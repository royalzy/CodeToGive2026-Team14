import type { VolunteerRole, VolunteerSession } from "../../content/volunteer";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

const copy = {
  en: {
    eyebrowNoSession: "Your possible first step",
    noSessionBody:
      "There is no demo session for this role yet. In a live service, Love 21 would contact you before suggesting a suitable opportunity.",
    noSessionNote: "You have expressed interest only. No activity has been booked or confirmed.",
    demoBadge: "Provisional demo plan",
    eyebrow: "Your possible first session",
    whatCouldLookLike: "What the session could look like",
    bring: "Bring",
    smallGoal: "A small first-session goal",
    supportNote:
      "You would not handle unfamiliar situations alone. A Love 21 lead or coach would be present throughout.",
  },
  zh: {
    eyebrowNoSession: "你可能的第一步",
    noSessionBody:
      "此角色暫時未有示範活動。在正式服務中，Love 21 會先與你聯絡，才建議合適的機會。",
    noSessionNote: "你只表達了興趣。暫時未有預約或確認任何活動。",
    demoBadge: "暫定示範計劃",
    eyebrow: "你可能的第一次活動",
    whatCouldLookLike: "活動可能是怎樣的",
    bring: "請攜帶",
    smallGoal: "第一次活動的小目標",
    supportNote: "你不需要獨自應對陌生情況，全程會有 Love 21 負責人或教練在場。",
  },
} as const;

export function FirstSessionPlan({
  role,
  session,
}: {
  role: VolunteerRole;
  session?: VolunteerSession;
}) {
  const { lang } = useLanguage();
  const t = localizeDeep(copy[lang === "en" ? "en" : "zh"], lang);

  if (!session) {
    return (
      <section className="first-session-plan">
        <p className="eyebrow">{t.eyebrowNoSession}</p>
        <h2>{role.title}</h2>
        <p>{t.noSessionBody}</p>
        <div className="plan-support-note">{t.noSessionNote}</div>
      </section>
    );
  }

  return (
    <section className="first-session-plan">
      <div className="demo-badge">{t.demoBadge}</div>
      <p className="eyebrow">{t.eyebrow}</p>
      <h2>{session.title}</h2>
      <p>
        <strong>{session.dateLabel}</strong> · {session.timeLabel}
        <br />
        {session.location}
      </p>
      <h3>{t.whatCouldLookLike}</h3>
      <ol className="plan-timeline">
        {session.schedule.map((item) => (
          <li key={`${item.time}-${item.activity}`}>
            <time>{item.time}</time>
            <span>{item.activity}</span>
          </li>
        ))}
      </ol>
      <div className="plan-grid">
        <div>
          <h3>{t.bring}</h3>
          <ul>
            {session.bring.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{t.smallGoal}</h3>
          <p>{session.smallTask}</p>
        </div>
      </div>
      <div className="plan-support-note">{t.supportNote}</div>
    </section>
  );
}
