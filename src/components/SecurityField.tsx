"use client";

interface SecurityFieldProps {
  autodeposit: boolean;
  onAutodepositChange: (val: boolean) => void;
  securityAnswer: string;
  onSecurityAnswerChange: (val: string) => void;
  label: string;
  autodepositLabel: string;
  placeholder: string;
}

export function SecurityField({
  autodeposit,
  onAutodepositChange,
  securityAnswer,
  onSecurityAnswerChange,
  label,
  autodepositLabel,
  placeholder
}: SecurityFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-stone-300 uppercase tracking-widest">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-[#00695c] uppercase tracking-widest">{autodepositLabel}</span>
          <label className="relative inline-block w-11 h-6">
            <input
              type="checkbox"
              checked={autodeposit}
              onChange={(e) => onAutodepositChange(e.target.checked)}
              className="opacity-0 w-0 h-0"
            />
            <span className={`absolute cursor-pointer inset-0 transition-all rounded-full ${autodeposit ? 'bg-[#00695c]' : 'bg-[#ccc]'} after:content-[''] after:absolute after:h-[18px] after:w-[18px] after:left-[3px] after:bottom-[3px] after:bg-white after:transition-all after:rounded-full ${autodeposit ? 'after:translate-x-[20px]' : ''}`}></span>
          </label>
        </div>
      </div>
      {!autodeposit && (
        <input
          type="text"
          value={securityAnswer}
          onChange={(e) => onSecurityAnswerChange(e.target.value)}
          className="bg-[#f1f3f5] border-none rounded-lg p-3.5 text-[16px] outline-none focus:bg-[#e9ecef] transition-colors placeholder:text-[#adb5bd] animate-in"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
