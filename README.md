# The Bark of the Town

Modern website for The Bark of the Town, a salon and mobile dog groomer in
Chicago. Built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.

## Local development

Use Node 22.13+ (or Node 20.19+) to match the current Next.js and ESLint engine
requirements.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Appointment delivery

Booking requests are validated on the server. Outbound email is **optional**.

- No `RESEND_API_KEY` → showcase mode: the banner and `/book` copy say so, and
  `POST /api/booking` returns `200` with `{ showcase: true }` (nothing is emailed).
- With `RESEND_API_KEY` set at **runtime** (Vercel project env, Docker compose,
  etc.) → live mode: the banner hides and Resend is actually called. A rebuild
  is not required just to add or change these vars; restart/redeploy so the
  process picks them up.
- `BOOKING_TO_EMAIL` defaults to the business Gmail.
- `BOOKING_FROM_EMAIL` must be a verified Resend domain in live mode. If it is
  empty, the app falls back to `onboarding@resend.dev`, which can only send to
  the Resend account owner and will 500 for `tbottinc1@gmail.com`.
- `BOOKING_CC_EMAIL` (optional) can CC an admin inbox on every request.
- Upstash variables enable distributed rate limiting. Without them, a
  process-local fallback protects local and single-instance environments.

The form requires a JPG, PNG, or WebP pet photo up to 5 MB. A hidden
honeypot, strict validation, file constraints, and request limits reduce abuse.

Failed Resend sends stay generic in the browser (`code: "delivery_failed"`).
Server logs include Resend’s error name, status, message, and the from/to
addresses (never the API key).

## Demo vs production

These are **different hosts**. Do not point `tbottinc.com` at the demo VPS.

| | Demo | Production |
| --- | --- | --- |
| URL | [https://tbott.by1002.com/](https://tbott.by1002.com/) | [https://tbottinc.com](https://tbottinc.com) |
| Host | Emerson’s Hostinger VPS (Docker + OpenResty, `3005:3000`, `/srv/apps/tbott`) | A host the **client** owns — not this VPS |
| Today | This Next.js app (showcase unless demo env has a Resend key) | DreamHost WordPress |

`robots.ts`, `sitemap.ts`, and `metadataBase` already name
[https://tbottinc.com](https://tbottinc.com). DreamHost can stay the **registrar**;
only the DNS records for the site need to move when production is ready.

### Go live (production — client host)

1. **Resend (any production host).** In Resend, add and verify `tbottinc.com`
   (SPF/DKIM/DMARC as Resend shows). Set `BOOKING_FROM_EMAIL` to
   `The Bark of the Town <appointments@tbottinc.com>` (already in `.env.example`).
   The Resend test domain cannot deliver production requests to Gmail. This step
   is independent of Docker or the demo VPS.
2. **App host.** Deploy this Next.js App Router app (`output: "standalone"`) to
   **Vercel** (or another Node host the client controls). Set runtime env:
   `RESEND_API_KEY`, `BOOKING_TO_EMAIL`, `BOOKING_FROM_EMAIL`, and optionally
   `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`. Confirm the showcase
   banner is gone and a test appointment email arrives.
3. **DNS.** In DreamHost DNS, point `tbottinc.com` (and `www`) at that Vercel
   (or equivalent) project. Leave WordPress running on DreamHost until cutover.
   Do **not** point the domain at the demo VPS.

Push-to-`main` GitHub Action SSH + `deploy.sh` update **demo only**.

### Demo host (optional)

To try live email on [tbott.by1002.com](https://tbott.by1002.com/) without
publishing the real domain: set the same env vars in the demo compose `.env`,
then `docker compose up -d` (rebuild only for code changes). That still is not
production.

## Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```
