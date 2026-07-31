import { badges, levels } from "./en";

/** Return the current level from total points. */
export function calculateLevel(points: number) {
  let current = levels[0];
  let next = levels.length > 1 ? levels[1] : null;

  for (let i = 0; i < levels.length; i++) {
    if (points >= levels[i].minPoints) {
      current = levels[i];
      next = levels[i + 1] ?? null;
    }
  }

  const progress = next
    ? ((points - current.minPoints) / (next.minPoints - current.minPoints)) * 100
    : 100;

  return { current, next, progress: Math.min(progress, 100) };
}

/** Award points for a completed activity. */
export function awardPoints(activity: string): number {
  const activityPoints: Record<string, number> = {
    session: 20,
    event: 50,
    share: 10,
    lead: 80,
  };

  return activityPoints[activity] ?? 15;
}

/** Return badges earned given total sessions and events count. */
export function earnedBadges(totalSessions: number, eventsHelped: number) {
  return badges.filter((badge) => {
    if (badge.id === "team-player" || badge.id === "kitchen-hero") return eventsHelped >= badge.threshold;
    return totalSessions >= badge.threshold;
  });
}
