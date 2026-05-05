"use client";

import { useState, useEffect } from "react";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  limitLabel: string;
  max?: number;
}

export function AmountInput({ value, onChange, label, limitLabel, max = 25000 }: AmountInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  const formatWithCommas = (val: string) => {
    if (!val) return "";
    const parts = val.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  useEffect(() => {
    setDisplayValue(formatWithCommas(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/,/g, "").replace(/[^0-9.]/g, "");
    
    // Prevent multiple decimals
    const parts = rawVal.split(".");
    if (parts.length > 2) return;
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) return;

    onChange(rawVal);
  };

  const handleBlur = () => {
    if (value) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        onChange(num.toFixed(2));
      }
    }
  };

  const numValue = parseFloat(value);
  const isOverLimit = !isNaN(numValue) && numValue > max;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-stone-300 uppercase tracking-widest">{label}</label>
        {isOverLimit && (
          <span className="text-[10px] font-bold text-red-500 uppercase animate-pulse">{limitLabel}: ${max.toLocaleString()}</span>
        )}
      </div>
      <div className={`relative flex items-center border-b-2 transition-colors ${isOverLimit ? 'border-red-500' : 'border-[#eee] focus-within:border-primary'}`}>
        <span className={`text-[24px] font-semibold pr-3 transition-colors ${isOverLimit ? 'text-red-500' : 'text-stone-300'}`}>$</span>
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`border-none text-[24px] font-semibold w-full py-3 outline-none bg-transparent ${isOverLimit ? 'text-red-500' : 'text-foreground'}`}
          placeholder="0.00"
        />
      </div>
    </div>
  );
}
