import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

const FACTS_EN = [
  "Neurodivergent brains can process certain information up to 40% faster.",
  "Autistic individuals often possess elite pattern recognition skills.",
  "Dyspraxia is frequently linked to high levels of creative empathy.",
  "ADHD brains naturally excel in high-pressure, crisis situations.",
  "Neurodiversity is a biological reality, not a deficit.",
];

const FACTS_ZH = [
  "神經多樣的大腦處理某些資訊的速度可以快達40%。",
  "自閉人士往往擁有卓越的模式識別能力。",
  "動作協調障礙經常與高度的創意同理心有關。",
  "專注力不足/過度活躍症（ADHD）的大腦天生擅長應對高壓危機情況。",
  "神經多樣性是一種生物學上的現實，並非一種缺陷。",
];

function FactsRow({ facts }: { facts: string[] }) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      {facts.map((fact, index) => (
        <span key={index} className="flex items-center gap-3 whitespace-nowrap">
          <span className="text-sm font-medium text-white/90">{fact}</span>
          <span className="text-white/40">•</span>
        </span>
      ))}
    </div>
  );
}

export function FactsMarquee() {
  const { lang } = useLanguage();
  const facts = localizeDeep(lang === "en" ? FACTS_EN : FACTS_ZH, lang);

  return (
    <div className="neuro-facts-marquee overflow-hidden rounded-full bg-black/10">
      {/* Decorative, looping copy — the same facts are exposed to assistive tech once, below. */}
      <div className="flex w-max animate-marquee motion-reduce:animate-none gap-3 px-3" aria-hidden="true">
        <FactsRow facts={facts} />
        <FactsRow facts={facts} />
      </div>
      <ul className="sr-only">
        {facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
    </div>
  );
}
