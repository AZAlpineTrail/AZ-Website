"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { signOutAction } from "@/app/auth/actions";
import { openAuthModal } from "@/components/auth/AuthModal";
import { createSupabaseBrowserClient } from "@/supabase/client";

export function AuthHeaderControls({
  variant = "bar",
  onNavigate,
}: {
  variant?: "bar" | "drawer";
  onNavigate?: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);

  const openAuth = (mode: "sign-in" | "sign-up") => {
    onNavigate?.();
    openAuthModal(mode, "/account");
  };

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  if (variant === "drawer") {
    return (
      <div className="flex flex-col gap-2">
        {user ? (
          <>
            <Link
              href="/account"
              onClick={onNavigate}
              className="flex min-h-14 items-center rounded-md px-3 text-lg font-semibold text-[#13221a] transition hover:bg-[#f2efe4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
            >
              Account
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex min-h-14 w-full items-center justify-center rounded-full border border-[#d8ded4] bg-white text-base font-black text-[#13221a] transition hover:border-[#b74f32] hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
              >
                Log out
              </button>
            </form>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => openAuth("sign-in")}
              className="flex min-h-14 items-center rounded-md px-3 text-lg font-semibold text-[#13221a] transition hover:bg-[#f2efe4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => openAuth("sign-up")}
              className="flex min-h-14 w-full items-center justify-center rounded-full bg-[#13221a] text-base font-black text-white transition hover:bg-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
            >
              Register
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <Link
            href="/account"
            className="min-h-11 whitespace-nowrap rounded-full px-3 text-sm font-semibold leading-[44px] text-white/78 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Account
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="min-h-11 whitespace-nowrap rounded-full border border-white/16 bg-white/10 px-4 text-sm font-black text-white transition hover:border-white/28 hover:bg-white hover:text-[#13221a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Log out
            </button>
          </form>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => openAuth("sign-in")}
            className="min-h-11 whitespace-nowrap rounded-full px-3 text-sm font-semibold leading-[44px] text-white/78 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => openAuth("sign-up")}
            className="min-h-11 whitespace-nowrap rounded-full border border-white/16 bg-white/10 px-4 text-sm font-black leading-[44px] text-white transition hover:border-white/28 hover:bg-white hover:text-[#13221a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Register
          </button>
        </>
      )}
    </div>
  );
}
