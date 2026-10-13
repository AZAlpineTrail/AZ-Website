"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import {
  DOWNLOAD_TERMS_VERSION,
  getActiveDownloadBySlug,
  listActiveDownloads,
} from "@/lib/downloads";
import { trackServerEvent } from "@/lib/server-analytics";
import { createSupabaseAdminClient } from "@/supabase/admin";
import { createSupabaseServerClient } from "@/supabase/server";

function safeSlug(formData: FormData) {
  return String(formData.get("slug") ?? "").trim();
}

export async function agreeToDownloadTerms(formData: FormData) {
  const slug = safeSlug(formData);
  const supabase = await createSupabaseServerClient();

  if (!supabase || !slug) {
    redirect("/sign-up");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-up?next=${encodeURIComponent(`/downloads/${slug}`)}`);
  }

  const download = await getActiveDownloadBySlug(slug);

  if (!download) {
    redirect("/resources");
  }

  const adminClient = createSupabaseAdminClient();

  if (!adminClient) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  const token = randomUUID();
  const { error } = await adminClient.from("download_acceptances").insert({
    user_id: user.id,
    download_file_id: download.id,
    download_slug: download.slug,
    terms_version: DOWNLOAD_TERMS_VERSION,
    access_token: token,
  });

  if (error) {
    await trackServerEvent("download_failed", {
      file: download.slug,
      type: download.file_type,
      reason: "acceptance_write_failed",
    });
    throw new Error(error.message);
  }

  await trackServerEvent("download_terms_accepted", {
    file: download.slug,
    type: download.file_type,
  });

  redirect(`/downloads/${download.slug}/thanks?token=${encodeURIComponent(token)}`);
}

export async function agreeToBulkDownloadTerms(formData: FormData) {
  const slugs = [...new Set(formData.getAll("slug").map(String).map((slug) => slug.trim()).filter(Boolean))].slice(0, 30);
  const supabase = await createSupabaseServerClient();

  if (!supabase || slugs.length === 0) {
    redirect("/downloads");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const next = `/downloads/bulk?slugs=${encodeURIComponent(slugs.join(","))}`;
    redirect(`/sign-up?next=${encodeURIComponent(next)}`);
  }

  const activeDownloads = await listActiveDownloads();
  const activeBySlug = new Map(activeDownloads.map((download) => [download.slug, download]));
  const downloads = slugs.map((slug) => activeBySlug.get(slug)).filter((download) => download != null);

  if (downloads.length !== slugs.length) {
    redirect("/downloads");
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  const batchToken = randomUUID();
  const { error } = await adminClient.from("download_acceptances").insert(
    downloads.map((download) => ({
      user_id: user.id,
      download_file_id: download.id,
      download_slug: download.slug,
      terms_version: DOWNLOAD_TERMS_VERSION,
      access_token: `${batchToken}:${randomUUID()}`,
    })),
  );

  if (error) {
    await trackServerEvent("download_failed", {
      file: "selected-files",
      type: "ZIP",
      reason: "acceptance_write_failed",
    });
    throw new Error(error.message);
  }

  await Promise.all(
    downloads.map((download) =>
      trackServerEvent("download_terms_accepted", {
        file: download.slug,
        type: download.file_type,
      }),
    ),
  );

  redirect(`/downloads/bulk/thanks?token=${encodeURIComponent(batchToken)}`);
}
