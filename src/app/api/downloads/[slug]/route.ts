import { NextResponse } from "next/server";
import {
  PROTECTED_DOWNLOADS_BUCKET,
  canonicalDownloadFilename,
  getDownloadForStreaming,
} from "@/lib/downloads";
import { trackServerEvent } from "@/lib/server-analytics";
import { createSupabaseAdminClient } from "@/supabase/admin";
import { createSupabaseServerClient } from "@/supabase/server";

type DownloadFailureReason =
  | "configuration_unavailable"
  | "unauthorized"
  | "token_invalid_or_expired"
  | "storage_unavailable";

async function failedDownloadResponse({
  slug,
  type,
  reason,
  status,
  message,
  requestId,
  startedAt,
}: {
  slug: string;
  type?: string;
  reason: DownloadFailureReason;
  status: number;
  message: string;
  requestId: string | null;
  startedAt: number;
}) {
  await trackServerEvent("download_failed", {
    file: slug,
    type: type ?? "unknown",
    reason,
  });
  console.warn(JSON.stringify({
    level: "warning",
    message: "Protected download failed",
    route: "/api/downloads/[slug]",
    requestId,
    file: slug,
    reason,
    status,
    duration_ms: Date.now() - startedAt,
  }));

  return NextResponse.json({ error: message }, { status });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const startedAt = Date.now();
  const requestId = request.headers.get("x-vercel-id");
  const { slug } = await params;
  console.log(JSON.stringify({
    level: "info",
    message: "Protected download started",
    route: "/api/downloads/[slug]",
    requestId,
    file: slug,
  }));
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  const userClient = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();

  if (!userClient || !adminClient) {
    return failedDownloadResponse({
      slug,
      reason: "configuration_unavailable",
      status: 503,
      message: "Downloads are not configured.",
      requestId,
      startedAt,
    });
  }

  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user || !token) {
    return failedDownloadResponse({
      slug,
      reason: "unauthorized",
      status: 401,
      message: "Unauthorized.",
      requestId,
      startedAt,
    });
  }

  const download = await getDownloadForStreaming(slug);
  const { data: acceptance, error: acceptanceError } = await adminClient
    .from("download_acceptances")
    .select("id")
    .eq("download_file_id", download.id)
    .eq("download_slug", download.slug)
    .eq("user_id", user.id)
    .eq("access_token", token)
    .gt("token_expires_at", new Date().toISOString())
    .single();

  if (acceptanceError || !acceptance) {
    return failedDownloadResponse({
      slug: download.slug,
      type: download.file_type,
      reason: "token_invalid_or_expired",
      status: 403,
      message: "Download link expired.",
      requestId,
      startedAt,
    });
  }

  const { data, error } = await adminClient.storage
    .from(PROTECTED_DOWNLOADS_BUCKET)
    .download(download.storage_path);

  if (error || !data) {
    return failedDownloadResponse({
      slug: download.slug,
      type: download.file_type,
      reason: "storage_unavailable",
      status: 404,
      message: "File is not available in protected storage yet.",
      requestId,
      startedAt,
    });
  }

  await trackServerEvent("download_delivered", {
    file: download.slug,
    type: download.file_type,
  });
  console.log(JSON.stringify({
    level: "info",
    message: "Protected download delivered",
    route: "/api/downloads/[slug]",
    requestId,
    file: download.slug,
    status: 200,
    duration_ms: Date.now() - startedAt,
  }));

  return new NextResponse(data.stream(), {
    headers: {
      "Content-Type": download.content_type,
      "Content-Disposition": `attachment; filename="${canonicalDownloadFilename(download)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
