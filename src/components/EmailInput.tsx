"use client";

import { useState, useRef, useEffect } from "react";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
}

const COMMON_DOMAINS = ["gmail.com", "outlook.com", "icloud.com", "hotmail.com", "yahoo.com"];

export function EmailInput({ value, onChange, label, placeholder }: EmailInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.includes("@")) {
      const [local, domain] = value.split("@");
      if (local && domain !== undefined) {
        const matches = COMMON_DOMAINS.filter(d => d.startsWith(domain) && d !== domain);
        setSuggestions(matches.map(d => `${local}@${d}`));
        setShowSuggestions(matches.length > 0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-[10px] font-black text-stone-300 uppercase tracking-widest">{label}</label>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.includes("@") && setSuggestions(suggestions)}
        className="bg-[#f1f3f5] border-none rounded-lg p-3.5 text-[16px] outline-none focus:bg-[#e9ecef] transition-colors placeholder:text-[#adb5bd]"
        placeholder={placeholder}
        autoComplete="email"
      />
      
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-stone-100 rounded-lg shadow-lg mt-1 z-50 overflow-hidden">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-none"
              onClick={() => {
                onChange(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
