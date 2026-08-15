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

      <div className="flex items-center gap-3">
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
