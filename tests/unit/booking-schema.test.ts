import { describe, expect, it } from "vitest";

import {
  MAX_PHOTO_BYTES,
  bookingSchema,
  validatePhoto,
} from "@/lib/booking-schema";

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
  availability:
    "Mon (9/8) 10:00-12:00\nTue (9/9) 1:00-3:30\nWed (9/10) 4:00-6:00",
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

describe("validatePhoto", () => {
  it("requires a photo by default", () => {
    expect(validatePhoto(null)).toBe("A recent photo of your dog is required");
  });

  it("rejects oversized photos", () => {
    const file = new File([new Uint8Array(MAX_PHOTO_BYTES + 1)], "dog.jpg", {
      type: "image/jpeg",
    });
    expect(validatePhoto(file)).toBe("Photo must be 5 MB or smaller");
  });

  it("rejects unsupported types", () => {
    const file = new File([new Uint8Array(10)], "dog.gif", {
      type: "image/gif",
    });
    expect(validatePhoto(file)).toBe("Photo must be a JPG, PNG, or WebP image");
  });

  it("accepts a valid jpeg", () => {
    const file = new File([new Uint8Array(10)], "dog.jpg", {
      type: "image/jpeg",
    });
    expect(validatePhoto(file)).toBeNull();
  });
});
