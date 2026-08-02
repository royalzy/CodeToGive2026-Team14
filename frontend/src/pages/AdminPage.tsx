import { useState } from "react";
import { Link } from "react-router-dom";

import { PageHero, SectionHeading } from "../components/Cards";
import { analyticsDashboardUrl } from "../analytics/umami";
import { PendingPosts } from "../components/admin/PendingPosts";
import { PostAnalytics } from "../components/admin/PostAnalytics";
import { SocialComposer } from "../components/admin/SocialComposer";

export function AdminPage() {
  // Bumped when a post is scheduled, so the pending list reloads.
  const [scheduleVersion, setScheduleVersion] = useState(0);

  return (
    <>
      {/* Wrapper only exists so the banner height can be trimmed without
          touching the shared .page-hero used by every other page. */}
      <div className="admin-hero">
        <PageHero
          eyebrow="Admin dashboard"
          title="Love 21 Admin"
          body="A demo overview of site activity, volunteer engagement and social media automation."
          tone="blue"
        />
      </div>

      <section className="section section-soft">
        <div className="shell admin-social">
          <SectionHeading
            eyebrow="Social media"
            title="Create a post"
            body={
              // \u00A0 keeps "at once." together if this ever wraps on a narrow screen
              "Upload an image, write a caption and publish to Instagram and Facebook Page at once."
            }
          />
          <SocialComposer onScheduled={() => setScheduleVersion((v) => v + 1)} />

          <PendingPosts refreshKey={scheduleVersion} />

          {/* Website posts are editable after publishing; the delete controls
              live on the Media page and only appear via this link. */}
          <p className="admin-manage-link">
            <Link to="/media?manage=1">Manage website posts</Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Posting activity"
            title="How much we are publishing"
            body="Posts created in each period, and how that compares with the one before."
          />
          <PostAnalytics />
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
