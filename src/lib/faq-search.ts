import { beforeEveryRide, faqCategories, officialResources, type FaqCategory, type FaqItem } from "@/lib/faq-content";

export type SearchRecord =
  | { type: "checklist"; id: string; title: string; body: string }
  | { type: "faq"; id: string; category: FaqCategory; item: FaqItem; title: string; body: string }
  | { type: "resource"; id: string; title: string; body: string; href: string; external?: boolean };

function buildIndex(): SearchRecord[] {
  const records: SearchRecord[] = [];

  beforeEveryRide.forEach((line, index) => {
    records.push({ type: "checklist", id: `checklist-${index}`, title: line, body: "" });
  });

  faqCategories.forEach((category) => {
    category.items.forEach((item, index) => {
      records.push({ type: "faq", id: `${category.id}-${index}`, category, item, title: item.q, body: item.a });
    });
  });

  officialResources.forEach((resource) => {
    records.push({
      type: "resource",
      id: `resource-${resource.href}`,
      title: resource.label,
      body: "",
      href: resource.href,
      external: resource.external,
    });
  });

  return records;
}

export const searchIndex = buildIndex();

export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function scoreRecord(record: SearchRecord, tokens: string[]): number {
  const title = record.title.toLowerCase();
  const body = record.body.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    const inTitle = title.includes(token);
    const inBody = body.includes(token);
    if (!inTitle && !inBody) return -1;
    score += (inTitle ? 2 : 0) + (inBody ? 1 : 0);
  }
  return score;
}

export function search(query: string): SearchRecord[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  return searchIndex
    .map((record) => ({ record, score: scoreRecord(record, tokens) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score)
    .map(({ record }) => record);
}
