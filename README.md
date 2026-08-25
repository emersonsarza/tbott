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

Booking requests are validated on the server and delivered through Resend.

- `RESEND_API_KEY` is required.
- `BOOKING_TO_EMAIL` defaults to the business email.
- `BOOKING_FROM_EMAIL` should use a verified production domain.
- Upstash variables enable distributed production rate limiting. Without them,
  a process-local fallback protects local and single-instance environments.

The form accepts optional JPG, PNG, or WebP pet photos up to 5 MB. A hidden
honeypot, strict validation, file constraints, and request limits reduce abuse.

## Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```
