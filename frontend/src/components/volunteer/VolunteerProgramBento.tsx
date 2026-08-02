import { Apple, Dumbbell, HeartHandshake, Sparkles, Users } from "lucide-react";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";

import { programs } from "../../content/programs";
import type { Program } from "../../content/types";
import { getVolunteerRolesForProgram } from "../../content/volunteer";

type IconComponent = ComponentType<{ size?: number; strokeWidth?: number }>;

const programIcons: Record<Program["slug"], IconComponent> = {
  sports: Dumbbell,
  community: Users,
  family_support: HeartHandshake,
  nutrition: Apple,
  enrichment: Sparkles,
};

export function VolunteerProgramBento() {
  const tiles = programs
    .map((program) => ({ program, roles: getVolunteerRolesForProgram(program.slug) }))
    .filter((tile) => tile.roles.length > 0);

  return (
    <div className="volunteer-program-bento">
      {tiles.map(({ program, roles }, index) => {
        const Icon = programIcons[program.slug];
        return (
          <Link
            key={program.slug}
            to={`/volunteer/roles?program=${program.slug}`}
            className={`volunteer-bento-card accent-${program.accent}${
              index === 0 ? " volunteer-bento-card-lead" : ""
            }`}
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <span className="volunteer-bento-shape" aria-hidden="true" />
            <span className="volunteer-bento-icon" aria-hidden="true">
              <Icon size={26} strokeWidth={1.75} />
            </span>
            <span className="volunteer-bento-body">
              <span className="volunteer-bento-eyebrow">{program.eyebrow}</span>
              <h3 className="volunteer-bento-title">{program.title}</h3>
              <p className="volunteer-bento-description">{program.description}</p>
            </span>
            <span className="volunteer-bento-meta">
              <span className="volunteer-bento-count">
                {roles.length} role{roles.length === 1 ? "" : "s"}
              </span>
              <span className="volunteer-bento-cta">
                Explore programme <span aria-hidden="true">→</span>
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
