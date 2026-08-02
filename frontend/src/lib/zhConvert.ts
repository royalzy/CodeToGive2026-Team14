import { Converter } from "opencc-js/t2cn";
import type { Lang } from "../content/languageContextValue";

// Content is authored once in Traditional Chinese (content/zh.ts and any
// inline zh copy). Simplified Chinese is derived from it at read time via
// OpenCC's Traditional -> Simplified (Mainland) character/phrase table, so
// we never have to hand-maintain a third parallel content file.
const toSimplified = Converter({ from: "t", to: "cn" });

/**
 * Recursively localizes string leaves of `value` for the given language.
 * - "en": returned unchanged.
 * - "zh-Hant": returned unchanged (content is authored in Traditional).
 * - "zh-Hans": every string leaf is converted to Simplified Chinese.
 */
export function localizeDeep<T>(value: T, lang: Lang): T {
  if (lang !== "zh-Hans") return value;
  return convertDeep(value) as T;
}

function convertDeep(value: unknown): unknown {
  if (typeof value === "string") return toSimplified(value);
  if (Array.isArray(value)) return value.map(convertDeep);
  if (typeof value === "function") {
    // Copy content occasionally exposes template helpers (e.g. `(name) =>
    // \`Welcome, ${name}\``) rather than plain strings. Wrap them so their
    // returned string is converted too, since the function body itself
    // can't be inspected here.
    return (...args: unknown[]) => convertDeep((value as (...a: unknown[]) => unknown)(...args));
  }
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      result[key] = convertDeep(entry);
    }
    return result;
  }
  return value;
}
