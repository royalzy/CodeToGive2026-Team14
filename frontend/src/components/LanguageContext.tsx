import type React from "react";
import { useEffect, useMemo, useState } from "react";
import * as enContent from "../content/en";
import * as zhContent from "../content/zh";
import { setCurrentLang } from "../analytics/umami";
import { type Lang, LanguageContext } from "../content/languageContextValue";
import { localizeDeep } from "../lib/zhConvert";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setCurrentLang(lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const content = useMemo(() => {
    const base = lang === "en" ? enContent : zhContent;
    return localizeDeep(base, lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: content }}>
      {children}
    </LanguageContext.Provider>
  );
}
