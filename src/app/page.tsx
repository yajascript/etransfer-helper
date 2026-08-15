"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Language, TranslationKey, getTranslation } from "@/translations";
import { Header } from "@/components/Header";
import { AmountInput } from "@/components/AmountInput";
import { EmailInput } from "@/components/EmailInput";
import { SecurityField } from "@/components/SecurityField";
import { QRDisplay } from "@/components/QRDisplay";
import { BuyMeACoffee } from "@/components/BuyMeACoffee";

export default function Home() {
  const [lang, setLang] = useState<Language>("en");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [isInvoiceExpanded, setIsInvoiceExpanded] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [autodeposit, setAutodeposit] = useState(true);
  const [qrVisible, setQrVisible] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copyFeedback, setCopyFeedback] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = (key: TranslationKey) => getTranslation(lang, key);

  // Load from localStorage on mount
  useEffect(() => {
    const storedAmount = localStorage.getItem("helper_amount");
    const storedEmail = localStorage.getItem("helper_email") || localStorage.getItem("helper_default_email");
    const storedMessage = localStorage.getItem("helper_message");
    const storedInvoice = localStorage.getItem("helper_invoice_url");
    const storedSecurity = localStorage.getItem("helper_security-answer");
    const storedAutodeposit = localStorage.getItem("helper_autodeposit");

    if (storedAmount) setAmount(storedAmount);
    if (storedEmail) setEmail(storedEmail);
    if (storedMessage) setMessage(storedMessage);
    if (storedInvoice) {
      setInvoiceUrl(storedInvoice);
      setIsInvoiceExpanded(true);
    }
    if (storedSecurity) setSecurityAnswer(storedSecurity);
    if (storedAutodeposit) setAutodeposit(storedAutodeposit === "true");
  }, []);

  // Save to localStorage on change
  useEffect(() => localStorage.setItem("helper_amount", amount), [amount]);
  useEffect(() => localStorage.setItem("helper_email", email), [email]);
  useEffect(() => localStorage.setItem("helper_message", message), [message]);
  useEffect(() => localStorage.setItem("helper_invoice_url", invoiceUrl), [invoiceUrl]);
  useEffect(() => localStorage.setItem("helper_security-answer", securityAnswer), [securityAnswer]);
  useEffect(() => localStorage.setItem("helper_autodeposit", String(autodeposit)), [autodeposit]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = () => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= 25000 && isValidEmail(email) && (autodeposit || securityAnswer.trim().length > 0);
  };

  const isDirty = amount !== "" || email !== "" || message !== "" || invoiceUrl !== "" || securityAnswer !== "" || !autodeposit;

  const generateQR = async () => {
    if (!isFormValid()) {
      setQrVisible(false);
      return;
    }

    const url = new URL(window.location.origin + "/pay");
    url.searchParams.set("amount", parseFloat(amount).toFixed(2));
    url.searchParams.set("email", email);
    if (message.trim()) url.searchParams.set("message", message.trim());
    if (invoiceUrl.trim()) url.searchParams.set("invoice", invoiceUrl.trim());
    url.searchParams.set("autodeposit", String(autodeposit));
    if (!autodeposit && securityAnswer) url.searchParams.set("security", securityAnswer);
    url.searchParams.set("lang", lang);

    const urlString = url.toString();
    setGeneratedUrl(urlString);

    // Only set visible and scroll if it wasn't already visible
    if (!qrVisible) {
      setQrVisible(true);
      setTimeout(() => {
        document.getElementById("qr-result")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }

    // Give react a tick to render the canvas
    setTimeout(async () => {
      if (!canvasRef.current) return;
      try {
        await QRCode.toCanvas(canvasRef.current, urlString, {
          width: 240,
          margin: 2,
          color: { dark: "#00695c", light: "#ffffff" },
        });
      } catch (err) {
        console.error(err);
      }
    }, 50);
  };

  // Auto-update QR if valid
  useEffect(() => {
    if (isFormValid()) {
      generateQR();
    } else {
      setQrVisible(false);
    }
  }, [amount, email, message, invoiceUrl, autodeposit, securityAnswer, lang]);

  const clearForm = () => {
    if (confirm(t("home.clearConfirm"))) {
      setAmount("");
      const defaultEmail = localStorage.getItem("helper_default_email") || "";
      setEmail(defaultEmail);
      setMessage("");
      setInvoiceUrl("");
      setIsInvoiceExpanded(false);
      setSecurityAnswer("");
      setAutodeposit(true);
      setQrVisible(false);
      setGeneratedUrl("");

      localStorage.removeItem("helper_amount");
      localStorage.removeItem("helper_email");
      localStorage.removeItem("helper_message");
      localStorage.removeItem("helper_invoice_url");
      localStorage.removeItem("helper_security-answer");
      localStorage.removeItem("helper_autodeposit");
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };


  return (
    <main className="min-h-screen flex flex-col items-center px-6 md:px-10 pt-16 md:pt-24 pb-24 gap-12">
      <Header lang={lang} onLanguageChange={setLang} />

      <div className="w-full max-w-[440px] flex flex-col gap-6">
        <div className="glass rounded-[32px] p-8 md:p-10 flex flex-col gap-8 transition-all">
          <AmountInput
            label={t("home.amountLabel")}
            limitLabel={t("home.maxLimit")}
            value={amount}
            onChange={setAmount}
            max={25000}
          />

          <EmailInput
            label={t("home.emailLabel")}
            value={email}
            onChange={setEmail}
            placeholder="payments@etransfer-helper.com"
            t={t}
          />

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest">{t("home.messageLabel")}</label>
              <span className={`text-[10px] font-bold ${message.length >= 160 ? 'text-red-500' : 'text-muted/60'}`}>
                {message.length}/160
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 160))}
              rows={2}
              maxLength={160}
              className="bg-input border-none rounded-2xl p-4 text-[16px] outline-none focus:opacity-80 transition-all placeholder:text-muted/50 resize-none"
              placeholder={t("home.messagePlaceholder")}
            />
          </div>

          {!isInvoiceExpanded && !invoiceUrl ? (
            <button
              type="button"
              onClick={() => setIsInvoiceExpanded(true)}
              className="text-[11px] font-semibold text-muted/70 hover:text-foreground transition-colors flex items-center gap-1 self-start -mt-4 py-1 active:opacity-70"
            >
              <span>+</span>
              <span>{t("home.addInvoice")}</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2 animate-in duration-200">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest">
                  {t("home.invoiceLabel")}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceUrl("");
                      setIsInvoiceExpanded(false);
                    }}
                    className="text-[10px] font-bold text-muted/60 hover:text-red-500 transition-colors uppercase tracking-wider"
                  >
                    {t("home.removeInvoice")}
                  </button>
                  <span className={`text-[10px] font-bold ${invoiceUrl.length >= 120 ? 'text-red-500' : 'text-muted/60'}`}>
                    {invoiceUrl.length}/120
                  </span>
                </div>
              </div>
              <input
                type="url"
                value={invoiceUrl}
                maxLength={120}
                onChange={(e) => setInvoiceUrl(e.target.value.slice(0, 120))}
                className="bg-input border-none rounded-2xl p-4 text-[14px] outline-none focus:opacity-80 transition-all placeholder:text-muted/50 truncate font-mono"
                placeholder={t("home.invoicePlaceholder")}
                autoFocus
              />
            </div>
          )}

          <SecurityField
            label={t("home.securityLabel")}
            autodepositLabel={t("home.autodeposit")}
            autodeposit={autodeposit}
            onAutodepositChange={setAutodeposit}
            securityAnswer={securityAnswer}
            onSecurityAnswerChange={setSecurityAnswer}
            placeholder={t("home.securityPlaceholder")}
          />

          <button
            onClick={clearForm}
            disabled={!isDirty}
            className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all pt-2 self-center ${isDirty
              ? "text-muted hover:text-red-500 cursor-pointer"
              : "text-muted/20 cursor-default"
              }`}
          >
            {t("home.clearBtn")}
          </button>
        </div>

        {qrVisible && (
          <QRDisplay
            canvasRef={canvasRef}
            url={generatedUrl}
            onCopy={copyUrl}
            copyFeedback={copyFeedback}
            openLabel={t("home.openLink")}
            t={t}
          />
        )}

        <div className="flex justify-center pt-2 pb-4">
          <BuyMeACoffee lang={lang} />
        </div>
      </div>
    </main>
  );
}
