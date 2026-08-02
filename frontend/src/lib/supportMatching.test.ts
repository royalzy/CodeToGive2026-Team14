import { describe, expect, it } from "vitest";

import { describeAnswers, needOptions, supportPathways } from "../content/support";
import { recommendSupportPathways } from "./supportMatching";

describe("answer summary for the request form", () => {
  it("joins the chosen labels with full stops", () => {
    expect(
      describeAnswers({
        audience: "carer",
        need: "carer_rest",
        start: "conversation",
      }),
    ).toBe(
      "For someone I care for. I am exhausted and need support myself. A conversation with the team.",
    );
  });

  it("uses the ideographic full stop for Traditional Chinese", async () => {
    const zh = await import("../content/zh");
    const summary = describeAnswers(
      { audience: "carer", need: "carer_rest", start: "conversation" },
      zh.supportQuestions,
    );

    expect(summary).toBe("為我照顧的人。我感到疲累，自己也需要支援。與團隊傾談。");
    expect(summary).not.toContain(". ");
  });

  it("leaves out 'prefer not to say' rather than repeating it back", () => {
    const summary = describeAnswers({
      audience: "unspecified",
      need: "unsure",
      start: "read",
    });

    expect(summary).not.toContain("Prefer not to say");
    expect(summary).toBe("I am not sure yet. Something to read on my own first.");
  });
});

describe("support pathway matching", () => {
  it("puts a carer who is exhausted in front of carer support", () => {
    const [first] = recommendSupportPathways({
      audience: "carer",
      need: "carer_rest",
      start: "conversation",
    });

    expect(first.pathway.id).toBe("carer_support");
    expect(first.reasons).toHaveLength(3);
  });

  it("sends someone who wants to read first to the learning page", () => {
    const [first] = recommendSupportPathways({
      audience: "self",
      need: "practical",
      start: "read",
    });

    expect(first.pathway.id).toBe("learn");
  });

  it("sends someone wanting to meet people to the community page", () => {
    const [first] = recommendSupportPathways({
      audience: "self",
      need: "community",
      start: "group",
    });

    expect(first.pathway.id).toBe("community");
  });

  it("sends a professional wanting practical action to programmes", () => {
    const [first] = recommendSupportPathways({
      audience: "professional",
      need: "practical",
      start: "action",
    });

    expect(first.pathway.id).toBe("programmes");
  });

  it("always returns every pathway so nothing is hidden", () => {
    const recommendations = recommendSupportPathways({
      audience: "unspecified",
      need: "unsure",
      start: "read",
    });

    expect(recommendations).toHaveLength(supportPathways.length);
  });

  it("always gives every pathway at least one reason", () => {
    const recommendations = recommendSupportPathways({
      audience: "exploring",
      need: "carer_rest",
      start: "conversation",
    });

    for (const recommendation of recommendations) {
      expect(recommendation.reasons.length).toBeGreaterThan(0);
    }
  });

  it("breaks ties using catalogue order so results are stable", () => {
    const first = recommendSupportPathways({
      audience: "self",
      need: "community",
      start: "group",
    });
    const second = recommendSupportPathways({
      audience: "self",
      need: "community",
      start: "group",
    });

    expect(first.map((r) => r.pathway.id)).toEqual(second.map((r) => r.pathway.id));
  });

  it("offers the carer-only need to carers but not to someone asking for themselves", () => {
    const carerRest = needOptions.find((option) => option.value === "carer_rest");

    expect(carerRest?.audiences).toContain("carer");
    expect(carerRest?.audiences).not.toContain("self");
  });
});
