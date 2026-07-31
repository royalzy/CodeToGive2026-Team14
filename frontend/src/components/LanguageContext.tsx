import type React from "react";
import { useState } from "react";
import * as enContent from "../content/en";
import { type Lang, LanguageContext } from "../content/languageContextValue";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: enContent }}>
      {children}
    </LanguageContext.Provider>
  );
}
