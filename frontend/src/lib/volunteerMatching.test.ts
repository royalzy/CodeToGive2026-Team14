import { describe, expect, it } from "vitest";

import { recommendVolunteerRoles } from "./volunteerMatching";

describe("volunteer role matching", () => {
  it("ranks an explainable strong creative-arts match first", () => {
    const recommendations = recommendVolunteerRoles({
      programs: ["enrichment"],
      roleType: "class_assistant",
      availability: "monthly",
      participationStyle: "direct",
    });

    expect(recommendations[0].role.id).toBe("dance_activity_buddy");
    expect(recommendations[0].level).toBe("Strong fit");
    expect(recommendations[0].reasons).toHaveLength(4);
  });

  it("uses stable catalogue order to break equal scores", () => {
    const recommendations = recommendVolunteerRoles({
      programs: ["sports"],
      availability: "twice_monthly",
      participationStyle: "behind_scenes",
    });

    expect(recommendations.map(({ role }) => role.id)).toEqual([
      "sports_activity_buddy",
      "sports_class_leader",
      "family_support_assistant",
      "dance_activity_buddy",
      "nutrition_class_assistant",
      "enrichment_class_leader",
      "community_event_volunteer",
    ]);
  });

  it("uses plain-language levels at the configured thresholds", () => {
    const recommendations = recommendVolunteerRoles({
      programs: ["enrichment"],
      availability: "one_time",
      participationStyle: "direct",
    });

    expect(
      recommendations.find(({ role }) => role.id === "dance_activity_buddy")?.level,
    ).toBe("Good fit");
    expect(
      recommendations.find(({ role }) => role.id === "sports_activity_buddy")?.level,
    ).toBe("Worth exploring");
  });

  it("does not use the optional confidence answer in ranking", () => {
    const baseAnswers: Pick<
      Parameters<typeof recommendVolunteerRoles>[0],
      "programs" | "availability" | "participationStyle"
    > = {
      programs: ["sports"],
      availability: "monthly",
      participationStyle: "direct",
    };

    expect(recommendVolunteerRoles({ ...baseAnswers, confidence: "ready" })).toEqual(
      recommendVolunteerRoles({ ...baseAnswers, confidence: "observe" }),
    );
  });
});
