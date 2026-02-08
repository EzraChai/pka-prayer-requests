"use client";

import { createContext, useEffect, useState } from "react";

export const LanguageContext = createContext<LanguageContextProvider | null>(
  null,
);

type LanguageContextProvider = {
  lang: string;
  setLang: (lang: string) => void;
};

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lang");
      return saved || "en";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
