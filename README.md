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
- With `RESEND_API_KEY` set at **container runtime** → live mode: the banner
  hides and Resend is actually called. The Docker image is built without secrets;
  `docker-compose.yml` injects env when the container starts. Restart/recreate
  the container after changing env (`docker compose up -d` is enough; a rebuild
  is only needed for code changes).
- `BOOKING_TO_EMAIL` defaults to the business Gmail.
- `BOOKING_FROM_EMAIL` must be a verified Resend domain in live mode. If it is
  empty, the app falls back to `onboarding@resend.dev`, which can only send to
  the Resend account owner and will 500 for `tbottinc1@gmail.com`.
- Upstash variables enable distributed rate limiting. Without them, a
  process-local fallback protects local and single-instance environments.

The form accepts optional JPG, PNG, or WebP pet photos up to 5 MB. A hidden
honeypot, strict validation, file constraints, and request limits reduce abuse.

Failed Resend sends stay generic in the browser (`code: "delivery_failed"`).
Server logs include Resend’s error name, status, message, and the from/to
addresses (never the API key).

## Go live (tbottinc.com)

`robots.ts`, `sitemap.ts`, and `metadataBase` already name
[https://tbottinc.com](https://tbottinc.com). This app is already deployed on
the OpenResty/Docker VPS at `https://tbott.by1002.com/` (`compose` maps
`3005:3000`, `deploy.sh` at `/srv/apps/tbott`). **tbottinc.com still points at
DreamHost WordPress** — do not cut DNS until booking email works on the VPS.

1. **Resend domain.** In Resend, add and verify `tbottinc.com` (SPF/DKIM/DMARC
   as Resend shows). Set `BOOKING_FROM_EMAIL` to
   `The Bark of the Town <appointments@tbottinc.com>` (already in `.env.example`).
   The Resend test domain cannot deliver production requests to Gmail.
2. **VPS env.** On the host, set `RESEND_API_KEY`, `BOOKING_TO_EMAIL`,
   `BOOKING_FROM_EMAIL`, and optionally `UPSTASH_REDIS_REST_URL` /
   `UPSTASH_REDIS_REST_TOKEN` for the `tbott` compose project (typically a
   `/srv/apps/tbott/.env` that compose reads). Recreate the container so runtime
   env is picked up. Confirm the home page no longer shows the showcase banner
   and a test `POST /api/booking` emails the shop.
3. **DNS cutover.** Point `tbottinc.com` (and `www`) from DreamHost to this
   same OpenResty/Docker host. Leave WordPress migration out of this repo.

## Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```
