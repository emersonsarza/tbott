import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

import {
  bookingSchema,
  validatePhoto,
  type BookingInput,
} from "@/lib/booking-schema";
import { site } from "@/lib/site-content";

export const runtime = "nodejs";

const fallbackAttempts = new Map<string, { count: number; resetAt: number }>();

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

function sanitize(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function bookingEmail(data: BookingInput) {
  const rows = [
    ["Location", data.location],
    ["Service", data.service],
    ["Owner", data.ownerName],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Address", data.address || "Not provided"],
    ["Pet", data.petName],
    ["Breed", data.breed],
    ["Age", data.age],
    ["Weight", data.weight],
    ["Gender", data.gender],
    ["Medical conditions", data.medical],
    ["Aggression history", data.aggression],
    ["Preferred", `${data.preferredDate} at ${data.preferredTime}`],
    [
      "Alternate",
      data.alternateDate
        ? `${data.alternateDate} at ${data.alternateTime || "any time"}`
        : "Not provided",
    ],
    ["Notes", data.notes || "None"],
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#292822;max-width:680px;margin:auto">
      <div style="background:#c1d72d;padding:24px;border-radius:16px 16px 0 0">
        <h1 style="margin:0;font-size:24px">New ${sanitize(data.location)} grooming request</h1>
      </div>
      <div style="border:1px solid #dedbd2;border-top:0;padding:24px;border-radius:0 0 16px 16px">
        <p style="margin-top:0">This is an appointment request, not a confirmed booking.</p>
        <table style="width:100%;border-collapse:collapse">
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <th style="text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #eee;width:34%">${sanitize(label)}</th>
                  <td style="padding:10px;border-bottom:1px solid #eee">${sanitize(value)}</td>
                </tr>`,
            )
            .join("")}
        </table>
      </div>
    </div>
  `;
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
    const parsed = bookingSchema.safeParse(raw);

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
    const photoError = validatePhoto(photo);
    if (photoError) {
      return NextResponse.json(
        { message: photoError, fieldErrors: { photo: [photoError] } },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();

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

    const resend = new Resend(apiKey);
    const attachments =
      photo && photo.size > 0
        ? [
            {
              filename: photo.name.replace(/[^\w.-]/g, "_"),
              content: Buffer.from(await photo.arrayBuffer()),
            },
          ]
        : undefined;

    const result = await resend.emails.send({
      from:
        process.env.BOOKING_FROM_EMAIL ||
        "The Bark of the Town <onboarding@resend.dev>",
      to: process.env.BOOKING_TO_EMAIL || site.email,
      replyTo: parsed.data.email,
      subject: `New ${parsed.data.location} request — ${parsed.data.petName}`,
      html: bookingEmail(parsed.data),
      attachments,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return NextResponse.json({
      showcase: false,
      message:
        "Request received. We’ll reply soon to confirm availability and pricing.",
    });
  } catch (error) {
    console.error("Booking request failed", error);
    return NextResponse.json(
      {
        message:
          "We couldn’t send your request. Please try again or email us directly.",
        email: site.email,
      },
      { status: 500 },
    );
  }
}
