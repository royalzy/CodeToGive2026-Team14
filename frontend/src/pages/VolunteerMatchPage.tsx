import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { QuizShareModal } from "../components/volunteer/QuizShareModal";
import { VolunteerNewsletterSignup } from "../components/volunteer/VolunteerNewsletterSignup";
import { VolunteerOtherWaysToHelp } from "../components/volunteer/VolunteerOtherWaysToHelp";
import { VolunteerRoleCard } from "../components/volunteer/VolunteerRoleCard";
import { getVolunteerRole } from "../content/volunteer";
import {
  type QuizLetter,
  type QuizQuestion,
  quizQuestions,
  quizResults,
  tallyQuizAnswers,
} from "../content/volunteerQuiz";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";

const QUIZ_LETTERS: QuizLetter[] = ["A", "B", "C", "D"];

function isQuizLetter(value: string | null): value is QuizLetter {
  return !!value && (QUIZ_LETTERS as string[]).includes(value);
}

export function VolunteerMatchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [arrivedViaSharedLink] = useState(() => isQuizLetter(searchParams.get("result")));
  const [started, setStarted] = useState(() => isQuizLetter(searchParams.get("result")));
  const [answers, setAnswers] = useState<QuizLetter[]>([]);
  const [resultLetter, setResultLetter] = useState<QuizLetter | null>(() => {
    const shared = searchParams.get("result");
    return isQuizLetter(shared) ? shared : null;
  });

  useEffect(() => {
    if (!arrivedViaSharedLink) {
      trackVolunteerEvent("role_match_started", { journey_path: "guided" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestionIndex = answers.length;
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = resultLetter
    ? 100
    : Math.round((currentQuestionIndex / quizQuestions.length) * 100);

  function beginQuiz() {
    setStarted(true);
  }

  function selectAnswer(letter: QuizLetter) {
    const nextAnswers = [...answers, letter];
    setAnswers(nextAnswers);
    if (nextAnswers.length === quizQuestions.length) {
      const finalLetter = tallyQuizAnswers(nextAnswers);
      setResultLetter(finalLetter);
      trackVolunteerEvent("role_match_completed", { journey_path: "guided" });
      trackVolunteerEvent("recommended_role_viewed", {
        journey_path: "guided",
        role_id: quizResults[finalLetter].matches[0].roleId,
      });
    }
  }

  function goBack() {
    setAnswers((current) => current.slice(0, -1));
  }

  function skipToEnd() {
    if (answers.length === 0) return;
    const lastAnswer = answers[answers.length - 1];
    const paddedAnswers = [
      ...answers,
      ...Array(quizQuestions.length - answers.length).fill(lastAnswer),
    ];
    const finalLetter = tallyQuizAnswers(paddedAnswers);
    setAnswers(paddedAnswers);
    setResultLetter(finalLetter);
    trackVolunteerEvent("role_match_completed", { journey_path: "guided" });
    trackVolunteerEvent("recommended_role_viewed", {
      journey_path: "guided",
      role_id: quizResults[finalLetter].matches[0].roleId,
    });
  }

  function retakeQuiz() {
    setAnswers([]);
    setResultLetter(null);
    setStarted(true);
    setSearchParams({}, { replace: true });
    trackVolunteerEvent("role_match_started", { journey_path: "guided" });
  }

  return (
    <>
      <section className="section volunteer-quiz-section">
        <div className="shell volunteer-quiz-shell">
          {resultLetter ? (
            <QuizResultView
              key="result"
              letter={resultLetter}
              arrivedViaSharedLink={arrivedViaSharedLink}
              onRetake={retakeQuiz}
            />
          ) : started ? (
            <QuizQuestionView
              key={currentQuestionIndex}
              question={currentQuestion}
              index={currentQuestionIndex}
              total={quizQuestions.length}
              progress={progress}
              canGoBack={answers.length > 0}
              canSkip={answers.length > 0}
              onSelect={selectAnswer}
              onBack={goBack}
              onSkip={skipToEnd}
            />
          ) : (
            <QuizIntroView key="intro" onStart={beginQuiz} />
          )}
        </div>
      </section>

      {resultLetter && (
        <>
          <section className="section section-soft">
            <div className="shell">
              <VolunteerOtherWaysToHelp />
            </div>
          </section>
          <section className="section">
            <div className="shell">
              <VolunteerNewsletterSignup
                source="volunteer_quiz_results"
                title="Prefer to hear from us by email?"
              />
            </div>
          </section>
        </>
      )}
    </>
  );
}

function QuizIntroView({ onStart }: { onStart: () => void }) {
  return (
    <div className="volunteer-quiz-card volunteer-quiz-intro volunteer-quiz-card-enter">
      <img
        className="volunteer-quiz-banner"
        src="/images/quiz-question-banner.jpg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
      <div className="volunteer-quiz-card-body">
        <p className="eyebrow">Before you start</p>
        <h2 className="volunteer-quiz-prompt">Five quick questions, one fun result.</h2>
        <p className="volunteer-quiz-disclaimer">
          This quiz is just for fun, it might not be fully accurate and can&apos;t capture
          every part of your personality in five questions. Treat your result as a friendly
          starting point for exploring volunteer roles, not a fixed label. You are always
          welcome to browse every role yourself, whatever your result says.
        </p>
        <button type="button" className="button button-dark" onClick={onStart}>
          Start the quiz
        </button>
      </div>
    </div>
  );
}

function QuizQuestionView({
  question,
  index,
  total,
  progress,
  canGoBack,
  canSkip,
  onSelect,
  onBack,
  onSkip,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  progress: number;
  canGoBack: boolean;
  canSkip: boolean;
  onSelect: (letter: QuizLetter) => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  const [selected, setSelected] = useState<QuizLetter | null>(null);

  function handleSelect(letter: QuizLetter) {
    if (selected) return;
    setSelected(letter);
    window.setTimeout(() => onSelect(letter), 380);
  }

  return (
    <div className="volunteer-quiz-card">
      <img
        className="volunteer-quiz-banner"
        src="/images/quiz-question-banner.jpg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
      <div className="volunteer-quiz-card-body">
        <div
          className="volunteer-quiz-progress"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Question ${index + 1} of ${total}`}
        >
          <div className="volunteer-quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="volunteer-quiz-question-enter">
          <p className="volunteer-quiz-step">
            Question {index + 1} of {total}
          </p>
          <h2 className="volunteer-quiz-prompt">{question.prompt}</h2>
          <div
            className={`volunteer-quiz-options${selected ? " volunteer-quiz-options-locked" : ""}`}
          >
            {question.options.map((option, optionIndex) => {
              const isSelected = selected === option.letter;
              const isDimmed = Boolean(selected) && !isSelected;
              return (
                <button
                  key={option.letter}
                  type="button"
                  className={`volunteer-quiz-option${isSelected ? " volunteer-quiz-option-selected" : ""}${isDimmed ? " volunteer-quiz-option-dimmed" : ""}`}
                  style={{ animationDelay: `${optionIndex * 60}ms` }}
                  disabled={Boolean(selected)}
                  onClick={() => handleSelect(option.letter)}
                >
                  <span className="volunteer-quiz-option-letter" aria-hidden="true">
                    {option.letter}
                  </span>
                  <span>{option.text}</span>
                  <span className="volunteer-quiz-option-check" aria-hidden="true">
                    ✓
                  </span>
                </button>
              );
            })}
          </div>
          {canGoBack && (
            <button
              type="button"
              className="text-link volunteer-quiz-back"
              onClick={onBack}
              disabled={Boolean(selected)}
            >
              <span aria-hidden="true">←</span> Back to previous question
            </button>
          )}
        </div>
      </div>
      {canSkip && (
        <button
          type="button"
          className="text-link volunteer-quiz-skip"
          onClick={onSkip}
          disabled={Boolean(selected)}
        >
          Skip to result <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}

function QuizResultView({
  letter,
  arrivedViaSharedLink,
  onRetake,
}: {
  letter: QuizLetter;
  arrivedViaSharedLink: boolean;
  onRetake: () => void;
}) {
  const result = quizResults[letter];
  const [isShareOpen, setIsShareOpen] = useState(false);

  const matchedRoles = result.matches
    .map((match) => getVolunteerRole(match.roleId))
    .filter((role): role is NonNullable<typeof role> => Boolean(role));
  const relatedPrograms = Array.from(new Set(matchedRoles.map((role) => role.programSlug)));

  return (
    <div className="volunteer-quiz-result volunteer-quiz-card-enter">
      <div className="volunteer-quiz-result-hero">
        <span className="volunteer-quiz-confetti" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
        {arrivedViaSharedLink && (
          <p className="volunteer-quiz-shared-banner">
            A friend shared their result with you — take the quiz to find yours!
          </p>
        )}
        <img
          className="volunteer-quiz-result-image"
          src={result.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <p className="eyebrow">Your result</p>
        <h2 className="volunteer-quiz-archetype">{result.archetype}</h2>
        <p className="volunteer-quiz-title-tag">You are a &ldquo;{result.title}&rdquo;</p>
        <p className="volunteer-quiz-personality">{result.personality}</p>
        <button
          type="button"
          className="button button-outline volunteer-quiz-share-button"
          onClick={() => setIsShareOpen(true)}
        >
          <span aria-hidden="true">↗</span> Share my result
        </button>
      </div>

      <div className="volunteer-quiz-result-body">
        <div className="volunteer-quiz-special">
          <p className="eyebrow">What makes you special</p>
          <p>{result.whatMakesYouSpecial}</p>
        </div>

        <h3>Your perfect volunteer match</h3>
        <div className="volunteer-quiz-match-grid">
          {result.matches.map((match, matchIndex) => {
            const role = getVolunteerRole(match.roleId);
            if (!role) return null;
            return (
              <div
                key={match.roleId}
                className="volunteer-quiz-match-item"
                style={{ animationDelay: `${matchIndex * 90}ms` }}
              >
                <p className="volunteer-quiz-match-note">{match.note}</p>
                <VolunteerRoleCard role={role} journeyPath="guided" />
              </div>
            );
          })}
        </div>

        <div className="volunteer-quiz-cta-row">
          <Link
            className="button button-dark"
            to={`/volunteer/roles${relatedPrograms.length ? `?program=${relatedPrograms.join(",")}` : ""}`}
          >
            Explore more related roles
          </Link>
          <button type="button" className="text-link" onClick={onRetake}>
            Retake the quiz
          </button>
        </div>
      </div>

      {isShareOpen && <QuizShareModal result={result} onClose={() => setIsShareOpen(false)} />}
    </div>
  );
}
