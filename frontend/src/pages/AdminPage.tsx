import { useState } from "react";
import { Link } from "react-router-dom";

import { PageHero, SectionHeading } from "../components/Cards";
import { analyticsDashboardUrl } from "../analytics/umami";
import { LiveMetrics } from "../components/admin/LiveMetrics";
import { PendingPosts } from "../components/admin/PendingPosts";
import { PostAnalytics } from "../components/admin/PostAnalytics";
import { SocialComposer } from "../components/admin/SocialComposer";
import { useLanguage } from "../hooks/useLanguage";
import { localizeDeep } from "../lib/zhConvert";

export function AdminPage() {
  const { lang } = useLanguage();
  // Bumped when a post is scheduled, so the pending list reloads.
  const [scheduleVersion, setScheduleVersion] = useState(0);

  return (
    <>
      {/* Wrapper only exists so the banner height can be trimmed without
          touching the shared .page-hero used by every other page. */}
      <div className="admin-hero">
        <PageHero
          eyebrow={lang === "en" ? "Admin dashboard" : localizeDeep("管理後台", lang)}
          title="Love 21 Admin"
          body={
            lang === "en"
              ? "A demo overview of site activity, volunteer engagement and social media automation."
              : localizeDeep("展示網站活動、義工參與和社交媒體自動發布的概覽。", lang)
          }
          tone="blue"
        />
      </div>

      <section className="section section-soft">
        <div className="shell admin-social">
          <SectionHeading
            eyebrow={lang === "en" ? "Social media" : localizeDeep("社交媒體", lang)}
            title={lang === "en" ? "Create a post" : localizeDeep("建立貼文", lang)}
            body={
              lang === "en"
                ? //   keeps "at once." together if this ever wraps on a narrow screen
                  "Upload an image, write a caption and publish to Instagram and Facebook Page at once."
                : localizeDeep("上傳圖片、撰寫說明，一次過發佈到 Instagram 和 Facebook 專頁。", lang)
            }
          />
          <SocialComposer onScheduled={() => setScheduleVersion((v) => v + 1)} />

          <PendingPosts refreshKey={scheduleVersion} />

          {/* Website posts are editable after publishing; the delete controls
              live on the Media page and only appear via this link. */}
          <p className="admin-manage-link">
            <Link to="/media?manage=1">
              {lang === "en" ? "Manage website posts" : localizeDeep("管理網站貼文", lang)}
            </Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow={lang === "en" ? "Posting activity" : localizeDeep("發佈活動", lang)}
            title={lang === "en" ? "How much we are publishing" : localizeDeep("我們的發佈量", lang)}
            body={
              lang === "en"
                ? "Posts created in each period, and how that compares with the one before."
                : localizeDeep("每個時段新增的貼文，以及與上一時段的比較。", lang)
            }
          />
          <PostAnalytics />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow={lang === "en" ? "Platform activity" : localizeDeep("平台活動", lang)}
            title={lang === "en" ? "Live backend metrics" : localizeDeep("即時後台數據", lang)}
            body={
              lang === "en"
                ? "Counts straight from the API: myth-check answers, donation intents, donor wall messages and help enquiries."
                : localizeDeep("直接來自 API 的統計：迷思問答、捐款意向、捐款人留言牆訊息和求助查詢。", lang)
            }
          />
          <LiveMetrics />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow={lang === "en" ? "Audience insights" : localizeDeep("受眾洞察", lang)}
            title={lang === "en" ? "Site analytics" : localizeDeep("網站分析", lang)}
            body={
              lang === "en"
                ? "Live visitor trends, referrers and conversion funnels from Umami."
                : localizeDeep("來自 Umami 的即時訪客趨勢、來源和轉換漏斗。", lang)
            }
          />
          {analyticsDashboardUrl ? (
            <iframe
              title={lang === "en" ? "Umami analytics dashboard" : localizeDeep("Umami 分析後台", lang)}
              src={analyticsDashboardUrl}
              style={{ width: "100%", height: "640px", border: 0, borderRadius: "12px" }}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="privacy-note" style={{ maxWidth: "600px", margin: "0 auto" }}>
              <strong>{lang === "en" ? "Analytics not configured" : localizeDeep("尚未設定分析功能", lang)}</strong>
              <p>
                {lang === "en" ? (
                  <>
                    Set <code>VITE_UMAMI_DASHBOARD_URL</code> to the shareable Umami
                    dashboard link to display live audience insights here.
                  </>
                ) : (
                  <>
                    {localizeDeep("請將", lang)} <code>VITE_UMAMI_DASHBOARD_URL</code>{" "}
                    {localizeDeep("設定為可分享的 Umami 後台連結，即可在此顯示即時受眾洞察。", lang)}
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="privacy-note" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <strong>{lang === "en" ? "Demo dashboard" : localizeDeep("示範後台", lang)}</strong>
            <p>
              {lang === "en"
                ? "This page demonstrates the concept of an admin dashboard. Real data would come from analytics, CMS and CRM integrations."
                : localizeDeep("此頁面示範管理後台的概念。實際數據將來自分析、內容管理系統和客戶關係管理系統的整合。", lang)}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
