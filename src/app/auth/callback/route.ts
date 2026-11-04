import { NextResponse, type NextRequest } from "next/server";
import { trackServerEvent } from "@/lib/server-analytics";
import { createSupabaseServerClient } from "@/supabase/server";

function safeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/account";
  }

  return next;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  const supabase = await createSupabaseServerClient();

  if (code && supabase) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Password-reset links also land here; only count account confirmations.
      if (next !== "/update-password") {
        await trackServerEvent("email_confirmed", {
          destination: next.startsWith("/downloads") ? "download" : "other",
        });
      }

      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  await trackServerEvent("email_confirmation_failed", {
    reason: code ? "exchange_failed" : "missing_code",
  });

  return NextResponse.redirect(
    new URL("/sign-in?error=confirmation_failed", request.url),
  );
}
