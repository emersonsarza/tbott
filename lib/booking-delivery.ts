import { site } from "@/lib/site-content";

/** Resend's test sender. Can only deliver to the account owner. */
export const RESEND_TEST_FROM =
  "The Bark of the Town <onboarding@resend.dev>";

export const DELIVERY_FAILED_CODE = "delivery_failed" as const;

export function getResendApiKey() {
  return process.env.RESEND_API_KEY?.trim() || "";
}

/** True when outbound booking email is not configured. */
export function isShowcaseMode() {
  return !getResendApiKey();
}

export function getBookingFromEmail() {
  return process.env.BOOKING_FROM_EMAIL?.trim() || RESEND_TEST_FROM;
}

export function getBookingToEmail() {
  return process.env.BOOKING_TO_EMAIL?.trim() || site.email;
}

export function isResendTestFromAddress(from: string) {
  return /@resend\.dev\b/i.test(from);
}

export type ResendFailureSummary = {
  name: string;
  message: string;
  statusCode: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Extract Resend's name/status/message without assuming SDK shape. */
export function summarizeResendFailure(error: unknown): ResendFailureSummary {
  if (isRecord(error)) {
    const name =
      typeof error.name === "string" && error.name.trim()
        ? error.name
        : "Error";
    const message =
      typeof error.message === "string" && error.message.trim()
        ? error.message
        : "Unknown Resend error";
    const statusCode =
      typeof error.statusCode === "number"
        ? error.statusCode
        : error.statusCode === null
          ? null
          : typeof error.status === "number"
            ? error.status
            : null;
    return { name, message, statusCode };
  }

  if (typeof error === "string" && error.trim()) {
    return { name: "Error", message: error, statusCode: null };
  }

  return { name: "Error", message: "Unknown Resend error", statusCode: null };
}

export function logBookingDeliveryFailure({
  error,
  from,
  to,
}: {
  error: unknown;
  from: string;
  to: string;
}) {
  const summary = summarizeResendFailure(error);
  console.error("[booking] Resend delivery failed", {
    name: summary.name,
    statusCode: summary.statusCode,
    message: summary.message,
    from,
    to,
    usingResendTestDomain: isResendTestFromAddress(from),
  });
}

/** Generic client payload — no provider internals or secrets. */
export function publicDeliveryFailedBody() {
  return {
    message:
      "We couldn’t send your request. Please try again or email us directly.",
    email: site.email,
    code: DELIVERY_FAILED_CODE,
  };
}
