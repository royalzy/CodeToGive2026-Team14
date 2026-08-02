import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useLanguage } from "../hooks/useLanguage";
import { usePretextLayout } from "../lib/usePretextLayout";
import { localizeDeep } from "../lib/zhConvert";
import "./ImpactPage.css";

type StoryFrame = {
  navLabel: string;
  kicker: string;
  title: string;
  lead: string;
  body: string;
  note: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  stat?: string;
  statLabel?: string;
  secondStat?: string;
  secondStatLabel?: string;
  quote?: string;
  quoteNote?: string;
  tone?: "light" | "blue" | "dark" | "milestone";
};

const storyCopy = {
  en: {
    heroEyebrow: "A true story from Love 21",
    heroTitle: "Crystal steps forward.",
    heroBody:
      "Before she led a warm-up for 20 people, Crystal had to walk into a room and try. Then return. Then try again.",
    heroAction: "Watch the story unfold",
    heroMeta: "Five frames · About three minutes",
    heroCaption: "Crystal performing with the Love 21 community",
    heroConsent:
      "Shared with the consent of Crystal and her family. Programme figures provide wider context.",
    nowShowing: "Now showing",
    frames: [
      {
        navLabel: "Begin",
        kicker: "Frame 01 · The first room",
        title: "No spotlight. Just somewhere to begin.",
        lead:
          "Crystal arrived with energy, confidence and a willingness to have a go.",
        body:
          "The first important moment was not a certificate or a performance. It was the ordinary feeling of being welcomed, expected and free to try as herself. She kept showing up—and the room kept making space for her.",
        note:
          "Every story starts differently. Across Love 21, that first sense of belonging reaches a much wider community.",
        image: "/media/3e0d647f0953-1.jpg",
        imageAlt: "Love 21 members and supporters sharing an activity around one table",
        imageCaption: "A room made for showing up together",
        stat: "680+",
        statLabel: "families supported",
        quote: "More confident, cheerful, and motivated to keep learning.",
        quoteNote: "Crystal’s family",
        tone: "light",
      },
      {
        navLabel: "Practise",
        kicker: "Frame 02 · The return",
        title: "Confidence found a rhythm.",
        lead: "She worked through the movement. Then came back to do it again.",
        body:
          "In integrated sports sessions, Crystal practised balance, coordination and decision-making. Coaches and volunteers were there, but the repetition was hers: one exercise, one small win, one return visit at a time.",
        note:
          "The moment that looks effortless is usually made from many smaller moments of practice.",
        image: "/images/sports-session.jpg",
        imageAlt: "Members taking part in a supported Love 21 sports session",
        imageCaption: "A supported sports session at Love 21",
        stat: "90+",
        statLabel: "ways to take part",
        secondStat: "500+",
        secondStatLabel: "volunteer hours each month",
        tone: "blue",
      },
      {
        navLabel: "Perform",
        kicker: "Frame 03 · The stage",
        title: "Then practice stepped into the light.",
        lead:
          "The room grew bigger. Crystal brought the same energy with her.",
        body:
          "Activities became performances; familiarity became presence. With growing confidence, joy and maturity, Crystal did not simply appear in the frame. She took her place in it.",
        note:
          "Participation is not rehearsal for a life elsewhere. It is life happening now.",
        image: "/images/crystal-performing.jpg",
        imageAlt: "Crystal dancing on stage with another Love 21 member",
        imageCaption: "Crystal on stage with the Love 21 community",
        stat: "900+",
        statLabel: "activities across the service each month",
        tone: "dark",
      },
      {
        navLabel: "Lead",
        kicker: "Frame 04 · The turn",
        title: "The person following the warm-up began leading it.",
        lead:
          "Crystal’s love of dance became a path into responsibility.",
        body:
          "After completing her 50th dance session, she was selected and trained as a Love 21 dance assistant. Then came a new kind of first: Crystal stepped forward and led a warm-up for 20 members.",
        note:
          "Not a finish line. A new role—earned through her commitment, practice and presence.",
        image: "/images/crystal-performing.jpg",
        imageAlt: "A close view of Crystal stepping forward during a Love 21 performance",
        imageCaption: "The same stage. A new role begins.",
        stat: "50",
        statLabel: "dance sessions completed",
        secondStat: "20",
        secondStatLabel: "members she led",
        tone: "milestone",
      },
      {
        navLabel: "Continue",
        kicker: "Frame 05 · The next beginning",
        title: "A milestone can become someone else’s opening scene.",
        lead:
          "Crystal turned participation into contribution. Her story is still moving.",
        body:
          "Her path—from trying, to practising, to performing, to leading—belongs to her. It also shows what becomes possible when people have consistent spaces to grow and a community ready to recognise the next role they can take.",
        note:
          "Across Love 21’s 2023–24 employment work, 26 members trained for more than 120 hours, creating over 6,000 hours of employment and opportunity.",
        image: "/images/community-performance.jpg",
        imageAlt: "Love 21 members and young dancers together after a community performance",
        imageCaption: "One stage, many stories still unfolding",
        tone: "light",
      },
    ] satisfies StoryFrame[],
    closingEyebrow: "The next frame",
    closingTitle: "Help the next story begin.",
    closingBody:
      "Volunteer your time or donate to keep the spaces, people and steady support behind every next step.",
    volunteerAction: "Volunteer",
    donateAction: "Donate",
    creditsLabel: "A note on this story",
    credits:
      "Crystal’s milestones and quote are shared with the consent of Crystal and her family. Wider programme figures are context, not proof that every member’s journey will look the same.",
  },
  zh: {
    heroEyebrow: "Love 21 真實故事",
    heroTitle: "Crystal，繼續向前。",
    heroBody:
      "在她為 20 人帶領熱身之前，Crystal 先要走進一個房間，試一次；再回來，再試一次。",
    heroAction: "讓故事逐幕展開",
    heroMeta: "五個片段 · 約三分鐘",
    heroCaption: "Crystal 與 Love 21 社群一起演出",
    heroConsent: "經 Crystal 與家人同意分享。計劃數字只作整體背景。",
    nowShowing: "正在播放",
    frames: [
      {
        navLabel: "開始",
        kicker: "第一幕 · 最初的房間",
        title: "沒有聚光燈，只有一個開始的地方。",
        lead: "Crystal 帶著活力、自信和願意一試的心走進來。",
        body:
          "第一個重要時刻，不是證書，也不是演出；而是感到自己被歡迎、被期待，可以自在地嘗試。她一次次回來，而這個空間也一次次為她留出位置。",
        note: "每個故事的開始都不同。在 Love 21，這份歸屬感連結著更大的社群。",
        image: "/media/3e0d647f0953-1.jpg",
        imageAlt: "Love 21 會員和同行者圍在同一張桌前參與活動",
        imageCaption: "一個讓大家一起出現的空間",
        stat: "680+",
        statLabel: "個受支援家庭",
        quote: "更自信、更開朗，也更有動力繼續學習。",
        quoteNote: "Crystal 的家人",
        tone: "light",
      },
      {
        navLabel: "練習",
        kicker: "第二幕 · 再回來",
        title: "自信，慢慢找到了節奏。",
        lead: "她一步步完成每個動作，然後回來，再做一次。",
        body:
          "在融合體育活動裡，Crystal 練習平衡、協調和判斷。教練和義工在身邊，而反覆嘗試屬於她自己：一個動作、一次小小突破、一次再次出現。",
        note: "看似輕鬆的一刻，通常由許多細小的練習累積而成。",
        image: "/images/sports-session.jpg",
        imageAlt: "會員參與 Love 21 的支援體育活動",
        imageCaption: "Love 21 的支援體育活動",
        stat: "90+",
        statLabel: "種參與方式",
        secondStat: "500+",
        secondStatLabel: "每月義工服務時數",
        tone: "blue",
      },
      {
        navLabel: "演出",
        kicker: "第三幕 · 舞台",
        title: "練習，終於走進了燈光裡。",
        lead: "空間變大了，Crystal 仍帶著同一份活力。",
        body:
          "活動成為演出，熟悉感成為台上的存在。帶著日漸增長的自信、喜悅和成熟，Crystal 不只是出現在畫面裡；她站穩了屬於自己的位置。",
        note: "參與不是為另一種生活作準備。這就是生活正在發生。",
        image: "/images/crystal-performing.jpg",
        imageAlt: "Crystal 與另一位 Love 21 會員在台上跳舞",
        imageCaption: "Crystal 與 Love 21 社群一起站上舞台",
        stat: "900+",
        statLabel: "項每月服務活動",
        tone: "dark",
      },
      {
        navLabel: "帶領",
        kicker: "第四幕 · 角色轉變",
        title: "跟著熱身的人，開始帶領大家。",
        lead: "Crystal 對舞蹈的熱愛，成為承擔責任的道路。",
        body:
          "完成第 50 次舞蹈課堂後，她獲選並接受 Love 21 舞蹈助理培訓。接著，是另一個第一次：Crystal 站到前面，為 20 位會員帶領熱身。",
        note: "不是終點，而是一個由她的投入、練習和存在所贏得的新角色。",
        image: "/images/crystal-performing.jpg",
        imageAlt: "Crystal 在 Love 21 演出中走到前方的近景",
        imageCaption: "同一個舞台，一個新角色正在開始",
        stat: "50",
        statLabel: "次完成的舞蹈課堂",
        secondStat: "20",
        secondStatLabel: "位由她帶領的會員",
        tone: "milestone",
      },
      {
        navLabel: "繼續",
        kicker: "第五幕 · 下一個開始",
        title: "一個里程碑，也可以成為別人的開場。",
        lead: "Crystal 把參與變成貢獻；她的故事仍在向前。",
        body:
          "這條從嘗試、練習、演出到帶領的道路，屬於 Crystal 自己。它也讓我們看見：當成長有持續的空間，社群願意看見每個人的下一個角色，新的可能就會出現。",
        note:
          "Love 21 的 2023–24 就業項目為 26 位會員提供 120+ 小時培訓，創造超過 6,000 小時的就業和機會。",
        image: "/images/community-performance.jpg",
        imageAlt: "Love 21 會員與年輕舞者在社區演出後合照",
        imageCaption: "同一個舞台，還有許多故事正在展開",
        tone: "light",
      },
    ] satisfies StoryFrame[],
    closingEyebrow: "下一幕",
    closingTitle: "讓下一個故事開始。",
    closingBody: "加入義工或捐款支持，讓每個下一步背後的空間、同行者和持續支援得以延續。",
    volunteerAction: "加入義工",
    donateAction: "捐款支持",
    creditsLabel: "關於這個故事",
    credits:
      "Crystal 的里程碑和引述經她與家人同意分享。整體計劃數字只作背景，不代表每位會員的道路都會相同。",
  },
} as const;

function StoryStats({ frame }: { frame: StoryFrame }) {
  if (!frame.stat) return null;

  return (
    <div className="impact-story-stats" aria-label="Wider programme context">
      <div>
        <strong>{frame.stat}</strong>
        <span>{frame.statLabel}</span>
      </div>
      {frame.secondStat && (
        <div>
          <strong>{frame.secondStat}</strong>
          <span>{frame.secondStatLabel}</span>
        </div>
      )}
    </div>
  );
}

export function ImpactPage() {
  const { lang } = useLanguage();
  const copy = localizeDeep(storyCopy[lang === "en" ? "en" : "zh"], lang);
  const frames = copy.frames as readonly StoryFrame[];
  const [activeFrame, setActiveFrame] = useState(0);
  const heroTitleRef = usePretextLayout<HTMLHeadingElement>(copy.heroTitle);
  const heroBodyRef = usePretextLayout<HTMLParagraphElement>(copy.heroBody);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-story-frame]"),
    );
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const next = Number((visible.target as HTMLElement).dataset.storyFrame);
        if (Number.isFinite(next)) setActiveFrame(next);
      },
      { rootMargin: "-30% 0px -46%", threshold: [0.05, 0.25, 0.55] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function goToFrame(index: number) {
    document.getElementById(`story-frame-${index + 1}`)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }

  return (
    <div className="impact-story-page">
      <section className="impact-story-hero">
        <img
          className="impact-story-hero-image"
          src="/images/crystal-performing.jpg"
          alt=""
        />
        <div className="impact-story-hero-shade" />
        <div className="impact-story-film-edge" aria-hidden="true" />
        <div className="shell impact-story-hero-content">
          <p className="impact-story-eyebrow">{copy.heroEyebrow}</p>
          <h1 ref={heroTitleRef}>{copy.heroTitle}</h1>
          <p ref={heroBodyRef} className="impact-story-hero-deck">
            {copy.heroBody}
          </p>
          <div className="impact-story-hero-actions">
            <a className="impact-story-primary-action" href="#story-frame-1">
              <span aria-hidden="true">↓</span>
              {copy.heroAction}
            </a>
            <p>{copy.heroMeta}</p>
          </div>
        </div>
        <div className="impact-story-hero-caption">
          <span>{copy.heroCaption}</span>
          <span>{copy.heroConsent}</span>
        </div>
      </section>

      <nav
        className="impact-story-tools"
        aria-label={lang === "en" ? "Story frames" : localizeDeep("故事片段", lang)}
      >
        <div className="shell impact-story-tools-inner">
          <p className="impact-story-progress-label" aria-live="polite">
            <span>{copy.nowShowing}</span>
            {String(activeFrame + 1).padStart(2, "0")} / 05 · {frames[activeFrame].navLabel}
          </p>
          <div className="impact-story-frame-nav">
            {frames.map((frame, index) => (
              <button
                type="button"
                key={frame.title}
                aria-label={`${index + 1}. ${frame.navLabel}`}
                aria-current={activeFrame === index ? "step" : undefined}
                onClick={() => goToFrame(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <em>{frame.navLabel}</em>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <article className="impact-story-reel">
        {frames.map((frame, index) => (
          <section
            className={`impact-story-frame impact-story-frame-${frame.tone ?? "light"}${activeFrame === index ? " is-active" : ""}`}
            id={`story-frame-${index + 1}`}
            data-story-frame={index}
            tabIndex={-1}
            key={frame.title}
          >
            <div className="impact-story-frame-rail" aria-hidden="true">
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="shell impact-story-frame-inner">
              <div className="impact-story-frame-copy">
                <p className="impact-story-eyebrow">{frame.kicker}</p>
                <h2>{frame.title}</h2>
                <p className="impact-story-frame-lead">{frame.lead}</p>
                <p className="impact-story-frame-body">{frame.body}</p>

                {frame.quote && (
                  <blockquote className="impact-story-quote">
                    <p>“{frame.quote}”</p>
                    <cite>— {frame.quoteNote}</cite>
                  </blockquote>
                )}

                <StoryStats frame={frame} />
                <p className="impact-story-director-note">
                  <span>{lang === "en" ? "Voice-over" : localizeDeep("畫外音", lang)}</span>
                  {frame.note}
                </p>
              </div>

              {frame.image && (
                <figure className="impact-story-frame-image">
                  <img src={frame.image} alt={frame.imageAlt} />
                  <figcaption>
                    <span>{String(index + 1).padStart(2, "0")} / 05</span>
                    {frame.imageCaption}
                  </figcaption>
                </figure>
              )}
            </div>
          </section>
        ))}
      </article>

      <section className="impact-story-closing">
        <div className="impact-story-film-edge" aria-hidden="true" />
        <div className="shell impact-story-closing-inner">
          <p className="impact-story-eyebrow">{copy.closingEyebrow}</p>
          <h2>{copy.closingTitle}</h2>
          <p className="impact-story-closing-body">{copy.closingBody}</p>
          <div className="impact-story-closing-actions">
            <Link className="impact-story-closing-primary" to="/volunteer">
              {copy.volunteerAction} <span aria-hidden="true">→</span>
            </Link>
            <Link className="impact-story-closing-secondary" to="/donate">
              {copy.donateAction} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="impact-story-credits">
            <strong>{copy.creditsLabel}</strong>
            <p>{copy.credits}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
