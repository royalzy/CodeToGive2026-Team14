import { PageHero, SectionHeading } from "../components/Cards";

const adminMetrics = [
  { value: "1,234", label: "visitors this month", accent: "blue" as const },
  { value: "45", label: "volunteer sign-ups", accent: "red" as const },
  { value: "23", label: "donation intents", accent: "yellow" as const },
  { value: "8", label: "social posts scheduled", accent: "teal" as const },
];

const scheduledPosts = [
  { date: "10 Aug 2025", platform: "Facebook", content: "Crystal completed her 50th dance session! 🎉 #SoMuchAbility" },
  { date: "12 Aug 2025", platform: "LinkedIn", content: "Join our community performance showcase. 60+ members on stage." },
  { date: "15 Aug 2025", platform: "Instagram", content: "Behind the scenes: nutrition workshop with Chef Ka Wai 👨‍🍳" },
];

export function AdminPage() {
  return (
    <>
      <PageHero
        eyebrow="Admin dashboard"
        title="Love 21 Admin"
        body="A demo overview of site activity, volunteer engagement and social media automation."
        tone="blue"
      />

      <section className="section">
        <div className="shell">
          <div className="metric-grid">
            {adminMetrics.map((metric) => (
              <article key={metric.label} className={`metric-card accent-${metric.accent}`}>
                <strong>{metric.value}</strong>
                <h3>{metric.label}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <SectionHeading
            eyebrow="Automation preview"
            title="Scheduled social posts"
            body="In a live service, achievements and events would be automatically drafted for review and posting."
          />
          <div className="help-grid">
            {scheduledPosts.map((post) => (
              <article key={post.content} className="support-card">
                <p className="eyebrow">{post.date} · {post.platform}</p>
                <p>{post.content}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="privacy-note" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <strong>Demo dashboard</strong>
            <p>
              This page demonstrates the concept of an admin dashboard. Real data
              would come from analytics, CMS and CRM integrations.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
