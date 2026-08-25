import { FlaskConical } from "lucide-react";

import { site } from "@/lib/site-content";

/** True when outbound booking email is not configured. */
export function isShowcaseMode() {
  return !process.env.RESEND_API_KEY?.trim();
}

export function ShowcaseBanner() {
  if (!isShowcaseMode()) return null;

  return (
    <div className="border-b border-lime-dark/20 bg-lime-soft">
      <div className="site-container flex items-start gap-3 py-2.5 text-sm text-ink sm:items-center">
        <FlaskConical className="mt-0.5 size-4 shrink-0 text-lime-dark sm:mt-0" />
        <p className="leading-5">
          <span className="font-bold">Showcase / testing:</span> this site is a
          demo rebuild. Appointment requests are not emailed live — contact{" "}
          <a className="font-bold underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>{" "}
          for a real booking.
        </p>
      </div>
    </div>
  );
}
