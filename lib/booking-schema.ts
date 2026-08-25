import { z } from "zod";

const requiredText = (label: string, max = 120) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} is too long`);

export const bookingSchema = z.object({
  location: z.enum(["salon", "mobile"], {
    message: "Choose salon or mobile grooming",
  }),
  service: z.enum(["nail-trim", "bath", "full-groom"], {
    message: "Choose a service",
  }),
  ownerName: requiredText("Your name"),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\d\s.-]{7,24}$/, "Enter a valid phone number"),
  address: z.string().trim().max(240).optional().default(""),
  petName: requiredText("Pet name"),
  breed: requiredText("Breed"),
  age: requiredText("Age", 40),
  weight: requiredText("Weight", 40),
  gender: z.enum(["male", "female", "unknown"]),
  medical: requiredText("Medical conditions", 1000),
  aggression: z.enum(["yes", "no"]),
  notes: z.string().trim().max(2000, "Notes are too long").optional().default(""),
  preferredDate: requiredText("Preferred date", 20),
  preferredTime: requiredText("Preferred time", 20),
  alternateDate: z.string().trim().max(20).optional().default(""),
  alternateTime: z.string().trim().max(20).optional().default(""),
  consent: z.literal("on", {
    message: "Confirm that this is an appointment request",
  }),
  website: z.string().max(0, "Spam detected").optional().default(""),
}).superRefine((data, context) => {
  if (data.location === "mobile" && !data.address) {
    context.addIssue({
      code: "custom",
      path: ["address"],
      message: "Address is required for mobile grooming",
    });
  }
  if (data.location === "mobile" && data.service === "nail-trim") {
    context.addIssue({
      code: "custom",
      path: ["service"],
      message: "Mobile service is available for baths and full grooms",
    });
  }
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export function validatePhoto(photo: File | null) {
  if (!photo || photo.size === 0) return null;
  if (photo.size > MAX_PHOTO_BYTES) {
    return "Photo must be 5 MB or smaller";
  }
  if (!PHOTO_TYPES.includes(photo.type as (typeof PHOTO_TYPES)[number])) {
    return "Photo must be a JPG, PNG, or WebP image";
  }
  return null;
}
