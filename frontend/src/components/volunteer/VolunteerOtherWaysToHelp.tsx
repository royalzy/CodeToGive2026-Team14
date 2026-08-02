import { BookOpen, Handshake, Heart, Megaphone } from "lucide-react";
import type { ComponentType } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

interface OtherWayItem {
  key: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;
  eyebrow: string;
  title: string;
  body: string;
  linkTo?: string;
  linkLabel?: string;
  accent: "red" | "blue" | "yellow" | "teal";
}

const pageCopy = {
  en: {
    eyebrow: "Not ready to commit yet?",
    heading: "So many ways to make a difference.",
    intro:
      "Showing up in person is one way to help Love 21, it is not the only way. Hover a card (or tap it) to see how else you could get involved.",
    flipHint: "activate to read more",
    ways: [
      {
        key: "learn",
        icon: BookOpen,
        eyebrow: "Learn",
        title: "Learn from our education resources",
        body: "Read plain-language guides on neurodiversity, inclusion and communication, then pass one on to a friend, colleague or classroom that might find it useful.",
        linkTo: "/resources",
        linkLabel: "Browse education resources",
        accent: "blue" as const,
      },
      {
        key: "spread-word",
        icon: Megaphone,
        eyebrow: "Share",
        title: "Tell someone who might care",
        body: "Not everyone can give their time, but almost everyone can share a link. Forward this page to a friend, a colleague or a community group.",
        accent: "red" as const,
      },
      {
        key: "donate",
        icon: Heart,
        eyebrow: "Give",
        title: "Donate instead of, or alongside, your time",
        body: "A one-off or regular donation funds coaching, nutrition support and equipment for members who cannot take part without it.",
        linkTo: "/donate",
        linkLabel: "Make a donation",
        accent: "yellow" as const,
      },
      {
        key: "partner",
        icon: Handshake,
        eyebrow: "Partner",
        title: "Bring your company on board",
        body: "Ask your employer about a CSR day, an in-kind donation or a sponsorship, a good fit if a single day works better than an ongoing role.",
        accent: "teal" as const,
      },
    ],
  },
  zh: {
    eyebrow: "暫時未準備好參與？",
    heading: "還有很多方式可以貢獻一分力。",
    intro: "親身參與是幫助 Love 21 的其中一個方法，但並非唯一方法。將滑鼠移到卡片上（或輕觸）了解其他參與方式。",
    flipHint: "點選以了解更多",
    ways: [
      {
        key: "learn",
        icon: BookOpen,
        eyebrow: "學習",
        title: "透過我們的教育資源學習",
        body: "閱讀有關神經多樣性、共融和溝通的淺白指南，再轉發給可能有需要的朋友、同事或班級。",
        linkTo: "/resources",
        linkLabel: "瀏覽教育資源",
        accent: "blue" as const,
      },
      {
        key: "spread-word",
        icon: Megaphone,
        eyebrow: "分享",
        title: "告訴可能關心這件事的人",
        body: "不是每個人都能付出時間，但幾乎每個人都能分享連結。將此頁面轉發給朋友、同事或社區團體。",
        accent: "red" as const,
      },
      {
        key: "donate",
        icon: Heart,
        eyebrow: "捐款",
        title: "以捐款取代或配合你的時間",
        body: "單次或定期捐款可資助教練指導、營養支援和器材，讓沒有這些支援便無法參與的會員受惠。",
        linkTo: "/donate",
        linkLabel: "立即捐款",
        accent: "yellow" as const,
      },
      {
        key: "partner",
        icon: Handshake,
        eyebrow: "合作",
        title: "邀請你的公司加入",
        body: "向你的僱主查詢企業社會責任日、實物捐贈或贊助機會，如果單日活動比長期參與更適合，這會是個好選擇。",
        accent: "teal" as const,
      },
    ],
  },
} as const;

export function VolunteerOtherWaysToHelp() {
  const { lang } = useLanguage();
  const t = localizeDeep(pageCopy[lang === "en" ? "en" : "zh"], lang);
  const otherWays: OtherWayItem[] = [...t.ways];

  return (
    <div className="volunteer-other-ways">
      <p className="eyebrow">{t.eyebrow}</p>
      <h3>{t.heading}</h3>
      <p className="volunteer-other-ways-intro">{t.intro}</p>
      <div className="volunteer-other-ways-grid">
        {otherWays.map((item) => (
          <OtherWayFlipCard key={item.key} item={item} flipHint={t.flipHint} />
        ))}
      </div>
    </div>
  );
}

function OtherWayFlipCard({ item, flipHint }: { item: OtherWayItem; flipHint: string }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = item.icon;

  return (
    <article
      className={`volunteer-other-way-card volunteer-accent-${item.accent} ${
        isFlipped ? "is-flipped" : ""
      }`}
      tabIndex={0}
      aria-label={`${item.title} — ${flipHint}`}
      onClick={() => setIsFlipped((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsFlipped((current) => !current);
        }
      }}
    >
      <div className="volunteer-other-way-card-inner">
        <div className="volunteer-other-way-card-face volunteer-other-way-card-front">
          <span className="volunteer-other-way-icon" aria-hidden="true">
            <Icon size={30} strokeWidth={1.75} />
          </span>
          <p className="volunteer-other-way-eyebrow">{item.eyebrow}</p>
          <h4>{item.title}</h4>
        </div>
        <div className="volunteer-other-way-card-face volunteer-other-way-card-back">
          <p className="volunteer-other-way-eyebrow">{item.eyebrow}</p>
          <p>{item.body}</p>
          {item.linkTo && item.linkLabel && (
            <div className="volunteer-other-way-actions">
              <Link
                className="text-link"
                to={item.linkTo}
                onClick={(event) => event.stopPropagation()}
              >
                {item.linkLabel} <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
