# Deployment

## Vercel

Deploy the Next.js app on Vercel and set the environment variables from `.env.example`.

## Supabase Auth

This site uses Supabase email/password auth plus one-time email codes for
existing accounts. Registration sends a confirmation email through the standard
Supabase Auth signup endpoint. Password recovery sends a reset email and then
uses the recovery session to update the user's password.

Set these variables in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
```

`NEXT_PUBLIC_SITE_URL` must be the canonical production origin, for example
`https://azalpinetrail.org`, so confirmation and password recovery emails return
to the website.

In Supabase Dashboard, go to Authentication > Providers > Email and keep Email
enabled. Enable Confirm email before launch. In Authentication > URL
Configuration, set the Site URL and allow these redirect URLs:

- `https://azalpinetrail.org/auth/callback`
- The local development callback URL, such as
  `http://localhost:3000/auth/callback`
- Any preview deployment callback URLs used for QA

Configure custom SMTP before production traffic. Supabase's default sender is
rate-limited and best-effort, which is not sufficient for confirmation or
password-reset delivery. Email-code requests also depend on this SMTP setup.

For email-code sign-in, open Authentication > Email Templates > Magic Link in
Supabase and include `{{ .Token }}` in the message body (for example,
`Your AZAT sign-in code: {{ .Token }}`). The default template sends a link,
not a visible code. Keep confirmation and recovery templates intact. Test a
pre-existing Supabase account end to end before inviting migrated members;
code sign-in intentionally does not create accounts. Supabase limits repeated
code requests, so wait before retrying a test address. Importing WordPress
members is a separate, not-yet-completed step.

## Sanity

Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and
`NEXT_PUBLIC_SANITY_API_VERSION`. The Studio route is `/studio`.

Current AZ Web values:

- Project ID: `ymwkx711`
- Dataset: `production`
- API version: `2026-07-03`

Sanity CLI 6 requires Node `22.12+`. If your shell is on an older Node version,
switch Node first, then authenticate and deploy:

```bash
sanity login --provider google
npm run sanity:schema:deploy
```

Use the provider that matches the Sanity account: `google`, `github`, or `sanity`.
After the schema is deployed, seed starter content with a write token:

```bash
SANITY_AUTH_TOKEN="..." npm run sanity:seed
```

Do not commit `SANITY_AUTH_TOKEN`; it is only for local or CI write operations.

## Contact Form Email

The contact form should use Resend for transactional delivery.

Set these server-only variables on the Linode host before launch:

```bash
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
```

`RESEND_API_KEY` must stay server-only. Verify the sending domain in Resend
before pointing production traffic at the new contact form. Use a separate
sending-only Resend key for the website contact form rather than reusing the
Supabase SMTP key.

## Redirects

High-value WordPress URLs are defined in `next.config.ts`. Additional editorial redirects can be stored in Sanity as `redirect` documents and wired into middleware later if needed.
