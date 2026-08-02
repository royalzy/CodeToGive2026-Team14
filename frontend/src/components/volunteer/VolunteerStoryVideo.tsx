import { useRef } from "react";

import type { VolunteerRole } from "../../content/volunteer";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";
import { trackVolunteerEvent } from "../../lib/volunteerAnalytics";

const copy = {
  en: {
    eyebrow: "A volunteer's story",
    heading: "See what volunteering really feels like.",
    body: "Hear what a volunteer actually does, what support is available and what they take away from showing up alongside the Love 21 community.",
    points: [
      "The practical things a volunteer does during an activity",
      "What can feel uncertain before a first visit",
      "The connection, confidence and perspective they gain",
    ],
    demoNote:
      "Demo media: all three role pages currently use the same sample video. A final volunteer story must include approved captions or a transcript.",
    demoBadge: "Volunteer story · demo",
    videoAriaLabel: (title: string) => `Volunteer story for people exploring the ${title} role`,
    noVideoSupport: "Your browser does not support embedded video.",
  },
  zh: {
    eyebrow: "義工的故事",
    heading: "看看做義工真正的感受。",
    body: "聽聽義工實際做些甚麼、有哪些支援可用，以及他們與 Love 21 社群同行後有甚麼得著。",
    points: [
      "義工在活動期間實際會做的事情",
      "首次參與前可能感到不確定的地方",
      "他們獲得的連繫、自信和啟發",
    ],
    demoNote: "示範媒體：目前三個角色頁面均使用同一段示範影片。正式的義工故事必須附有審批的字幕或文字稿。",
    demoBadge: "義工故事 · 示範",
    videoAriaLabel: (title: string) => `適合探索「${title}」角色人士的義工故事`,
    noVideoSupport: "你的瀏覽器不支援嵌入式影片。",
  },
} as const;

export function VolunteerStoryVideo({
  role,
  journeyPath,
}: {
  role: VolunteerRole;
  journeyPath: "quick" | "guided";
}) {
  const { lang } = useLanguage();
  const t = localizeDeep(copy[lang === "en" ? "en" : "zh"], lang);
  const started = useRef(false);

  function trackStarted() {
    if (started.current) {
      return;
    }
    started.current = true;
    trackVolunteerEvent("volunteer_story_video_started", {
      journey_path: journeyPath,
      role_id: role.id,
    });
  }

  function trackCompleted() {
    trackVolunteerEvent("volunteer_story_video_completed", {
      journey_path: journeyPath,
      role_id: role.id,
    });
  }

  return (
    <div className="volunteer-story">
      <div className="volunteer-story-copy">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.heading}</h2>
        <p className="large-copy">{t.body}</p>
        <ul className="volunteer-story-points">
          {t.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p className="field-hint">{t.demoNote}</p>
      </div>
      <div className="volunteer-video-frame">
        <div className="demo-badge">{t.demoBadge}</div>
        <video
          controls
          playsInline
          preload="metadata"
          aria-label={t.videoAriaLabel(role.title)}
          onPlay={trackStarted}
          onEnded={trackCompleted}
        >
          <source src="/video/volunteer-story.mp4" type="video/mp4" />
          {t.noVideoSupport}
        </video>
      </div>
    </div>
  );
}
