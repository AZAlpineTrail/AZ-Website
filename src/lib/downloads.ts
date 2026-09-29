import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/supabase/admin";
import { createSupabaseServerClient } from "@/supabase/server";

export const DOWNLOAD_TERMS_VERSION = "azat-download-terms-2026-07-06";
export const PROTECTED_DOWNLOADS_BUCKET = "protected-downloads";
const HIDDEN_DOWNLOAD_SLUGS = new Set(["azat-shapefile"]);

export type DownloadFile = {
  id: string;
  slug: string;
  title: string;
  file_type: string;
  version: string | null;
  storage_path: string;
  filename: string;
  content_type: string;
  active: boolean;
  published_at: string | null;
  notes: string | null;
};

export const fallbackDownloadFiles: DownloadFile[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    slug: "arizona-alpine-trail-gpx",
    title: "Complete Trail GPX",
    file_type: "GPX",
    version: "V5 / Mar 21, 2026",
    storage_path: "current/arizona-alpine-trail.gpx",
    filename: "arizona-alpine-trail.gpx",
    content_type: "application/gpx+xml",
    active: true,
    published_at: "2026-03-21",
    notes: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    slug: "azat-segments-v5-kml",
    title: "Segment Overlay KML",
    file_type: "KML",
    version: "V5 / Mar 21, 2026",
    storage_path: "current/azat-segments-v5.kml",
    filename: "azat-segments-v5.kml",
    content_type: "application/vnd.google-earth.kml+xml",
    active: true,
    published_at: "2026-03-21",
    notes: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    slug: "azat-shapefile",
    title: "GIS Shapefile",
    file_type: "SHP",
    version: "Planning archive",
    storage_path: "current/azat-shapefile.zip",
    filename: "azat-shapefile.zip",
    content_type: "application/zip",
    active: true,
    published_at: null,
    notes: null,
  },
];

export const termsParagraphs = [
  "PLEASE READ CAREFULLY. BY ACCESSING, DOWNLOADING, OR USING THE ARIZONA ALPINE TRAIL MAP SYSTEM, GPS DATA, OR ANY RELATED MATERIALS, YOU ACKNOWLEDGE AND AGREE THAT YOUR USE IS ENTIRELY AT YOUR OWN RISK AND THAT YOU ARE LEGALLY BOUND BY THE TERMS SET FORTH BELOW.",
  "Arizona Alpine Trail, Inc. is an Arizona nonprofit corporation organized under Section 501(c)(3) of the Internal Revenue Code, established for charitable and educational purposes, including educating and promoting public awareness regarding Off-Highway Vehicle (OHV) riding safety, responsible recreation, and awareness of and respect for the natural environment.",
  "Arizona Alpine Trail, Inc. does not own, operate, control, or manage any land, roadway, or trail, and does not grant permission to access any property. Trails referenced may be located on federal, state, tribal, municipal, or private lands.",
  'All maps, route descriptions, GPS tracks, data, images, text, and other materials provided by Arizona Alpine Trail, Inc. are provided solely for general informational and educational purposes and are provided "AS IS," "AS AVAILABLE," AND WITH ALL FAULTS.',
  "Arizona Alpine Trail, Inc. makes no representations or warranties of any kind, express or implied, including but not limited to warranties of accuracy, completeness, reliability, safety, merchantability, fitness for a particular purpose, or non-infringement.",
  "Trails may be inaccurately shown, misaligned, incomplete, unsafe, temporarily or permanently closed, or non-existent. Conditions may change at any time due to weather, erosion, washouts, fires, flooding, fallen trees, landownership issues, maintenance activity, or other unforeseen circumstances.",
  "Arizona Alpine Trail, Inc. has no duty or obligation to monitor, inspect, or assess trail conditions; update, correct, or verify any map or GPS information; or provide notice of closures, hazards, or changed conditions. Users are solely responsible for verifying trail conditions, access, legality, and suitability before and during any use.",
  "You expressly acknowledge that backcountry, alpine, and OHV recreation is inherently dangerous and may result in serious bodily injury or death. Risks include, without limitation: becoming lost, stranded, or disoriented; rapidly changing or severe weather conditions; steep, narrow, unstable, or unmaintained terrain; washouts, cliffs, rockfall, obstacles, and hidden hazards; vehicle, equipment, navigation, or communication failure; wildlife encounters; delayed, limited, or unavailable emergency response; and river conditions that may make it dangerous or impossible to cross because of unexpected high water.",
  "You voluntarily, knowingly, and expressly assume all risks, whether known or unknown, foreseeable or unforeseeable, arising out of or related to your use of any materials provided by Arizona Alpine Trail, Inc.",
  "Users are solely responsible for complying with all applicable federal, state, tribal, and local laws, including Arizona Off-Highway Vehicle (OHV) laws and regulations.",
  "To the fullest extent permitted by law, Arizona Alpine Trail, Inc., its directors, officers, volunteers, agents, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, exemplary, or punitive damages, including but not limited to personal injury, death, property damage, or loss of use, arising out of or relating to use of or reliance on maps or informational materials; errors, omissions, or inaccuracies; trail conditions, hazards, or access issues; or inability to locate, access, or safely travel any route.",
  "You agree to release, defend, indemnify, and hold harmless Arizona Alpine Trail, Inc., and its directors, officers, volunteers, agents, and affiliates from any and all claims, demands, causes of action, damages, losses, or liabilities arising out of or related to your use of any materials provided or any recreational activity undertaken in reliance thereon.",
  "Users agree to conduct themselves in a manner consistent with responsible recreation, environmental stewardship, and respect for landowners, other trail users, and natural resources.",
  'By clicking "I Agree," or by accessing or using the Arizona Alpine Trail map system or related materials in any manner, you acknowledge that you have read, understood, and voluntarily agreed to these Terms and Conditions and that you are waiving certain legal rights.',
];

export async function listActiveDownloads() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return fallbackDownloadFiles.filter((download) => !HIDDEN_DOWNLOAD_SLUGS.has(download.slug));
  }

  const { data, error } = await supabase
    .from("download_files")
    .select("*")
    .eq("active", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data?.length) {
    return fallbackDownloadFiles.filter((download) => !HIDDEN_DOWNLOAD_SLUGS.has(download.slug));
  }

  return (data as DownloadFile[]).filter((download) => !HIDDEN_DOWNLOAD_SLUGS.has(download.slug));
}

export async function getActiveDownloadBySlug(slug: string) {
  if (HIDDEN_DOWNLOAD_SLUGS.has(slug)) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return fallbackDownloadFiles.find((download) => download.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("download_files")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as DownloadFile;
}

export async function getDownloadForStreaming(slug: string) {
  if (HIDDEN_DOWNLOAD_SLUGS.has(slug)) {
    notFound();
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  const { data, error } = await supabase
    .from("download_files")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) {
    notFound();
  }

  return data as DownloadFile;
}

export function gatedDownloadHref(slug: string) {
  return `/downloads/${slug}`;
}
