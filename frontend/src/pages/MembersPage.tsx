import { PageHero, MemberCard, SectionHeading } from "../components/Cards";
import { useLanguage } from "../hooks/useLanguage";

export function MembersPage() {
  const { t } = useLanguage();
  const defaultPoints = [450, 180, 720];

  return (
    <>
      <PageHero
        eyebrow="Member portal"
        title="Meet the community"
        body="Every profile here represents real growth, real milestones and real joy. Explore what members are achieving every day."
        tone="red"
      />

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Our members"
            title="Profiles in progress"
            body="Tap a member to see their journey, milestones and achievements."
          />
          <div className="member-grid">
            {t.memberProfiles.map((member, i) => (
              <MemberCard
                key={member.slug}
                member={member}
                points={defaultPoints[i] ?? 0}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
