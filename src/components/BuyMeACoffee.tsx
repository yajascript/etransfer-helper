"use client";

import { Language, TranslationKey, getTranslation } from "@/translations";

interface BuyMeACoffeeProps {
  lang: Language;
}

export function BuyMeACoffee({ lang }: BuyMeACoffeeProps) {
  const t = (key: TranslationKey) => getTranslation(lang, key);

  return (
    <a
      href="https://donate.stripe.com/fZu5kCbeB8vW82I8RcfAc02"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-slate-700/50 hover:border-primary/50 text-slate-400 hover:text-white transition-all text-[12px] font-semibold group shadow-sm active:scale-95 bg-slate-900/60"
      aria-label={t("common.buyCoffee")}
    >
      <span className="text-primary group-hover:scale-110 transition-transform">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
      </span>
      <span>{t("common.buyCoffee")}</span>
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-slate-400 group-hover:text-primary"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  );
}
