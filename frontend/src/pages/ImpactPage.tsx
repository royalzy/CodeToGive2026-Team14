import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useLanguage } from "../hooks/useLanguage";
import { usePretextLayout } from "../lib/usePretextLayout";
import "./ImpactPage.css";

type StoryAct = {
  eyebrow: string;
  title: string;
  intro: string;
  crystalTitle: string;
  crystalBody: string;
  supportTitle: string;
  supportBody: string;
  dataLine: string;
  image?: string;
  imageAlt?: string;
  imageNote?: string;
  link?: {
    eyebrow: string;
    body: string;
    label: string;
    to: string;
  };
  quote?: string;
  quoteNote?: string;
  tone?: "sky" | "cinema";
};

const storyCopy = {
  en: {
    heroEyebrow: "The work behind the moment",
    heroTitle: "Crystal steps forward.",
    heroBody:
      "Not in one leap. In a series of rooms where she could practise, perform, lead and keep learning. This is Crystal’s story in five moments, with the support behind each one kept clearly in view.",
    heroAction: "Read Crystal’s story",
    heroConsent:
      "Crystal’s story and quote are shared with the consent of Crystal and her family. Wider programme figures appear only as context.",
    heroCaption: "Crystal performing with the Love 21 community",
    nowReading: "Now reading",
    acts: [
      {
        eyebrow: "Belonging comes first",
        title: "Room to try.",
        intro:
          "Before a milestone can be counted, someone needs a place where trying feels ordinary. Crystal’s story begins with what she brought into the room: energy, confidence and a willingness to have a go.",
        crystalTitle: "She kept showing up as herself.",
        crystalBody:
          "Crystal embraced activities with energy and a willingness to try. The story starts with her agency, not with a deficit that someone else had to fix.",
        supportTitle: "A community built for participation.",
        supportBody:
          "Integrated sessions gave Crystal repeated opportunities to join in, build familiarity and find the activities that brought her joy.",
        dataLine: "Across Love 21’s wider community, 680+ families are supported.",
        quote: "More confident, cheerful, and motivated to keep learning.",
        quoteNote: "Shared with the consent of Crystal and her family.",
      },
      {
        eyebrow: "Skills become a rhythm",
        title: "Practice before performance.",
        intro:
          "Confidence had somewhere practical to land. Through integrated sports sessions, Crystal strengthened balance, coordination and thinking skills, one exercise and one return visit at a time.",
        crystalTitle: "She worked through the movement.",
        crystalBody:
          "Crystal took part in integrated sports sessions and practised the physical and thinking skills each activity asked of her.",
        supportTitle: "Structured sessions, hands-on support.",
        supportBody:
          "Coaches and volunteers created repeated chances to practise balance, coordination and decision-making in a supported group setting.",
        dataLine:
          "Across the wider programme: 90+ activity types and 500+ volunteer hours each month.",
        image: "/images/sports-session.jpg",
        imageAlt: "Members taking part in a supported sports session",
        imageNote:
          "The moment that looks effortless is usually made from many smaller moments of practice.",
        link: {
          eyebrow: "Some sessions need another pair of hands.",
          body: "Love 21’s wider programme is supported by 500+ volunteer hours each month. Class support is one place that time becomes tangible.",
          label: "Explore volunteering",
          to: "/volunteer",
        },
        tone: "sky",
      },
      {
        eyebrow: "A place in the frame",
        title: "Being seen.",
        intro:
          "Practice became presence. Crystal embraced activities and performances with increasing confidence, joy and maturity, making the stage another place where she could take up space.",
        crystalTitle: "She performed with joy.",
        crystalBody:
          "Crystal brought energy to activities and performances, growing more assured and mature as she took part.",
        supportTitle: "Real occasions to contribute.",
        supportBody:
          "Community activities and performances offered more than rehearsal. They gave members an audience, a shared goal and a visible role.",
        dataLine: "Across Love 21’s wider service, 900+ activities run each month.",
        image: "/images/community-performance.jpg",
        imageAlt: "Love 21 members performing together at a community event",
        imageNote:
          "Participation is not preparation for life elsewhere. It is life happening now.",
        tone: "cinema",
      },
      {
        eyebrow: "The role changes",
        title: "From dancer to assistant.",
        intro:
          "Crystal’s love of dance became a path into responsibility. She was selected and trained as one of Love 21’s dance assistants, moving from following the warm-up to helping lead it.",
        crystalTitle: "She reached fifty, then led twenty.",
        crystalBody:
          "Crystal completed her 50th dance session and led a dance warm-up for 20 members. Those milestones belong to her work and presence.",
        supportTitle: "A next role, not an ending.",
        supportBody:
          "Love 21 recognised Crystal’s commitment to dance and selected her for training as a dance assistant, turning experience into contribution.",
        dataLine:
          "In Love 21’s 2023–24 employment work, 26 members trained across 120+ training hours.",
      },
      {
        eyebrow: "One story, wider work",
        title: "More people need the same room.",
        intro:
          "Crystal’s story is specific. It should not be stretched into proof of every outcome. But it helps us see why consistent activities, skill-building and pathways into responsibility matter across a much larger community.",
        crystalTitle: "She turned participation into contribution.",
        crystalBody:
          "Crystal’s path moved through trying, practising, performing and leading. The sequence is hers, and it remains open-ended.",
        supportTitle: "Continuity across different kinds of growth.",
        supportBody:
          "Love 21 sustains activities and builds routes from participation toward training and employment opportunities for members across the service.",
        dataLine:
          "In 2023–24, the wider programme created 6,000+ employment hours and opportunities.",
        link: {
          eyebrow: "Consistency has a real cost.",
          body: "Donations help sustain 900+ monthly activities and the training behind wider employment pathways. This is where funding meets the work described above.",
          label: "Support the work",
          to: "/donate",
        },
        tone: "sky",
      },
    ] satisfies StoryAct[],
    closingEyebrow: "End frame",
    closingTitle:
      "The milestone matters. So does every room that came before it.",
    closingBody:
      "Crystal’s milestones are hers. The spaces, people and steady support around them are what help the next step become possible.",
  },
  zh: {
    heroEyebrow: "每個時刻背後的同行",
    heroTitle: "Crystal，繼續向前。",
    heroBody:
      "成長不是一步登天，而是在一個又一個可以練習、演出、帶領和繼續學習的空間裡發生。這是 Crystal 的五個真實時刻，也讓每一步背後的支持清楚可見。",
    heroAction: "閱讀 Crystal 的故事",
    heroConsent:
      "Crystal 的故事和引述經她與家人同意分享。整體服務數字只用作背景。",
    heroCaption: "Crystal 與 Love 21 社群一起演出",
    nowReading: "正在閱讀",
    acts: [
      {
        eyebrow: "歸屬感先開始",
        title: "一個可以嘗試的空間。",
        intro: "在里程碑可以被記錄之前，先要有一個讓嘗試變得自然的地方。Crystal 帶著活力、自信和願意一試的態度走進來。",
        crystalTitle: "她一次又一次，以自己的方式出現。",
        crystalBody: "Crystal 充滿活力地參與活動，也願意嘗試。故事從她的主動開始，而不是把她描述成需要被修正的人。",
        supportTitle: "一個為參與而設的社群。",
        supportBody: "融合活動讓 Crystal 可以持續參與、建立熟悉感，並找到真正令她快樂的活動。",
        dataLine: "Love 21 的整體社群支援 680+ 個家庭。",
        quote: "更自信、更開朗，也更有動力繼續學習。",
        quoteNote: "經 Crystal 與家人同意分享。",
      },
      {
        eyebrow: "能力成為節奏",
        title: "演出之前，是一次次練習。",
        intro: "自信有了實際的落點。透過融合體育活動，Crystal 在每次練習和再次參與之間，鍛鍊平衡、協調和思考能力。",
        crystalTitle: "她一步步完成每個動作。",
        crystalBody: "Crystal 參與融合體育活動，練習每項活動需要的身體和思考能力。",
        supportTitle: "有結構的課堂，也有身邊的支持。",
        supportBody: "教練和義工在小組環境中，創造反覆練習平衡、協調和判斷的機會。",
        dataLine: "整體計劃每月提供 90+ 種活動，並獲得 500+ 義工服務時數。",
        image: "/images/sports-session.jpg",
        imageAlt: "會員參與有支援的體育活動",
        imageNote: "看似輕鬆的一刻，通常由許多細小的練習累積而成。",
        link: { eyebrow: "有些課堂，需要多一雙手。", body: "Love 21 每月獲得 500+ 義工服務時數，課堂支援正是這些時間變得具體的地方。", label: "了解義工服務", to: "/volunteer" },
        tone: "sky",
      },
      {
        eyebrow: "站進畫面裡",
        title: "被看見。",
        intro: "練習成為台上的存在。Crystal 以日漸增長的自信、喜悅和成熟參與活動及演出，讓舞台成為她自在佔據空間的另一個地方。",
        crystalTitle: "她帶著喜悅演出。",
        crystalBody: "Crystal 把活力帶進活動和演出，在每次參與中變得更從容、更成熟。",
        supportTitle: "真正可以作出貢獻的場合。",
        supportBody: "社區活動和演出不只是排練，也帶來觀眾、共同目標和清楚可見的角色。",
        dataLine: "Love 21 的整體服務每月舉行 900+ 項活動。",
        image: "/images/community-performance.jpg",
        imageAlt: "Love 21 會員在社區活動中一起演出",
        imageNote: "參與不是為另一種生活作準備。這就是生活正在發生。",
        tone: "cinema",
      },
      {
        eyebrow: "角色開始改變",
        title: "從舞者到助理。",
        intro: "Crystal 對舞蹈的熱愛，成為承擔責任的道路。她獲選並接受 Love 21 舞蹈助理培訓，從跟著熱身，到協助帶領大家。",
        crystalTitle: "她完成五十次，再帶領二十人。",
        crystalBody: "Crystal 完成第 50 次舞蹈課堂，並為 20 位會員帶領舞蹈熱身。這些里程碑屬於她的努力和投入。",
        supportTitle: "下一個角色，不是故事的終點。",
        supportBody: "Love 21 看見 Crystal 對舞蹈的投入，選出她接受舞蹈助理培訓，讓經驗成為貢獻。",
        dataLine: "Love 21 的 2023–24 就業項目為 26 位會員提供 120+ 小時培訓。",
      },
      {
        eyebrow: "一個故事，更廣的工作",
        title: "更多人需要同樣的空間。",
        intro: "Crystal 的故事屬於她自己，不應被延伸成所有成果的證明。但它讓我們看見，持續活動、能力培養和承擔責任的道路，為何對更大的社群重要。",
        crystalTitle: "她把參與變成貢獻。",
        crystalBody: "Crystal 的道路經歷嘗試、練習、演出和帶領。這個次序屬於她，也仍然繼續向前。",
        supportTitle: "讓不同的成長可以持續。",
        supportBody: "Love 21 持續提供活動，並為會員建立從參與走向培訓和就業機會的道路。",
        dataLine: "2023–24 年度的整體計劃創造 6,000+ 個就業工時及機會。",
        link: { eyebrow: "持續支持有實際成本。", body: "捐款協助維持每月 900+ 項活動，以及更廣泛就業道路背後的培訓。", label: "支持這項工作", to: "/donate" },
        tone: "sky",
      },
    ] satisfies StoryAct[],
    closingEyebrow: "最後一幕",
    closingTitle: "里程碑很重要，之前的每一個空間也同樣重要。",
    closingBody: "里程碑屬於 Crystal；而她身邊持續存在的空間、人和支持，讓下一步成為可能。",
  },
} as const;

function StoryPair({ act }: { act: StoryAct }) {
  return (
    <div className="impact-story-pair">
      <section className="impact-story-panel">
        <h3>{act.crystalTitle}</h3>
        <p>{act.crystalBody}</p>
      </section>
      <section className="impact-story-panel impact-story-support-panel">
        <h3>{act.supportTitle}</h3>
        <p>{act.supportBody}</p>
        <p className="impact-story-data-line">{act.dataLine}</p>
      </section>
    </div>
  );
}

export function ImpactPage() {
  const { lang } = useLanguage();
  const copy = storyCopy[lang];
  const acts = copy.acts as readonly StoryAct[];
  const [activeAct, setActiveAct] = useState(0);
  const heroTitleRef = usePretextLayout<HTMLHeadingElement>(copy.heroTitle);
  const heroBodyRef = usePretextLayout<HTMLParagraphElement>(copy.heroBody);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-impact-act]"),
    );
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const next = Number((visible.target as HTMLElement).dataset.impactAct);
        if (Number.isFinite(next)) setActiveAct(next);
      },
      { rootMargin: "-28% 0px -52%", threshold: [0.05, 0.3, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function goToAct(index: number) {
    document.getElementById(`impact-act-${index + 1}`)?.scrollIntoView({
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
        <div className="impact-story-hero-overlay" />
        <div className="shell impact-story-hero-content">
          <p className="impact-story-eyebrow">{copy.heroEyebrow}</p>
          <h1 ref={heroTitleRef}>{copy.heroTitle}</h1>
          <p ref={heroBodyRef} className="impact-story-hero-deck">
            {copy.heroBody}
          </p>
          <div className="impact-story-hero-bottom">
            <a className="impact-story-primary-action" href="#impact-act-1">
              <span aria-hidden="true">↳</span>
              {copy.heroAction}
            </a>
            <p>{copy.heroConsent}</p>
          </div>
        </div>
        <p className="impact-story-hero-caption">{copy.heroCaption}</p>
      </section>

      <nav
        className="impact-story-tools"
        aria-label={lang === "zh" ? "故事章節" : "Story chapters"}
      >
        <div className="shell impact-story-tools-inner">
          <p className="impact-story-progress-label" aria-live="polite">
            <span>{copy.nowReading}</span>
            {acts[activeAct].title}
          </p>
          <div
            className="impact-story-act-nav"
            aria-label={lang === "zh" ? "故事章節" : "Story chapters"}
          >
            {acts.map((act, index) => (
              <button
                type="button"
                key={act.title}
                aria-label={`${index + 1}. ${act.title}`}
                aria-current={activeAct === index ? "step" : undefined}
                onClick={() => goToAct(index)}
              >
                <span>{index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <article className="impact-story-acts" id="impact-story">
        {acts.map((act, index) => (
          <section
            className={`impact-story-act${act.tone ? ` impact-story-act-${act.tone}` : ""}${act.image ? " impact-story-act-media" : ""}`}
            id={`impact-act-${index + 1}`}
            data-impact-act={index}
            tabIndex={-1}
            key={act.title}
          >
            <div className="shell">
              <header className="impact-story-act-head">
                <span className="impact-story-act-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="impact-story-eyebrow">{act.eyebrow}</p>
                  <h2>{act.title}</h2>
                  <p className="impact-story-act-intro">{act.intro}</p>
                </div>
              </header>

              <StoryPair act={act} />

              {act.quote && (
                <blockquote className="impact-story-quote">
                  <p>“{act.quote}”</p>
                  <cite>{act.quoteNote}</cite>
                </blockquote>
              )}

              {act.image && (
                <figure className="impact-story-image-break">
                  <img src={act.image} alt={act.imageAlt} />
                  <figcaption>{act.imageNote}</figcaption>
                </figure>
              )}

              {act.link && (
                <aside className="impact-story-context-link">
                  <strong>{act.link.eyebrow}</strong>
                  <p>{act.link.body}</p>
                  <Link to={act.link.to}>{act.link.label} →</Link>
                </aside>
              )}
            </div>
          </section>
        ))}
      </article>

      <section className="impact-story-closing">
        <div className="shell impact-story-closing-grid">
          <div>
            <p className="impact-story-eyebrow">{copy.closingEyebrow}</p>
            <h2>{copy.closingTitle}</h2>
          </div>
          <div className="impact-story-closing-copy">
            <p>{copy.closingBody}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
