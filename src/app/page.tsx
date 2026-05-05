"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Language, TranslationKey, getTranslation } from "@/translations";
import { Header } from "@/components/Header";
import { AmountInput } from "@/components/AmountInput";
import { EmailInput } from "@/components/EmailInput";
import { SecurityField } from "@/components/SecurityField";
import { QRDisplay } from "@/components/QRDisplay";

export default function Home() {
  const [lang, setLang] = useState<Language>("en"); // Default to English
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
    const storedEmail = localStorage.getItem("helper_email");
    const storedMessage = localStorage.getItem("helper_message");
    const storedSecurity = localStorage.getItem("helper_security-answer");
    const storedAutodeposit = localStorage.getItem("helper_autodeposit");

    if (storedAmount) setAmount(storedAmount);
    if (storedEmail) setEmail(storedEmail);
    if (storedMessage) setMessage(storedMessage);
    if (storedSecurity) setSecurityAnswer(storedSecurity);
    if (storedAutodeposit) setAutodeposit(storedAutodeposit === "true");
  }, []);

  // Save to localStorage on change
  useEffect(() => localStorage.setItem("helper_amount", amount), [amount]);
  useEffect(() => localStorage.setItem("helper_email", email), [email]);
  useEffect(() => localStorage.setItem("helper_message", message), [message]);
  useEffect(() => localStorage.setItem("helper_security-answer", securityAnswer), [securityAnswer]);
  useEffect(() => localStorage.setItem("helper_autodeposit", String(autodeposit)), [autodeposit]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = () => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= 25000 && isValidEmail(email) && (autodeposit || securityAnswer.trim().length > 0);
  };

  const generateQR = async () => {
    if (!isFormValid()) return;

    const url = new URL(window.location.origin + "/pay");
    url.searchParams.set("amount", parseFloat(amount).toFixed(2));
    url.searchParams.set("email", email);
    if (message) url.searchParams.set("message", message);
    url.searchParams.set("autodeposit", String(autodeposit));
    if (!autodeposit && securityAnswer) url.searchParams.set("security", securityAnswer);
    url.searchParams.set("lang", lang);

    const urlString = url.toString();
    setGeneratedUrl(urlString);
    setQrVisible(true);

    // Give react a tick to render the canvas
    setTimeout(async () => {
      if (!canvasRef.current) return;
      try {
        await QRCode.toCanvas(canvasRef.current, urlString, {
          width: 240,
          margin: 2,
          color: { dark: "#00695c", light: "#ffffff" },
        });
        
        // Scroll to the result
        document.getElementById("qr-result")?.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch (err) {
        console.error(err);
      }
    }, 50);
  };

  // Auto-update QR if visible (without scrolling)
  useEffect(() => {
    if (qrVisible) {
      const updateQR = async () => {
        const url = new URL(window.location.origin + "/pay");
        url.searchParams.set("amount", parseFloat(amount).toFixed(2));
        url.searchParams.set("email", email);
        if (message) url.searchParams.set("message", message);
        url.searchParams.set("autodeposit", String(autodeposit));
        if (!autodeposit && securityAnswer) url.searchParams.set("security", securityAnswer);
        url.searchParams.set("lang", lang);

        const urlString = url.toString();
        setGeneratedUrl(urlString);

        if (canvasRef.current) {
          try {
            await QRCode.toCanvas(canvasRef.current, urlString, {
              width: 240,
              margin: 2,
              color: { dark: "#00695c", light: "#ffffff" },
            });
          } catch (err) {
            console.error(err);
          }
        }
      };
      updateQR();
    }
  }, [amount, email, message, autodeposit, securityAnswer, lang, qrVisible]);

  const clearForm = () => {
    if (confirm(t("home.clearConfirm"))) {
      setAmount(""); setEmail(""); setMessage(""); setSecurityAnswer("");
      setAutodeposit(true); setQrVisible(false); setGeneratedUrl("");
      localStorage.clear();
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-6 md:px-10 pt-12 md:pt-20 pb-24 gap-10">
      <Header lang={lang} onLanguageChange={setLang} />

      <div className="w-full max-w-[440px] flex flex-col gap-6">
        <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 flex flex-col gap-8 transition-all">
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
          />

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-stone-300 uppercase tracking-widest">{t("home.messageLabel")}</label>
              <span className={`text-[10px] font-bold ${message.length >= 400 ? 'text-red-500' : 'text-stone-300'}`}>
                {message.length}/400
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 400))}
              rows={2}
              className="bg-[#f1f3f5] border-none rounded-lg p-3.5 text-[16px] outline-none focus:bg-[#e9ecef] transition-colors placeholder:text-[#adb5bd] resize-none"
              placeholder={t("home.messagePlaceholder")}
            />
          </div>

          <SecurityField 
            label={t("home.securityLabel")}
            autodepositLabel={t("home.autodeposit")}
            autodeposit={autodeposit}
            onAutodepositChange={setAutodeposit}
            securityAnswer={securityAnswer}
            onSecurityAnswerChange={setSecurityAnswer}
            placeholder={t("home.securityPlaceholder")}
          />

          <button onClick={clearForm} className="text-stone-400 hover:text-red-500 text-[12px] font-bold uppercase tracking-widest transition-colors pt-2">
            {t("home.clearBtn")}
          </button>
        </div>

        <button
          onClick={generateQR}
          disabled={!isFormValid()}
          className={`bg-[#00695c] text-white rounded-[20px] p-[18px] md:p-[20px] text-[18px] font-bold flex items-center justify-center gap-3 transition-all ${!isFormValid() ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#00695c]/20'}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
          </svg>
          {t("home.generateBtn")}
        </button>

        {qrVisible && (
          <QRDisplay 
            canvasRef={canvasRef}
            url={generatedUrl}
            onCopy={copyUrl}
            copyFeedback={copyFeedback}
            openLabel={t("home.openLink")}
          />
        )}
      </div>
    </main>
  );
}
