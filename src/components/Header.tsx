"use client";

import Link from "next/link";
import { Language, TranslationKey, getTranslation } from "@/translations";
import { DarkModeToggle } from "./DarkModeToggle";

interface HeaderProps {
  lang: Language;
  onHelpClick?: () => void;
  onLanguageChange?: (lang: Language) => void;
}

export function Header({ lang, onHelpClick }: HeaderProps) {
  const t = (key: TranslationKey) => getTranslation(lang, key);
  const brandName = t("home.header");
  const [first, ...rest] = brandName.split(" ");
  const last = rest.join(" ");

  return (
    <div className="w-full max-w-[440px] flex items-center justify-between animate-in">
      {/* Brand Identity */}
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-primary rounded-[14px] flex items-center justify-center shadow-lg shadow-primary/20 rotate-[-4deg]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17l10-10M17 17V7H7" />
          </svg>
        </div>
        <h1 className="text-[20px] md:text-[24px] font-black tracking-tight text-foreground whitespace-nowrap">
          {first} <span className="text-primary">{last}</span>
        </h1>
      </Link>

      <div className="flex items-center gap-2.5">
        <a
          href="https://donate.stripe.com/fZu5kCbeB8vW82I8RcfAc02"
          target="_blank"
          rel="noopener noreferrer"
          className="glass w-8 h-8 rounded-full flex items-center justify-center text-foreground/75 hover:text-primary hover:border-primary/40 transition-all font-black text-[13px] shadow-sm active:scale-90"
          aria-label={t("common.support")}
          title={t("common.buyCoffee")}
        >
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
        </a>
        {onHelpClick && (
          <button
            type="button"
            onClick={onHelpClick}
            className="glass w-8 h-8 rounded-full flex items-center justify-center text-foreground/75 hover:text-primary hover:border-primary/40 transition-all font-black text-[13px] shadow-sm active:scale-90"
            aria-label="How to pay help"
            title="How to Pay"
          >
            ?
          </button>
        )}
        <DarkModeToggle />
      </div>
    </div>
  );
}
