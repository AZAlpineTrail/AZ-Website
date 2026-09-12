"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, PhoneCall, Search, X } from "lucide-react";
import {
  beforeEveryRide,
  emergencyProcedure,
  faqCategories,
  legalDisclaimer,
  officialResources,
  type FaqCategory,
  type FaqItem,
} from "@/lib/faq-content";
import { search, tokenize, type SearchRecord } from "@/lib/faq-search";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text: string, tokens: string[]): ReactNode {
  if (tokens.length === 0 || !text) return text;
  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, index) =>
    tokens.some((token) => part.toLowerCase() === token.toLowerCase()) ? (
      <mark key={index} className="rounded-[2px] bg-[#f1b65a]/50 text-[#13221a]">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function renderAnswerText(text: string, tokens: string[]): ReactNode {
  return text.split("\n\n").map((paragraph, paragraphIndex) => {
    const parts = paragraph.split(/(1-800-VANDALS|911)/g);

    return (
      <p key={paragraphIndex} className={paragraphIndex > 0 ? "mt-3" : undefined}>
        {parts.map((part, partIndex) =>
          part === "1-800-VANDALS" || part === "911" ? (
            <strong key={partIndex} className="font-semibold text-[#13221a]">
              {highlightText(part, tokens)}
            </strong>
          ) : (
            <span key={partIndex}>{highlightText(part, tokens)}</span>
          ),
        )}
      </p>
    );
  });
}

function ContactEscapeHatch() {
  return (
    <p className="max-w-sm text-sm leading-relaxed text-[#5f6c63]">
      Can&apos;t find what you&apos;re looking for?
      <br />
      <Link href="/contact" className="font-semibold text-[#13221a] underline underline-offset-4 hover:text-[#b74f32]">
        Contact AZAT
      </Link>
      .
    </p>
  );
}

function FaqLink({ link }: { link: NonNullable<FaqItem["link"]> }) {
  const classes =
    "mt-3 inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-[0.1em] text-[#b74f32] underline underline-offset-4 hover:text-[#8f3d27]";
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={classes}>
        {link.label}
        <ArrowUpRight size={12} aria-hidden="true" />
      </a>
    );
  }
  return (
    <Link href={link.href} className={classes}>
      {link.label}
    </Link>
  );
}

function QuestionRow({
  item,
  defaultOpen,
  isFirst,
  tokens = [],
}: {
  item: FaqItem;
  defaultOpen?: boolean;
  isFirst?: boolean;
  tokens?: string[];
}) {
  return (
    <details open={defaultOpen} className="group border-b border-[#d8ded4] last:border-b-0">
      <summary
        className={`flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden ${
          isFirst ? "pt-0" : ""
        }`}
      >
        <span className="text-base font-semibold leading-snug text-[#13221a] sm:text-lg">{highlightText(item.q, tokens)}</span>
        <ChevronDown
          aria-hidden="true"
          size={18}
          className="mt-1 shrink-0 text-[#5f6c63] transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="max-w-[65ch] pb-5 text-[15px] leading-relaxed text-[#5f6c63]">
        {renderAnswerText(item.a, tokens)}
        {item.link ? <FaqLink link={item.link} /> : null}
      </div>
    </details>
  );
}

function CategoryBlock({
  category,
  items,
  resetKey,
  tokens = [],
}: {
  category: FaqCategory;
  items: FaqItem[];
  resetKey: string;
  tokens?: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xl font-semibold text-[#13221a] sm:text-2xl">{category.title}</h3>
      <div className="mt-2" key={resetKey}>
        {items.map((item, index) => (
          <QuestionRow key={item.q} item={item} defaultOpen={index === 0} isFirst={index === 0} tokens={tokens} />
        ))}
      </div>
    </div>
  );
}

export function FaqExplorer() {
  const [activeCategoryId, setActiveCategoryId] = useState(faqCategories[0].id);
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;
  const tokens = useMemo(() => tokenize(trimmedQuery), [trimmedQuery]);
  const results = useMemo(() => (isSearching ? search(trimmedQuery) : []), [isSearching, trimmedQuery]);

  const faqMatches = results.filter((record): record is Extract<SearchRecord, { type: "faq" }> => record.type === "faq");
  const resourceMatches = results.filter((record): record is Extract<SearchRecord, { type: "resource" }> => record.type === "resource");

  const faqGroups: { category: FaqCategory; items: FaqItem[] }[] = [];
  faqMatches.forEach((record) => {
    const existing = faqGroups.find((group) => group.category.id === record.category.id);
    if (existing) existing.items.push(record.item);
    else faqGroups.push({ category: record.category, items: [record.item] });
  });

  const totalMatches = results.length;
  const activeCategory = faqCategories.find((category) => category.id === activeCategoryId) ?? faqCategories[0];

  const categoryNavButtons = (variant: "rail" | "pills") => (
    <div
      role="tablist"
      aria-label="FAQ categories"
      className={variant === "rail" ? "flex flex-col" : "flex flex-wrap gap-2"}
    >
      {faqCategories.map((category) => {
        const active = category.id === activeCategoryId;
        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setActiveCategoryId(category.id)}
            className={
              variant === "rail"
                ? `min-h-10 rounded-sm px-3 py-2 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] ${
                    active ? "bg-[#f8f4e8] font-semibold text-[#13221a]" : "text-[#5f6c63] hover:text-[#13221a]"
                  }`
                : `min-h-10 shrink-0 rounded-full px-4 text-xs font-bold uppercase tracking-[0.06em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] ${
                    active
                      ? "bg-[#13221a] text-white"
                      : "border border-[#d8ded4] bg-transparent text-[#5f6c63] hover:border-[#b74f32] hover:text-[#13221a]"
                  }`
            }
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-w-0">
      <section aria-labelledby="emergency" className="border-t border-[#d8ded4] pt-10">
        <div className="flex items-start gap-3 rounded-sm border-2 border-[#b74f32] bg-[#fffdf7] p-6 sm:p-8">
          <PhoneCall aria-hidden="true" size={24} className="mt-1 shrink-0 text-[#b74f32]" />
          <div>
            <h2 id="emergency" className="text-2xl font-semibold text-[#13221a] sm:text-3xl">
              In an emergency
            </h2>
            <p className="mt-2 max-w-[65ch] text-[15px] leading-relaxed text-[#5f6c63]">
              {isSearching ? highlightText(emergencyProcedure, tokens) : emergencyProcedure}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="before-every-ride" className="mt-16 border-t border-[#d8ded4] pt-10">
        <h2 id="before-every-ride" className="text-2xl font-semibold text-[#13221a] sm:text-3xl">
          Before every ride
        </h2>
        <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {beforeEveryRide.map((line) => (
            <li key={line} className="text-[15px] leading-relaxed text-[#5f6c63]">
              {isSearching ? highlightText(line, tokens) : line}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[65ch] text-xs leading-relaxed text-[#5f6c63]">
          {isSearching ? highlightText(legalDisclaimer, tokens) : legalDisclaimer}
        </p>
      </section>

      <div className="mt-14 lg:grid lg:grid-cols-[300px_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-[92px] lg:self-start">
          <div className="relative">
            <label htmlFor="faq-search" className="sr-only">
              Search the FAQ
            </label>
            <Search aria-hidden="true" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5f6c63]" />
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions"
              className="min-h-11 w-full rounded-full border border-[#d8ded4] bg-[#fffdf7] py-2 pl-11 pr-11 text-sm text-[#13221a] placeholder:text-[#5f6c63] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-[#5f6c63] transition hover:bg-[#d8ded4] hover:text-[#13221a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
              >
                <X size={16} aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {!isSearching ? (
            <div className="mt-6">
              <div className="hidden lg:block">{categoryNavButtons("rail")}</div>
              <div className="lg:hidden">{categoryNavButtons("pills")}</div>
            </div>
          ) : null}

          <div className="mt-8 hidden lg:block">
            <ContactEscapeHatch />
          </div>
        </aside>

        <div className="mt-10 lg:mt-0" aria-live="polite">
          {isSearching ? (
            totalMatches > 0 ? (
              <div className="flex flex-col gap-10">
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#5f6c63]">
                  {totalMatches} {totalMatches === 1 ? "result" : "results"} for &ldquo;{trimmedQuery}&rdquo;
                </p>

                {faqGroups.map(({ category, items }) => (
                  <CategoryBlock key={category.id} category={category} items={items} resetKey={`search-${trimmedQuery}`} tokens={tokens} />
                ))}

                {resourceMatches.length > 0 ? (
                  <div>
                    <h3 className="text-xl font-semibold text-[#13221a] sm:text-2xl">Official resources</h3>
                    <ul className="mt-4 flex flex-col gap-3">
                      {resourceMatches.map((record) => (
                        <li key={record.id}>
                          <a
                            href={record.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-11 w-full items-start gap-1.5 py-2.5 text-sm leading-relaxed text-[#13221a] underline decoration-[#d8ded4] underline-offset-4 hover:text-[#b74f32] hover:decoration-[#b74f32]"
                          >
                            <span>{highlightText(record.title, tokens)}</span>
                            <ArrowUpRight size={13} aria-hidden="true" className="mt-0.5 shrink-0 text-[#5f6c63]" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="py-8">
                <p className="text-lg font-semibold text-[#13221a]">No matches for &ldquo;{trimmedQuery}&rdquo;</p>
                <p className="mt-2 text-sm text-[#5f6c63]">Try a shorter word, or clear the search.</p>
              </div>
            )
          ) : (
            <CategoryBlock category={activeCategory} items={activeCategory.items} resetKey={activeCategoryId} />
          )}
        </div>
      </div>

      <div className="mt-10 lg:hidden">
        <ContactEscapeHatch />
      </div>

      {!isSearching ? (
        <section aria-labelledby="official-resources" className="mt-16 border-t border-[#d8ded4] pb-4 pt-10">
          <h2 id="official-resources" className="text-2xl font-semibold text-[#13221a] sm:text-3xl">
            Official resources
          </h2>
          <p className="mt-2 max-w-[65ch] text-[15px] leading-relaxed text-[#5f6c63]">
            AZAT doesn&apos;t control these agencies. Verify closures, permits, and conditions directly with them before you
            ride.
          </p>
          <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {officialResources.map((resource) => (
              <li key={resource.href}>
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 w-full items-start gap-1.5 py-2.5 text-sm leading-relaxed text-[#13221a] underline decoration-[#d8ded4] underline-offset-4 hover:text-[#b74f32] hover:decoration-[#b74f32]"
                >
                  <span>{resource.label}</span>
                  <ArrowUpRight size={13} aria-hidden="true" className="mt-0.5 shrink-0 text-[#5f6c63]" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
