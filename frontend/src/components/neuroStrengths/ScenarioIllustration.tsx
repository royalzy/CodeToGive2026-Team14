import type { LucideIcon } from "lucide-react";
import { Activity, CalendarClock, Headphones, MessageSquare, Terminal } from "lucide-react";

import type { QuizScenario } from "./data";

const SCENE_STYLES: Record<string, { gradient: string; icon: LucideIcon }> = {
  processing: { gradient: "from-slate-400 to-blue-600", icon: Headphones },
  hyperfocus: { gradient: "from-indigo-500 to-cyan-500", icon: Terminal },
  direct: { gradient: "from-fuchsia-500 to-purple-600", icon: MessageSquare },
  stimming: { gradient: "from-orange-400 to-rose-500", icon: Activity },
  routine: { gradient: "from-emerald-400 to-teal-600", icon: CalendarClock },
};

export function ScenarioIllustration({
  scenario,
  hasAnswered,
}: {
  scenario: QuizScenario;
  hasAnswered: boolean;
}) {
  const { gradient, icon: Icon } = SCENE_STYLES[scenario.id] ?? SCENE_STYLES.processing;

  return (
    <div
      className={`flex h-full min-h-[240px] w-full items-center justify-center overflow-hidden bg-gradient-to-br p-8 transition-transform duration-500 ${gradient} ${
        hasAnswered ? "scale-[1.03]" : "scale-100"
      }`}
    >
      <div className="flex items-center justify-center rounded-2xl border border-white/30 bg-white/20 p-12 shadow-2xl backdrop-blur-xl">
        <Icon size={120} strokeWidth={1.25} className="text-white drop-shadow-lg" />
      </div>
    </div>
  );
}
