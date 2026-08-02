import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { VolunteerNewsletterSignup } from "../components/volunteer/VolunteerNewsletterSignup";
import { VolunteerOtherWaysToHelp } from "../components/volunteer/VolunteerOtherWaysToHelp";
import { VolunteerRoleCard } from "../components/volunteer/VolunteerRoleCard";
import {
  localizeVolunteerRole,
  matchRoleTypeLabelZh,
  matchRoleTypeOptions,
  volunteerRoles,
  type VolunteerInterest,
  type VolunteerRoleType,
} from "../content/volunteer";
import { useLanguage } from "../hooks/useLanguage";
import { localizeDeep } from "../lib/zhConvert";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";

const pageCopy = {
  en: {
    programmeLabel: "Programme",
    contributeLabel: "How you'd contribute",
    clearFilters: "Clear filters",
    emptyTitle: "No roles match those filters yet.",
    emptyBody: "Try clearing a filter, or subscribe below to hear about new roles.",
    newsletterTitle: "None of these feel right for now?",
    newsletterBody: "Subscribe and we'll let you know when new roles or programmes open up.",
  },
  zh: {
    programmeLabel: "計劃",
    contributeLabel: "你希望如何參與",
    clearFilters: "清除篩選",
    emptyTitle: "暫時沒有符合篩選條件的職位。",
    emptyBody: "試試清除篩選，或在下方訂閱以了解新職位消息。",
    newsletterTitle: "暫時未找到合適的角色？",
    newsletterBody: "訂閱後，我們會在有新職位或計劃開放時通知你。",
  },
} as const;

export function VolunteerRolesPage() {
  const { lang, t } = useLanguage();
  const copy = localizeDeep(pageCopy[lang === "en" ? "en" : "zh"], lang);
  const programs = t.programs;
  const [searchParams] = useSearchParams();
  const [activePrograms, setActivePrograms] = useState<VolunteerInterest[]>(() => {
    const requested = searchParams.get("program")?.split(",") ?? [];
    return programs
      .map((program) => program.slug)
      .filter((slug) => requested.includes(slug));
  });
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
  }, [programs, activePrograms, activeRoleTypes]);

  const filterKey = `${activePrograms.join(",")}|${activeRoleTypes.join(",")}`;
  const totalResults = filteredByProgram.reduce((sum, group) => sum + group.roles.length, 0);

  return (
    <>
      <section className="section volunteer-role-preview-section">
        <div className="shell">
          <div className="volunteer-filter-bar">
            <div className="volunteer-filter-group">
              <span className="volunteer-filter-group-label">{copy.programmeLabel}</span>
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
              <span className="volunteer-filter-group-label">{copy.contributeLabel}</span>
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
                    {lang === "en" ? option.label : localizeDeep(matchRoleTypeLabelZh[option.value], lang)}
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
                {copy.clearFilters}
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
                      <VolunteerRoleCard
                        key={role.id}
                        role={localizeDeep(localizeVolunteerRole(role, lang), lang)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="volunteer-filter-empty">
              <h2>{copy.emptyTitle}</h2>
              <p>{copy.emptyBody}</p>
              <button
                type="button"
                className="button button-dark"
                onClick={() => {
                  setActivePrograms([]);
                  setActiveRoleTypes([]);
                }}
              >
                {copy.clearFilters}
              </button>
            </div>
          )}
        </div>
      </section>
      <section className="section section-soft">
        <div className="shell">
          <VolunteerOtherWaysToHelp />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <VolunteerNewsletterSignup
            source="volunteer_roles_page"
            title={copy.newsletterTitle}
            body={copy.newsletterBody}
          />
        </div>
      </section>
    </>
  );
}
