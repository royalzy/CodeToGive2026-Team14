import { useState } from "react";
import { Navigate } from "react-router-dom";

import { MemberCard, SectionHeading } from "../components/Cards";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";
import { addBooking, canBookMember, isAlreadyBooked, MAX_PER_WEEK } from "../content/booking";
import { dashboardCopy } from "../content/dashboard";
import type { Booking } from "../content/types";
import { localizeDeep } from "../lib/zhConvert";

export function DashboardPage() {
  const { family, logout } = useAuth();
  const { t, lang } = useLanguage();
  const copy = localizeDeep(dashboardCopy[lang === "en" ? "en" : "zh"], lang);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  if (!family) return <Navigate to="/login" replace />;

  const members = family.memberSlugs
    .map((slug) => t.memberProfiles.find((m) => m.slug === slug))
    .filter(Boolean);

  const memberBookings = (slug: string) =>
    bookings.filter((b) => b.memberSlug === slug);

  function handleBook(memberSlug: string, eventId: string, eventDate: string) {
    if (isAlreadyBooked(memberSlug, eventId, bookings)) {
      setMessage(copy.alreadyBooked);
      return;
    }
    if (!canBookMember(memberSlug, eventDate, bookings)) {
      setMessage(copy.bookingLimitReached);
      return;
    }
    setBookings(addBooking(memberSlug, eventId, bookings));
    setMessage(copy.bookedSuccess);
  }

  const allBookings = members.flatMap((m) =>
    memberBookings(m!.slug).map((b) => {
      const ev = t.bookableEvents.find((e) => e.id === b.eventId);
      return { ...b, memberName: m!.name, event: ev };
    }),
  );

  return (
    <>
      <section className="page-hero page-hero-blue">
        <div className="shell page-hero-inner">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.welcome(family.name)}</h1>
          <div style={{ marginTop: "1rem" }}>
            <button className="button button-outline" type="button" onClick={logout}>
              {copy.signOut}
            </button>
          </div>
        </div>
      </section>

      {message && (
        <div className="shell" style={{ marginTop: "1rem" }}>
          <div className="profile-activity" role="status" style={{ maxWidth: "600px" }}>
            {message}
          </div>
        </div>
      )}

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow={copy.yourMembersEyebrow}
            title={copy.whoBookingTitle}
          />
          <div className="member-grid">
            {members.map((member) => {
              if (!member) return null;
              const weekCount = memberBookings(member.slug).length;
              return (
                <article key={member.slug} className="support-card">
                  <MemberCard
                    member={member}
                    points={0}
                  />
                  <div className="booking-limit" style={{ marginTop: "0.75rem" }}>
                    <div className="allocation-track" style={{ height: "0.4rem" }}>
                      <div
                        className="allocation-fill"
                        style={{
                          width: `${(weekCount / MAX_PER_WEEK) * 100}%`,
                          background: weekCount >= MAX_PER_WEEK ? "var(--red)" : "var(--blue)",
                        }}
                      />
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.3rem" }}>
                      {copy.bookingsThisWeek(weekCount, MAX_PER_WEEK)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <SectionHeading
            eyebrow={copy.browseAndBookEyebrow}
            title={copy.availableSessionsTitle}
            body={copy.chooseSessionBody}
          />
          <div className="opportunity-grid">
            {t.bookableEvents.map((ev) => (
              <article key={ev.id} className={`opportunity-card accent-${ev.accent}`}>
                <p className="eyebrow">{ev.date} · {ev.time}</p>
                <h3>{ev.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                  {ev.location} · {copy.agesLabel} {ev.ageRange} · {ev.spots} {copy.spotsLabel}
                </p>
                <div className="activity-buttons" style={{ marginTop: "0.75rem" }}>
                  {members.map((member) => {
                    if (!member) return null;
                    const booked = isAlreadyBooked(member.slug, ev.id, bookings);
                    return (
                      <button
                        key={`${member.slug}-${ev.id}`}
                        className={booked ? "button button-outline" : "button button-dark"}
                        type="button"
                        disabled={booked}
                        onClick={() => handleBook(member.slug, ev.id, ev.date)}
                        style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem" }}
                      >
                        {booked ? `✓ ${member.name}` : `${member.name} — ${copy.signUpSuffix}`}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {allBookings.length > 0 && (
        <section className="section">
          <div className="shell">
            <SectionHeading
              eyebrow={copy.yourCalendarEyebrow}
              title={copy.upcomingSessionsTitle}
            />
            <div className="help-grid">
              {allBookings.map((b) =>
                b.event ? (
                  <article key={b.id} className="support-card">
                    <p className="eyebrow">{b.event.date} · {b.event.time}</p>
                    <h3>{b.event.title}</h3>
                    <p>{copy.bookedForLabel} {b.memberName}</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{b.event.location}</p>
                  </article>
                ) : null,
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
