import { useState } from "react";

import { programs } from "../../content/programs";
import { getVolunteerRolesForProgram } from "../../content/volunteer";
import { VolunteerRoleCard } from "./VolunteerRoleCard";

export function VolunteerProgramAccordion() {
  const [openSlug, setOpenSlug] = useState<string | null>(programs[0]?.slug ?? null);

  return (
    <div className="volunteer-program-accordion">
      {programs.map((program) => {
        const roles = getVolunteerRolesForProgram(program.slug);
        if (!roles.length) return null;
        const isOpen = openSlug === program.slug;
        const panelId = `volunteer-accordion-panel-${program.slug}`;
        const triggerId = `volunteer-accordion-trigger-${program.slug}`;

        return (
          <div
            key={program.slug}
            className={`volunteer-accordion-item accent-${program.accent} ${
              isOpen ? "is-open" : ""
            }`}
          >
            <button
              id={triggerId}
              type="button"
              className="volunteer-accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenSlug(isOpen ? null : program.slug)}
            >
              <span className="volunteer-accordion-trigger-text">
                <span className="volunteer-accordion-eyebrow">{program.eyebrow}</span>
                <span className="volunteer-accordion-title">{program.title}</span>
              </span>
              <span className="volunteer-accordion-meta">
                <span className="volunteer-accordion-count">
                  {roles.length} role{roles.length === 1 ? "" : "s"}
                </span>
                <span className="volunteer-accordion-chevron" aria-hidden="true">
                  ⌄
                </span>
              </span>
            </button>
            <div
              className="volunteer-accordion-panel"
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
            >
              <div className="volunteer-accordion-panel-inner">
                <p className="volunteer-accordion-description">{program.description}</p>
                <div className="volunteer-role-grid">
                  {roles.map((role) => (
                    <VolunteerRoleCard key={role.id} role={role} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
