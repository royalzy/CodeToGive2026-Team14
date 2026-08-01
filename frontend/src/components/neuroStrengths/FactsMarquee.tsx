const FACTS = [
  "Neurodivergent brains can process certain information up to 40% faster.",
  "Autistic individuals often possess elite pattern recognition skills.",
  "Dyspraxia is frequently linked to high levels of creative empathy.",
  "ADHD brains naturally excel in high-pressure, crisis situations.",
  "Neurodiversity is a biological reality, not a deficit.",
];

function FactsRow() {
  return (
    <div className="flex shrink-0 items-center gap-3">
      {FACTS.map((fact, index) => (
        <span key={index} className="flex items-center gap-3 whitespace-nowrap">
          <span className="text-sm font-medium text-white/90">{fact}</span>
          <span className="text-white/40">•</span>
        </span>
      ))}
    </div>
  );
}

export function FactsMarquee() {
  return (
    <div className="mt-8 overflow-hidden rounded-full bg-black/10 py-3">
      {/* Decorative, looping copy — the same facts are exposed to assistive tech once, below. */}
      <div className="flex w-max animate-marquee motion-reduce:animate-none gap-3 px-3" aria-hidden="true">
        <FactsRow />
        <FactsRow />
      </div>
      <ul className="sr-only">
        {FACTS.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
    </div>
  );
}
