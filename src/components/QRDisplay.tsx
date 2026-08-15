"use client";

import { RefObject } from "react";
import { TranslationKey } from "@/translations";

interface QRDisplayProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  url: string;
  onCopy: () => void;
  copyFeedback: boolean;
  openLabel: string;
  t: (key: TranslationKey) => string;
}

export function QRDisplay({ canvasRef, url, onCopy, copyFeedback, openLabel, t }: QRDisplayProps) {
  return (
    <div id="qr-result" className="glass rounded-[32px] p-8 md:p-10 flex flex-col items-center shadow-xl animate-in w-full">
      <canvas ref={canvasRef} className="mb-6 p-4 border-4 border-foreground/5 rounded-2xl max-w-full h-auto"></canvas>

      <div className="w-full flex flex-col gap-4">
        <div className="flex gap-2">
          {typeof navigator !== "undefined" && navigator.share && (
            <button 
              onClick={() => {
                navigator.share({
                  title: t("home.shareTitle"),
                  text: t("home.shareText"),
                  url: url,
                }).catch(() => {});
              }}
              className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-[0.98]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              {t("home.shareBtn")}
            </button>
          )}

          <button 
            onClick={onCopy}
            className={`w-[60px] h-[60px] rounded-2xl flex items-center justify-center transition-all shadow-sm ${copyFeedback ? 'bg-green-500 text-white' : 'bg-input border border-foreground/10 text-foreground hover:opacity-80'}`}
            title={t("home.copyLink")}
          >
            {copyFeedback ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>

          <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={openLabel}
            className="w-[60px] h-[60px] rounded-2xl bg-input border border-foreground/10 text-foreground hover:opacity-80 transition-all flex items-center justify-center shadow-sm"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>

        <input 
          readOnly 
          value={url} 
          className="bg-input border-none rounded-xl px-4 py-3.5 text-[12px] text-muted w-full outline-none truncate font-mono text-center" 
        />
      </div>
    </div>
  );
}
