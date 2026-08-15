"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Language, TranslationKey, getTranslation } from "@/translations";
import { Header } from "@/components/Header";
import { InfoCard } from "@/components/InfoCard";
import { HowToPayModal } from "@/components/HowToPayModal";
import { BuyMeACoffee } from "@/components/BuyMeACoffee";

const BANKS = [
  { name: "RBC", url: "rbcmobile://", package: "com.rbc.mobile.android", web: "https://www.rbcroyalbank.com/onlinebanking/" },
  { name: "TD", url: "tdmobile://", package: "com.td", web: "https://easyweb.td.com/" },
  { name: "BMO", url: "bmomobile://", package: "com.bmo.mobile", web: "https://www.bmo.com/onlinebanking" },
  { name: "Scotiabank", url: "scotiabank://", package: "com.scotiabank.banking", web: "https://www.scotiabank.com/online-banking/" },
  { name: "CIBC", url: "cibcmobile://", package: "com.cibc.android.mobi", web: "https://www.cibc.com/online-banking/" },
  { name: "Desjardins", url: "desjardins://", package: "com.desjardins.mobile", web: "https://www.desjardins.com/accest/" },
  { name: "Tangerine", url: "tangerine://", package: "com.tangerine.android", web: "https://www.tangerine.ca/" },
  { name: "National Bank", url: "bnc://", package: "ca.bnc.mobile", web: "https://www.nbc.ca/" },
  { name: "Simplii", url: "simpliimobile://", package: "com.cibc.simplii", web: "https://www.simplii.com/" },
  { name: "EQ Bank", url: "eqbank://", package: "com.eqbank.eqbank", web: "https://www.eqbank.ca/" },
];

function PaymentContent() {
  const searchParams = useSearchParams();
  const lang: Language = (searchParams.get("lang") as Language) || "en";
  const amount = searchParams.get("amount") || "0.00";
  const email = searchParams.get("email") || "payments@etransfer-helper.com";
  const message = searchParams.get("message");
  const invoice = searchParams.get("invoice");
  const autodeposit = searchParams.get("autodeposit") === "true";
  const security = searchParams.get("security");

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const t = (key: TranslationKey) => getTranslation(lang, key);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formattedAmount = parseFloat(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <main className="min-h-screen flex flex-col items-center px-6 md:px-10 pt-12 md:pt-20 pb-24 gap-8">
      <Header lang={lang} onHelpClick={() => setIsHelpOpen(true)} />

      <HowToPayModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        lang={lang}
        autodeposit={autodeposit}
        securityAnswer={security}
        message={message}
      />

      <div className="w-full max-w-[440px] flex flex-col gap-8">
        {/* Payment Details */}
        <section className="flex flex-col items-center pt-4 pb-2 w-full animate-in">
          <span className="text-[11px] font-black text-muted uppercase tracking-[0.3em] mb-3">{t("pay.details")}</span>
          <div className="text-[48px] md:text-[56px] font-black text-foreground leading-none tracking-tight">
            ${formattedAmount}
          </div>
        </section>

        {/* Transfer Information Card */}
        <section className="glass rounded-[32px] p-8 md:p-10 flex flex-col gap-6 animate-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-primary font-black text-[12px] uppercase tracking-[0.2em] mb-2">{t("pay.transferInfo")}</h2>

          <div className="flex flex-col gap-4">
            <InfoCard
              label={t("pay.recipientEmail")}
              value={email}
              onCopy={() => copyToClipboard(email, "email")}
              isCopied={copiedField === "email"}
              copiedLabel={t("common.copiedShort")}
              breakAll
            />

            <InfoCard
              label={t("pay.amount")}
              value={`$${formattedAmount}`}
              onCopy={() => copyToClipboard(amount, "amount")}
              isCopied={copiedField === "amount"}
              copiedLabel={t("common.copiedShort")}
            />

            {!autodeposit && security && (
              <InfoCard
                label={t("pay.securityAnswer")}
                value={security}
                onCopy={() => copyToClipboard(security, "security")}
                isCopied={copiedField === "security"}
                copiedLabel={t("common.copiedShort")}
                uppercase
              />
            )}

            {message && (
              <InfoCard
                label={t("pay.notes")}
                value={message}
                onCopy={() => copyToClipboard(message, "message")}
                isCopied={copiedField === "message"}
                copiedLabel={t("common.copiedShort")}
              />
            )}

            {invoice && (
              <a
                href={invoice.startsWith("http://") || invoice.startsWith("https://") ? invoice : `https://${invoice}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-input rounded-2xl p-5 border border-foreground/5 flex flex-col gap-1 relative group cursor-pointer active:scale-[0.98] transition-all w-full hover:border-primary/20"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-muted uppercase tracking-widest">{t("pay.invoice")}</span>
                  <div className="text-muted/40 group-hover:text-primary transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                </div>
                <span className="text-[15px] md:text-[17px] font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {invoice}
                </span>
              </a>
            )}
          </div>
        </section>

        {/* Bank Links Card */}
        <section className="glass rounded-[32px] p-8 md:p-10 flex flex-col gap-6 animate-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-primary font-black text-[12px] uppercase tracking-[0.2em] mb-2">{t("pay.openBankApp")}</h2>
          <div className="grid grid-cols-2 gap-4">
            {BANKS.map((bank) => (
              <a
                key={bank.name}
                href={bank.url}
                className="bg-input border border-foreground/5 text-foreground/70 font-bold text-[13px] py-4 rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center text-center shadow-sm"
                onClick={(e) => {
                  const ua = navigator.userAgent;
                  const isAndroid = /Android/i.test(ua);
                  const isiOS = /iPhone|iPad|iPod/i.test(ua);

                  if (!isAndroid && !isiOS) {
                    e.preventDefault();
                    window.open(bank.web, "_blank");
                    return;
                  }

                  // Deep link handling
                  const start = Date.now();

                  if (isAndroid) {
                    e.preventDefault();
                    // Robust Android Intent: Open app by package, fallback to Play Store if not installed
                    const intent = `intent:#Intent;package=${bank.package};action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end`;
                    window.location.href = intent;
                  }
                  // On iOS, we let the default href (bank.url) do its thing.

                  setTimeout(() => {
                    const elapsed = Date.now() - start;
                    if (document.hasFocus() && elapsed < 3000) {
                      window.location.href = bank.web;
                    }
                  }, 2500);
                }}
              >
                {bank.name}
              </a>
            ))}
          </div>
        </section>

        {/* Growth CTA */}
        <section className="w-full flex flex-col items-center gap-4 py-4 animate-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-muted text-[13px] font-bold text-center">{t("pay.footerTitle")}</p>
          <Link
            href="/"
            className="glass px-8 py-4 rounded-2xl text-primary font-black text-[14px] hover:scale-[1.05] active:scale-[0.95] transition-all shadow-lg border-primary/10"
          >
            {t("pay.footerBtn")}
          </Link>
        </section>

        {/* Support / Buy Me a Coffee */}
        <div className="flex justify-center pt-2 pb-4 animate-in" style={{ animationDelay: '0.4s' }}>
          <BuyMeACoffee lang={lang} />
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#00695c] font-bold italic tracking-widest animate-pulse uppercase text-[12px]">Loading Portal...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
