"use client";

import { Language, TranslationKey, getTranslation } from "@/translations";

interface HeaderProps {
  lang: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function Header({ lang, onLanguageChange }: HeaderProps) {
  const t = (key: TranslationKey) => getTranslation(lang, key);
  const brandName = t("home.header");
  const [first, ...rest] = brandName.split(" ");
  const last = rest.join(" ");

  return (
    <div className="w-full flex flex-col items-center gap-4 animate-in relative">
      {/* Brand Identity */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00695c] rounded-[14px] flex items-center justify-center shadow-lg shadow-[#00695c]/20 rotate-[-4deg]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17l10-10M17 17V7H7" />
            </svg>
          </div>
          <h1 className="text-[24px] font-black tracking-tight text-[#1a1a1a]">
            {first} <span className="text-[#00695c]">{last}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
