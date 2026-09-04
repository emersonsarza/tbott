import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

import {
  formatAvailability,
  parseAvailabilityWindowsJson,
} from "@/lib/availability";
import {
  getBookingFromEmail,
  getBookingToEmail,
  getResendApiKey,
  logBookingDeliveryFailure,
  publicDeliveryFailedBody,
} from "@/lib/booking-delivery";
import { bookingEmail, formatGender, formatService } from "@/lib/booking-email";
import { bookingSchema, validatePhoto } from "@/lib/booking-schema";

export const runtime = "nodejs";

const fallbackAttempts = new Map<string, { count: number; resetAt: number }>();
const PHOTO_CONTENT_ID = "tbott-booking-photo";

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function isRateLimited(identifier: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    const limiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      prefix: "tbott:booking",
    });
    const result = await limiter.limit(identifier);
    return !result.success;
  }

  const now = Date.now();
  const current = fallbackAttempts.get(identifier);
  if (!current || current.resetAt < now) {
    fallbackAttempts.set(identifier, {
      count: 1,
      resetAt: now + 15 * 60 * 1000,
    });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (await isRateLimited(ip)) {
      return NextResponse.json(
        { message: "Too many requests. Please wait and try again." },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const raw = Object.fromEntries(
      [...formData.entries()]
        .filter(([key, value]) => key !== "photo" && typeof value === "string")
        .map(([key, value]) => [key, String(value)]),
    );

    const windowsResult = parseAvailabilityWindowsJson(raw.availabilityWindows);
    if (!windowsResult.success) {
      return NextResponse.json(
        {
          message: "Please check the highlighted fields.",
          fieldErrors: { availability: [windowsResult.error] },
        },
        { status: 400 },
      );
    }

    const parsed = bookingSchema.safeParse({
      ...raw,
      availability: formatAvailability(windowsResult.data),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Please check the highlighted fields.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const photoValue = formData.get("photo");
    const photo = photoValue instanceof File ? photoValue : null;
    const photoError = validatePhoto(photo, { required: true });
    if (photoError) {
      return NextResponse.json(
        { message: photoError, fieldErrors: { photo: [photoError] } },
        { status: 400 },
      );
    }

    const apiKey = getResendApiKey();

    // Showcase / testing: no Resend key means we only validate the form.
    if (!apiKey) {
      console.info("[showcase] Booking request accepted without email delivery", {
        location: parsed.data.location,
        service: parsed.data.service,
        petName: parsed.data.petName,
      });
      return NextResponse.json({
        showcase: true,
        message:
          "Showcase mode: this request was validated but not emailed. Booking delivery is disabled for testing.",
      });
    }

    const from = getBookingFromEmail();
    const to = getBookingToEmail();
    const attachments =
      photo && photo.size > 0
        ? [
            {
              filename: photo.name.replace(/[^\w.-]/g, "_"),
              content: Buffer.from(await photo.arrayBuffer()),
              contentType: photo.type || "image/jpeg",
              contentId: PHOTO_CONTENT_ID,
            },
          ]
        : undefined;

    const serviceLabel = formatService(parsed.data.service).toLowerCase();
    const subject = `New ${parsed.data.location} request — ${parsed.data.petName} (${serviceLabel})`;

    const html = bookingEmail(parsed.data, {
      photoContentId: attachments?.length ? PHOTO_CONTENT_ID : undefined,
    });

    const text = [
      `New ${parsed.data.location} request — ${parsed.data.petName} (${serviceLabel})`,
      `Full name: ${parsed.data.ownerName}`,
      ``,
      `Availability:`,
      parsed.data.availability,
      ``,
      `Contact:`,
      `Phone: ${parsed.data.phone}`,
      `Email: ${parsed.data.email}`,
      ...(parsed.data.location === "mobile"
        ? [`Service location: ${parsed.data.address}`]
        : []),
      ``,
      `Pet details:`,
      `Breed: ${parsed.data.breed}`,
      `Age: ${parsed.data.age}`,
      `Weight: ${parsed.data.weight}`,
      `Gender: ${formatGender(parsed.data.gender)}`,
      `Medical: ${parsed.data.medical}`,
      `Aggression: ${
        parsed.data.aggression === "yes"
          ? "Yes — review before booking"
          : "No"
      }`,
      ...(parsed.data.notes?.trim().length
        ? [`Notes: ${parsed.data.notes.trim()}`]
        : []),
    ].join("\n");

    try {
      const resend = new Resend(apiKey);
      const result = await resend.emails.send({
        from,
        to,
        replyTo: parsed.data.email,
        ...(process.env.BOOKING_CC_EMAIL?.trim()
          ? { cc: process.env.BOOKING_CC_EMAIL.trim() }
          : {}),
        subject,
        html,
        text,
        attachments,
      });

      if (result.error) {
        logBookingDeliveryFailure({ error: result.error, from, to });
        return NextResponse.json(publicDeliveryFailedBody(), { status: 500 });
      }
    } catch (error) {
      logBookingDeliveryFailure({ error, from, to });
      return NextResponse.json(publicDeliveryFailedBody(), { status: 500 });
    }

    return NextResponse.json({
      showcase: false,
      message:
        "Request received. We’ll reply soon to confirm availability and pricing.",
    });
  } catch (error) {
    console.error("[booking] Request failed", error);
    return NextResponse.json(publicDeliveryFailedBody(), { status: 500 });
  }
}
