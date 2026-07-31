import type React from "react";
import { useState } from "react";
import * as enContent from "../content/en";
import * as zhContent from "../content/zh";
import { type Lang, LanguageContext } from "../content/languageContextValue";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const content = lang === "zh" ? zhContent : enContent;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: content }}>
      {children}
    </LanguageContext.Provider>
  );
}
