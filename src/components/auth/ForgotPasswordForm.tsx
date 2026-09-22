"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Mail } from "lucide-react";
import {
  requestPasswordResetAction,
  type AuthFormState,
} from "@/app/auth/actions";

const initialState: AuthFormState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#b74f32] px-5 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#9f432b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] disabled:cursor-wait disabled:opacity-70"
    >
      <Mail size={17} aria-hidden="true" />
      {pending ? "Sending..." : "Send reset link"}
    </button>
  );
}

export function ForgotPasswordForm({
  initialMessage = "",
}: {
  initialMessage?: string;
}) {
  const initialFormState: AuthFormState = initialMessage
    ? { status: "error", message: initialMessage }
    : initialState;
  const [state, formAction] = useActionState(
    requestPasswordResetAction,
    initialFormState,
  );

  return (
    <section className="w-full max-w-2xl overflow-hidden rounded-[6px] border border-[#d8ded4] bg-[#fffdf7] text-[#13221a] shadow-[0_18px_44px_rgba(19,34,26,0.12)]">
      <div className="border-b border-[#d8ded4] bg-[#f8f4e8] px-5 py-4 sm:px-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#b87939]">
          Password recovery
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight">
          Reset your password
        </h2>
      </div>
      <form action={formAction} className="grid gap-4 p-5 sm:p-6">
        <p className="text-sm font-semibold leading-6 text-[#5f6c63]">
          Enter the email for your Arizona Alpine Trail account and we will send
          a secure reset link.
        </p>
        <label className="grid gap-2 text-sm font-bold text-[#13221a]">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="min-h-12 rounded-[6px] border border-[#d8ded4] bg-white px-4 text-base font-medium outline-none transition focus:border-[#b74f32] focus:ring-2 focus:ring-[#b74f32]/18"
          />
        </label>
        {state.message ? (
          <p
            className={`text-sm font-semibold ${
              state.status === "success" ? "text-[#235840]" : "text-[#b74f32]"
            }`}
          >
            {state.message}
          </p>
        ) : null}
        <div className="grid gap-4 pt-1 sm:max-w-sm">
          <SubmitButton />
          <Link
            href="/sign-in"
            className="inline-flex min-h-11 items-center justify-self-start text-sm font-bold text-[#235840] underline decoration-[#b87939]/40 underline-offset-4 transition hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
          >
            Back to log in
          </Link>
        </div>
      </form>
    </section>
  );
}
