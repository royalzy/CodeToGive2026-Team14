import { useEffect, useRef, useState } from "react";
import { useEffect, useState, type CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { Link } from "react-router-dom";

import {
  communityPartners,
  donorCommunityCopy,
  donorWallPosts,
  supporterFaces,
} from "../content/donorCommunity";
import {
  ApiError,
  getMyDonorWallPosts,
  type DonorWallPost,
} from "../api/client";
import { useLanguage } from "../hooks/useLanguage";
import { usePretextLayout } from "../lib/usePretextLayout";

const BUBBLE_REPEL_RADIUS = 120;
const BUBBLE_REPEL_MAX_PUSH = 40;

export function CommunityPage() {
  const { lang } = useLanguage();
  const copy = donorCommunityCopy[lang];
  const titleText = `${copy.heroLead} ${copy.heroEmphasis}`;
  const titleRef = usePretextLayout<HTMLHeadingElement>(titleText);
  const bodyRef = usePretextLayout<HTMLParagraphElement>(copy.heroBody);
  const [privatePosts, setPrivatePosts] = useState<DonorWallPost[]>([]);
  const [wallNotice, setWallNotice] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getMyDonorWallPosts()
      .then((posts) => {
        if (!controller.signal.aborted) setPrivatePosts(posts);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (!(error instanceof ApiError && error.status === 401)) {
          setWallNotice("Your private wall previews could not be loaded just now.");
        }
      });
    return () => controller.abort();
  }, []);

  const bubbleRefs = useRef<(HTMLLIElement | null)[]>([]);
  const bubbleRafRef = useRef<number | null>(null);
  const [bubbleOffsets, setBubbleOffsets] = useState<{ x: number; y: number }[]>(
    () => supporterFaces.map(() => ({ x: 0, y: 0 })),
  );

  useEffect(() => {
    return () => {
      if (bubbleRafRef.current !== null) cancelAnimationFrame(bubbleRafRef.current);
    };
  }, []);

  const handleBubbleGridMouseMove = (event: ReactMouseEvent<HTMLUListElement>) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    if (bubbleRafRef.current !== null) cancelAnimationFrame(bubbleRafRef.current);
    bubbleRafRef.current = requestAnimationFrame(() => {
      setBubbleOffsets(
        bubbleRefs.current.map((el) => {
          if (!el) return { x: 0, y: 0 };
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dx = centerX - mouseX;
          const dy = centerY - mouseY;
          const distance = Math.hypot(dx, dy);
          if (distance === 0 || distance >= BUBBLE_REPEL_RADIUS) return { x: 0, y: 0 };
          const push = BUBBLE_REPEL_MAX_PUSH * (1 - distance / BUBBLE_REPEL_RADIUS);
          return { x: (dx / distance) * push, y: (dy / distance) * push };
        }),
      );
    });
  };

  const handleBubbleGridMouseLeave = () => {
    if (bubbleRafRef.current !== null) cancelAnimationFrame(bubbleRafRef.current);
    setBubbleOffsets(supporterFaces.map(() => ({ x: 0, y: 0 })));
  };

  return (
    <div className="donor-community-page">
      <section className="donor-community-hero-section">
        <div className="donor-community-hero">
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
              <div><dt>6</dt><dd>{lang === "zh" ? "持續同行" : "yrs of showing up"}</dd></div>
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
        </div>
      </section>

      <section className="donor-community-mosaic-band" id="supporters">
        <div className="donor-community-section">
          <p className="donor-community-eyebrow donor-community-mosaic-title">{copy.supportersEyebrow}</p>
          <ul
            className="donor-community-face-grid"
            aria-label="Supporter mosaic"
            onMouseMove={handleBubbleGridMouseMove}
            onMouseLeave={handleBubbleGridMouseLeave}
          >
            {supporterFaces.map(([name, color], index) => (
              <li
                key={`${name}-${index}`}
                ref={(el) => { bubbleRefs.current[index] = el; }}
                style={{
                  "--supporter-color": color,
                  "--hover-x": `${bubbleOffsets[index]?.x ?? 0}px`,
                  "--hover-y": `${bubbleOffsets[index]?.y ?? 0}px`,
                } as CSSProperties}
              >
                <span aria-hidden="true">{name.slice(0, 2)}</span><span className="sr-only">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="donor-community-partners-section">
        <div className="donor-community-section">
          <div className="donor-community-section-heading">
            <div><p className="donor-community-eyebrow">{copy.partnersEyebrow}</p><h2>{copy.partnersTitle}</h2></div>
          </div>
          <div className="donor-community-partner-marquee">
            <ul className="donor-community-partner-grid">
              {communityPartners.map(([name, role]) => <li key={name}><span>{name}</span><small>{role}</small></li>)}
              {communityPartners.map(([name, role]) => <li key={`${name}-dup`} aria-hidden="true"><span>{name}</span><small>{role}</small></li>)}
            </ul>
          </div>
        </div>
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
            {wallNotice && <div className="form-alert form-notice" role="status">{wallNotice}</div>}
            {privatePosts.map((post) => (
              <article className="pending" key={post.id}>
                <span className="donor-community-post-avatar" aria-hidden="true">{post.nickname.slice(0, 2)}</span>
                <div><strong>{post.nickname} {lang === "zh" ? "加入了大家庭" : "joined the family"}</strong>{post.message && <p>“{post.message}”</p>}</div>
                <div className="donor-community-post-meta"><time>Just now</time><span>{copy.pending}</span></div>
              </article>
            ))}
            {donorWallPosts.map((post) => (
              <article key={`${post.name}-${post.time}`}>
                <span className="donor-community-post-avatar" aria-hidden="true">{post.name.slice(0, 2)}</span>
                <div><strong>{post.name} {lang === "zh" ? "加入了大家庭" : "joined the family"}</strong><p>“{post.message}”</p></div>
                <div className="donor-community-post-meta"><time>{post.time}</time></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="donor-community-thanks-section">
        <div className="donor-community-section donor-community-thanks">
          <figure><img src="/images/community-performance.jpg" alt="Love 21 members performing together in the community" /></figure>
          <div>
            <p className="donor-community-eyebrow">{copy.thanksEyebrow}</p>
            <h2>{copy.thanksTitle}</h2>
            <p>{copy.thanksBody}</p>
            <p className="donor-community-signature">Jeff Rotmeyer · Founder & CEO, Love 21 Foundation</p>
            <Link className="donor-community-button donor-community-button-primary" to="/donate">Make a donation</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
