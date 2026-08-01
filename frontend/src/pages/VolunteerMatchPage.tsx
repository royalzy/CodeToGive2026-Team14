import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PageHero } from "../components/Cards";
import { VolunteerNewsletterSignup } from "../components/volunteer/VolunteerNewsletterSignup";
import { VolunteerRoleCard } from "../components/volunteer/VolunteerRoleCard";
import { programs } from "../content/programs";
import {
  confidenceOptions,
  heardFromOptions,
  matchAvailabilityOptions,
  matchInterestOptions,
  matchRoleTypeOptions,
  matchStyleOptions,
  type VolunteerMatchAnswers,
} from "../content/volunteer";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";
import {
  recommendVolunteerRoles,
  type VolunteerRecommendation,
} from "../lib/volunteerMatching";

type MatchFormState = Partial<VolunteerMatchAnswers> & {
  programs: VolunteerMatchAnswers["programs"];
};

export function VolunteerMatchPage() {
  const [answers, setAnswers] = useState<MatchFormState>({ programs: [] });
  const [recommendations, setRecommendations] = useState<VolunteerRecommendation[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackVolunteerEvent("role_match_started", { journey_path: "guided" });
  }, []);

  function toggleProgram(value: VolunteerMatchAnswers["programs"][number]) {
    setAnswers((current) => ({
      ...current,
      programs: current.programs.includes(value)
        ? current.programs.filter((program) => program !== value)
        : [...current.programs, value],
    }));
  }

  function submitMatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answers.programs.length || !answers.availability || !answers.participationStyle) {
      setError(
        "Choose at least one area of interest, then answer the availability and participation questions.",
      );
      return;
    }
    const nextRecommendations = recommendVolunteerRoles(answers as VolunteerMatchAnswers);
    setError(null);
    setRecommendations(nextRecommendations);
    trackVolunteerEvent("role_match_completed", {
      journey_path: "guided",
      heard_from: answers.heardFrom,
    });
    trackVolunteerEvent("recommended_role_viewed", {
      journey_path: "guided",
      role_id: nextRecommendations[0].role.id,
    });
  }

  const unselectedPrograms = programs.filter(
    (program) => !answers.programs.includes(program.slug),
  );

  return (
    <>
      <PageHero
        eyebrow="60-second role match"
        title="Begin with what feels realistic."
        body="A few answers help reduce the choice. They do not decide whether you can volunteer."
        tone="red"
      />
      <section className="section volunteer-match-section">
        <div className="shell volunteer-match-layout">
          <form className="volunteer-match-form" onSubmit={submitMatch}>
            <fieldset className="volunteer-match-question">
              <legend>1. Which area(s) interest you? (choose one or more)</legend>
              <div className="match-option-grid">
                {matchInterestOptions.map((option) => (
                  <label key={option.value}>
                    <input
                      type="checkbox"
                      checked={answers.programs.includes(option.value)}
                      onChange={() => toggleProgram(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="volunteer-match-question">
              <legend>2. How would you like to contribute?</legend>
              <div className="match-option-grid">
                {matchRoleTypeOptions.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="roleType"
                      checked={answers.roleType === option.value}
                      onChange={() =>
                        setAnswers((current) => ({ ...current, roleType: option.value }))
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <MatchQuestion
              legend="3. What can you realistically offer right now?"
              name="availability"
              options={matchAvailabilityOptions}
              selected={answers.availability}
              onSelect={(value) => setAnswers((current) => ({ ...current, availability: value }))}
            />
            <MatchQuestion
              legend="4. How would you prefer to take part?"
              name="participationStyle"
              options={matchStyleOptions}
              selected={answers.participationStyle}
              onSelect={(value) =>
                setAnswers((current) => ({ ...current, participationStyle: value }))
              }
            />
            <fieldset className="volunteer-match-question volunteer-match-optional">
              <legend>Optional: how does a first visit feel right now?</legend>
              <p>This changes the guidance we show, not the role ranking.</p>
              <div className="match-option-grid">
                {confidenceOptions.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="confidence"
                      checked={answers.confidence === option.value}
                      onChange={() =>
                        setAnswers((current) => ({
                          ...current,
                          confidence: option.value,
                        }))
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="volunteer-match-question volunteer-match-optional">
              <legend>Optional: tell us a little about yourself</legend>
              <p>
                Skills, interests or experience you'd like us to know about. This stays in
                your browser and only shapes the guidance you see below.
              </p>
              <textarea
                className="volunteer-about-textarea"
                rows={3}
                value={answers.aboutYou ?? ""}
                onChange={(event) =>
                  setAnswers((current) => ({ ...current, aboutYou: event.target.value }))
                }
                placeholder="E.g. I love cooking and have helped run kids' classes before."
              />
            </fieldset>

            <fieldset className="volunteer-match-question volunteer-match-optional">
              <legend>Optional: how did you hear about Love 21's volunteer programme?</legend>
              <div className="match-option-grid">
                {heardFromOptions.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="heardFrom"
                      checked={answers.heardFrom === option.value}
                      onChange={() =>
                        setAnswers((current) => ({ ...current, heardFrom: option.value }))
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {error && (
              <p className="form-alert" role="alert">
                {error}
              </p>
            )}
            <button className="button button-dark" type="submit">
              Show my starting point
            </button>
            <Link className="text-link" to="/volunteer/roles">
              Skip and browse every role <span aria-hidden="true">→</span>
            </Link>
          </form>

          <div className="volunteer-match-results" aria-live="polite">
            {recommendations ? (
              <>
                <p className="eyebrow">Your suggested starting point</p>
                {answers.aboutYou && (
                  <p className="volunteer-match-acknowledgement">
                    Thanks for sharing a bit about yourself — we've kept it in mind below.
                  </p>
                )}
                <VolunteerRoleCard
                  role={recommendations[0].role}
                  level={recommendations[0].level}
                  reasons={recommendations[0].reasons}
                  journeyPath="guided"
                  featured
                />
                <h2>Two other roles worth exploring</h2>
                <div className="volunteer-alternative-grid">
                  {recommendations.slice(1, 3).map((recommendation) => (
                    <VolunteerRoleCard
                      key={recommendation.role.id}
                      role={recommendation.role}
                      level={recommendation.level}
                      reasons={recommendation.reasons}
                      journeyPath="guided"
                    />
                  ))}
                </div>

                <div className="volunteer-alternatives-panel">
                  <div>
                    <p className="eyebrow">Not quite the right fit?</p>
                    <h3>You could also explore…</h3>
                    {unselectedPrograms.length ? (
                      <div className="volunteer-alternative-links">
                        {unselectedPrograms.map((program) => (
                          <Link
                            key={program.slug}
                            className="text-link"
                            to="/volunteer/roles"
                          >
                            {program.title} roles <span aria-hidden="true">→</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p>
                        You've already looked across every programme area — browse the full
                        list to compare roles side by side.
                      </p>
                    )}
                    <Link className="text-link" to="/volunteer/roles">
                      Compare every role <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                  <VolunteerNewsletterSignup source="volunteer_match_results" />
                </div>
              </>
            ) : (
              <div className="match-placeholder">
                <span aria-hidden="true">?</span>
                <h2>Your recommendation will appear here.</h2>
                <p>It will include plain-language reasons and two alternatives.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function MatchQuestion<TValue extends string>({
  legend,
  name,
  options,
  selected,
  onSelect,
}: {
  legend: string;
  name: string;
  options: readonly { value: TValue; label: string }[];
  selected?: TValue;
  onSelect: (value: TValue) => void;
}) {
  return (
    <fieldset className="volunteer-match-question">
      <legend>{legend}</legend>
      <div className="match-option-grid">
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name={name}
              checked={selected === option.value}
              onChange={() => onSelect(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
