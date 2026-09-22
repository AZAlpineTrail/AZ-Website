"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Circle, LogIn, UserPlus } from "lucide-react";
import {
  signInAction,
  signUpAction,
  type AuthFormState,
} from "@/app/auth/actions";
import { EmailCodeForm } from "@/components/auth/EmailCodeForm";

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

function SubmitButton({
  mode,
  disabled = false,
}: {
  mode: "sign-in" | "sign-up";
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#b74f32] px-5 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#9f432b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] disabled:cursor-wait disabled:opacity-70"
    >
      {mode === "sign-up" ? (
        <UserPlus size={17} aria-hidden="true" />
      ) : (
        <LogIn size={17} aria-hidden="true" />
      )}
      {pending ? "Working..." : mode === "sign-up" ? "Register" : "Log in"}
    </button>
  );
}

export function AuthForm({
  mode,
  nextPath = "/account",
  onModeChange,
}: {
  mode: "sign-in" | "sign-up";
  nextPath?: string;
  onModeChange?: (mode: "sign-in" | "sign-up") => void;
}) {
  const [state, formAction] = useActionState(
    mode === "sign-up" ? signUpAction : signInAction,
    initialState,
  );
  const isSignUp = mode === "sign-up";
  const [signInMethod, setSignInMethod] = useState<"code" | "password">("code");
  const [password, setPassword] = useState("");
  const passwordChecks = useMemo(
    () =>
      passwordRequirements.map((requirement) => ({
        ...requirement,
        met: requirement.test(password),
      })),
    [password],
  );

  return (
    <section className={`w-full overflow-hidden rounded-[6px] border border-[#d8ded4] bg-[#fffdf7] text-[#13221a] shadow-[0_18px_44px_rgba(19,34,26,0.12)] ${isSignUp ? "max-w-4xl" : "max-w-2xl"}`}>
      <div className="border-b border-[#d8ded4] bg-[#f8f4e8] px-5 py-4 sm:px-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#b87939]">
          {isSignUp ? "Rider registration" : "Member access"}
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight">
          {isSignUp ? "Create your trail account" : "Log in to continue"}
        </h2>
      </div>
      {!isSignUp ? (
        <div className="flex border-b border-[#d8ded4] px-5 pt-4 sm:px-6" role="group" aria-label="Sign-in method">
          {(["code", "password"] as const).map((method) => (
            <button key={method} type="button" onClick={() => setSignInMethod(method)} aria-pressed={signInMethod === method} className={`min-h-11 border-b-2 px-4 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] ${signInMethod === method ? "border-[#b74f32] text-[#13221a]" : "border-transparent text-[#5f6c63] hover:text-[#13221a]"}`}>
              {method === "code" ? "Email code" : "Password"}
            </button>
          ))}
        </div>
      ) : null}
      {!isSignUp && signInMethod === "code" ? <EmailCodeForm nextPath={nextPath} /> : null}
      {!isSignUp && signInMethod === "code" ? (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          {onModeChange ? (
            <button type="button" onClick={() => onModeChange("sign-up")} className="text-sm font-bold text-[#235840] underline underline-offset-4 hover:text-[#b74f32]">Need an account? Register</button>
          ) : (
            <Link href={`/sign-up?next=${encodeURIComponent(nextPath)}`} className="text-sm font-bold text-[#235840] underline underline-offset-4 hover:text-[#b74f32]">Need an account? Register</Link>
          )}
        </div>
      ) : null}
      {isSignUp || signInMethod === "password" ? (
      <form
        action={formAction}
        className={`grid gap-4 p-5 sm:p-6 ${isSignUp ? "sm:grid-cols-2" : ""}`}
      >
        <input type="hidden" name="next" value={nextPath} />
        {isSignUp ? (
          <>
            <label className="grid gap-2 text-sm font-bold text-[#13221a]">
              First name
              <input
                name="firstName"
                autoComplete="given-name"
                required
                className="min-h-12 rounded-[6px] border border-[#d8ded4] bg-white px-4 text-base font-medium outline-none transition focus:border-[#b74f32] focus:ring-2 focus:ring-[#b74f32]/18"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#13221a]">
              Last name
              <input
                name="lastName"
                autoComplete="family-name"
                required
                className="min-h-12 rounded-[6px] border border-[#d8ded4] bg-white px-4 text-base font-medium outline-none transition focus:border-[#b74f32] focus:ring-2 focus:ring-[#b74f32]/18"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#13221a]">
              ZIP code
              <input
                name="zipCode"
                autoComplete="postal-code"
                inputMode="numeric"
                pattern="[0-9]{5}(-[0-9]{4})?"
                required
                className="min-h-12 rounded-[6px] border border-[#d8ded4] bg-white px-4 text-base font-medium outline-none transition focus:border-[#b74f32] focus:ring-2 focus:ring-[#b74f32]/18"
              />
            </label>
          </>
        ) : null}
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
        <label className="grid gap-2 text-sm font-bold text-[#13221a]">
          Password
          <input
            name="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            minLength={8}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
            className="min-h-12 rounded-[6px] border border-[#d8ded4] bg-white px-4 text-base font-medium outline-none transition focus:border-[#b74f32] focus:ring-2 focus:ring-[#b74f32]/18"
          />
        </label>
        {!isSignUp ? (
          <Link
            href="/forgot-password"
            className="inline-flex min-h-8 items-center justify-self-start text-sm font-bold text-[#235840] underline decoration-[#b87939]/40 underline-offset-4 transition hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] sm:col-span-2"
          >
            Forgot password?
          </Link>
        ) : null}
        {isSignUp ? (
          <div
            className="grid gap-2 border-y border-[#d8ded4] py-4 text-sm sm:col-span-2"
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
          </div>
        ) : null}
        {state.message ? (
          <p
            className={`text-sm font-semibold sm:col-span-2 ${
              state.status === "success" ? "text-[#235840]" : "text-[#b74f32]"
            }`}
          >
            {state.message}
          </p>
        ) : null}
        <div className="grid gap-4 pt-1 sm:col-span-2 sm:max-w-sm">
          <SubmitButton
            mode={mode}
            disabled={isSignUp && state.status === "success"}
          />
          {onModeChange ? (
            <button
              type="button"
              onClick={() => onModeChange(isSignUp ? "sign-in" : "sign-up")}
              className="inline-flex min-h-11 items-center justify-self-start text-sm font-bold text-[#235840] underline decoration-[#b87939]/40 underline-offset-4 transition hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
            >
              {isSignUp
                ? "Already registered? Log in"
                : "Need an account? Register"}
            </button>
          ) : (
            <Link
              href={`${isSignUp ? "/sign-in" : "/sign-up"}?next=${encodeURIComponent(nextPath)}`}
              className="inline-flex min-h-11 items-center text-sm font-bold text-[#235840] underline decoration-[#b87939]/40 underline-offset-4 transition hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
            >
              {isSignUp
                ? "Already registered? Log in"
                : "Need an account? Register"}
            </Link>
          )}
        </div>
      </form>
      ) : null}
    </section>
  );
}
