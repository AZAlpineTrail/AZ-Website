"use client";

import { useId, useState } from "react";

type ContactFormProps = {
  compact?: boolean;
};

export function ContactForm({ compact = false }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const id = useId();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={submit}
      aria-busy={status === "loading"}
      className={compact ? "w-full" : "max-w-2xl rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-5"}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label htmlFor={`${id}-first-name`} className="grid gap-2 text-sm font-semibold">
          First name
          <input
            id={`${id}-first-name`}
            name="firstName"
            autoComplete="given-name"
            maxLength={80}
            required
            className="min-h-12 rounded-sm border border-[#c8d0c4] bg-white px-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
          />
        </label>
        <label htmlFor={`${id}-last-name`} className="grid gap-2 text-sm font-semibold">
          Last name
          <input
            id={`${id}-last-name`}
            name="lastName"
            autoComplete="family-name"
            maxLength={80}
            required
            className="min-h-12 rounded-sm border border-[#c8d0c4] bg-white px-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
          />
        </label>
      </div>
      <label htmlFor={`${id}-email`} className="mt-5 grid gap-2 text-sm font-semibold">
        Email
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          className="min-h-12 rounded-sm border border-[#c8d0c4] bg-white px-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
        />
      </label>
      <label htmlFor={`${id}-message`} className="mt-5 grid gap-2 text-sm font-semibold">
        Comment or message
        <textarea
          id={`${id}-message`}
          name="message"
          maxLength={5000}
          required
          rows={compact ? 4 : 6}
          className="rounded-sm border border-[#c8d0c4] bg-white px-3 py-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
        />
      </label>
      <label aria-hidden="true" className="absolute -left-[9999px]">
        Company
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-5 inline-flex min-h-12 items-center justify-center rounded-sm bg-[#173d2b] px-6 font-bold text-white transition hover:bg-[#24563e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] disabled:cursor-wait disabled:opacity-55"
      >
        {status === "loading" ? "Sending..." : "Submit"}
      </button>
      <p aria-live="polite" role="status" className="mt-4 min-h-5 text-sm text-[#5f6c63]">
        {status === "success" ? "Thanks. Your message has been sent." : null}
        {status === "error" ? "Something went wrong. Please try again." : null}
      </p>
    </form>
  );
}
