"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Mail } from "lucide-react";
import {
  requestEmailCodeAction,
  verifyEmailCodeAction,
  type AuthFormState,
} from "@/app/auth/actions";

const initialState: AuthFormState = { status: "idle", message: "" };
const inputClass = "min-h-12 rounded-[6px] border border-[#d8ded4] bg-white px-4 text-base font-medium outline-none transition focus:border-[#b74f32] focus:ring-2 focus:ring-[#b74f32]/18";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#b74f32] px-5 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#9f432b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] disabled:cursor-wait disabled:opacity-70">
      <Mail size={17} aria-hidden="true" />
      {pending ? "Working..." : label}
    </button>
  );
}

export function EmailCodeForm({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = useState("");
  const [requestState, requestAction] = useActionState(requestEmailCodeAction, initialState);
  const [verifyState, verifyAction] = useActionState(verifyEmailCodeAction, initialState);
  const codeRequested = requestState.status === "success";

  return (
    <div className="grid gap-4 p-5 sm:p-6">
      <form action={requestAction} className="grid gap-4">
        <label className="grid gap-2 text-sm font-bold text-[#13221a]">
          Email
          <input name="email" type="email" autoComplete="email" required readOnly={codeRequested} value={email} onChange={(event) => setEmail(event.currentTarget.value)} className={inputClass} />
        </label>
        {requestState.message ? <p role="status" className={`text-sm font-semibold ${requestState.status === "error" ? "text-[#b74f32]" : "text-[#235840]"}`}>{requestState.message}</p> : null}
        <SubmitButton label={codeRequested ? "Send another code" : "Email me a code"} />
      </form>
      {codeRequested ? (
        <form action={verifyAction} className="grid gap-4 border-t border-[#d8ded4] pt-4">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="next" value={nextPath} />
          <label className="grid gap-2 text-sm font-bold text-[#13221a]">
            Email code
            <input name="token" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,8}" maxLength={8} required className={inputClass} />
          </label>
          {verifyState.message ? <p role="alert" className="text-sm font-semibold text-[#b74f32]">{verifyState.message}</p> : null}
          <SubmitButton label="Log in" />
        </form>
      ) : null}
    </div>
  );
}
