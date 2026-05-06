"use client";

import { useState, useRef, useEffect } from "react";
import { TranslationKey } from "@/translations";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  t: (key: TranslationKey) => string;
}

const COMMON_DOMAINS = ["gmail.com", "outlook.com", "icloud.com", "hotmail.com", "yahoo.com"];

export function EmailInput({ value, onChange, label, placeholder, t }: EmailInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  const handleBlur = () => {
    if (value && !isValidEmail(value)) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  };

  const [isSaved, setIsSaved] = useState(false);
  const saveAsDefault = () => {
    if (isValidEmail(value)) {
      localStorage.setItem("helper_default_email", value);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-muted uppercase tracking-widest">{label}</label>
        {isValidEmail(value) && (
          <button 
            onClick={saveAsDefault}
            className={`text-[10px] font-black uppercase tracking-widest transition-all ${isSaved ? 'text-green-500' : 'text-primary hover:opacity-70'}`}
          >
            {isSaved ? "Saved!" : t("home.setDefault")}
          </button>
        )}
      </div>
      <input
        type="email"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (isInvalid) setIsInvalid(false);
        }}
        onBlur={handleBlur}
        onFocus={() => value.includes("@") && setSuggestions(suggestions)}
        className={`bg-input border-2 rounded-2xl p-4 text-[16px] outline-none transition-all placeholder:text-muted/50 ${isInvalid ? 'border-red-500/50 bg-red-500/5' : 'border-transparent focus:opacity-80'}`}
        placeholder={placeholder}
        autoComplete="email"
      />
      
      {showSuggestions && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-card border border-foreground/10 rounded-2xl shadow-2xl mt-1 z-50 overflow-hidden">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              className="w-full text-left px-4 py-3 text-[14px] hover:bg-foreground/5 transition-colors border-b border-foreground/5 last:border-none font-medium"
              onClick={() => {
                onChange(suggestion);
                setShowSuggestions(false);
                setIsInvalid(false);
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
