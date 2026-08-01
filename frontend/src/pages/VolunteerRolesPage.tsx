import { useEffect, useMemo, useState } from "react";

import { PageHero } from "../components/Cards";
import { VolunteerNewsletterSignup } from "../components/volunteer/VolunteerNewsletterSignup";
import { VolunteerOtherWaysToHelp } from "../components/volunteer/VolunteerOtherWaysToHelp";
import { VolunteerRoleCard } from "../components/volunteer/VolunteerRoleCard";
import { programs } from "../content/programs";
import {
  matchRoleTypeOptions,
  volunteerRoles,
  type VolunteerInterest,
  type VolunteerRoleType,
} from "../content/volunteer";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";

export function VolunteerRolesPage() {
  const [activePrograms, setActivePrograms] = useState<VolunteerInterest[]>([]);
  const [activeRoleTypes, setActiveRoleTypes] = useState<VolunteerRoleType[]>([]);

  useEffect(() => {
    trackVolunteerEvent("all_roles_viewed", { journey_path: "quick" });
  }, []);

  function toggle<T>(value: T, list: T[], setList: (next: T[]) => void) {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  const hasActiveFilters = activePrograms.length > 0 || activeRoleTypes.length > 0;

  const filteredByProgram = useMemo(() => {
    return programs
      .map((program) => ({
        program,
        roles: volunteerRoles.filter((role) => {
          if (role.programSlug !== program.slug) return false;
          if (activePrograms.length && !activePrograms.includes(program.slug)) return false;
          if (activeRoleTypes.length && !activeRoleTypes.includes(role.roleType)) return false;
          return true;
        }),
      }))
      .filter((group) => group.roles.length > 0);
  }, [activePrograms, activeRoleTypes]);

  const filterKey = `${activePrograms.join(",")}|${activeRoleTypes.join(",")}`;
  const totalResults = filteredByProgram.reduce((sum, group) => sum + group.roles.length, 0);

  return (
    <>
      <PageHero
        eyebrow="All volunteer roles"
        title="Explore without being boxed in."
        body="Compare every first-step role across Love 21's programmes. You do not need a recommendation to choose what feels right for you."
        tone="yellow"
      />
      <section className="section volunteer-role-preview-section">
        <div className="shell">
          <div className="volunteer-filter-bar">
            <div className="volunteer-filter-group">
              <span className="volunteer-filter-group-label">Programme</span>
              <div className="volunteer-filter-chips">
                {programs.map((program) => (
                  <button
                    key={program.slug}
                    type="button"
                    className={`volunteer-filter-chip ${
                      activePrograms.includes(program.slug) ? "is-active" : ""
                    }`}
                    aria-pressed={activePrograms.includes(program.slug)}
                    onClick={() => toggle(program.slug, activePrograms, setActivePrograms)}
                  >
                    {program.title}
                  </button>
                ))}
              </div>
            </div>
            <div className="volunteer-filter-group">
              <span className="volunteer-filter-group-label">How you'd contribute</span>
              <div className="volunteer-filter-chips">
                {matchRoleTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`volunteer-filter-chip ${
                      activeRoleTypes.includes(option.value) ? "is-active" : ""
                    }`}
                    aria-pressed={activeRoleTypes.includes(option.value)}
                    onClick={() => toggle(option.value, activeRoleTypes, setActiveRoleTypes)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                className="text-link volunteer-filter-clear"
                onClick={() => {
                  setActivePrograms([]);
                  setActiveRoleTypes([]);
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {totalResults ? (
            <div key={filterKey} className="volunteer-filtered-results">
              {filteredByProgram.map(({ program, roles }) => (
                <div key={program.slug} className="volunteer-program-group">
                  <h2 className={`volunteer-program-group-heading accent-${program.accent}`}>
                    {program.title}
                  </h2>
                  <div className="volunteer-role-grid">
                    {roles.map((role) => (
                      <VolunteerRoleCard key={role.id} role={role} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="volunteer-filter-empty">
              <h2>No roles match those filters yet.</h2>
              <p>Try clearing a filter, or subscribe below to hear about new roles.</p>
              <button
                type="button"
                className="button button-dark"
                onClick={() => {
                  setActivePrograms([]);
                  setActiveRoleTypes([]);
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <VolunteerNewsletterSignup
            source="volunteer_roles_page"
            title="None of these feel right for now?"
            body="Subscribe and we'll let you know when new roles or programmes open up."
          />
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <VolunteerOtherWaysToHelp />
        </div>
      </section>
    </>
  );
}
