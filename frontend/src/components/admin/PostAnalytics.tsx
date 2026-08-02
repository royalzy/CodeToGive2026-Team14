/**
 * Posting activity at a glance.
 *
 * Website figures are counted for real from `media-posts.json`, which records
 * every post published to the site from this dashboard. Instagram and Facebook
 * are hardcoded: publishing to them leaves no local record, and reading true
 * totals would mean querying Meta, which would also count posts made directly
 * from the Instagram app rather than from here.
 */

import mediaPosts from "../../content/media-posts.json";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

interface MediaPostRecord {
  published_at: string;
}

const posts = mediaPosts as MediaPostRecord[];

const DAY_MS = 24 * 60 * 60 * 1000;

interface PeriodSpec {
  labelEn: string;
  labelZh: string;
  changeLabel: string;
  /** Length of the window, used for both the current and previous period. */
  windowMs: number;
  /** Hardcoded counts: [current period, previous period]. */
  instagram: [number, number];
  facebook: [number, number];
}

const PERIODS: PeriodSpec[] = [
  { labelEn: "Today", labelZh: "今日", changeLabel: "DoD", windowMs: DAY_MS, instagram: [1, 2], facebook: [1, 1] },
  { labelEn: "This week", labelZh: "本週", changeLabel: "WoW", windowMs: 7 * DAY_MS, instagram: [7, 6], facebook: [6, 5] },
  { labelEn: "This month", labelZh: "本月", changeLabel: "MoM", windowMs: 30 * DAY_MS, instagram: [26, 31], facebook: [22, 24] },
  { labelEn: "This year", labelZh: "本年", changeLabel: "YoY", windowMs: 365 * DAY_MS, instagram: [218, 150], facebook: [184, 126] },
];

/** Website posts whose timestamp falls in [now - windowMs*offset, now - windowMs*(offset-1)). */
function countWebsite(windowMs: number, offset: number, now: number): number {
  const end = now - windowMs * (offset - 1);
  const start = now - windowMs * offset;
  return posts.filter((post) => {
    const at = new Date(post.published_at).getTime();
    return !Number.isNaN(at) && at >= start && at < end;
  }).length;
}

function Change({
  current,
  previous,
  label,
}: {
  current: number;
  previous: number;
  label: string;
}) {
  // No baseline to compare against, so show nothing rather than a fake 100%.
  if (previous === 0) {
    return (
      <span className="post-analytics-change is-flat">
        — <span className="post-analytics-period">{label}</span>
      </span>
    );
  }

  const percent = ((current - previous) / previous) * 100;
  const up = percent >= 0;
  return (
    <span className={`post-analytics-change ${up ? "is-up" : "is-down"}`}>
      <span aria-hidden="true">{up ? "▲" : "▼"}</span>
      {/* The arrow and colour carry the sign, so the number stays clean. */}
      {Math.abs(percent).toFixed(1)}% <span className="post-analytics-period">{label}</span>
    </span>
  );
}

export function PostAnalytics() {
  const { lang } = useLanguage();
  const now = Date.now();

  return (
    <div className="post-analytics">
      <div className="post-analytics-grid">
        {PERIODS.map((period) => {
          const website = countWebsite(period.windowMs, 1, now);
          const websitePrev = countWebsite(period.windowMs, 2, now);

          const total = website + period.instagram[0] + period.facebook[0];
          const totalPrev = websitePrev + period.instagram[1] + period.facebook[1];

          const label =
            lang === "en" ? period.labelEn : localizeDeep(period.labelZh, lang);

          return (
            <article key={period.labelEn} className="post-analytics-card">
              <p className="post-analytics-label">{label}</p>
              <strong className="post-analytics-total">{total}</strong>
              <Change current={total} previous={totalPrev} label={period.changeLabel} />

              <dl className="post-analytics-breakdown">
                <div>
                  <dt>{lang === "en" ? "Website" : localizeDeep("網站", lang)}</dt>
                  <dd>{website}</dd>
                </div>
                <div>
                  <dt>Instagram</dt>
                  <dd>{period.instagram[0]}</dd>
                </div>
                <div>
                  <dt>Facebook</dt>
                  <dd>{period.facebook[0]}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </div>
  );
}
