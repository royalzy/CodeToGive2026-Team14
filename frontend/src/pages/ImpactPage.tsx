import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useLanguage } from "../hooks/useLanguage";
import { usePretextLayout } from "../lib/usePretextLayout";
import "./ImpactPage.css";

type EvidenceScope = "crystal" | "service";

type StoryAct = {
  eyebrow: string;
  title: string;
  intro: string;
  crystalTitle: string;
  crystalBody: string;
  supportTitle: string;
  supportBody: string;
  crystalMetric: string;
  crystalEvidence: string;
  serviceMetric: string;
  serviceEvidence: string;
  evidenceNote: string;
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
      "Not in one leap. In a series of rooms where she could practise, perform, lead and keep learning. This is Crystal’s story in five moments, with the support and evidence kept clearly in view.",
    heroAction: "Read Crystal’s story",
    heroConsent:
      "Crystal’s story and quote are shared with the consent of Crystal and her family. This page separates her experience from wider programme totals.",
    heroCaption: "Crystal performing with the Love 21 community",
    nowReading: "Now reading",
    scopeLabel: "Choose evidence scope",
    crystalScope: "Crystal",
    serviceScope: "Wider service",
    evidenceLabel: "Evidence",
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
        crystalMetric: "Her words",
        crystalEvidence:
          "A consented reflection from Crystal and her family describes change in confidence, cheerfulness and motivation.",
        serviceMetric: "680+",
        serviceEvidence: "families supported across Love 21’s wider community.",
        evidenceNote:
          "Wider-service figures describe programme reach. They are not a claim about Crystal’s family experience.",
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
        crystalMetric: "3 skills",
        crystalEvidence:
          "Balance, coordination and thinking skills were strengthened through integrated sports sessions.",
        serviceMetric: "90+",
        serviceEvidence:
          "activity types are available across the wider Love 21 programme.",
        evidenceNote:
          "Crystal-specific evidence is descriptive; the service figure shows the wider range of opportunities.",
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
        crystalMetric: "Visible growth",
        crystalEvidence:
          "Increasing confidence, joy and maturity were observed across Crystal’s participation and performances.",
        serviceMetric: "900+",
        serviceEvidence: "activities run each month across Love 21’s wider service.",
        evidenceNote:
          "The programme total is not a count of Crystal’s attendance or a causal claim about her growth.",
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
        crystalMetric: "50 → 20",
        crystalEvidence:
          "50th dance session completed; a warm-up led for 20 members.",
        serviceMetric: "26",
        serviceEvidence:
          "members trained through Love 21’s 2023–24 employment work.",
        evidenceNote:
          "The employment figure describes a separate programme-wide pathway, not Crystal’s dance-assistant training.",
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
        crystalMetric: "Still learning",
        crystalEvidence:
          "Crystal’s story ends here on the page, not in life: confident, cheerful and motivated to keep learning.",
        serviceMetric: "6,000+",
        serviceEvidence:
          "employment hours and opportunities in 2023–24, alongside 120+ training hours for 26 members.",
        evidenceNote:
          "Source: Love 21 official 2023–24 employment data. Service-level totals only.",
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
      "Crystal-specific observations stay separate from programme-wide totals throughout this story. Open the evidence notes to see exactly what each number describes.",
    evidenceButton: "View evidence notes",
    sourcesLine:
      "Crystal’s story and quote: shared with Crystal and family consent. Service totals: Love 21 programme information and official 2023–24 employment data.",
    drawerTitle: "Evidence notes",
    drawerIntro:
      "Two kinds of evidence appear on this page. They are deliberately not blended.",
    closeDrawer: "Close evidence notes",
    sourceGroups: [
      {
        type: "Crystal’s story",
        title: "What belongs specifically to Crystal",
        body: "Integrated sports strengthened balance, coordination and thinking skills. Crystal embraced activities and performances with growing confidence, joy and maturity. Her love of dance led to selection and training as a dance assistant.",
      },
      {
        type: "Recorded moments",
        title: "Milestones shown in this story",
        body: "Crystal completed her 50th dance session and led a dance warm-up for 20 members. The quote is presented with Crystal and family consent without assigning it to an unidentified speaker.",
      },
      {
        type: "Wider service",
        title: "Programme-scale figures",
        body: "680+ families supported, 900+ monthly activities, 90+ activity types and 500+ volunteer hours each month describe Love 21’s wider work, not Crystal’s individual usage.",
      },
      {
        type: "Official 2023–24 data",
        title: "Employment and development",
        body: "Love 21 reports 26 members trained, 120+ training hours, and 6,000+ employment hours and opportunities. These totals describe the wider programme.",
      },
    ],
  },
  zh: {
    heroEyebrow: "每個時刻背後的同行",
    heroTitle: "Crystal，繼續向前。",
    heroBody:
      "成長不是一步登天，而是在一個又一個可以練習、演出、帶領和繼續學習的空間裡發生。這是 Crystal 的五個真實時刻，也讓支持和證據清楚可見。",
    heroAction: "閱讀 Crystal 的故事",
    heroConsent:
      "Crystal 的故事和引述經她與家人同意分享。本頁將她的個人經歷與整體服務數據分開呈現。",
    heroCaption: "Crystal 與 Love 21 社群一起演出",
    nowReading: "正在閱讀",
    scopeLabel: "選擇證據範圍",
    crystalScope: "Crystal",
    serviceScope: "整體服務",
    evidenceLabel: "證據",
    acts: [
      {
        eyebrow: "歸屬感先開始",
        title: "一個可以嘗試的空間。",
        intro: "在里程碑可以被記錄之前，先要有一個讓嘗試變得自然的地方。Crystal 帶著活力、自信和願意一試的態度走進來。",
        crystalTitle: "她一次又一次，以自己的方式出現。",
        crystalBody: "Crystal 充滿活力地參與活動，也願意嘗試。故事從她的主動開始，而不是把她描述成需要被修正的人。",
        supportTitle: "一個為參與而設的社群。",
        supportBody: "融合活動讓 Crystal 可以持續參與、建立熟悉感，並找到真正令她快樂的活動。",
        crystalMetric: "她的轉變",
        crystalEvidence: "經同意分享的回饋，描述 Crystal 在自信、開朗和學習動力上的轉變。",
        serviceMetric: "680+",
        serviceEvidence: "個家庭由 Love 21 整體社群支援。",
        evidenceNote: "整體服務數字只描述計劃覆蓋，不代表 Crystal 家庭的個別經歷。",
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
        crystalMetric: "3 種能力",
        crystalEvidence: "透過融合體育活動，平衡、協調和思考能力得到鍛鍊。",
        serviceMetric: "90+",
        serviceEvidence: "種活動由 Love 21 整體服務提供。",
        evidenceNote: "Crystal 的證據是描述性的；整體數字呈現更廣泛的活動選擇。",
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
        crystalMetric: "看得見的成長",
        crystalEvidence: "在 Crystal 的參與和演出中，可以看到自信、喜悅和成熟逐漸增加。",
        serviceMetric: "900+",
        serviceEvidence: "項活動每月在 Love 21 整體服務中舉行。",
        evidenceNote: "整體活動數不代表 Crystal 的出席次數，也不是對她成長的單一因果聲明。",
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
        crystalMetric: "50 → 20",
        crystalEvidence: "完成第 50 次舞蹈課堂；為 20 位會員帶領熱身。",
        serviceMetric: "26",
        serviceEvidence: "位會員在 Love 21 2023–24 年度就業項目中接受培訓。",
        evidenceNote: "26 位會員屬另一個整體就業項目數字，不是 Crystal 舞蹈助理培訓的人數。",
      },
      {
        eyebrow: "一個故事，更廣的工作",
        title: "更多人需要同樣的空間。",
        intro: "Crystal 的故事屬於她自己，不應被延伸成所有成果的證明。但它讓我們看見，持續活動、能力培養和承擔責任的道路，為何對更大的社群重要。",
        crystalTitle: "她把參與變成貢獻。",
        crystalBody: "Crystal 的道路經歷嘗試、練習、演出和帶領。這個次序屬於她，也仍然繼續向前。",
        supportTitle: "讓不同的成長可以持續。",
        supportBody: "Love 21 持續提供活動，並為會員建立從參與走向培訓和就業機會的道路。",
        crystalMetric: "繼續學習",
        crystalEvidence: "故事在頁面上結束，生活沒有：Crystal 更自信、更開朗，也有動力繼續學習。",
        serviceMetric: "6,000+",
        serviceEvidence: "個就業工時及機會，另有 120+ 培訓時數，惠及 26 位會員。",
        evidenceNote: "來源：Love 21 2023–24 官方就業數據，只代表整體服務。",
        link: { eyebrow: "持續支持有實際成本。", body: "捐款協助維持每月 900+ 項活動，以及更廣泛就業道路背後的培訓。", label: "支持這項工作", to: "/donate" },
        tone: "sky",
      },
    ] satisfies StoryAct[],
    closingEyebrow: "最後一幕",
    closingTitle: "里程碑很重要，之前的每一個空間也同樣重要。",
    closingBody: "整個故事都把 Crystal 的個人觀察與整體服務數字分開。打開證據說明，可以查看每一個數字實際描述的範圍。",
    evidenceButton: "查看證據說明",
    sourcesLine: "Crystal 的故事及引述經本人與家人同意分享；服務數字來自 Love 21 計劃資料及 2023–24 官方就業數據。",
    drawerTitle: "證據說明",
    drawerIntro: "本頁使用兩類證據，並刻意分開呈現。",
    closeDrawer: "關閉證據說明",
    sourceGroups: [
      { type: "Crystal 的故事", title: "只屬於 Crystal 的內容", body: "融合體育活動鍛鍊平衡、協調和思考能力。Crystal 以日漸增長的自信、喜悅和成熟參與活動及演出，並因熱愛舞蹈而獲選接受舞蹈助理培訓。" },
      { type: "已記錄時刻", title: "本故事中的里程碑", body: "Crystal 完成第 50 次舞蹈課堂，並為 20 位會員帶領舞蹈熱身。引述經 Crystal 與家人同意分享，沒有把說話者錯誤歸屬給未具名的人。" },
      { type: "整體服務", title: "計劃規模數字", body: "680+ 個受助家庭、每月 900+ 項活動、90+ 種活動和每月 500+ 義工時數，描述 Love 21 的整體工作，而不是 Crystal 的個人使用量。" },
      { type: "2023–24 官方數據", title: "就業及發展", body: "Love 21 報告 26 位會員接受培訓、120+ 培訓時數，以及 6,000+ 就業工時及機會；這些都是整體項目數字。" },
    ],
  },
} as const;

function StoryPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="impact-story-panel">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export function ImpactPage() {
  const { lang } = useLanguage();
  const copy = storyCopy[lang];
  const acts = copy.acts as readonly StoryAct[];
  const [scope, setScope] = useState<EvidenceScope>("crystal");
  const [activeAct, setActiveAct] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const evidenceTriggerRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = evidenceTriggerRef.current;
    document.body.style.overflow = "hidden";
    drawerCloseRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [drawerOpen]);

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

      <nav className="impact-story-tools" aria-label={copy.scopeLabel}>
        <div className="shell impact-story-tools-inner">
          <p className="impact-story-progress-label" aria-live="polite">
            <span>{copy.nowReading}</span>
            {acts[activeAct].title}
          </p>
          <div className="impact-story-act-nav" aria-label="Story chapters">
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
          <div className="impact-story-scope" role="group" aria-label={copy.scopeLabel}>
            <button
              type="button"
              aria-pressed={scope === "crystal"}
              onClick={() => setScope("crystal")}
            >
              {copy.crystalScope}
            </button>
            <button
              type="button"
              aria-pressed={scope === "service"}
              onClick={() => setScope("service")}
            >
              {copy.serviceScope}
            </button>
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

              <div className="impact-story-triptych">
                <StoryPanel title={act.crystalTitle} body={act.crystalBody} />
                <StoryPanel title={act.supportTitle} body={act.supportBody} />
                <div className="impact-story-panel impact-story-evidence">
                  <p className="impact-story-evidence-label">
                    {copy.evidenceLabel}
                  </p>
                  <strong className="impact-story-metric">
                    {scope === "crystal" ? act.crystalMetric : act.serviceMetric}
                  </strong>
                  <p>
                    {scope === "crystal"
                      ? act.crystalEvidence
                      : act.serviceEvidence}
                  </p>
                  <small>{act.evidenceNote}</small>
                </div>
              </div>

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
            <button
              type="button"
              ref={evidenceTriggerRef}
              aria-expanded={drawerOpen}
              aria-controls="impact-evidence-drawer"
              onClick={() => setDrawerOpen(true)}
            >
              {copy.evidenceButton} <span aria-hidden="true">＋</span>
            </button>
            <p className="impact-story-source-line">{copy.sourcesLine}</p>
          </div>
        </div>
      </section>

      <div
        className={`impact-story-drawer-backdrop${drawerOpen ? " is-open" : ""}`}
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className={`impact-story-drawer${drawerOpen ? " is-open" : ""}`}
        id="impact-evidence-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="impact-evidence-title"
        aria-hidden={!drawerOpen}
      >
        <div className="impact-story-drawer-head">
          <h2 id="impact-evidence-title">{copy.drawerTitle}</h2>
          <button
            type="button"
            ref={drawerCloseRef}
            aria-label={copy.closeDrawer}
            onClick={() => setDrawerOpen(false)}
          >
            ×
          </button>
        </div>
        <p className="impact-story-drawer-intro">{copy.drawerIntro}</p>
        {copy.sourceGroups.map((group) => (
          <section className="impact-story-source-group" key={group.title}>
            <span>{group.type}</span>
            <h3>{group.title}</h3>
            <p>{group.body}</p>
          </section>
        ))}
      </aside>
    </div>
  );
}
