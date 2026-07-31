import { PageHero, SectionHeading } from "../components/Cards";

const resourceCategories = [
  {
    title: "Understanding neurodiversity",
    badge: "Foundations",
    body: "A beginner-friendly guide to different ways people experience the world, communicate and learn.",
  },
  {
    title: "Inclusion tips for everyday life",
    badge: "Practical",
    body: "Simple ways to create calm, welcoming spaces at home, school and in the community.",
  },
  {
    title: "Celebrating strengths",
    badge: "Stories",
    body: "Explore how abilities grow through confidence, routine, curiosity and joyful participation.",
  },
] as const;

const learningCards = [
  {
    title: "Building confidence",
    category: "Growth",
    body: "Small, steady experiences can build independence, participation and self-belief over time.",
  },
  {
    title: "Communication that works",
    category: "Support",
    body: "Helpful ways to listen, pause, show choice and make space for different communication styles.",
  },
  {
    title: "Finding belonging",
    category: "Community",
    body: "Real connection comes from shared routines, warm welcome and opportunities to contribute.",
  },
] as const;

const faqs = [
  {
    question: "Who can access these resources?",
    answer: "These materials are designed for families, carers, volunteers and community members who want a welcoming starting point.",
  },
  {
    question: "Are the resources suitable for beginners?",
    answer: "Yes. They are written in plain language and can be revisited whenever you need reassurance or ideas.",
  },
  {
    question: "How can I learn more?",
    answer: "You can connect with Love 21 through the help page, volunteer page or by exploring our programmes.",
  },
] as const;

export function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Learning for belonging"
        title="Learning for belonging"
        body="Education is one of the most powerful ways to build confidence, empathy and community."
        tone="blue"
      />

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Explore the topics"
            title="Resources shaped for real life"
            body="The content here supports families, volunteers and supporters who want to learn, connect and contribute with care."
          />
          <div className="resource-category-grid">
            {resourceCategories.map((topic) => (
              <article key={topic.title} className="resource-card">
                <p className="resource-badge">{topic.badge}</p>
                <h3>{topic.title}</h3>
                <p>{topic.body}</p>
              </article>
            ))}
          </div>

          <div className="resource-card-stack">
            {learningCards.map((card) => (
              <article key={card.title} className="resource-highlight">
                <p className="resource-badge">{card.category}</p>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <SectionHeading
            eyebrow="Common questions"
            title="Helpful answers at a glance"
            body="A brief starting point for families and visitors who want to understand what support can look like."
          />
          <div className="faq-list">
            {faqs.map((faq) => (
              <article key={faq.question} className="faq-card">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
