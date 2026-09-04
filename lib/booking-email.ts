import type { BookingInput } from "@/lib/booking-schema";

export function sanitize(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function escapeMultiline(value: string) {
  return sanitize(value).replaceAll("\n", "<br/>");
}

export function formatService(service: BookingInput["service"]) {
  switch (service) {
    case "bath":
      return "Bath";
    case "full-groom":
      return "Full groom";
    case "nail-trim":
      return "Nail trim";
    default:
      return service;
  }
}

export function formatGender(gender: BookingInput["gender"]) {
  switch (gender) {
    case "male":
      return "Male";
    case "female":
      return "Female";
    case "unknown":
      return "Prefer not to say";
    default:
      return gender;
  }
}

export function telHref(phone: string) {
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/[^\d]/g, "");
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

export function bookingEmail(
  data: BookingInput,
  options?: {
    photoContentId?: string;
    photoSrc?: string;
  },
) {
  const isMobile = data.location === "mobile";
  const svc = formatService(data.service);
  const aggYes = data.aggression === "yes";
  const availRows = data.availability
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s{2,}/);
      const date = sanitize(parts[0] ?? "");
      const time = sanitize(parts.slice(1).join(" "));
      return `
        <tr>
          <td style="padding:1px 12px 1px 0;font-size:13px;line-height:1.35;color:rgba(255,255,255,0.92);white-space:nowrap;">${date}</td>
          <td style="padding:1px 0;font-size:13px;line-height:1.35;color:rgba(255,255,255,0.92);">${time}</td>
        </tr>`;
    })
    .join("");
  const notesHtml = data.notes?.trim().length
    ? escapeMultiline(data.notes.trim())
    : null;
  const phoneTel = telHref(data.phone);
  const photoSrc =
    options?.photoSrc ||
    (options?.photoContentId ? `cid:${options.photoContentId}` : undefined);

  const accent = isMobile ? "#d7432d" : "#667408";
  const accentSoft = isMobile ? "#fef6f5" : "#f3f7d5";
  const accentBorder = isMobile
    ? "rgba(215,67,45,0.12)"
    : "rgba(102,116,8,0.12)";
  const badgeBg = isMobile ? "#d7432d" : "#c1d72d";
  const badgeFg = isMobile ? "#fff" : "#292822";
  const linkColor = isMobile ? "#d7432d" : "#667408";

  const lbl = (l: string) =>
    `<span style="color:#292822;opacity:0.5;font-size:12px;font-weight:600;">${sanitize(l)}</span>`;
  const val = (v: string) =>
    `<span style="color:#292822;font-size:14px;">${v}</span>`;

  const card = (title: string, body: string, dark = false) => `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:10px;">
      <tr><td>
        <div style="background:${dark ? "#292822" : accentSoft};padding:7px 16px 3px 16px;border-radius:4px 14px 0 0;${!dark ? `border:1px solid ${accentBorder};border-bottom:none;` : ""}">
          <div style="font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:${dark ? accentSoft : accent};">${sanitize(title)}</div>
        </div>
        <div style="padding:6px 16px 10px 16px;background:${dark ? "#292822" : "#fff"};color:${dark ? "#fff" : "#292822"};border-radius:0 0 4px 14px;${!dark ? `border:1px solid ${accentBorder};border-top:none;` : ""}">
          ${body}
        </div>
      </td></tr>
    </table>`;

  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#f7f4ed;">
  <tr><td align="center" style="padding:28px 16px;">
    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;font-family:Arial,sans-serif;color:#292822;border-collapse:collapse;background:#ffffff;border-radius:16px;">
      <tr><td style="padding:22px 24px 8px 24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
          <tr>
            <td style="vertical-align:top;">
              <span style="display:inline-block;background:${badgeBg};color:${badgeFg};font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;letter-spacing:0.04em;text-transform:uppercase;">New ${sanitize(isMobile ? "mobile" : "salon")} request</span>
              <div style="margin-top:8px;font-size:22px;font-weight:700;color:#292822;line-height:1.2;">${sanitize(data.petName)}</div>
              <div style="margin-top:2px;font-size:14px;color:#292822;opacity:0.55;">${sanitize(svc)} · ${sanitize(data.ownerName)}</div>
            </td>
          </tr>
        </table>
      </td></tr>

      ${
        aggYes
          ? `
      <tr><td style="padding:0 24px 10px 24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
          <tr><td style="background:#d7432d;color:#fff;padding:10px 16px;border-radius:4px 14px 4px 14px;font-size:13px;font-weight:700;">
            ⚠ Aggression reported — review before booking
          </td></tr>
        </table>
      </td></tr>
      `
          : ""
      }

      <tr><td style="padding:0 24px;">
        ${card(
          "Availability",
          `<table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${availRows}</table>`,
          true,
        )}
      </td></tr>

      ${
        isMobile
          ? `
      <tr><td style="padding:0 24px;">
        ${card("Service location", `<div style="font-size:14px;font-weight:600;color:#292822;">${sanitize(data.address)}</div>`)}
      </td></tr>
      `
          : ""
      }

      <tr><td style="padding:0 24px;">
        <div style="background:${accentSoft};border:1px solid ${accentBorder};border-radius:4px 14px 4px 14px;padding:10px 16px;margin-bottom:10px;font-size:13px;line-height:1.6;">
          <div style="font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:${accent};margin-bottom:4px;">Contact</div>
          <span style="font-weight:700;color:#292822;">${sanitize(data.ownerName)}</span><br/>
          <a href="tel:${sanitize(phoneTel)}" style="color:${linkColor};text-decoration:underline;font-size:13px;">${sanitize(data.phone)}</a>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <a href="mailto:${sanitize(data.email)}" style="color:${linkColor};text-decoration:underline;font-size:13px;">${sanitize(data.email)}</a>
        </div>
      </td></tr>

      <tr><td style="padding:0 24px 22px 24px;">
        ${card(
          "Pet",
          `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            <tr>
              ${
                photoSrc
                  ? `
              <td style="vertical-align:top;width:140px;padding-right:14px;">
                <img src="${sanitize(photoSrc)}" alt="Pet photo" style="display:block;width:130px;height:auto;border-radius:4px 10px 4px 10px;border:1px solid #dedbd2;" />
              </td>
              `
                  : ""
              }
              <td style="vertical-align:top;">
                <div style="margin-bottom:6px;">
                  ${lbl("Breed")} <div style="font-size:14px;font-weight:600;color:#292822;margin-top:1px;">${sanitize(data.breed)}</div>
                </div>
                <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding-right:16px;vertical-align:top;">
                      ${lbl("Age")}<br/>${val(sanitize(data.age))}
                    </td>
                    <td style="padding-right:16px;vertical-align:top;">
                      ${lbl("Weight")}<br/>${val(sanitize(data.weight))}
                    </td>
                    <td style="vertical-align:top;">
                      ${lbl("Gender")}<br/>${val(sanitize(formatGender(data.gender)))}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:10px;">
            <tr><td style="border-top:1px solid #f0ede6;padding-top:8px;">
              <div style="margin-bottom:3px;">${lbl("Medical")}</div>
              <div style="font-size:13px;line-height:1.5;color:#292822;">${escapeMultiline(data.medical)}</div>
            </td></tr>
            <tr><td style="padding-top:5px;">
              <div style="margin-bottom:3px;">${lbl("Aggression")}</div>
              ${
                aggYes
                  ? `<span style="display:inline-block;background:#d7432d;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;">⚠ YES</span>`
                  : `<span style="display:inline-block;background:${accentSoft};color:${accent};font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;">No</span>`
              }
            </td></tr>
            ${
              notesHtml
                ? `
            <tr><td style="padding-top:5px;">
              <div style="margin-bottom:3px;">${lbl("Notes")}</div>
              <div style="font-size:13px;line-height:1.5;color:#292822;">${notesHtml}</div>
            </td></tr>
            `
                : ""
            }
          </table>
        `,
        )}
      </td></tr>
    </table>
    <div style="padding:14px 16px 0 16px;font-size:11px;color:#292822;opacity:0.4;text-align:center;font-family:Arial,sans-serif;">
      The Bark of the Town · 1041 W Lawrence Ave, Chicago IL 60640
    </div>
  </td></tr>
</table>`;
}
