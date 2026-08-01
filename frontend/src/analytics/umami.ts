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
} {
  return {
    host: import.meta.env.VITE_UMAMI_HOST,
    websiteId: import.meta.env.VITE_UMAMI_WEBSITE_ID,
  };
}

export function isConfigured(): boolean {
  const { host, websiteId } = umamiConfig();
  return Boolean(host && websiteId);
}

let scriptInjected = false;

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
}

export function track(
  eventName: string,
  data?: Record<string, unknown>,
): void {
  if (!isConfigured() || !window.umami) {
    return;
  }
  window.umami.track(eventName, data);
}
