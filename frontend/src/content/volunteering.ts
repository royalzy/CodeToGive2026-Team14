import type { VolunteerOpportunity } from "./types";
import { programs } from "./programs";

export const volunteerInterests = programs.map(({ slug, title }) => ({
  value: slug,
  label: title,
}));

export const availabilityOptions = [
  { value: "weekday", label: "Weekdays" },
  { value: "evening", label: "Evenings" },
  { value: "weekend", label: "Weekends" },
  { value: "flexible", label: "I'm flexible" },
];

export const opportunities: VolunteerOpportunity[] = [
  {
    id: "opp-1",
    title: "Saturday Sports Assistant",
    program: "sports",
    date: "9 Aug 2025",
    time: "10:00 – 12:00",
    spots: 4,
    role: "Support bocce and boxing sessions alongside coaches",
    accent: "red",
  },
  {
    id: "opp-2",
    title: "Community Performance Prep",
    program: "community",
    date: "12 Aug 2025",
    time: "14:00 – 16:00",
    spots: 6,
    role: "Help with staging, costumes and rehearsal support",
    accent: "blue",
  },
  {
    id: "opp-3",
    title: "Family Support Afternoon",
    program: "family_support",
    date: "14 Aug 2025",
    time: "13:00 – 15:00",
    spots: 3,
    role: "Welcome families and help facilitate group conversations",
    accent: "teal",
  },
  {
    id: "opp-4",
    title: "Nutrition Workshop Helper",
    program: "nutrition",
    date: "16 Aug 2025",
    time: "11:00 – 13:00",
    spots: 5,
    role: "Assist with food prep and guide small groups",
    accent: "orange",
  },
  {
    id: "opp-5",
    title: "Creative Arts Session",
    program: "enrichment",
    date: "19 Aug 2025",
    time: "10:00 – 12:00",
    spots: 4,
    role: "Support members exploring painting, craft and music",
    accent: "yellow",
  },
  {
    id: "opp-6",
    title: "Dragon Boat Training Day",
    program: "sports",
    date: "23 Aug 2025",
    time: "08:00 – 12:00",
    spots: 8,
    role: "Join the team on the water — no experience needed",
    accent: "red",
  },
];
