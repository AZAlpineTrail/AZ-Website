import { NextResponse, type NextRequest } from "next/server";
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
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(
    new URL("/sign-in?error=confirmation_failed", request.url),
  );
}
