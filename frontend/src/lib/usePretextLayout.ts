import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";
import { useLayoutEffect, useRef } from "react";

export function usePretextLayout<T extends HTMLElement>(text: string) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    let disposed = false;
    let preparedText = text;
    let preparedFont = "";
    let prepared = prepareWithSegments(text, "16px sans-serif");

    function measure() {
      if (disposed || !element || element.clientWidth <= 0) return;
      const styles = window.getComputedStyle(element);
      const nextText = element.textContent?.trim() || text;
      const font = styles.font;
      if (nextText !== preparedText || font !== preparedFont) {
        preparedText = nextText;
        preparedFont = font;
        prepared = prepareWithSegments(nextText, font, {
          letterSpacing: Number.parseFloat(styles.letterSpacing) || 0,
        });
      }
      const fontSize = Number.parseFloat(styles.fontSize) || 16;
      const lineHeight = Number.parseFloat(styles.lineHeight) || fontSize * 1.2;
      const result = layoutWithLines(prepared, element.clientWidth, lineHeight);
      element.style.setProperty(
        "--pretext-height",
        `${Math.ceil(result.height)}px`,
      );
      element.dataset.pretextLines = String(result.lineCount);
    }

    void document.fonts.ready.then(measure);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(element);
    const mutationObserver = new MutationObserver(measure);
    mutationObserver.observe(element, {
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [text]);

  return ref;
}
