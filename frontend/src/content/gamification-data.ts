import type { Badge, Level } from "./types";

export const levels: Level[] = [
  { name: "First Steps", minPoints: 0 },
  { name: "Curious Learner", minPoints: 100 },
  { name: "Community Maker", minPoints: 300 },
  { name: "Confidence Builder", minPoints: 600 },
  { name: "Ability Champion", minPoints: 1000 },
];

export const badges: Badge[] = [
  { id: "first-activity", label: "First Activity", description: "Attended your first session", threshold: 1 },
  { id: "five-sessions", label: "Five and Counting", description: "Attended five sessions", threshold: 5 },
  { id: "team-player", label: "Team Player", description: "Helped at a community event", threshold: 1 },
  { id: "streak-4", label: "Monthly Streak", description: "Active for four weeks in a row", threshold: 4 },
  { id: "dance-star", label: "Dance Star", description: "Performed on stage", threshold: 1 },
  { id: "kitchen-hero", label: "Kitchen Hero", description: "Led a cooking session", threshold: 1 },
];
