import "server-only";

import { track } from "@vercel/analytics/server";
import { headers } from "next/headers";

type AnalyticsProperty = string | number | boolean | null;

/**
 * Record a server-side outcome without ever making analytics part of the
 * user-facing success path. Properties must remain anonymous: never include
 * email addresses, names, user IDs, tokens, ZIP codes, or message content.
 */
export async function trackServerEvent(
  name: string,
  properties?: Record<string, AnalyticsProperty>,
) {
  try {
    const requestHeaders = await headers();
    await track(name, properties, { headers: requestHeaders });
  } catch (error) {
    console.error(`Vercel Analytics event failed: ${name}`, error);
  }
}
