import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";
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
  const { lang } = useLanguage();
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
          <p className="eyebrow">
            {lang === "en" ? "Neurodiversity" : localizeDeep("神經多樣性", lang)}
          </p>
          <h1>
            {lang === "en" ? "Beyond the Linear Spectrum" : localizeDeep("超越線性光譜", lang)}
          </h1>
          <p className="mb-0 max-w-[720px] text-[1.2rem]">
            {lang === "en"
              ? 'For decades, society viewed autism as a straight line from "mild" to "severe." But human neurology forms a unique constellation of strengths.'
              : localizeDeep(
                  "數十年來，社會一直將自閉症視為一條從「輕微」到「嚴重」的直線。但人類的神經系統其實構成了一個獨特的強項星座。",
                  lang,
                )}
          </p>

          <FactsMarquee />
        </div>
      </section>

      {/* Chapter 2: The Proof */}
      <section className="py-16">
        <div className="shell flex flex-col gap-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-love-ink">
              {lang === "en" ? "Meet the Archetypes" : localizeDeep("認識這些原型", lang)}
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-love-ink/70">
              {lang === "en"
                ? 'Ever wonder why you might struggle with a task that someone else does effortlessly? We all have a "spiky profile." Explore these archetypes to see how neurodivergent traits translate into unique advantages.'
                : localizeDeep(
                    "有沒有想過，為甚麼你會在某項任務上感到吃力，而別人卻能輕鬆完成？我們每個人都有自己的「參差能力剖析」。探索這些原型，了解神經多樣性的特質如何轉化為獨特的優勢。",
                    lang,
                  )}
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
              {lang === "en"
                ? "Understanding the Why: Scenario Quiz"
                : localizeDeep("了解背後原因：情境問答", lang)}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-love-ink/70">
              {lang === "en"
                ? "Put yourself in the moment. What's really going on beneath the surface?"
                : localizeDeep("代入這一刻的情境，想想表面之下真正發生了甚麼？", lang)}
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
              {lang === "en"
                ? "The Science Behind the Constellation"
                : localizeDeep("星座背後的科學", lang)}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-love-ink/70">
              {lang === "en"
                ? "Understanding the neurobiology that powers these unique strengths."
                : localizeDeep("了解驅動這些獨特強項的神經生物學原理。", lang)}
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
            <h2 className="text-3xl font-bold text-love-ink">
              {lang === "en" ? "Continue the Journey" : localizeDeep("繼續探索旅程", lang)}
            </h2>
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
            alt={
              lang === "en"
                ? "Crystal performing with the Love 21 community"
                : localizeDeep("Crystal 與 Love 21 社群一同表演", lang)
            }
          />
          <div className="neuro-story-cta-copy">
            <p className="eyebrow">
              {lang === "en" ? "A real Love 21 story" : localizeDeep("一個真實的 Love 21 故事", lang)}
            </p>
            <h2 id="neuro-story-cta-title">
              {lang === "en"
                ? "See what possibility looks like in motion."
                : localizeDeep("看看可能性如何動起來。", lang)}
            </h2>
            <p>
              {lang === "en"
                ? "Crystal started by showing up. Fifty dance sessions later, she stepped forward to lead a warm-up for 20 members."
                : localizeDeep(
                    "Crystal 由出席開始。五十節舞蹈課後，她主動站出來，為20位會員帶領熱身活動。",
                    lang,
                  )}
            </p>
            <Link className="neuro-story-cta-button" to="/story">
              {lang === "en" ? "Read Crystal's story" : localizeDeep("閱讀 Crystal 的故事", lang)}{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
    </div>
  );
}
