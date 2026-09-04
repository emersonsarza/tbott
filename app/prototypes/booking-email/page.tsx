"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { bookingEmail, formatService } from "@/lib/booking-email";
import type { BookingInput } from "@/lib/booking-schema";

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
    "Mon, Sep 8    10:00–12:00 PM\nTue, Sep 9    1:00–3:30 PM\nWed, Sep 10   4:00–6:00 PM",
  consent: "on",
  website: "",
};

const mobileSample: BookingInput = {
  location: "mobile",
  service: "full-groom",
  ownerName: "Malcolm Turner",
  email: "malcolm.turner@example.com",
  phone: "+1 312-555-0199",
  address: "4750 N Winthrop Ave",
  petName: "Lady",
  breed: "Maltese",
  age: "3",
  weight: "7 lb",
  gender: "male",
  medical:
    "No known conditions. Please use gentle handling for sensitive ears.",
  aggression: "yes",
  notes: "They may be nervous at first — slow approach helps.",
  availability:
    "Mon, Sep 8    9:30–11:00 AM\nTue, Sep 9    2:00–4:00 PM\nWed, Sep 10   10:00–12:30 PM",
  consent: "on",
  website: "",
};

const PLACEHOLDER_PHOTO = "https://placedog.net/280/200?random";

function EmailPreview() {
  const searchParams = useSearchParams();
  const [showMobile, setShowMobile] = useState(
    searchParams.get("type") === "mobile",
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "m" || e.key === "M") setShowMobile((p) => !p);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const sample = showMobile ? mobileSample : salonSample;
  const html = bookingEmail(sample, { photoSrc: PLACEHOLDER_PHOTO });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e0e0e0",
          padding: "10px 24px",
          fontSize: 13,
          color: "#5f6368",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ fontWeight: 700, color: "#202124" }}>
          New {showMobile ? "mobile" : "salon"} request — {sample.petName} (
          {formatService(sample.service).toLowerCase()})
        </span>
        <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.6 }}>
          Press{" "}
          <kbd
            style={{
              background: "#eee",
              padding: "2px 5px",
              borderRadius: 3,
            }}
          >
            M
          </kbd>{" "}
          to toggle salon / mobile
        </span>
      </div>

      <div
        style={{
          maxWidth: 720,
          margin: "20px auto",
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export default function BookingEmailPrototypePage() {
  return (
    <Suspense>
      <EmailPreview />
    </Suspense>
  );
}
