import { useMemo } from "react";
import {
  Chart as ChartJS,
  Filler,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip as ChartTooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";

import { TRAITS, type Archetype, type TraitId } from "./data";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip);

// Chart.js sizes the radar's radius to fit each point label on one line; on
// narrow screens two-word labels like "Direct Communication" get clipped
// past the canvas edge, so wrap them onto two lines instead.
function wrapChartLabel(label: string): string | string[] {
  const words = label.split(" ");
  if (words.length <= 1) return label;
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

const CHART_LABELS = TRAITS.map((trait) => wrapChartLabel(trait.label));

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 0 as const },
  scales: {
    r: {
      min: 0,
      max: 10,
      angleLines: { color: "rgba(23, 22, 37, 0.12)" },
      grid: { color: "rgba(23, 22, 37, 0.08)" },
      ticks: { display: false, stepSize: 2 },
      pointLabels: {
        color: "#171625",
        font: { size: 12, weight: 600 },
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#171625",
      titleColor: "#fff9ef",
      bodyColor: "#fff9ef",
      padding: 10,
      displayColors: false,
    },
  },
};

export function ConstellationRadar({
  archetype,
  values,
}: {
  archetype: Archetype;
  values: Record<TraitId, number>;
}) {
  const chartData = useMemo(
    () => ({
      labels: CHART_LABELS,
      datasets: [
        {
          label: "Strength score",
          data: TRAITS.map((trait) => values[trait.id]),
          backgroundColor: "rgba(20, 85, 192, 0.25)",
          borderColor: "#1455c0",
          borderWidth: 2,
          pointBackgroundColor: "#1455c0",
          pointBorderColor: "#fff9ef",
          pointHoverRadius: 6,
          pointRadius: 4,
          fill: true,
        },
      ],
    }),
    [values],
  );

  return (
    <div className="neuro-radar-column flex flex-col">
      <div className="neuro-radar-frame relative w-full">
        <div
          className="pointer-events-none absolute inset-0 rounded-full bg-love-blue/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative h-full w-full rounded-3xl border border-love-blue/10 bg-white/50 p-4">
          <Radar data={chartData} options={CHART_OPTIONS} />
        </div>
      </div>

      <div
        key={archetype.id}
        className="neuro-radar-note rounded-2xl border border-love-teal/20 bg-love-ink text-love-cream shadow-sm"
      >
        <p className="text-sm">
          <span className="font-semibold text-love-yellow">The Myth: </span>
          {archetype.myth}
        </p>
        <p className="mt-3 text-sm">
          <span className="font-semibold text-love-teal">The Reality — {archetype.realityTitle}: </span>
          {archetype.realityBody}
        </p>
      </div>
    </div>
  );
}
