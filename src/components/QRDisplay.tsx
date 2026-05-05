"use client";

import { RefObject } from "react";

interface QRDisplayProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  url: string;
  onCopy: () => void;
  copyFeedback: boolean;
  openLabel: string;
}

export function QRDisplay({ canvasRef, url, onCopy, copyFeedback, openLabel }: QRDisplayProps) {
  return (
    <div id="qr-result" className="bg-white rounded-[24px] p-6 md:p-8 flex flex-col items-center shadow-xl animate-in w-full border border-stone-100">
      <canvas ref={canvasRef} className="mb-6 p-4 border-4 border-stone-50 rounded-2xl max-w-full h-auto"></canvas>
      
      <div className="w-full flex flex-col sm:flex-row gap-3">
        <input 
          readOnly 
          value={url} 
          className="bg-stone-50 border-none rounded-xl px-4 py-3 text-[13px] text-stone-500 flex-1 outline-none truncate font-sans" 
        />
        <div className="flex gap-2 justify-center sm:justify-start">
          <button 
            onClick={onCopy}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm ${copyFeedback ? 'bg-green-500 text-white' : 'bg-[#00695c] text-white hover:bg-[#004d40]'}`}
          >
            {copyFeedback ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
            className="w-12 h-12 rounded-xl bg-white border border-stone-100 text-stone-500 hover:bg-stone-50 transition-all flex items-center justify-center shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
