import { useState } from "react";
import { Link } from "react-router-dom";

import { shareOrCopyLink } from "../../lib/shareUtils";
import { trackVolunteerEvent } from "../../lib/volunteerAnalytics";

interface OtherWayItem {
  key: string;
  eyebrow: string;
  title: string;
  body: string;
  linkTo: string;
  linkLabel: string;
  share?: { url: string; title: string; text: string; source: string };
}

const otherWays: OtherWayItem[] = [
  {
    key: "learn",
    eyebrow: "Learn",
    title: "Learn from our education resources",
    body: "Read plain-language guides on neurodiversity, inclusion and communication, then pass one on to a friend, colleague or classroom that might find it useful.",
    linkTo: "/resources",
    linkLabel: "Browse education resources",
    share: {
      url: "/resources",
      title: "Love 21 education resources",
      text: "Plain-language guides on neurodiversity, inclusion and communication from Love 21 Foundation.",
      source: "other_ways_learn",
    },
  },
  {
    key: "spread-word",
    eyebrow: "Spread the word",
    title: "Tell someone who might care",
    body: "Not everyone can give their time, but almost everyone can share a link. Forward this page to a friend, a colleague or a community group.",
    linkTo: "/volunteer",
    linkLabel: "Open the volunteer page",
    share: {
      url: "/volunteer",
      title: "Volunteer with Love 21 Foundation",
      text: "Love 21 Foundation is looking for volunteers to support the Down syndrome, autistic and neurodiverse community in Hong Kong.",
      source: "other_ways_spread_word",
    },
  },
  {
    key: "donate",
    eyebrow: "Give",
    title: "Donate instead of, or alongside, your time",
    body: "A one-off or regular donation funds coaching, nutrition support and equipment for members who cannot take part without it.",
    linkTo: "/donate",
    linkLabel: "Make a donation",
  },
  {
    key: "partner",
    eyebrow: "Partner",
    title: "Bring your company on board",
    body: "Ask your employer about a CSR day, an in-kind donation or a sponsorship — a good fit if a single day works better than an ongoing role.",
    linkTo: "/partners",
    linkLabel: "Explore corporate partnership",
  },
];

export function VolunteerOtherWaysToHelp() {
  return (
    <div className="volunteer-other-ways">
      <p className="eyebrow">Not ready to commit yet?</p>
      <h3>You can still make a difference without being a physical volunteer.</h3>
      <p className="volunteer-other-ways-intro">
        Showing up in person is one way to help Love 21 — it is not the only way. Here are a
        few others worth considering.
      </p>
      <div className="volunteer-other-ways-grid">
        {otherWays.map((item) => (
          <OtherWayCard key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}

function OtherWayCard({ item }: { item: OtherWayItem }) {
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleShare() {
    if (!item.share) return;
    await shareOrCopyLink(item.share, (message) => {
      setFeedback(message);
      window.setTimeout(() => setFeedback(null), 1800);
    });
    trackVolunteerEvent("resource_shared", { source: item.share.source });
  }

  return (
    <article className="volunteer-other-way-card">
      <p className="volunteer-other-way-eyebrow">{item.eyebrow}</p>
      <h4>{item.title}</h4>
      <p>{item.body}</p>
      <div className="volunteer-other-way-actions">
        <Link className="text-link" to={item.linkTo}>
          {item.linkLabel} <span aria-hidden="true">→</span>
        </Link>
        {item.share && (
          <button type="button" className="text-link volunteer-other-way-share" onClick={handleShare}>
            {feedback ?? "Share"}
          </button>
        )}
      </div>
    </article>
  );
}
