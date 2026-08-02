import { useEffect, useState } from "react";

import { getAnalyticsSummary, type AnalyticsSummary } from "../../api/client";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

export function LiveMetrics() {
  const { lang } = useLanguage();
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
        <strong>{lang === "en" ? "API not reachable" : localizeDeep("無法連接 API", lang)}</strong>
        <p>
          {lang === "en"
            ? "Start the backend on port 8000 to see live metrics here."
            : localizeDeep("請在 8000 埠啟動後端服務，即可在此查看即時數據。", lang)}
        </p>
      </div>
    );
  }

  if (!summary) {
    return (
      <p className="privacy-note" style={{ maxWidth: "600px", margin: "0 auto" }}>
        {lang === "en" ? "Loading live metrics…" : localizeDeep("正在載入即時數據…", lang)}
      </p>
    );
  }

  const languageCount = Object.keys(summary.quizzes.languages).length;
  const languageWord =
    lang === "en"
      ? languageCount === 1
        ? "language"
        : "languages"
      : localizeDeep("種語言", lang);
  const roundWord =
    lang === "en"
      ? summary.quizzes.rounds.length === 1
        ? "round"
        : "rounds"
      : localizeDeep("輪", lang);
  const cards = [
    {
      value: summary.quizzes.attempts.toLocaleString(),
      label: lang === "en" ? "Myth-check answers" : localizeDeep("迷思問答", lang),
      detail:
        lang === "en"
          ? `${languageCount} ${languageWord} · ${summary.quizzes.rounds.length} ${roundWord}`
          : `${languageCount} ${languageWord} · ${summary.quizzes.rounds.length} ${roundWord}`,
    },
    {
      value: summary.donations.intents.toLocaleString(),
      label: lang === "en" ? "Donation intents" : localizeDeep("捐款意向", lang),
      detail:
        lang === "en"
          ? `HK$${summary.donations.total_hkd.toLocaleString()} · ${summary.donations.anonymous_count} anonymous`
          : `HK$${summary.donations.total_hkd.toLocaleString()} · ${summary.donations.anonymous_count} ${localizeDeep("筆匿名", lang)}`,
    },
    {
      value: summary.donors.profiles.toLocaleString(),
      label: lang === "en" ? "Donor profiles" : localizeDeep("捐款人檔案", lang),
      detail:
        lang === "en"
          ? `${summary.donors.wall_posts} wall message${summary.donors.wall_posts === 1 ? "" : "s"}`
          : `${summary.donors.wall_posts} ${localizeDeep("則留言牆訊息", lang)}`,
    },
    {
      value: summary.questionnaire_submissions.toLocaleString(),
      label: lang === "en" ? "Help enquiries" : localizeDeep("求助查詢", lang),
      detail: lang === "en" ? "Questionnaire submissions" : localizeDeep("問卷提交數量", lang),
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
