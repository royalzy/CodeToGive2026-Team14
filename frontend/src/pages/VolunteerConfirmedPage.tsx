import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { PageHero, StatusPanel } from "../components/Cards";
import { FirstSessionPlan } from "../components/volunteer/FirstSessionPlan";
import { getVolunteerRole, getVolunteerSession } from "../content/volunteer";
import { useLanguage } from "../hooks/useLanguage";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";
import type { VolunteerConfirmationState } from "../lib/volunteerConfirmation";
import { localizeDeep } from "../lib/zhConvert";

const confirmedCopy = {
  en: {
    unavailableHeading: "Volunteer demo result unavailable",
    unavailableTitle: "Demo result is no longer available.",
    unavailableBody:
      "Prototype submissions are not saved in the browser or on the server. Choose a role to create another demonstration plan.",
    chooseRole: "Choose a role",
    heroEyebrow: "Demonstration complete",
    heroTitlePending: "Your demo request is pending — not booked.",
    heroTitleSubmitted: "Your demo interest has been explored.",
    heroBody:
      "This screen shows what a clear next step could feel like. No personal details or request were saved.",
    statusTitlePending: "Demo session awaiting confirmation",
    statusTitleSubmitted: "Demo interest submitted",
    simulationNote: "Simulation only.",
    simulationRest: "Love 21 has not received this request and no place has been reserved.",
    returnToVolunteering: "Return to volunteering",
    exploreImpact: "Explore Love 21's impact",
  },
  zh: {
    unavailableHeading: "義工示範結果暫時無法查看",
    unavailableTitle: "示範結果已不再提供。",
    unavailableBody:
      "示範提交不會儲存在瀏覽器或伺服器上。請選擇一個角色，建立另一個示範計劃。",
    chooseRole: "選擇角色",
    heroEyebrow: "示範完成",
    heroTitlePending: "你的示範申請仍待確認——尚未預約。",
    heroTitleSubmitted: "你的示範興趣已經探索完成。",
    heroBody: "此畫面展示清晰下一步的感覺。並未儲存任何個人資料或申請。",
    statusTitlePending: "示範時段待確認",
    statusTitleSubmitted: "示範興趣已提交",
    simulationNote: "僅為模擬。",
    simulationRest: "Love 21 尚未收到此申請，亦未預留任何名額。",
    returnToVolunteering: "返回義工服務",
    exploreImpact: "探索 Love 21 的成果",
  },
} as const;

export function VolunteerConfirmedPage() {
  const { lang } = useLanguage();
  const copy = localizeDeep(confirmedCopy[lang === "en" ? "en" : "zh"], lang);
  const location = useLocation();
  const state = location.state as VolunteerConfirmationState | null;
  const role = state ? getVolunteerRole(state.result.role_id) : undefined;
  const session = state?.result.session_id
    ? getVolunteerSession(state.result.session_id)
    : undefined;

  useEffect(() => {
    if (state && role) {
      trackVolunteerEvent("first_session_plan_viewed", {
        role_id: role.id,
        session_id: session?.id,
        application_status: state.result.status,
      });
    }
  }, [role, session, state]);

  if (!state || !role) {
    return (
      <section className="section">
        <div className="shell narrow-shell">
          <h1 className="sr-only">{copy.unavailableHeading}</h1>
          <StatusPanel title={copy.unavailableTitle} tone="notice">
            <p>{copy.unavailableBody}</p>
            <Link className="button button-dark" to="/volunteer/roles">
              {copy.chooseRole}
            </Link>
          </StatusPanel>
        </div>
      </section>
    );
  }

  const pending = state.result.status === "pending_confirmation";

  return (
    <>
      <PageHero
        eyebrow={copy.heroEyebrow}
        title={pending ? copy.heroTitlePending : copy.heroTitleSubmitted}
        body={copy.heroBody}
        tone="blue"
      />
      <section className="section volunteer-confirmation-section">
        <div className="shell volunteer-confirmation-layout">
          <div>
            <StatusPanel
              title={pending ? copy.statusTitlePending : copy.statusTitleSubmitted}
              tone="notice"
            >
              <p>
                <strong>{copy.simulationNote}</strong> {copy.simulationRest}
              </p>
              <ul className="next-steps-list">
                {state.result.next_steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </StatusPanel>
            <div className="confirmation-actions">
              <Link className="button button-dark" to="/volunteer">
                {copy.returnToVolunteering}
              </Link>
              <Link className="text-link" to="/story">
                {copy.exploreImpact} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <FirstSessionPlan role={role} session={session} />
        </div>
      </section>
    </>
  );
}
