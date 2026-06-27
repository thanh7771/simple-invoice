# SimpleInvoice

Take-home project for 101 Digital. Next.js, TypeScript, Tailwind.

You can log in, browse invoices (search/sort/filter/pagination), and create a new one with a single line item.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000

Put the sandbox credentials from Appendix A into `.env.local`. Copy from `.env.example` if you don't have that file yet. Don't commit `.env.local`.

Cookie `Secure` flag turns on automatically in production. For local HTTPS, add `COOKIE_SECURE=true` to `.env.local` (see `.env.example`).

Test account:
- username: `94756921275`
- password: `Password@12345`

Other commands: `npm run build`, `npm start`, `npm test`

## Notes on the implementation

I didn't call the 101 Digital APIs from the browser. Login hits `POST /api/auth/login`, the server does the OAuth2 password grant, fetches `/users/me`, pulls `org_token` from `data.memberships[0].token`, and saves both tokens in httpOnly cookies. After that the client only talks to `/api/invoices` and `/api/auth/*`.

`client_secret` lives in env vars on the server. No `NEXT_PUBLIC_` secrets. Route protection is in `proxy.ts`.

Forms use React Hook Form + Zod. Validation runs on the client for UX and again on the server before forwarding requests.

## Folder structure

Most of the code is under `src/app` (pages + API routes) and `src/lib` (API clients, cookie helpers, zod schemas). UI components are in `src/components`.

## Things I assumed

Only one org token (`memberships[0]`). One line item per invoice. Status filter uses whatever the API returns (Paid, Unpaid, etc.). Cookie expiry is 1 hour.
