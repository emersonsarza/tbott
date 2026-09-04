import { afterEach, describe, expect, it, vi } from "vitest";

import {
  DELIVERY_FAILED_CODE,
  getBookingFromEmail,
  getBookingToEmail,
  isResendTestFromAddress,
  isShowcaseMode,
  logBookingDeliveryFailure,
  publicDeliveryFailedBody,
  RESEND_TEST_FROM,
  summarizeResendFailure,
} from "@/lib/booking-delivery";
import { site } from "@/lib/site-content";

const keys = [
  "RESEND_API_KEY",
  "BOOKING_FROM_EMAIL",
  "BOOKING_TO_EMAIL",
] as const;

const originalEnv = Object.fromEntries(
  keys.map((key) => [key, process.env[key]]),
);

afterEach(() => {
  for (const key of keys) {
    const value = originalEnv[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  vi.restoreAllMocks();
});

describe("isShowcaseMode", () => {
  it("is true when the Resend key is missing", () => {
    delete process.env.RESEND_API_KEY;
    expect(isShowcaseMode()).toBe(true);
  });

  it("is true when the Resend key is whitespace", () => {
    process.env.RESEND_API_KEY = "   ";
    expect(isShowcaseMode()).toBe(true);
  });

  it("is false when a runtime Resend key is present", () => {
    process.env.RESEND_API_KEY = "re_test_placeholder";
    expect(isShowcaseMode()).toBe(false);
  });
});

describe("booking from/to addresses", () => {
  it("falls back to the Resend test sender when FROM is unset", () => {
    delete process.env.BOOKING_FROM_EMAIL;
    expect(getBookingFromEmail()).toBe(RESEND_TEST_FROM);
    expect(isResendTestFromAddress(getBookingFromEmail())).toBe(true);
  });

  it("uses the configured FROM address", () => {
    process.env.BOOKING_FROM_EMAIL =
      "The Bark of the Town <appointments@tbottinc.com>";
    expect(getBookingFromEmail()).toBe(
      "The Bark of the Town <appointments@tbottinc.com>",
    );
    expect(isResendTestFromAddress(getBookingFromEmail())).toBe(false);
  });

  it("falls back to the public shop email when TO is unset", () => {
    delete process.env.BOOKING_TO_EMAIL;
    expect(getBookingToEmail()).toBe(site.email);
  });
});

describe("summarizeResendFailure", () => {
  it("reads name, statusCode, and message from a Resend error object", () => {
    expect(
      summarizeResendFailure({
        name: "invalid_access",
        statusCode: 403,
        message:
          "You can only send testing emails to your own email address.",
      }),
    ).toEqual({
      name: "invalid_access",
      statusCode: 403,
      message: "You can only send testing emails to your own email address.",
    });
  });

  it("accepts status as an alias for statusCode", () => {
    expect(
      summarizeResendFailure({ name: "application_error", status: 500 }),
    ).toEqual({
      name: "application_error",
      statusCode: 500,
      message: "Unknown Resend error",
    });
  });

  it("summarizes a thrown Error without leaking extra fields", () => {
    expect(summarizeResendFailure(new Error("socket hang up"))).toEqual({
      name: "Error",
      statusCode: null,
      message: "socket hang up",
    });
  });
});

describe("public delivery failure payload", () => {
  it("stays generic and includes a stable code", () => {
    const body = publicDeliveryFailedBody();
    expect(body.code).toBe(DELIVERY_FAILED_CODE);
    expect(body.email).toBe(site.email);
    expect(JSON.stringify(body)).not.toMatch(/resend|api[_-]?key|onboarding/i);
  });

  it("logs provider details server-side without putting them in the client body", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    logBookingDeliveryFailure({
      error: {
        name: "invalid_access",
        statusCode: 403,
        message: "You can only send testing emails to your own email address.",
      },
      from: RESEND_TEST_FROM,
      to: site.email,
    });

    expect(errorSpy).toHaveBeenCalledWith(
      "[booking] Resend delivery failed",
      expect.objectContaining({
        name: "invalid_access",
        statusCode: 403,
        message: "You can only send testing emails to your own email address.",
        from: RESEND_TEST_FROM,
        to: site.email,
        usingResendTestDomain: true,
      }),
    );
    expect(JSON.stringify(publicDeliveryFailedBody())).not.toContain(
      "invalid_access",
    );
  });
});
