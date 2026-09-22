"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Circle, KeyRound } from "lucide-react";
import {
  updatePasswordAction,
  type AuthFormState,
} from "@/app/auth/actions";

const initialState: AuthFormState = { status: "idle", message: "" };

const passwordRequirements = [
  {
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: "One number",
    test: (password: string) => /\d/.test(password),
  },
];

function SubmitButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#b74f32] px-5 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#9f432b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] disabled:cursor-wait disabled:opacity-70"
    >
      <KeyRound size={17} aria-hidden="true" />
      {pending ? "Updating..." : "Update password"}
    </button>
  );
}

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState(updatePasswordAction, initialState);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordChecks = useMemo(
    () =>
      passwordRequirements.map((requirement) => ({
        ...requirement,
        met: requirement.test(password),
      })),
    [password],
  );
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = state.status !== "success";

  return (
    <section className="w-full max-w-2xl overflow-hidden rounded-[6px] border border-[#d8ded4] bg-[#fffdf7] text-[#13221a] shadow-[0_18px_44px_rgba(19,34,26,0.12)]">
      <div className="border-b border-[#d8ded4] bg-[#f8f4e8] px-5 py-4 sm:px-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#b87939]">
          Password recovery
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight">
          Choose a new password
        </h2>
      </div>
      <form action={formAction} className="grid gap-4 p-5 sm:p-6">
        <label className="grid gap-2 text-sm font-bold text-[#13221a]">
          New password
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
            className="min-h-12 rounded-[6px] border border-[#d8ded4] bg-white px-4 text-base font-medium outline-none transition focus:border-[#b74f32] focus:ring-2 focus:ring-[#b74f32]/18"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#13221a]">
          Confirm new password
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            onChange={(event) => setConfirmPassword(event.currentTarget.value)}
            required
            className="min-h-12 rounded-[6px] border border-[#d8ded4] bg-white px-4 text-base font-medium outline-none transition focus:border-[#b74f32] focus:ring-2 focus:ring-[#b74f32]/18"
          />
        </label>
        <div
          className="grid gap-2 border-y border-[#d8ded4] py-4 text-sm"
          aria-label="Password requirements"
        >
          {passwordChecks.map((requirement) => (
            <div
              key={requirement.label}
              className={`inline-flex items-center gap-2 font-semibold transition ${
                requirement.met ? "text-[#235840]" : "text-[#5f6c63]"
              }`}
            >
              {requirement.met ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                <Circle size={16} aria-hidden="true" />
              )}
              <span>{requirement.label}</span>
            </div>
          ))}
          <div
            className={`inline-flex items-center gap-2 font-semibold transition ${
              passwordsMatch ? "text-[#235840]" : "text-[#5f6c63]"
            }`}
          >
            {passwordsMatch ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <Circle size={16} aria-hidden="true" />
            )}
            <span>Passwords match</span>
          </div>
        </div>
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
          <SubmitButton disabled={!canSubmit} />
          {state.status === "success" ? (
            <Link
              href="/account"
              className="inline-flex min-h-11 items-center justify-self-start text-sm font-bold text-[#235840] underline decoration-[#b87939]/40 underline-offset-4 transition hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
            >
              Continue to account
            </Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}
