import { BookOpen, Handshake, Heart, Megaphone } from "lucide-react";
import type { ComponentType } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface OtherWayItem {
  key: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;
  eyebrow: string;
  title: string;
  body: string;
  linkTo?: string;
  linkLabel?: string;
  accent: "red" | "blue" | "yellow" | "teal";
}

const otherWays: OtherWayItem[] = [
  {
    key: "learn",
    icon: BookOpen,
    eyebrow: "Learn",
    title: "Learn from our education resources",
    body: "Read plain-language guides on neurodiversity, inclusion and communication, then pass one on to a friend, colleague or classroom that might find it useful.",
    linkTo: "/resources",
    linkLabel: "Browse education resources",
    accent: "blue",
  },
  {
    key: "spread-word",
    icon: Megaphone,
    eyebrow: "Share",
    title: "Tell someone who might care",
    body: "Not everyone can give their time, but almost everyone can share a link. Forward this page to a friend, a colleague or a community group.",
    accent: "red",
  },
  {
    key: "donate",
    icon: Heart,
    eyebrow: "Give",
    title: "Donate instead of, or alongside, your time",
    body: "A one-off or regular donation funds coaching, nutrition support and equipment for members who cannot take part without it.",
    linkTo: "/donate",
    linkLabel: "Make a donation",
    accent: "yellow",
  },
  {
    key: "partner",
    icon: Handshake,
    eyebrow: "Partner",
    title: "Bring your company on board",
    body: "Ask your employer about a CSR day, an in-kind donation or a sponsorship, a good fit if a single day works better than an ongoing role.",
    linkTo: "/partners",
    linkLabel: "Explore corporate partnership",
    accent: "teal",
  },
];

export function VolunteerOtherWaysToHelp() {
  return (
    <div className="volunteer-other-ways">
      <p className="eyebrow">Not ready to commit yet?</p>
      <h3>So many ways to make a difference.</h3>
      <p className="volunteer-other-ways-intro">
        Showing up in person is one way to help Love 21, it is not the only way. Hover a
        card (or tap it) to see how else you could get involved.
      </p>
      <div className="volunteer-other-ways-grid">
        {otherWays.map((item) => (
          <OtherWayFlipCard key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}

function OtherWayFlipCard({ item }: { item: OtherWayItem }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = item.icon;

  return (
    <article
      className={`volunteer-other-way-card volunteer-accent-${item.accent} ${
        isFlipped ? "is-flipped" : ""
      }`}
      tabIndex={0}
      aria-label={`${item.title} — activate to read more`}
      onClick={() => setIsFlipped((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsFlipped((current) => !current);
        }
      }}
    >
      <div className="volunteer-other-way-card-inner">
        <div className="volunteer-other-way-card-face volunteer-other-way-card-front">
          <span className="volunteer-other-way-icon" aria-hidden="true">
            <Icon size={30} strokeWidth={1.75} />
          </span>
          <p className="volunteer-other-way-eyebrow">{item.eyebrow}</p>
          <h4>{item.title}</h4>
        </div>
        <div className="volunteer-other-way-card-face volunteer-other-way-card-back">
          <p className="volunteer-other-way-eyebrow">{item.eyebrow}</p>
          <p>{item.body}</p>
          {item.linkTo && item.linkLabel && (
            <div className="volunteer-other-way-actions">
              <Link
                className="text-link"
                to={item.linkTo}
                onClick={(event) => event.stopPropagation()}
              >
                {item.linkLabel} <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
