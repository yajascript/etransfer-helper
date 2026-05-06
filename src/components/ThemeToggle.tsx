"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) return <div className="w-14 h-8" />; // Avoid hydration mismatch

  return (
    <button
      onClick={toggleTheme}
      className={`glass p-1 rounded-full w-14 h-8 flex items-center relative transition-all duration-300 active:scale-90 shadow-sm overflow-hidden ${
        isDark ? "bg-slate-800/50" : "bg-primary/10"
      }`}
      aria-label="Toggle theme"
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-md ${
          isDark ? "translate-x-6 bg-slate-900" : "translate-x-0 bg-white"
        }`}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <svg 
            className={`absolute transition-all duration-500 ${isDark ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          <svg 
            className={`absolute transition-all duration-500 ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'}`}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
