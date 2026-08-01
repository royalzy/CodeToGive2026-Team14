import { useEffect, useState } from "react";

import {
  getAnalyticsReport,
  type AnalyticsReportResponse,
} from "../api/client";
import { PageHero, SectionHeading } from "../components/Cards";
import { analyticsDashboardUrl } from "../analytics/umami";

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
  const [report, setReport] = useState<AnalyticsReportResponse | null>(null);

  useEffect(() => {
    let active = true;
    getAnalyticsReport()
      .then((data) => {
        if (active) {
          setReport(data);
        }
      })
      .catch(() => {
        if (active) {
          setReport({
            configured: false,
            report: null,
            error: "The report service is unavailable right now.",
          });
        }
      });
    return () => {
      active = false;
    };
  }, []);

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
            eyebrow="Core metrics"
            title={`Analytics report · last ${report?.report?.period_days ?? 30} days`}
            body="Key numbers pulled from the Umami Cloud API on demand."
          />
          {!report ? (
            <div className="privacy-note" style={{ maxWidth: "600px", margin: "0 auto" }}>
              <strong>Loading report…</strong>
            </div>
          ) : !report.configured ? (
            <div className="privacy-note" style={{ maxWidth: "600px", margin: "0 auto" }}>
              <strong>Analytics reporting not configured</strong>
              <p>{report.error}</p>
            </div>
          ) : (
            <div className="metric-grid">
              <article className="metric-card accent-blue">
                <strong>{report.report!.pageviews.toLocaleString()}</strong>
                <h3>pageviews</h3>
              </article>
              <article className="metric-card accent-red">
                <strong>{report.report!.visitors.toLocaleString()}</strong>
                <h3>unique visitors</h3>
              </article>
              <article className="metric-card accent-yellow">
                <strong>{report.report!.visits.toLocaleString()}</strong>
                <h3>visits</h3>
              </article>
              <article className="metric-card accent-teal">
                <strong>{report.report!.bounce_rate}%</strong>
                <h3>bounce rate</h3>
              </article>
            </div>
          )}
          {report?.configured && report.report && (
            <div className="help-grid" style={{ marginTop: "1.5rem" }}>
              <article className="support-card">
                <p className="eyebrow">Top pages</p>
                <ul className="next-steps-list">
                  {report.report.top_pages.map((page) => (
                    <li key={page.path}>
                      {page.path} · {page.visitors} visitors
                    </li>
                  ))}
                </ul>
              </article>
              <article className="support-card">
                <p className="eyebrow">Top events</p>
                <ul className="next-steps-list">
                  {report.report.top_events.map((event) => (
                    <li key={event.name}>
                      {event.name} · {event.count}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          )}
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
          <SectionHeading
            eyebrow="Audience insights"
            title="Site analytics"
            body="Live visitor trends, referrers and conversion funnels from Umami."
          />
          {analyticsDashboardUrl ? (
            <iframe
              title="Umami analytics dashboard"
              src={analyticsDashboardUrl}
              style={{ width: "100%", height: "640px", border: 0, borderRadius: "12px" }}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="privacy-note" style={{ maxWidth: "600px", margin: "0 auto" }}>
              <strong>Analytics not configured</strong>
              <p>
                Set <code>VITE_UMAMI_DASHBOARD_URL</code> to the shareable Umami
                dashboard link to display live audience insights here.
              </p>
            </div>
          )}
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
