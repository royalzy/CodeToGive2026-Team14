import { useEffect, useState } from "react";

import { getAnalyticsSummary, type AnalyticsSummary } from "../../api/client";

export function LiveMetrics() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAnalyticsSummary()
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <div className="privacy-note" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <strong>API not reachable</strong>
        <p>Start the backend on port 8000 to see live metrics here.</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <p className="privacy-note" style={{ maxWidth: "600px", margin: "0 auto" }}>
        Loading live metrics…
      </p>
    );
  }

  const languageCount = Object.keys(summary.quizzes.languages).length;
  const cards = [
    {
      value: summary.quizzes.attempts.toLocaleString(),
      label: "Myth-check answers",
      detail: `${languageCount} ${languageCount === 1 ? "language" : "languages"} · ${summary.quizzes.rounds.length} ${summary.quizzes.rounds.length === 1 ? "round" : "rounds"}`,
    },
    {
      value: summary.donations.intents.toLocaleString(),
      label: "Donation intents",
      detail: `HK$${summary.donations.total_hkd.toLocaleString()} · ${summary.donations.anonymous_count} anonymous`,
    },
    {
      value: summary.donors.profiles.toLocaleString(),
      label: "Donor profiles",
      detail: `${summary.donors.wall_posts} wall message${summary.donors.wall_posts === 1 ? "" : "s"}`,
    },
    {
      value: summary.questionnaire_submissions.toLocaleString(),
      label: "Help enquiries",
      detail: "Questionnaire submissions",
    },
  ];

  return (
    <div className="metric-grid">
      {cards.map((card) => (
        <div key={card.label} className="metric-card">
          <strong>{card.value}</strong>
          <h3>{card.label}</h3>
          <p>{card.detail}</p>
        </div>
      ))}
    </div>
  );
}