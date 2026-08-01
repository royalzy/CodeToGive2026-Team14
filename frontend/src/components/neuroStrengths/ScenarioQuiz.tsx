import { useState } from "react";

import { QUIZ_SCENARIOS, type QuizTheme } from "./data";

const THEME_STYLES: Record<
  QuizTheme,
  { banner: string; shape: string; primary: string; secondary: string }
> = {
  blue: {
    banner: "bg-blue-50",
    shape: "bg-blue-200/50",
    primary: "text-blue-600",
    secondary: "text-slate-500",
  },
  indigo: {
    banner: "bg-indigo-50",
    shape: "bg-indigo-200/50",
    primary: "text-indigo-600",
    secondary: "text-cyan-500",
  },
  purple: {
    banner: "bg-purple-50",
    shape: "bg-purple-200/50",
    primary: "text-purple-600",
    secondary: "text-pink-500",
  },
  orange: {
    banner: "bg-orange-50",
    shape: "bg-orange-200/50",
    primary: "text-orange-600",
    secondary: "text-amber-500",
  },
  emerald: {
    banner: "bg-emerald-50",
    shape: "bg-emerald-200/50",
    primary: "text-emerald-600",
    secondary: "text-teal-500",
  },
};

export function ScenarioQuiz() {
  const [index, setIndex] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  if (index >= QUIZ_SCENARIOS.length) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-love-teal/20 bg-white p-8 text-center shadow-xl">
        <p className="text-2xl font-bold text-love-ink">
          You&apos;ve completed all {QUIZ_SCENARIOS.length} scenarios!
        </p>
        <p className="mt-2 text-love-ink/70">
          Every one of these everyday moments reveals a neurodivergent strength hiding behind a
          common misconception.
        </p>
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setSelectedLabel(null);
          }}
          className="mt-6 rounded-full bg-love-blue px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-love-blue/90"
        >
          Restart
        </button>
      </div>
    );
  }

  const scenario = QUIZ_SCENARIOS[index];
  const selectedOption = scenario.options.find((option) => option.label === selectedLabel);
  const hasAnswered = selectedOption !== undefined;
  const isLastScenario = index === QUIZ_SCENARIOS.length - 1;
  const theme = THEME_STYLES[scenario.theme];
  const IconPrimary = scenario.iconPrimary;
  const IconSecondary = scenario.iconSecondary;

  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-love-blue/15 bg-white shadow-xl">
      <div key={scenario.id} className={`relative h-48 overflow-hidden ${theme.banner}`}>
        <div
          className={`absolute -right-6 -top-6 h-28 w-28 rounded-full ${theme.shape}`}
          aria-hidden="true"
        />
        <div
          className={`absolute bottom-6 left-8 h-10 w-10 rotate-12 rounded-xl ${theme.shape}`}
          aria-hidden="true"
        />
        <div
          className={`absolute right-12 top-10 h-6 w-6 rounded-full ${theme.shape}`}
          aria-hidden="true"
        />

        <div className="relative flex h-full items-center justify-center gap-4">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-md ${theme.primary}`}
          >
            <IconPrimary size={40} strokeWidth={1.75} />
          </div>
          <div
            className={`flex h-14 w-14 translate-y-3 items-center justify-center rounded-full bg-white/70 shadow ${theme.secondary}`}
          >
            <IconSecondary size={26} strokeWidth={1.75} />
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-love-blue/70">
          Scenario {index + 1} of {QUIZ_SCENARIOS.length}
        </p>
        <p className="mt-2 text-lg font-semibold text-love-ink">{scenario.question}</p>

        <div className="mt-5 flex flex-col gap-3">
          {scenario.options.map((option) => {
            const isSelected = option.label === selectedLabel;

            let stateClasses = "border-love-blue/20 bg-white hover:border-love-blue/50";
            if (hasAnswered) {
              if (option.isCorrect) {
                stateClasses = "border-love-teal bg-love-teal/10 text-love-ink";
              } else if (isSelected) {
                stateClasses = "border-love-red bg-love-red/10 text-love-ink";
              } else {
                stateClasses = "border-love-blue/10 bg-white text-love-ink/40";
              }
            }

            return (
              <button
                key={option.label}
                type="button"
                disabled={hasAnswered}
                onClick={() => setSelectedLabel(option.label)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors disabled:cursor-default ${stateClasses}`}
              >
                <span className="font-semibold">{option.label}) </span>
                {option.text}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div
            key={scenario.id}
            className="animate-fade-in motion-reduce:animate-none mt-6 rounded-2xl border border-love-teal/20 bg-love-ink p-5 text-center text-love-cream sm:text-left"
          >
            <p
              className={`text-sm font-bold ${
                selectedOption.isCorrect ? "text-love-teal" : "text-love-yellow"
              }`}
            >
              {selectedOption.isCorrect ? "Correct!" : "Not quite."}
            </p>
            <p className="mt-1 text-sm">{scenario.fact}</p>
          </div>
        )}

        {hasAnswered && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIndex((current) => current + 1);
                setSelectedLabel(null);
              }}
              className="rounded-full bg-love-blue px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-love-blue/90"
            >
              {isLastScenario ? "See Results" : "Next Scenario"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
