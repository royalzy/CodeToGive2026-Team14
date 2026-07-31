import { useEffect } from "react";

import { PageHero } from "../components/Cards";
import { VolunteerRoleCard } from "../components/volunteer/VolunteerRoleCard";
import { volunteerRoles } from "../content/volunteer";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";

export function VolunteerRolesPage() {
  useEffect(() => {
    trackVolunteerEvent("all_roles_viewed", { journey_path: "quick" });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="All volunteer roles"
        title="Explore without being boxed in."
        body="Compare every first-step role. You do not need a recommendation to choose what feels right for you."
        tone="yellow"
      />
      <section className="section volunteer-role-preview-section">
        <div className="shell volunteer-role-grid">
          {volunteerRoles.map((role) => (
            <VolunteerRoleCard key={role.id} role={role} />
          ))}
        </div>
      </section>
    </>
  );
}
