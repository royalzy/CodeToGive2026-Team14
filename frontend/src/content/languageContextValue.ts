import { createContext } from "react";
import type * as enContent from "../content/en";

export type Lang = "en" | "zh";

export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof enContent;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
