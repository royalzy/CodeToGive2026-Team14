import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  type Audience,
  describeAnswers,
  type Need,
  type StartStyle,
  type SupportAnswers,
  type SupportOption,
  type SupportPathway,
  type SupportQuestion,
} from "../../content/support";
import { useLanguage } from "../../hooks/useLanguage";
import { recommendSupportPathways } from "../../lib/supportMatching";
import "./SupportFinder.css";

type AnswerValue = Audience | Need | StartStyle;
type Draft = Partial<Record<"audience" | "need" | "start", AnswerValue>>;

/** How many alternatives to show under the primary suggestion. */
const ALTERNATIVES_SHOWN = 2;

function visibleOptions(
  options: SupportOption<AnswerValue>[],
  audience: AnswerValue | undefined,
): SupportOption<AnswerValue>[] {
  // Some needs only make sense for certain audiences (carer exhaustion, say).
  return options.filter(
    (option) => !option.audiences || option.audiences.includes(audience as Audience),
  );
}

interface SupportFinderProps {
  /**
   * Called once all three questions are answered. `summary` is written in the
   * language the person was reading, so the caller does not have to re-derive it.
   */
  onComplete?: (answers: SupportAnswers, summary: string) => void;
}

export function SupportFinder({ onComplete }: SupportFinderProps) {
  const { t } = useLanguage();
  const supportQuestions = t.supportQuestions as SupportQuestion[];
  const supportPathways = t.supportPathways as SupportPathway[];
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({});
  const [answers, setAnswers] = useState<SupportAnswers | null>(null);
  // Focus target so keyboard and screen-reader users are moved to each new step.
  const headingRef = useRef<HTMLParagraphElement>(null);

  const question = supportQuestions[step];
  const options = visibleOptions(
    question.options as SupportOption<AnswerValue>[],
    draft.audience,
  );
  const isLast = step === supportQuestions.length - 1;

  function choose(value: AnswerValue) {
    const next: Draft = { ...draft, [question.id]: value };
    setDraft(next);

    if (isLast) {
      const complete = next as SupportAnswers;
      setAnswers(complete);
      onComplete?.(complete, describeAnswers(complete, supportQuestions));
      return;
    }
    setStep((current) => current + 1);
    window.requestAnimationFrame(() => headingRef.current?.focus());
  }

  function back() {
    if (answers) {
      // Returning from the results goes back to the final question.
      setAnswers(null);
      setStep(supportQuestions.length - 1);
    } else {
      setStep((current) => Math.max(0, current - 1));
    }
    window.requestAnimationFrame(() => headingRef.current?.focus());
  }

  function restart() {
    setStep(0);
    setDraft({});
    setAnswers(null);
    window.requestAnimationFrame(() => headingRef.current?.focus());
  }

  if (answers) {
    const ranked = recommendSupportPathways(answers, supportPathways);
    const [primary, ...rest] = ranked;
    const alternatives = rest.slice(0, ALTERNATIVES_SHOWN);

    return (
      <div className="support-finder">
        <p className="support-finder-step" ref={headingRef} tabIndex={-1}>
          Based on your answers
        </p>

        <article className="support-finder-primary">
          <h3>{primary.pathway.title}</h3>
          <p>{primary.pathway.body}</p>
          {primary.pathway.href.startsWith("#") ? (
            <a className="button button-dark" href={primary.pathway.href}>
              {primary.pathway.actionLabel}
            </a>
          ) : (
            <Link className="button button-dark" to={primary.pathway.href}>
              {primary.pathway.actionLabel}
            </Link>
          )}
        </article>

        {alternatives.length > 0 ? (
          <>
            <p className="support-finder-alt-heading">
              Other things that might help
            </p>
            <div className="support-finder-alts">
              {alternatives.map(({ pathway }) =>
                pathway.href.startsWith("#") ? (
                  <a key={pathway.id} className="support-finder-alt" href={pathway.href}>
                    <strong>{pathway.title}</strong>
                    <span>{pathway.body}</span>
                  </a>
                ) : (
                  <Link key={pathway.id} className="support-finder-alt" to={pathway.href}>
                    <strong>{pathway.title}</strong>
                    <span>{pathway.body}</span>
                  </Link>
                ),
              )}
            </div>
          </>
        ) : null}

        <div className="support-finder-controls">
          <button type="button" className="support-finder-link" onClick={back}>
            Change my last answer
          </button>
          <button type="button" className="support-finder-link" onClick={restart}>
            Start again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="support-finder">
      <p className="support-finder-step" ref={headingRef} tabIndex={-1}>
        Question {step + 1} of {supportQuestions.length}
      </p>

      <div
        className="support-finder-progress"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={supportQuestions.length}
        aria-valuenow={step + 1}
        aria-label={`Question ${step + 1} of ${supportQuestions.length}`}
      >
        {supportQuestions.map((item, index) => (
          <span key={item.id} className={index <= step ? "is-done" : undefined} />
        ))}
      </div>

      <fieldset className="support-finder-question">
        <legend>{question.legend}</legend>
        {question.help ? <p className="support-finder-help">{question.help}</p> : null}

        <div className="support-finder-options">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="support-finder-option"
              aria-pressed={draft[question.id] === option.value}
              onClick={() => choose(option.value)}
            >
              <strong>{option.label}</strong>
              {option.hint ? <span>{option.hint}</span> : null}
            </button>
          ))}
        </div>
      </fieldset>

      {step > 0 ? (
        <div className="support-finder-controls">
          <button type="button" className="support-finder-link" onClick={back}>
            Back
          </button>
        </div>
      ) : null}
    </div>
  );
}
