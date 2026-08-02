import { useEffect, useRef, useState } from "react";

import type { TraitId } from "./data";

const DURATION_MS = 600;

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/**
 * Tweens a trait-score object toward `target` over DURATION_MS, using the
 * animated value as the starting point for the next tween so repeated,
 * rapid selections don't jump-cut mid-flight.
 */
export function useAnimatedStats(target: Record<TraitId, number>): Record<TraitId, number> {
  const [values, setValues] = useState<Record<TraitId, number>>(target);
  const currentRef = useRef<Record<TraitId, number>>(target);

  useEffect(() => {
    const from = currentRef.current;
    const startTime = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = Math.min((now - startTime) / DURATION_MS, 1);
      const eased = easeOutCubic(progress);

      const next = {} as Record<TraitId, number>;
      (Object.keys(target) as TraitId[]).forEach((id) => {
        next[id] = from[id] + (target[id] - from[id]) * eased;
      });

      currentRef.current = next;
      setValues(next);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return values;
}
