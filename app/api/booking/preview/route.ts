import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

import { bookingEmail } from "@/lib/booking-email";
import type { BookingInput } from "@/lib/booking-schema";

export const runtime = "nodejs";

const PHOTO_CONTENT_ID = "tbott-booking-photo";

// Small inline PNG so the preview page shows the photo.
// (The real booking email keeps `cid:${PHOTO_CONTENT_ID}` for Gmail.)
const PHOTO_DATA_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+Xj1QAAAAASUVORK5CYII=";

function previewHtml(emailHtml: string) {
  return emailHtml.replaceAll(`cid:${PHOTO_CONTENT_ID}`, PHOTO_DATA_URI);
}

export async function GET() {
  // Dev-only: this route is not meant to ship.
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const salonSample: BookingInput = {
    location: "salon",
    service: "bath",
    ownerName: "Elizabeth Dobler",
    email: "elizabeth.dobler@gmail.com",
    phone: "+1 206-963-9437",
    address: "",
    petName: "Blossom",
    breed: "Chihuahua terrier mix",
    age: "14",
    weight: "16 lb",
    gender: "female",
    medical: "Back pain - on medicine, doing well.",
    aggression: "no",
    notes: "If possible, a quick nail trim would be great.",
    availability:
      "Mon (9/8) 10:00-12:00\nTue (9/9) 1:00-3:30\nWed (9/10) 4:00-6:00",
    consent: "on",
    website: "",
  };

  const mobileSample: BookingInput = {
    location: "mobile",
    service: "full-groom",
    ownerName: "Malcolm",
    email: "malcolm.turner@example.com",
    phone: "+1 312-555-0199",
    address: "4750 N Winthrop Ave",
    petName: "Lady",
    breed: "Maltese",
    age: "3",
    weight: "7 lb",
    gender: "male",
    medical: "No known conditions. Please use gentle handling for sensitive ears.",
    aggression: "yes",
    notes: "They may be nervous at first—slow approach helps.",
    availability:
      "Mon (9/8) 9:30-11:00\nTue (9/9) 2:00-4:00\nWed (9/10) 10:00-12:30",
    consent: "on",
    website: "",
  };

  const salonEmailHtmlCid = bookingEmail(salonSample, {
    photoContentId: PHOTO_CONTENT_ID,
  });
  const mobileEmailHtmlCid = bookingEmail(mobileSample, {
    photoContentId: PHOTO_CONTENT_ID,
  });

  const salonPreview = previewHtml(salonEmailHtmlCid);
  const mobilePreview = previewHtml(mobileEmailHtmlCid);

  const outDir = path.join(process.cwd(), "var", "booking-email-previews");
  await fs.mkdir(outDir, { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(outDir, "salon.html"), salonPreview, "utf8"),
    fs.writeFile(path.join(outDir, "mobile.html"), mobilePreview, "utf8"),
  ]);

  return new NextResponse(
    `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TBOTT booking email preview (dev-only)</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 20px; color: #292822;">
    <h1 style="margin: 0 0 12px;">Salon request email (preview)</h1>
    ${salonPreview}
    <h1 style="margin: 24px 0 12px;">Mobile request email (preview)</h1>
    ${mobilePreview}
    <p style="margin-top: 18px; font-size: 12px; color: #666;">
      Preview image uses a data URI so it renders in-browser. The real email uses
      <code>cid:${PHOTO_CONTENT_ID}</code> inline images for Gmail.
    </p>
  </body>
</html>`,
    {
      headers: { "content-type": "text/html; charset=utf-8" },
    },
  );
}

