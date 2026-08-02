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
import { useLanguage } from "../hooks/useLanguage";
import { localizeDeep } from "../lib/zhConvert";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";

const QUIZ_LETTERS: QuizLetter[] = ["A", "B", "C", "D"];

function isQuizLetter(value: string | null): value is QuizLetter {
  return !!value && (QUIZ_LETTERS as string[]).includes(value);
}

const quizCopy = {
  en: {
    introEyebrow: "Before you start",
    introTitle: "Five quick questions, one fun result.",
    introDisclaimer:
      "This quiz is just for fun, it might not be fully accurate and can't capture every part of your personality in five questions. Treat your result as a friendly starting point for exploring volunteer roles, not a fixed label. You are always welcome to browse every role yourself, whatever your result says.",
    introStart: "Start the quiz",
    back: "Back to previous question",
    skip: "Skip to result",
    sharedBanner: "A friend shared their result with you — take the quiz to find yours!",
    yourResult: "Your result",
    shareResult: "Share my result",
    whatMakesYouSpecial: "What makes you special",
    perfectMatch: "Your perfect volunteer match",
    exploreMore: "Explore more related roles",
    retake: "Retake the quiz",
    newsletterTitle: "Prefer to hear from us by email?",
  },
  zh: {
    introEyebrow: "開始之前",
    introTitle: "五條簡單問題，一個有趣結果。",
    introDisclaimer:
      "這個小測驗純粹好玩，未必完全準確，也無法在五條問題內捕捉你性格的全部。請把結果當作探索義工角色的友善起點，而非固定標籤。無論結果如何，你都歡迎親自瀏覽所有角色。",
    introStart: "開始測驗",
    back: "返回上一題",
    skip: "跳至結果",
    sharedBanner: "朋友與你分享了他們的結果——來做測驗，找出屬於你的結果！",
    yourResult: "你的結果",
    shareResult: "分享我的結果",
    whatMakesYouSpecial: "你的特別之處",
    perfectMatch: "最適合你的義工配對",
    exploreMore: "探索更多相關角色",
    retake: "重新做測驗",
    newsletterTitle: "想透過電郵收到我們的消息嗎？",
  },
} as const;

function questionOfTotal(index: number, total: number, lang: ReturnType<typeof useLanguage>["lang"]) {
  return lang === "en"
    ? `Question ${index + 1} of ${total}`
    : localizeDeep(`第 ${index + 1} 題，共 ${total} 題`, lang);
}

export function VolunteerMatchPage() {
  const { lang } = useLanguage();
  const copy = localizeDeep(quizCopy[lang === "en" ? "en" : "zh"], lang);
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
                title={copy.newsletterTitle}
              />
            </div>
          </section>
        </>
      )}
    </>
  );
}

function QuizIntroView({ onStart }: { onStart: () => void }) {
  const { lang } = useLanguage();
  const copy = localizeDeep(quizCopy[lang === "en" ? "en" : "zh"], lang);
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
        <p className="eyebrow">{copy.introEyebrow}</p>
        <h2 className="volunteer-quiz-prompt">{copy.introTitle}</h2>
        <p className="volunteer-quiz-disclaimer">{copy.introDisclaimer}</p>
        <button type="button" className="button button-dark" onClick={onStart}>
          {copy.introStart}
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
  const { lang } = useLanguage();
  const copy = localizeDeep(quizCopy[lang === "en" ? "en" : "zh"], lang);
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
          aria-label={questionOfTotal(index, total, lang)}
        >
          <div className="volunteer-quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="volunteer-quiz-question-enter">
          <p className="volunteer-quiz-step">{questionOfTotal(index, total, lang)}</p>
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
              <span aria-hidden="true">←</span> {copy.back}
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
          {copy.skip} <span aria-hidden="true">→</span>
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
  const { lang } = useLanguage();
  const copy = localizeDeep(quizCopy[lang === "en" ? "en" : "zh"], lang);
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
          <p className="volunteer-quiz-shared-banner">{copy.sharedBanner}</p>
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
        <p className="eyebrow">{copy.yourResult}</p>
        <h2 className="volunteer-quiz-archetype">{result.archetype}</h2>
        <p className="volunteer-quiz-title-tag">
          {lang === "en" ? (
            <>You are a &ldquo;{result.title}&rdquo;</>
          ) : (
            <>
              {localizeDeep("你是", lang)}「{result.title}」
            </>
          )}
        </p>
        <p className="volunteer-quiz-personality">{result.personality}</p>
        <button
          type="button"
          className="button button-outline volunteer-quiz-share-button"
          onClick={() => setIsShareOpen(true)}
        >
          <span aria-hidden="true">↗</span> {copy.shareResult}
        </button>
      </div>

      <div className="volunteer-quiz-result-body">
        <div className="volunteer-quiz-special">
          <p className="eyebrow">{copy.whatMakesYouSpecial}</p>
          <p>{result.whatMakesYouSpecial}</p>
        </div>

        <h3>{copy.perfectMatch}</h3>
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
            {copy.exploreMore}
          </Link>
          <button type="button" className="text-link" onClick={onRetake}>
            {copy.retake}
          </button>
        </div>
      </div>

      {isShareOpen && <QuizShareModal result={result} onClose={() => setIsShareOpen(false)} />}
    </div>
  );
}
