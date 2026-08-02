import { createContext } from "react";
import type * as enContent from "../content/en";

export type Lang = "en" | "zh-Hant" | "zh-Hans";

export const langOrder: Lang[] = ["en", "zh-Hant", "zh-Hans"];

export const langShortLabel: Record<Lang, string> = {
  en: "EN",
  "zh-Hant": "繁",
  "zh-Hans": "简",
};

export const langFullLabel: Record<Lang, string> = {
  en: "English",
  "zh-Hant": "繁體中文",
  "zh-Hans": "简体中文",
};

export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof enContent;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
