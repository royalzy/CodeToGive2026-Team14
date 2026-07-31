import { describe, expect, it } from "vitest";

import { recommendVolunteerRoles } from "./volunteerMatching";

describe("volunteer role matching", () => {
  it("ranks an explainable strong dance match first", () => {
    const recommendations = recommendVolunteerRoles({
      interest: "dance",
      availability: "monthly",
      participationStyle: "direct",
    });

    expect(recommendations[0].role.id).toBe("dance_activity_buddy");
    expect(recommendations[0].level).toBe("Strong fit");
    expect(recommendations[0].reasons).toHaveLength(3);
  });

  it("uses stable catalogue order to break equal scores", () => {
    const recommendations = recommendVolunteerRoles({
      interest: "community",
      availability: "twice_monthly",
      participationStyle: "direct",
    });

    expect(recommendations.map(({ role }) => role.id)).toEqual([
      "community_event_volunteer",
      "dance_activity_buddy",
      "sports_activity_buddy",
    ]);
  });

  it("uses plain-language levels at the configured thresholds", () => {
    const recommendations = recommendVolunteerRoles({
      interest: "dance",
      availability: "one_time",
      participationStyle: "behind_scenes",
    });

    expect(
      recommendations.find(({ role }) => role.id === "dance_activity_buddy")?.level,
    ).toBe("Good fit");
    expect(
      recommendations.find(({ role }) => role.id === "sports_activity_buddy")?.level,
    ).toBe("Worth exploring");
  });

  it("does not use the optional confidence answer in ranking", () => {
    const baseAnswers = {
      interest: "sports" as const,
      availability: "monthly" as const,
      participationStyle: "direct" as const,
    };

    expect(recommendVolunteerRoles({ ...baseAnswers, confidence: "ready" })).toEqual(
      recommendVolunteerRoles({ ...baseAnswers, confidence: "observe" }),
    );
  });
});
