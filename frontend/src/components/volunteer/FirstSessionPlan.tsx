import type { VolunteerRole, VolunteerSession } from "../../content/volunteer";

export function FirstSessionPlan({
  role,
  session,
}: {
  role: VolunteerRole;
  session?: VolunteerSession;
}) {
  if (!session) {
    return (
      <section className="first-session-plan">
        <p className="eyebrow">Your possible first step</p>
        <h2>{role.title}</h2>
        <p>
          There is no demo session for this role yet. In a live service, Love 21
          would contact you before suggesting a suitable opportunity.
        </p>
        <div className="plan-support-note">
          You have expressed interest only. No activity has been booked or confirmed.
        </div>
      </section>
    );
  }

  return (
    <section className="first-session-plan">
      <div className="demo-badge">Provisional demo plan</div>
      <p className="eyebrow">Your possible first session</p>
      <h2>{session.title}</h2>
      <p>
        <strong>{session.dateLabel}</strong> · {session.timeLabel}
        <br />
        {session.location}
      </p>
      <h3>What the session could look like</h3>
      <ol className="plan-timeline">
        {session.schedule.map((item) => (
          <li key={`${item.time}-${item.activity}`}>
            <time>{item.time}</time>
            <span>{item.activity}</span>
          </li>
        ))}
      </ol>
      <div className="plan-grid">
        <div>
          <h3>Bring</h3>
          <ul>
            {session.bring.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>A small first-session goal</h3>
          <p>{session.smallTask}</p>
        </div>
      </div>
      <div className="plan-support-note">
        You would not handle unfamiliar situations alone. A Love 21 lead or coach
        would be present throughout.
      </div>
    </section>
  );
}
