import { describe, expect, it } from "vitest";

import { bookingEmail } from "@/lib/booking-email";
import type { BookingInput } from "@/lib/booking-schema";

const salon: BookingInput = {
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
  availability: "Mon, Sep 8    10:00–12:00 PM",
  consent: "on",
  website: "",
};

const mobile: BookingInput = {
  ...salon,
  location: "mobile",
  service: "full-groom",
  address: "4750 N Winthrop Ave",
  petName: "Lady",
  aggression: "yes",
};

describe("bookingEmail", () => {
  it("uses salon theme without an aggression banner", () => {
    const html = bookingEmail(salon);
    expect(html).toContain("background:#f7f4ed");
    expect(html).toContain("background:#ffffff");
    expect(html).toContain("New salon request");
    expect(html).toContain("Blossom");
    expect(html).toContain("Bath · Elizabeth Dobler");
    expect(html).toContain("Mon, Sep 8");
    expect(html).toContain("10:00–12:00 PM");
    expect(html).not.toContain("white-space:pre");
    expect(html).toContain("Contact");
    expect(html).not.toContain("Service location");
    expect(html).not.toContain("Aggression reported");
    expect(html).toContain(">No</span>");
  });

  it("uses mobile theme with location and aggression warning", () => {
    const html = bookingEmail(mobile, { photoContentId: "tbott-booking-photo" });
    expect(html).toContain("New mobile request");
    expect(html).toContain("⚠ Aggression reported — review before booking");
    expect(html).toContain("Service location");
    expect(html).toContain("4750 N Winthrop Ave");
    expect(html).toContain("cid:tbott-booking-photo");
    expect(html).toContain("⚠ YES");
  });
});
