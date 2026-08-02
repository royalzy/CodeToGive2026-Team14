export function VolunteerHero() {
  return (
    <section className="volunteer-hero-scroll">
      <div className="volunteer-hero-sticky">
        <img
          className="volunteer-hero-image"
          src="/images/Love21Foundation-ourstory-01.jpg"
          alt=""
          aria-hidden="true"
        />
        <div className="volunteer-hero-overlay" />
        <span className="volunteer-hero-shape volunteer-hero-shape-1" aria-hidden="true" />

        <div className="shell volunteer-hero-content">
          <p className="eyebrow volunteer-hero-eyebrow">Where your time becomes impact</p>
          <h1 className="volunteer-hero-title">Step into the action</h1>
          <p className="volunteer-hero-deck">
            Behind every great programme are great people. Take a look at the opportunities and see where you could make a difference.
          </p>
        </div>
        <p className="volunteer-hero-caption">Volunteers and members at a Love 21 gathering</p>
      </div>
    </section>
  );
}
