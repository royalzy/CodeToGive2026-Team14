import { useState } from "react";

import { QUIZ_SCENARIOS } from "./data";
import { ScenarioIllustration } from "./ScenarioIllustration";

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

  return (
    <div className="mx-auto flex w-full min-h-[500px] max-w-6xl flex-col overflow-hidden rounded-3xl border border-love-blue/15 bg-white shadow-xl lg:flex-row">
      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-love-blue/70">
          Scenario {index + 1} of {QUIZ_SCENARIOS.length}
        </p>
        <p className="mt-2 text-lg font-semibold text-love-ink">{scenario.question}</p>

        <div
          className={`mt-5 flex flex-col gap-3 transition-opacity duration-500 ${
            hasAnswered ? "opacity-60" : "opacity-100"
          }`}
        >
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

      <div className="lg:w-2/5 lg:shrink-0">
        <ScenarioIllustration key={scenario.id} scenario={scenario} hasAnswered={hasAnswered} />
      </div>
    </div>
  );
}
