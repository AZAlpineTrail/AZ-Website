import type { Metadata } from "next";
import { AuthExperienceShell } from "@/components/auth/AuthExperienceShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a password reset link for your Arizona Alpine Trail account.",
  robots: {
    index: false,
    follow: false,
  },
};

function recoveryMessage(error: string | undefined) {
  if (error === "expired") {
    return "Your password reset link expired or was already used. Request a new reset email.";
  }

  return "";
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthExperienceShell title="Reset password">
      <ForgotPasswordForm initialMessage={recoveryMessage(error)} />
    </AuthExperienceShell>
  );
}
