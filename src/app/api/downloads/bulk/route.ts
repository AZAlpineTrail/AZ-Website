import { zipSync } from "fflate";
import { NextResponse } from "next/server";
import { DOWNLOAD_TERMS_VERSION, PROTECTED_DOWNLOADS_BUCKET, canonicalDownloadFilename, type DownloadFile } from "@/lib/downloads";
import { trackServerEvent } from "@/lib/server-analytics";
import { createSupabaseAdminClient } from "@/supabase/admin";
import { createSupabaseServerClient } from "@/supabase/server";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  const userClient = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();

  if (!userClient || !adminClient) {
    return NextResponse.json({ error: "Downloads are not configured." }, { status: 503 });
  }

  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user || !UUID_PATTERN.test(token)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: acceptances, error: acceptanceError } = await adminClient
    .from("download_acceptances")
    .select("download_file_id, download_slug")
    .eq("user_id", user.id)
    .eq("terms_version", DOWNLOAD_TERMS_VERSION)
    .like("access_token", `${token}:%`)
    .gt("token_expires_at", new Date().toISOString());

  if (acceptanceError || !acceptances?.length) {
    return NextResponse.json({ error: "Download link expired." }, { status: 403 });
  }

  const fileIds = acceptances.map((acceptance) => acceptance.download_file_id);
  const { data: fileRows, error: fileError } = await adminClient
    .from("download_files")
    .select("*")
    .in("id", fileIds)
    .eq("active", true);

  if (fileError || !fileRows || fileRows.length !== fileIds.length) {
    return NextResponse.json({ error: "One or more files are no longer available." }, { status: 404 });
  }

  const filesById = new Map((fileRows as DownloadFile[]).map((file) => [file.id, file]));
  const archiveEntries: Record<string, Uint8Array> = {};

  for (const acceptance of acceptances) {
    const download = filesById.get(acceptance.download_file_id);
    if (!download || download.slug !== acceptance.download_slug) {
      return NextResponse.json({ error: "Selected file validation failed." }, { status: 403 });
    }

    const { data, error } = await adminClient.storage.from(PROTECTED_DOWNLOADS_BUCKET).download(download.storage_path);
    if (error || !data) {
      return NextResponse.json({ error: `${download.title} is not available in storage.` }, { status: 404 });
    }

    archiveEntries[canonicalDownloadFilename(download)] = new Uint8Array(await data.arrayBuffer());
  }

  const archive = zipSync(archiveEntries, { level: 6 });
  const body = archive.buffer.slice(archive.byteOffset, archive.byteOffset + archive.byteLength) as ArrayBuffer;

  await trackServerEvent("download_delivered", {
    file: "selected-files",
    type: "ZIP",
  });

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="arizona-alpine-trail-selected-files.zip"',
      "Content-Length": String(archive.byteLength),
      "Cache-Control": "private, no-store",
    },
  });
}
