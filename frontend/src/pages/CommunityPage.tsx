import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

import {
  communityPartners,
  donorCommunityCopy,
  donorWallPosts,
  supporterFaces,
} from "../content/donorCommunity";
import { useLanguage } from "../hooks/useLanguage";
import { usePretextLayout } from "../lib/usePretextLayout";

export function CommunityPage() {
  const { lang } = useLanguage();
  const copy = donorCommunityCopy[lang];
  const titleText = `${copy.heroLead} ${copy.heroEmphasis}`;
  const titleRef = usePretextLayout<HTMLHeadingElement>(titleText);
  const bodyRef = usePretextLayout<HTMLParagraphElement>(copy.heroBody);

  return (
    <div className="donor-community-page">
      <section className="donor-community-hero">
        <div className="donor-community-hero-copy">
          <p className="donor-community-eyebrow">{copy.eyebrow}</p>
          <h1 ref={titleRef}>
            {copy.heroLead} <em>{copy.heroEmphasis}</em>
          </h1>
          <p ref={bodyRef} className="donor-community-dek">
            {copy.heroBody}
          </p>
          <dl className="donor-community-counts">
            <div><dt>1,284</dt><dd>{lang === "zh" ? "位支持者" : "supporters"}</dd></div>
            <div><dt>10</dt><dd>{lang === "zh" ? "家合作機構" : "partner organisations"}</dd></div>
            <div><dt>6 yrs</dt><dd>{lang === "zh" ? "持續同行" : "of showing up"}</dd></div>
          </dl>
          <blockquote>{copy.heroQuote}</blockquote>
          <div className="donor-community-actions">
            <Link className="donor-community-button donor-community-button-primary" to="/donate">{copy.join}</Link>
            <a className="donor-community-button" href="#supporters">{copy.meet}</a>
          </div>
        </div>

        <div className="donor-community-constellation" aria-label="Supporter constellation">
          <span className="donor-community-orbit" aria-hidden="true" />
          <span className="donor-community-orbit donor-community-orbit-inner" aria-hidden="true" />
          <div className="donor-community-core"><strong>1,284</strong><span>people, one promise</span></div>
          {supporterFaces.slice(0, 10).map(([name, color], index) => (
            <span
              className={`donor-community-orbit-avatar donor-community-orbit-avatar-${index + 1}`}
              key={`${name}-${index}`}
              style={{ "--supporter-color": color } as CSSProperties}
              title={name}
            >
              {name.slice(0, 2)}
            </span>
          ))}
        </div>
      </section>

      <section className="donor-community-mosaic-band" id="supporters">
        <div className="donor-community-section">
          <div className="donor-community-section-heading">
            <div><p className="donor-community-eyebrow">{copy.supportersEyebrow}</p><h2>{copy.supportersTitle}</h2></div>
            <p>{copy.supportersBody}</p>
          </div>
          <ul className="donor-community-face-grid" aria-label="Supporter mosaic">
            {supporterFaces.map(([name, color], index) => (
              <li key={`${name}-${index}`} style={{ "--supporter-color": color } as CSSProperties}>
                <span aria-hidden="true">{name.slice(0, 2)}</span><span className="sr-only">{name}</span>
              </li>
            ))}
          </ul>
          <p className="donor-community-mosaic-note">No amounts. No rankings. Every circle is equal.</p>
        </div>
      </section>

      <section className="donor-community-section donor-community-partners-section">
        <div className="donor-community-section-heading">
          <div><p className="donor-community-eyebrow">{copy.partnersEyebrow}</p><h2>{copy.partnersTitle}</h2></div>
        </div>
        <ul className="donor-community-partner-grid">
          {communityPartners.map(([name, role]) => <li key={name}><span>{name}</span><small>{role}</small></li>)}
        </ul>
      </section>

      <section className="donor-community-wall-section">
        <div className="donor-community-section donor-community-wall-layout">
          <div className="donor-community-wall-intro">
            <p className="donor-community-eyebrow">{copy.wallEyebrow}</p>
            <h2>{copy.wallTitle}</h2>
            <p>{copy.wallBody}</p>
            <div className="donor-community-moderation-note"><strong>Public after review</strong><span>Report controls and privacy checks protect the whole community.</span></div>
          </div>
          <div className="donor-community-wall" aria-live="polite">
            {donorWallPosts.map((post) => (
              <article className={post.status === "pending" ? "pending" : undefined} key={`${post.name}-${post.time}`}>
                <span className="donor-community-post-avatar" aria-hidden="true">{post.name.slice(0, 2)}</span>
                <div><strong>{post.name} {lang === "zh" ? "加入了大家庭" : "joined the family"}</strong><p>“{post.message}”</p></div>
                <div className="donor-community-post-meta"><time>{post.time}</time>{post.status === "pending" && <span>{copy.pending}</span>}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="donor-community-section donor-community-thanks">
        <figure><img src="/images/community-performance.jpg" alt="Love 21 members performing together in the community" /></figure>
        <div>
          <p className="donor-community-eyebrow">{copy.thanksEyebrow}</p>
          <h2>{copy.thanksTitle}</h2>
          <p>{copy.thanksBody}</p>
          <p className="donor-community-signature">Jeff Rotmeyer · Founder & CEO, Love 21 Foundation</p>
          <Link className="donor-community-button donor-community-button-primary" to="/donate">Make a donation</Link>
        </div>
      </section>
    </div>
  );
}
