import { useEffect } from "react";
import { Link } from "react-router-dom";

import { SectionHeading } from "../components/Cards";
import { VolunteerHero } from "../components/volunteer/VolunteerHero";
import { VolunteerNewsletterSignup } from "../components/volunteer/VolunteerNewsletterSignup";
import { VolunteerOtherWaysToHelp } from "../components/volunteer/VolunteerOtherWaysToHelp";
import { VolunteerProgramBento } from "../components/volunteer/VolunteerProgramBento";
import { VolunteerTestimonialMarquee } from "../components/volunteer/VolunteerTestimonialMarquee";
import { programs } from "../content/programs";
import { volunteerTestimonials } from "../content/volunteer";
import { useLanguage } from "../hooks/useLanguage";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";
import { localizeDeep } from "../lib/zhConvert";

const PROGRAMME_TITLES = programs.map((program) => program.title);

const volunteerPageCopy = {
  en: {
    entryEyebrow: "Choose your way in",
    entryTitle: "Not sure where to start?",
    entryBody:
      "Take the quiz for a fun, personalised starting point, or skip straight to browsing every role yourself.",
    quizTitle: "Find out which type of volunteer you are",
    quizBody: "Take our 1 minute quiz and discover the role that was made for you.",
    findOut: "Find out",
    browseAllRoles: "Browse all roles",
    programmeEyebrow: "Five programmes, endless ways to help",
    programmeTitle: "Find the programme that fits you.",
    programmeBody:
      "Every programme welcomes assistants, leaders and event helpers. Pick the one that speaks to you to see its roles in full.",
    testimonialEyebrow: "From our volunteers",
    testimonialTitle: "Why they keep coming back",
    closingEyebrow: "Still deciding between roles?",
    closingTitle: "Try the guided match, or explore every role.",
    guidedMatchLink: "Answer a few questions for a suggestion",
    compareRolesLink: "Compare every role side by side",
    newsletterTitle: "Prefer to hear from us by email?",
  },
  zh: {
    entryEyebrow: "選擇你的入門方式",
    entryTitle: "不確定從何開始？",
    entryBody: "做個小測驗，找到有趣又個人化的起點；或直接瀏覽所有角色。",
    quizTitle: "了解你適合哪種義工類型",
    quizBody: "花一分鐘做小測驗，找到專屬於你的角色。",
    findOut: "立即了解",
    browseAllRoles: "瀏覽所有角色",
    programmeEyebrow: "五個計劃，無數參與方式",
    programmeTitle: "找到適合你的計劃。",
    programmeBody: "每個計劃都歡迎助理、領隊和活動幫手。選擇你感興趣的計劃，看看完整的角色。",
    testimonialEyebrow: "來自義工的心聲",
    testimonialTitle: "他們為何一再回來",
    closingEyebrow: "還在角色之間猶豫？",
    closingTitle: "試試導引配對，或瀏覽所有角色。",
    guidedMatchLink: "回答幾條問題獲得建議",
    compareRolesLink: "並排比較所有角色",
    newsletterTitle: "想透過電郵收到我們的消息？",
  },
} as const;

function VolunteerProgramMarquee() {
  return (
    <div className="home-marquee volunteer-program-marquee" aria-hidden="true">
      <div>
        {[0, 1].flatMap((repeat) =>
          PROGRAMME_TITLES.flatMap((title) => [
            <span key={`${repeat}-${title}`}>{title}</span>,
            <b key={`${repeat}-${title}-dot`}>•</b>,
          ]),
        )}
      </div>
    </div>
  );
}

export function VolunteerPage() {
  const { lang } = useLanguage();
  const copy = localizeDeep(volunteerPageCopy[lang === "en" ? "en" : "zh"], lang);

  useEffect(() => {
    trackVolunteerEvent("volunteer_page_viewed");
  }, []);

  return (
    <div className="volunteer-page">
      <VolunteerHero />
      <VolunteerProgramMarquee />

      <section
        className="section volunteer-entry-section volunteer-hero-reveal"
        id="volunteer-entry"
      >
        <div className="shell">
          <SectionHeading
            eyebrow={copy.entryEyebrow}
            title={copy.entryTitle}
            body={copy.entryBody}
          />
          <div className="volunteer-path-grid volunteer-path-grid-single">
            <article className="volunteer-path-card volunteer-path-quiz">
              <img
                className="volunteer-path-quiz-image"
                src="/images/quiz-cta-girl.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <div className="volunteer-path-quiz-content">
                <h2>{copy.quizTitle}</h2>
                <br></br>
                <p>{copy.quizBody}</p>
                <div className="volunteer-inline-actions">
                  <Link className="button button-quiz-highlight" to="/volunteer/match">
                    {copy.findOut}{" "}
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link className="button button-outline" to="/volunteer/roles">
                    {copy.browseAllRoles}
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section volunteer-programme-fit-section">
        <div className="shell">
          <SectionHeading
            eyebrow={copy.programmeEyebrow}
            title={copy.programmeTitle}
            body={copy.programmeBody}
          />
          <VolunteerProgramBento />
        </div>
      </section>

      <section className="section volunteer-testimonial-section">
        <div className="shell">
          <SectionHeading
            eyebrow={copy.testimonialEyebrow}
            title={copy.testimonialTitle}
          />
          <VolunteerTestimonialMarquee testimonials={volunteerTestimonials} />
        </div>
      </section>

      <section className="section section-soft volunteer-ways-section">
        <div className="shell">
          <VolunteerOtherWaysToHelp />
        </div>
      </section>

      <section className="section volunteer-closing-section">
        <div className="shell volunteer-alternatives-panel">
          <div>
            <p className="eyebrow">{copy.closingEyebrow}</p>
            <h3>{copy.closingTitle}</h3>
            <div className="volunteer-alternative-links">
              <Link className="text-link" to="/volunteer/match">
                {copy.guidedMatchLink} <span aria-hidden="true">→</span>
              </Link>
              <Link className="text-link" to="/volunteer/roles">
                {copy.compareRolesLink} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <VolunteerNewsletterSignup
            source="volunteer_landing"
            title={copy.newsletterTitle}
          />
        </div>
      </section>
    </div>
  );
}
