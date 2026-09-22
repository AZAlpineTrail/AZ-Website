import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthExperienceShell } from "@/components/auth/AuthExperienceShell";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { createSupabaseServerClient } from "@/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Update password",
  description: "Choose a new password for your Arizona Alpine Trail account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function UpdatePasswordPage() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <AuthExperienceShell title="Update password">
        <section className="w-full max-w-2xl overflow-hidden rounded-[6px] border border-[#d8ded4] bg-[#fffdf7] p-5 text-[#13221a] shadow-[0_18px_44px_rgba(19,34,26,0.12)] sm:p-6">
          <p className="text-sm font-semibold text-[#b74f32]">
            Supabase is not configured yet. Add the project URL and anon key to
            enable password recovery.
          </p>
        </section>
      </AuthExperienceShell>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/forgot-password?error=expired");
  }

  return (
    <AuthExperienceShell title="Update password">
      <UpdatePasswordForm />
    </AuthExperienceShell>
  );
}
