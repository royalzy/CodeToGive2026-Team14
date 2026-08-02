declare global {
  interface Window {
    umami?: {
      track: (eventName: string, data?: Record<string, unknown>) => void;
    };
  }
}

export function umamiConfig(): {
  host?: string;
  websiteId?: string;
  dashboardUrl?: string;
} {
  return {
    host: import.meta.env.VITE_UMAMI_HOST,
    websiteId: import.meta.env.VITE_UMAMI_WEBSITE_ID,
    dashboardUrl: import.meta.env.VITE_UMAMI_DASHBOARD_URL,
  };
}

export const analyticsDashboardUrl = umamiConfig().dashboardUrl;

let currentLang = "en";
const firedEvents = new Set<string>();

export function setCurrentLang(lang: string): void {
  currentLang = lang;
}

export function isConfigured(): boolean {
  const { host, websiteId } = umamiConfig();
  return Boolean(host && websiteId);
}

let scriptInjected = false;
let ctaListenerAttached = false;

export function initAnalytics(): void {
  if (!isConfigured() || scriptInjected) {
    return;
  }
  scriptInjected = true;
  const { host, websiteId } = umamiConfig();
  const base = host!.replace(/\/$/, "");
  const script = document.createElement("script");
  script.defer = true;
  script.async = true;
  script.src = `${base}/script.js`;
  script.setAttribute("data-website-id", websiteId!);
  script.setAttribute("data-host-url", base);
  document.head.appendChild(script);

  if (!ctaListenerAttached) {
    ctaListenerAttached = true;
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const cta = target?.closest("[data-cta]")?.getAttribute("data-cta");
      if (cta) {
        track("cta_click", { cta });
      }
    });
  }

  const reducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const highContrast = window.matchMedia?.(
    "(prefers-contrast: more)",
  ).matches;
  if (reducedMotion || highContrast) {
    trackOnce("accessibility_pref", {
      reduced_motion: reducedMotion ?? false,
      high_contrast: highContrast ?? false,
    });
  }
}

export function track(
  eventName: string,
  data?: Record<string, unknown>,
): void {
  if (!isConfigured() || !window.umami) {
    return;
  }
  window.umami.track(eventName, {
    lang: currentLang,
    ...data,
  });
}

export function trackOnce(
  eventName: string,
  data?: Record<string, unknown>,
): void {
  if (firedEvents.has(eventName)) {
    return;
  }
  firedEvents.add(eventName);
  track(eventName, data);
}

export function trackFormStarted(formName: string): void {
  trackOnce(`${formName}_form_started`);
}

export function __resetState(): void {
  scriptInjected = false;
  ctaListenerAttached = false;
  firedEvents.clear();
  currentLang = "en";
}
