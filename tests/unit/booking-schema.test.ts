import { describe, expect, it } from "vitest";

import { bookingSchema } from "@/lib/booking-schema";

const validBooking = {
  location: "salon",
  service: "full-groom",
  ownerName: "Jamie Doe",
  email: "jamie@example.com",
  phone: "312-555-0100",
  address: "",
  petName: "Pepper",
  breed: "Poodle mix",
  age: "4",
  weight: "28 lb",
  gender: "female",
  medical: "None",
  aggression: "no",
  notes: "",
  preferredDate: "2026-09-01",
  preferredTime: "10:00",
  alternateDate: "",
  alternateTime: "",
  consent: "on",
  website: "",
} as const;

describe("bookingSchema", () => {
  it("accepts a complete salon request", () => {
    expect(bookingSchema.safeParse(validBooking).success).toBe(true);
  });

  it("requires an address for mobile grooming", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      location: "mobile",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.address).toContain(
        "Address is required for mobile grooming",
      );
    }
  });

  it("blocks mobile nail-only requests", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      location: "mobile",
      service: "nail-trim",
      address: "1041 W Lawrence Ave, Chicago, IL",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.service).toContain(
        "Mobile service is available for baths and full grooms",
      );
    }
  });

  it("rejects honeypot submissions", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      website: "https://spam.example",
    });
    expect(result.success).toBe(false);
  });
});
