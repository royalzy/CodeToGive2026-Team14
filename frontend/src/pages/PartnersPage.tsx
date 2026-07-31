import { PageHero, SectionHeading } from "../components/Cards";

const tiers = [
  {
    name: "Community Partner",
    amount: "Up to HK$25,000",
    benefits: [
      "Logo on Love 21 website and event materials",
      "Quarterly impact newsletter",
      "Invitation to one community event per year",
    ],
  },
  {
    name: "Programme Sponsor",
    amount: "HK$25,000 – HK$100,000",
    benefits: [
      "Everything in Community Partner, plus",
      "Named sponsorship of one programme area",
      "Two corporate volunteer days per year",
      "Co-branded impact report for your team",
    ],
  },
  {
    name: "Strategic Partner",
    amount: "HK$100,000+",
    benefits: [
      "Everything in Programme Sponsor, plus",
      "Custom CSR programme designed with your team",
      "Quarterly impact briefings with Love 21 leadership",
      "Priority access to member events and stories",
      "Annual partnership recognition celebration",
    ],
  },
] as const;

export function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Corporate partnerships"
        title="Partner with Love 21"
        body="Build meaningful CSR programmes, engage your team and make a lasting impact on the neurodiverse community in Hong Kong."
        tone="blue"
      />

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Why partner with us"
            title="Shared value, real impact"
            body="Love 21 serves over 600 families each month. Your partnership helps scale our reach and deepens your team's connection to the community."
          />
          <div className="metric-grid">
            <article className="metric-card accent-red">
              <strong>600+</strong>
              <h3>families reached</h3>
              <p>Your support reaches real families across Hong Kong.</p>
            </article>
            <article className="metric-card accent-blue">
              <strong>1,000+</strong>
              <h3>monthly activities</h3>
              <p>Programmes your team can see, join and sponsor.</p>
            </article>
            <article className="metric-card accent-teal">
              <strong>5</strong>
              <h3>programme areas</h3>
              <p>From sports to family support — align with what matters.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <SectionHeading
            eyebrow="Partnership levels"
            title="Find the right fit"
            body="Every partnership starts with a conversation. These tiers show what is possible."
          />
          <div className="help-grid">
            {tiers.map((tier) => (
              <article key={tier.name} className="support-card">
                <p className="eyebrow">{tier.amount}</p>
                <h3>{tier.name}</h3>
                <ul className="partner-benefits">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section next-step-banner">
        <div className="shell next-step-inner">
          <div>
            <p className="eyebrow">Start a conversation</p>
            <h2>Let us explore what partnership could look like.</h2>
          </div>
          <div>
            <p>Contact the Love 21 team at <strong>partnerships@love21foundation.com</strong></p>
          </div>
        </div>
      </section>
    </>
  );
}
