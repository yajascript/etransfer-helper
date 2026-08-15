"use client";

import { useEffect } from "react";
import { Language, TranslationKey, getTranslation } from "@/translations";

interface HowToPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  autodeposit: boolean;
  securityAnswer?: string | null;
  message?: string | null;
}

export function HowToPayModal({
  isOpen,
  onClose,
  lang,
  autodeposit,
  securityAnswer,
  message,
}: HowToPayModalProps) {
  const t = (key: TranslationKey) => getTranslation(lang, key);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent scrolling behind modal
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-pay-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="glass rounded-[32px] p-6 md:p-8 w-full max-w-[440px] shadow-2xl flex flex-col gap-6 relative border border-white/10 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 text-foreground animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-black text-[14px]">
              ?
            </div>
            <h2 id="how-to-pay-title" className="text-primary font-black text-[13px] uppercase tracking-[0.2em]">
              {t("pay.howToPay")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
            className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground flex items-center justify-center transition-all active:scale-90 text-[14px] font-bold"
          >
            ✕
          </button>
        </div>

        {/* Steps List */}
        <div className="flex flex-col gap-6 py-2">
          {/* Step 1 */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-[13px] shrink-0 shadow-md shadow-primary/20">
              1
            </div>
            <p className="text-[14px] text-foreground/80 leading-relaxed pt-1">
              {t("pay.step1_1")}
              <span className="font-bold text-primary">{t("pay.recipientEmail")}</span>
              {t("pay.step1_2")}
              <span className="font-bold text-primary">{t("pay.amount")}</span>
              {t("pay.step1_3")}
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-[13px] shrink-0 shadow-md shadow-primary/20">
              2
            </div>
            <p className="text-[14px] text-foreground/80 leading-relaxed pt-1">
              {t("pay.step2_1")}
              <span className="font-bold text-primary">{t("pay.interac")}</span>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-[13px] shrink-0 shadow-md shadow-primary/20">
              3
            </div>
            <div className="text-[14px] text-foreground/80 leading-relaxed pt-1">
              <p>
                {t("pay.step3_1")}
                <span className="font-bold text-primary">
                  {autodeposit ? t("pay.autodeposit") : securityAnswer || "Autodeposit"}
                </span>
                {t("pay.step3_2")}
              </p>
              {message && (
                <p className="mt-2 text-[13px] opacity-80 italic">
                  {t("pay.step3Notes_1")}
                  <span className="font-bold text-primary">{t("pay.notes")}</span>
                  {t("pay.step3Notes_2")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Got It Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-primary hover:opacity-90 active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-primary/25 text-[14px] tracking-wide"
        >
          {t("common.gotIt")}
        </button>
      </div>
    </div>
  );
}
