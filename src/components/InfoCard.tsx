"use client";

interface InfoCardProps {
  label: string;
  value: string;
  onCopy: () => void;
  isCopied: boolean;
  copiedLabel: string;
  breakAll?: boolean;
  uppercase?: boolean;
}

export function InfoCard({ label, value, onCopy, isCopied, copiedLabel, breakAll, uppercase }: InfoCardProps) {
  return (
    <div 
      className="bg-input rounded-2xl p-5 border border-foreground/5 flex flex-col gap-1 relative group cursor-pointer active:scale-[0.98] transition-all w-full" 
      onClick={onCopy}
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-muted uppercase tracking-widest">{label}</span>
        <div className={`text-primary transition-opacity ${isCopied ? "opacity-100" : "opacity-20 group-hover:opacity-100"}`}>
          {isCopied ? (
            <span className="text-[11px] font-bold">{copiedLabel}</span>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </div>
      </div>
      <span className={`text-[16px] md:text-[18px] font-bold text-foreground leading-snug ${breakAll ? 'break-all' : ''} ${uppercase ? 'uppercase' : ''} whitespace-pre-wrap`}>
        {value}
      </span>
    </div>
  );
}
