import { useMemo, useState } from "react";

import { ArchetypeSwitcher } from "./ArchetypeSwitcher";
import { ConstellationRadar } from "./ConstellationRadar";
import { ARCHETYPES } from "./data";
import { FactsMarquee } from "./FactsMarquee";
import { NarrativeStory } from "./NarrativeStory";
import { ScenarioQuiz } from "./ScenarioQuiz";
import { ScienceTrivia } from "./ScienceTrivia";
import { TraitDials } from "./TraitDials";
import { useAnimatedStats } from "./useAnimatedStats";

export function NeuroStrengthsConstellation() {
  const [activeArchetypeId, setActiveArchetypeId] = useState(ARCHETYPES[0].id);

  const activeArchetype = useMemo(
    () => ARCHETYPES.find((archetype) => archetype.id === activeArchetypeId) ?? ARCHETYPES[0],
    [activeArchetypeId],
  );

  const animatedStats = useAnimatedStats(activeArchetype.stats);

  return (
    <div className="flex flex-col">
      {/* Chapter 1: The Premise */}
      <section className="page-hero page-hero-blue neuro-hero">
        <div className="shell page-hero-inner">
          <p className="eyebrow">Neurodiversity</p>
          <h1>Beyond the Linear Spectrum</h1>
          <p className="mb-0 max-w-[720px] text-[1.2rem]">
            For decades, society viewed autism as a straight line from &ldquo;mild&rdquo; to
            &ldquo;severe.&rdquo; But human neurology forms a unique constellation of strengths.
          </p>

          <FactsMarquee />
        </div>
      </section>

      {/* Chapter 2: The Proof */}
      <section className="neuro-proof-section">
        <div className="shell neuro-proof-layout flex flex-col">
          <ArchetypeSwitcher activeId={activeArchetype.id} onSelect={setActiveArchetypeId} />

          <NarrativeStory key={activeArchetype.id} archetype={activeArchetype} />

          <div className="neuro-proof-grid grid grid-cols-1 lg:grid-cols-2">
            <TraitDials values={animatedStats} />
            <ConstellationRadar archetype={activeArchetype} values={animatedStats} />
          </div>
        </div>
      </section>

      {/* Chapter 3: Interactive Scenario Quiz */}
      <section className="bg-love-cream py-16">
        <div className="shell">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-love-ink">
              Understanding the Why: Scenario Quiz
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-love-ink/70">
              Put yourself in the moment. What&apos;s really going on beneath the surface?
            </p>
          </div>

          <div className="mt-10">
            <ScenarioQuiz />
          </div>
        </div>
      </section>

      {/* Chapter 4: The Science */}
      <section className="py-16">
        <div className="shell">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-love-ink">
              The Science Behind the Constellation
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-love-ink/70">
              Understanding the neurobiology that powers these unique strengths.
            </p>
          </div>

          <div className="mt-10">
            <ScienceTrivia />
          </div>
        </div>
      </section>
    </div>
  );
}
