import { type PointerEvent, useEffect, useRef, useState } from "react";

import type { VolunteerTestimonial } from "../../content/volunteer";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

const AUTO_SCROLL_PX_PER_SECOND = 32;

const ariaLabelCopy = {
  en: "Volunteer testimonials — drag or scroll to browse",
  zh: "義工分享 — 拖曳或滾動瀏覽",
} as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function VolunteerTestimonialMarquee({
  testimonials,
}: {
  testimonials: VolunteerTestimonial[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragOrigin = useRef({ pointerX: 0, scrollLeft: 0 });
  const lastTimestamp = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { lang } = useLanguage();
  const ariaLabel = localizeDeep(ariaLabelCopy[lang === "en" ? "en" : "zh"], lang);

  const loopedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    let frameId: number;
    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    function step(timestamp: number) {
      const track = trackRef.current;
      if (track) {
        if (lastTimestamp.current === null) lastTimestamp.current = timestamp;
        const deltaSeconds = (timestamp - lastTimestamp.current) / 1000;
        lastTimestamp.current = timestamp;

        if (!isPausedRef.current && !isDraggingRef.current) {
          const halfWidth = track.scrollWidth / 2;
          let nextScrollLeft = track.scrollLeft + AUTO_SCROLL_PX_PER_SECOND * deltaSeconds;
          if (halfWidth > 0 && nextScrollLeft >= halfWidth) {
            nextScrollLeft -= halfWidth;
          }
          track.scrollLeft = nextScrollLeft;
        }
      }
      frameId = requestAnimationFrame(step);
    }

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  function pause() {
    isPausedRef.current = true;
  }

  function resume() {
    isPausedRef.current = false;
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    // Touch and pen already get native, momentum-scrolling drag from
    // overflow-x; only mouse needs the manual click-drag behaviour.
    if (!track || event.pointerType !== "mouse") return;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragOrigin.current = { pointerX: event.clientX, scrollLeft: track.scrollLeft };
    track.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!isDraggingRef.current || !track) return;
    const delta = event.clientX - dragOrigin.current.pointerX;
    track.scrollLeft = dragOrigin.current.scrollLeft - delta;
  }

  function endDrag() {
    isDraggingRef.current = false;
    setIsDragging(false);
  }

  function normaliseLoopOnScroll() {
    const track = trackRef.current;
    if (!track) return;
    const halfWidth = track.scrollWidth / 2;
    if (halfWidth <= 0) return;
    if (track.scrollLeft >= halfWidth) {
      track.scrollLeft -= halfWidth;
    } else if (track.scrollLeft < 0) {
      track.scrollLeft += halfWidth;
    }
  }

  return (
    <div
      className={`volunteer-testimonial-marquee ${isDragging ? "is-dragging" : ""}`}
      aria-label={ariaLabel}
    >
      <div
        className="volunteer-testimonial-track"
        ref={trackRef}
        role="list"
        tabIndex={0}
        onMouseEnter={pause}
        onMouseLeave={() => {
          resume();
          endDrag();
        }}
        onFocus={pause}
        onBlur={resume}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onScroll={normaliseLoopOnScroll}
      >
        {loopedTestimonials.map((testimonial, index) => (
          <figure
            key={`${testimonial.name}-${index}`}
            role="listitem"
            className={`volunteer-testimonial-card volunteer-accent-${testimonial.accent}`}
            aria-hidden={index >= testimonials.length}
          >
            <blockquote>&ldquo;{testimonial.quote}&rdquo;</blockquote>
            <figcaption className="volunteer-testimonial-person">
              <span className="volunteer-testimonial-avatar" aria-hidden="true">
                {getInitials(testimonial.name)}
              </span>
              <span className="volunteer-testimonial-identity">
                <strong>{testimonial.name}</strong>
                <span className="volunteer-testimonial-role">
                  {testimonial.role} · {testimonial.org}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
