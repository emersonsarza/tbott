"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Bath,
  CalendarCheck,
  CheckCircle2,
  House,
  LoaderCircle,
  Scissors,
  Sparkles,
  Store,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AvailabilityWindows } from "@/components/availability-windows";
import { type AvailabilityWindow } from "@/lib/availability";
import { cta, site } from "@/lib/site-content";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, string[] | undefined>;

const inputClass =
  "h-11 w-full bg-white text-base placeholder:text-muted-foreground/65";

const EMPTY_WINDOWS: AvailabilityWindow[] = [
  { date: "", start: "", end: "" },
  { date: "", start: "", end: "" },
  { date: "", start: "", end: "" },
];

function Field({
  id,
  label,
  required,
  description,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  description?: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="font-bold text-ink">
        {label}
        {required ? <span className="ml-1 text-red">*</span> : null}
      </Label>
      {description ? (
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
      {children}
      {error?.[0] ? (
        <p className="text-sm font-medium text-destructive">{error[0]}</p>
      ) : null}
    </div>
  );
}

export function BookingForm() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location");
  const serviceParam = searchParams.get("service");
  const [location, setLocation] = useState<"salon" | "mobile">(
    locationParam === "mobile" ? "mobile" : "salon",
  );
  const [service, setService] = useState(
    serviceParam === "bath" || serviceParam === "full-groom"
      ? serviceParam
      : "full-groom",
  );
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [windows, setWindows] = useState<AvailabilityWindow[]>(EMPTY_WINDOWS);
  const [photoName, setPhotoName] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function clearPhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoName("");
    setPhotoPreview("");
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setFormError("");
    setErrors({});

    const form = event.currentTarget;
    const photo = photoInputRef.current?.files?.[0] ?? null;
    if (!photo || photo.size === 0) {
      setErrors({ photo: ["A recent photo of your dog is required"] });
      setFormError("Please check the highlighted fields.");
      setSubmitting(false);
      requestAnimationFrame(() => {
        document.getElementById("photo")?.focus();
      });
      return;
    }

    const data = new FormData(form);
    data.set("location", location);
    data.set("service", service);
    data.set("availabilityWindows", JSON.stringify(windows));

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        body: data,
      });
      const result = (await response.json()) as {
        message?: string;
        email?: string;
        showcase?: boolean;
        fieldErrors?: FieldErrors;
      };

      if (!response.ok) {
        setErrors(result.fieldErrors || {});
        setFormError(result.message || "Please check the form and try again.");
        requestAnimationFrame(() => {
          document.getElementById("booking-status")?.focus();
        });
        return;
      }

      const message =
        result.message ||
        "Request received. We’ll reply soon to confirm availability.";
      setSuccess(message);
      toast.success(
        result.showcase
          ? "Showcase Request Validated"
          : "Appointment Request Sent",
      );
      form.reset();
      clearPhoto();
      setWindows(EMPTY_WINDOWS);
      requestAnimationFrame(() => {
        document.getElementById("booking-status")?.focus();
      });
    } catch {
      setFormError(
        `We couldn’t send your request. Please email ${site.email} directly.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <Card className="border-0 bg-white p-8 text-center shadow-xl ring-1 ring-black/7 sm:p-12">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-lime">
          <CheckCircle2 className="size-8 text-ink" />
        </span>
        <h2 className="mt-6 font-heading text-3xl font-semibold">
          {success.toLowerCase().includes("showcase")
            ? "Showcase Request Validated"
            : "Request Received"}
        </h2>
        <p className="mx-auto mt-3 max-w-lg leading-7 text-muted-foreground">
          {success}
        </p>
        <p className="mt-4 text-sm font-semibold text-ink/65">
          {success.toLowerCase().includes("showcase")
            ? `For a real appointment, email ${site.email}.`
            : "Remember: your appointment is not confirmed until our team replies."}
        </p>
        <Button className="mt-7" onClick={() => setSuccess("")}>
          {cta.sendAnotherRequest}
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7">
      <Card className="border-0 bg-white p-6 shadow-sm ring-1 ring-black/7 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-lime text-ink">
            <Store className="size-5" />
          </span>
          <div>
            <p className="eyebrow">Step 1</p>
            <h2 className="mt-1 font-heading text-2xl font-semibold">
              Where should we groom?
            </h2>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            {
              value: "salon" as const,
              icon: Store,
              title: "Uptown Salon",
              body: "Visit us at 1041 W Lawrence Avenue.",
            },
            {
              value: "mobile" as const,
              icon: House,
              title: "Mobile Service",
              body: "We bring the groomery to your door.",
            },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={location === option.value}
              onClick={() => {
                setLocation(option.value);
                if (option.value === "mobile" && service === "nail-trim") {
                  setService("bath");
                }
              }}
              className={cn(
                "flex items-start gap-4 rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                location === option.value
                  ? "border-lime-dark bg-lime-soft shadow-sm"
                  : "border-black/8 bg-background hover:border-black/20",
              )}
            >
              <option.icon className="mt-0.5 size-5 shrink-0 text-red" />
              <span>
                <span className="block font-bold">{option.title}</span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {option.body}
                </span>
              </span>
            </button>
          ))}
        </div>
        {location === "mobile" ? (
          <div className="mt-5">
            <Field
              id="address"
              label="Street Address"
              required
              error={errors.address}
            >
              <Input
                id="address"
                name="address"
                autoComplete="street-address"
                placeholder="Street address, city, ZIP"
                required
                aria-invalid={Boolean(errors.address)}
                className={inputClass}
              />
            </Field>
          </div>
        ) : (
          <input type="hidden" name="address" value="" />
        )}
      </Card>

      <Card className="border-0 bg-white p-6 shadow-sm ring-1 ring-black/7 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-lime text-ink">
            <Scissors className="size-5" />
          </span>
          <div>
            <p className="eyebrow">Step 2</p>
            <h2 className="mt-1 font-heading text-2xl font-semibold">
              Choose a Service
            </h2>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["nail-trim", Sparkles, "Nail Trim", "Salon Only"],
            ["bath", Bath, "Bath Only", location === "mobile" ? "From $130" : "From $65"],
            [
              "full-groom",
              Scissors,
              "Full Groom",
              location === "mobile" ? "From $145" : "From $85",
            ],
          ].map(([value, Icon, title, price]) => {
            const IconComponent = Icon as typeof Sparkles;
            const disabled = location === "mobile" && value === "nail-trim";
            return (
              <button
                key={String(value)}
                type="button"
                disabled={disabled}
                aria-pressed={service === value}
                onClick={() => setService(String(value))}
                className={cn(
                  "rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-40",
                  service === value
                    ? "border-lime-dark bg-lime-soft"
                    : "border-black/8 bg-background hover:border-black/20",
                )}
              >
                <IconComponent className="size-5 text-red" />
                <span className="mt-4 block font-bold">{String(title)}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {String(price)}
                </span>
              </button>
            );
          })}
        </div>
        {errors.service?.[0] ? (
          <p className="mt-2 text-sm font-medium text-destructive">
            {errors.service[0]}
          </p>
        ) : null}
      </Card>

      <Card className="border-0 bg-white p-6 shadow-sm ring-1 ring-black/7 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-lime text-ink">
            <CalendarCheck className="size-5" />
          </span>
          <div>
            <p className="eyebrow">Step 3</p>
            <h2 className="mt-1 font-heading text-2xl font-semibold">
              Your Details & Availability
            </h2>
          </div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Field id="ownerName" label="Your Name" required error={errors.ownerName}>
            <Input
              id="ownerName"
              name="ownerName"
              autoComplete="name"
              required
              aria-invalid={Boolean(errors.ownerName)}
              className={inputClass}
            />
          </Field>
          <Field id="email" label="Email" required error={errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(errors.email)}
              className={inputClass}
            />
          </Field>
          <Field id="phone" label="Phone" required error={errors.phone}>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              aria-invalid={Boolean(errors.phone)}
              className={inputClass}
            />
          </Field>
          <Field id="petName" label="Pet Name" required error={errors.petName}>
            <Input
              id="petName"
              name="petName"
              required
              aria-invalid={Boolean(errors.petName)}
              className={inputClass}
            />
          </Field>
          <Field id="breed" label="Breed" required error={errors.breed}>
            <Input
              id="breed"
              name="breed"
              required
              aria-invalid={Boolean(errors.breed)}
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field id="age" label="Age" required error={errors.age}>
              <Input
                id="age"
                name="age"
                required
                aria-invalid={Boolean(errors.age)}
                className={inputClass}
              />
            </Field>
            <Field id="weight" label="Weight" required error={errors.weight}>
              <Input
                id="weight"
                name="weight"
                placeholder="e.g. 25 lb"
                required
                aria-invalid={Boolean(errors.weight)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field id="gender" label="Gender" required error={errors.gender}>
            <select
              id="gender"
              name="gender"
              required
              defaultValue=""
              aria-invalid={Boolean(errors.gender)}
              className={cn(
                inputClass,
                "rounded-lg border border-input px-3 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unknown">Unknown / Prefer Not to Say</option>
            </select>
          </Field>
          <Field
            id="aggression"
            label="Any Aggression When Handled or Groomed?"
            required
            error={errors.aggression}
          >
            <select
              id="aggression"
              name="aggression"
              required
              defaultValue=""
              aria-invalid={Boolean(errors.aggression)}
              className={cn(
                inputClass,
                "rounded-lg border border-input px-3 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </Field>
        </div>

        <div className="mt-5 space-y-5">
          <Field
            id="medical"
            label="Medical Conditions Since the Last Groom"
            required
            error={errors.medical}
          >
            <Textarea
              id="medical"
              name="medical"
              placeholder='Enter "None" if there are no conditions to report.'
              required
              aria-invalid={Boolean(errors.medical)}
              className="min-h-24 bg-white text-base"
            />
          </Field>
          <Field id="notes" label="Comments or Special Requests" error={errors.notes}>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Coat concerns, temperament notes, additional pets, or anything else we should know."
              className="min-h-28 bg-white text-base"
            />
          </Field>
          <Field
            id="photo"
            label="Recent Photo of Your Dog"
            required
            description="We use this to judge coat condition and size."
            error={errors.photo}
          >
            <input
              id="photo"
              ref={photoInputRef}
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (photoPreview) URL.revokeObjectURL(photoPreview);
                if (!file) {
                  setPhotoName("");
                  setPhotoPreview("");
                  return;
                }
                setPhotoName(file.name);
                setPhotoPreview(URL.createObjectURL(file));
              }}
            />
            {photoPreview ? (
              <div className="flex items-center gap-4 rounded-2xl border border-black/8 bg-warm p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview}
                  alt=""
                  className="size-16 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {photoName}
                  </p>
                  <label
                    htmlFor="photo"
                    className="mt-1 inline-block cursor-pointer text-sm font-semibold text-red underline"
                  >
                    Replace Photo
                  </label>
                </div>
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-ink/55 transition hover:bg-white hover:text-ink"
                  aria-label="Remove Photo"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="photo"
                className="flex min-h-24 cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-input bg-warm px-5 text-sm font-semibold text-ink/70 transition hover:border-lime-dark hover:bg-lime-soft"
              >
                <Upload className="size-5 text-red" />
                Choose JPG, PNG, or WebP · up to 5 MB
              </label>
            )}
          </Field>
        </div>

        <div className="mt-7 rounded-2xl bg-warm p-5">
          <div className="space-y-2">
            <p className="font-bold text-ink">
              3 Appointment Options
              <span className="ml-1 text-red">*</span>
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              Pick a date and a time window for each option. Same-day and
              next-day appointments aren’t available. Times are{" "}
              {site.hours.label}.
            </p>
            <AvailabilityWindows
              windows={windows}
              onChange={setWindows}
              error={errors.availability}
            />
          </div>
        </div>
      </Card>

      <div
        className="hidden"
        aria-hidden="true"
      >
        <Label htmlFor="website">Website</Label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-black/7 bg-white p-5 text-sm leading-6 text-muted-foreground">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 size-4 accent-[var(--red)]"
        />
        <span>
          I understand this is an appointment request. The Bark of the Town will
          reply to confirm availability, pricing, and the final appointment.
        </span>
      </label>

      <div
        id="booking-status"
        tabIndex={-1}
        role="status"
        aria-live="polite"
      >
        {formError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>We couldn’t send this yet</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="h-13 w-full text-base shadow-[0_15px_35px_rgba(215,67,45,0.25)]"
      >
        {submitting ? (
          <>
            <LoaderCircle className="animate-spin" /> Sending Request…
          </>
        ) : (
          <>
            {cta.requestAppointment} <CalendarCheck />
          </>
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Prefer email? Contact{" "}
        <a className="font-bold text-red underline" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        .
      </p>
    </form>
  );
}
