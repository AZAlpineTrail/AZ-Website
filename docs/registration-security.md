# Registration security setup

The application creates users through the standard Supabase Auth signup
endpoint, not the administrator API. Protection depends on Supabase's built-in
rate limits and email confirmation; no CAPTCHA provider account is required.

This is weaker against attackers who can rotate IP addresses and email
addresses. Review Auth logs after launch and reconsider CAPTCHA if automated
registration becomes a problem.

## Required Supabase settings

Before launch, configure the project in the Supabase dashboard:

1. In Authentication > Providers > Email, enable **Confirm email**.
2. In Authentication > URL Configuration, set the production site URL and add
   `https://azalpinetrail.org/auth/callback` to the allowed redirect URLs. Add
   the corresponding preview or local callback URLs used for testing.
3. In Authentication > Rate Limits, set **Sign-ups and sign-ins** to the launch
   threshold. Start with 10 requests per 5 minutes and adjust after reviewing
   legitimate traffic and Auth logs. This is a Supabase project setting, not
   enforced by application code. It also affects sign-ins.
4. Configure custom SMTP. Supabase's default sender is restricted and is not
   intended for production confirmation email delivery.

## Verification

1. Registration works without Turnstile keys or a CAPTCHA challenge.
2. A successful registration shows a check-email message and does not create a
   logged-in session.
3. The new user cannot log in until the confirmation link is opened.
4. The confirmation link establishes a session and returns the user to the
   originally requested local path.
5. Repeated sign-up attempts receive a Supabase `429` response at the configured
   threshold.
6. The public registration path never calls `auth.admin.createUser` and never
   sets `email_confirm`.

## Password recovery

The website exposes password recovery through `/forgot-password` and
`/update-password`.

1. `/forgot-password` calls `resetPasswordForEmail` with a redirect to
   `/auth/callback?next=/update-password`.
2. `/auth/callback` exchanges the recovery code for a Supabase session and then
   redirects to `/update-password`.
3. `/update-password` requires that authenticated recovery session before it
   shows the password update form.
4. The update form calls `updateUser({ password })` and applies the same
   password strength rules used during registration.

Supabase must allow the callback URL in Authentication > URL Configuration.
If the project customizes Supabase email templates, make sure the recovery
template honors the configured redirect URL, for example by using
`{{ .RedirectTo }}` rather than a hard-coded site URL.

### Recovery verification

1. `/sign-in` displays a visible "Forgot password?" link.
2. `/forgot-password` accepts an email and returns a neutral success message so
   visitors cannot enumerate registered accounts.
3. A recovery email link opens `/auth/callback` and lands on `/update-password`.
4. `/update-password` rejects weak passwords and mismatched confirmation.
5. A valid new password updates successfully.
6. The user can sign out and log in again with the new password.
7. A reused or expired recovery link returns the visitor to `/forgot-password`
   with instructions to request a new email.
