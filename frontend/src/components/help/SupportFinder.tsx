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
import { localizeDeep } from "../../lib/zhConvert";
import "./SupportFinder.css";

type AnswerValue = Audience | Need | StartStyle;
type Draft = Partial<Record<"audience" | "need" | "start", AnswerValue>>;

/** How many alternatives to show under the primary suggestion. */
const ALTERNATIVES_SHOWN = 2;

const finderCopy = {
  en: {
    basedOnAnswers: "Based on your answers",
    otherThingsHelp: "Other things that might help",
    changeLastAnswer: "Change my last answer",
    startAgain: "Start again",
    back: "Back",
    questionOf: "Question {step} of {total}",
  },
  zh: {
    basedOnAnswers: "根據你的答案",
    otherThingsHelp: "其他可能有幫助的選項",
    changeLastAnswer: "更改我的上一個答案",
    startAgain: "重新開始",
    back: "返回",
    questionOf: "第 {step} 條問題，共 {total} 條",
  },
} as const;

function formatQuestionOf(template: string, step: number, total: number): string {
  return template.replace("{step}", String(step)).replace("{total}", String(total));
}

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
  const { t, lang } = useLanguage();
  const copy = localizeDeep(finderCopy[lang === "en" ? "en" : "zh"], lang);
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
          {copy.basedOnAnswers}
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
              {copy.otherThingsHelp}
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
            {copy.changeLastAnswer}
          </button>
          <button type="button" className="support-finder-link" onClick={restart}>
            {copy.startAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="support-finder">
      <p className="support-finder-step" ref={headingRef} tabIndex={-1}>
        {formatQuestionOf(copy.questionOf, step + 1, supportQuestions.length)}
      </p>

      <div
        className="support-finder-progress"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={supportQuestions.length}
        aria-valuenow={step + 1}
        aria-label={formatQuestionOf(copy.questionOf, step + 1, supportQuestions.length)}
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
            {copy.back}
          </button>
        </div>
      ) : null}
    </div>
  );
}
