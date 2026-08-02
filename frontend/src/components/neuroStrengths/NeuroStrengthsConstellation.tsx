import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ArchetypeSwitcher } from "./ArchetypeSwitcher";
import { ArticleCard } from "./ArticleCard";
import { ArticleModal } from "./ArticleModal";
import { ConstellationRadar } from "./ConstellationRadar";
import { ARCHETYPES, ARTICLES, type Article } from "./data";
import { FactsMarquee } from "./FactsMarquee";
import { MythRealityPanel } from "./MythRealityPanel";
import { NarrativeStory } from "./NarrativeStory";
import { ScenarioQuiz } from "./ScenarioQuiz";
import { ScienceTrivia } from "./ScienceTrivia";
import { TraitDials } from "./TraitDials";
import { useAnimatedStats } from "./useAnimatedStats";

export function NeuroStrengthsConstellation() {
  const [activeArchetypeId, setActiveArchetypeId] = useState(ARCHETYPES[0].id);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

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
      <section className="py-16">
        <div className="shell flex flex-col gap-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-love-ink">Meet the Archetypes</h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-love-ink/70">
              Ever wonder why you might struggle with a task that someone else does
              effortlessly? We all have a &ldquo;spiky profile.&rdquo; Explore these archetypes
              to see how neurodivergent traits translate into unique advantages.
            </p>
          </div>

          <ArchetypeSwitcher activeId={activeArchetype.id} onSelect={setActiveArchetypeId} />

          <NarrativeStory key={activeArchetype.id} archetype={activeArchetype} />

          <div className="neuro-proof-grid grid grid-cols-1 lg:grid-cols-2">
            <TraitDials values={animatedStats} />
            <ConstellationRadar values={animatedStats} />
          </div>

          <MythRealityPanel archetype={activeArchetype} />
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

      {/* Chapter 5: Dive Deeper */}
      <section className="bg-love-cream py-16">
        <div className="shell">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-love-ink">Continue the Journey</h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onOpen={() => setActiveArticle(article)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="neuro-story-cta" aria-labelledby="neuro-story-cta-title">
        <div className="shell neuro-story-cta-inner">
          <img
            className="neuro-story-cta-photo"
            src="/images/crystal-performing.jpg"
            alt="Crystal performing with the Love 21 community"
          />
          <div className="neuro-story-cta-copy">
            <p className="eyebrow">A real Love 21 story</p>
            <h2 id="neuro-story-cta-title">See what possibility looks like in motion.</h2>
            <p>
              Crystal started by showing up. Fifty dance sessions later, she stepped forward
              to lead a warm-up for 20 members.
            </p>
            <Link className="neuro-story-cta-button" to="/story">
              Read Crystal&apos;s story <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
    </div>
  );
}
