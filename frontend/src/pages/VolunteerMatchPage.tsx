import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PageHero } from "../components/Cards";
import { VolunteerRoleCard } from "../components/volunteer/VolunteerRoleCard";
import {
  confidenceOptions,
  matchAvailabilityOptions,
  matchInterestOptions,
  matchStyleOptions,
  type VolunteerMatchAnswers,
} from "../content/volunteer";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";
import {
  recommendVolunteerRoles,
  type VolunteerRecommendation,
} from "../lib/volunteerMatching";

export function VolunteerMatchPage() {
  const [answers, setAnswers] = useState<Partial<VolunteerMatchAnswers>>({});
  const [recommendations, setRecommendations] = useState<VolunteerRecommendation[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackVolunteerEvent("role_match_started", { journey_path: "guided" });
  }, []);

  function submitMatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answers.interest || !answers.availability || !answers.participationStyle) {
      setError("Choose one answer in each of the three matching questions.");
      return;
    }
    const nextRecommendations = recommendVolunteerRoles(answers as VolunteerMatchAnswers);
    setError(null);
    setRecommendations(nextRecommendations);
    trackVolunteerEvent("role_match_completed", { journey_path: "guided" });
    trackVolunteerEvent("recommended_role_viewed", {
      journey_path: "guided",
      role_id: nextRecommendations[0].role.id,
    });
  }

  return (
    <>
      <PageHero
        eyebrow="60-second role match"
        title="Begin with what feels realistic."
        body="Three answers help reduce the choice. They do not decide whether you can volunteer."
        tone="red"
      />
      <section className="section volunteer-match-section">
        <div className="shell volunteer-match-layout">
          <form className="volunteer-match-form" onSubmit={submitMatch}>
            <MatchQuestion
              legend="1. What activity interests you most?"
              name="interest"
              options={matchInterestOptions}
              selected={answers.interest}
              onSelect={(value) => setAnswers((current) => ({ ...current, interest: value }))}
            />
            <MatchQuestion
              legend="2. What can you realistically offer right now?"
              name="availability"
              options={matchAvailabilityOptions}
              selected={answers.availability}
              onSelect={(value) =>
                setAnswers((current) => ({ ...current, availability: value }))
              }
            />
            <MatchQuestion
              legend="3. How would you prefer to take part?"
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
                <VolunteerRoleCard
                  role={recommendations[0].role}
                  level={recommendations[0].level}
                  reasons={recommendations[0].reasons}
                  journeyPath="guided"
                  featured
                />
                <h2>Two other roles worth exploring</h2>
                <div className="volunteer-alternative-grid">
                  {recommendations.slice(1).map((recommendation) => (
                    <VolunteerRoleCard
                      key={recommendation.role.id}
                      role={recommendation.role}
                      level={recommendation.level}
                      reasons={recommendation.reasons}
                      journeyPath="guided"
                    />
                  ))}
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
