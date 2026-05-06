"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Language, TranslationKey, getTranslation } from "@/translations";
import { Header } from "@/components/Header";
import { InfoCard } from "@/components/InfoCard";

const BANKS = [
  { name: "RBC Mobile", url: "https://www.rbcroyalbank.com/onlinebanking/" },
  { name: "TD Bank", url: "https://easyweb.td.com/" },
  { name: "BMO App", url: "https://www.bmo.com/onlinebanking" },
  { name: "Scotiabank", url: "https://www.scotiabank.com/online-banking/" },
  { name: "CIBC", url: "https://www.cibc.com/online-banking/" },
  { name: "Desjardins", url: "https://www.desjardins.com/accest/" },
];

function PaymentContent() {
  const searchParams = useSearchParams();
  const lang: Language = (searchParams.get("lang") as Language) || "en";
  const amount = searchParams.get("amount") || "0.00";
  const email = searchParams.get("email") || "payments@etransfer-helper.com";
  const message = searchParams.get("message");
  const autodeposit = searchParams.get("autodeposit") === "true";
  const security = searchParams.get("security");

  const [copiedField, setCopiedField] = useState<string | null>(null);

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
      <Header lang={lang} />

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
                target="_blank"
                rel="noopener noreferrer"
                className="bg-input border border-foreground/5 text-foreground/70 font-bold text-[13px] py-4 rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center text-center shadow-sm"
              >
                {bank.name}
              </a>
            ))}
          </div>
        </section>

        {/* How to Pay Card */}
        <section className="glass rounded-[32px] p-8 md:p-10 flex flex-col gap-8 animate-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-primary font-black text-[12px] uppercase tracking-[0.2em] mb-2">{t("pay.howToPay")}</h2>

          <div className="flex flex-col gap-10">
            <div className="flex gap-4 md:gap-6">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-primary/20">1</div>
              <p className="text-[14px] md:text-[15px] text-foreground/80 leading-relaxed pt-1">
                {t("pay.step1_1")}
                <span className="font-bold text-primary"> {t("pay.recipientEmail")} </span>
                {t("pay.step1_2")}
                <span className="font-bold text-primary"> {t("pay.amount")} </span>
                {t("pay.step1_3")}
              </p>
            </div>

            <div className="flex gap-4 md:gap-6">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-primary/20">2</div>
              <p className="text-[14px] md:text-[15px] text-foreground/80 leading-relaxed pt-1">
                {t("pay.step2_1")}
                <span className="font-bold text-primary"> {t("pay.interac")}</span>.
              </p>
            </div>

            <div className="flex gap-4 md:gap-6">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-primary/20">3</div>
              <div className="text-[14px] md:text-[15px] text-foreground/80 leading-relaxed pt-1">
                <p>
                  {t("pay.step3_1")}
                  <span className="font-bold text-primary"> {autodeposit ? t("pay.autodeposit") : security} </span>
                  {t("pay.step3_2")}
                </p>
                {message && (
                  <p className="mt-2 opacity-80 italic">
                    {t("pay.step3Notes_1")}
                    <span className="font-bold text-primary"> {t("pay.notes")} </span>
                    {t("pay.step3Notes_2")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
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
