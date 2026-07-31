import { Link } from "react-router-dom";

import { PageHero, SectionHeading } from "../components/Cards";

const supportOptions = [
  {
    title: "Book a support conversation",
    body: "Parents and carers can request a time to talk through concerns, next steps and available services.",
  },
  {
    title: "Find practical help",
    body: "Explore guidance on routines, communication, transitions and family wellbeing in a welcoming space.",
  },
  {
    title: "Join the community",
    body: "Meet other families, share wins and learn from peers who understand the everyday rhythm of support.",
  },
] as const;

const steps = [
  "Tell us what kind of support feels useful right now.",
  "We will connect you with the right programme, service or conversation.",
  "You can keep building confidence at your own pace and with your own rhythm.",
] as const;

export function HelpPage() {
  return (
    <>
      <PageHero
        eyebrow="Support for families and carers"
        title="Support for families and carers"
        body="Love 21 offers practical guidance, warm connection and a clear path to support for parents, carers and families."
        tone="red"
      />

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="You are not alone"
            title="Ways we can help"
            body="Support is available in plain language, with space for questions, care and steady next steps."
          />
          <div className="help-grid">
            {supportOptions.map((option) => (
              <article key={option.title} className="support-card">
                <h3>{option.title}</h3>
                <p>{option.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell help-layout">
          <div>
            <SectionHeading
              eyebrow="Start here"
              title="A clear first step"
              body="Every family deserves a simple place to begin, ask questions and feel welcomed."
            />
            <ol className="resource-list">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <aside className="support-panel">
            <p className="eyebrow">Need a gentle next step?</p>
            <h3>Explore volunteering or learning resources</h3>
            <p>
              You can discover new ways to belong, support the community and grow alongside members.
            </p>
            <div className="button-row">
              <Link className="button button-dark" to="/volunteer">
                Explore volunteering
              </Link>
              <Link className="button button-outline" to="/resources">
                Browse resources
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
