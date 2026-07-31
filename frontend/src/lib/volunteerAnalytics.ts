import type { VolunteerRoleId, VolunteerSessionId } from "../content/volunteer";

export type VolunteerAnalyticsEvent =
  | "volunteer_page_viewed"
  | "role_match_started"
  | "role_match_completed"
  | "recommended_role_viewed"
  | "all_roles_viewed"
  | "role_selected"
  | "volunteer_story_video_started"
  | "volunteer_story_video_completed"
  | "first_step_selected"
  | "trial_session_selected"
  | "volunteer_application_started"
  | "volunteer_application_submitted"
  | "first_session_plan_viewed";

interface VolunteerAnalyticsProperties {
  journey_path?: "quick" | "guided";
  role_id?: VolunteerRoleId;
  session_id?: VolunteerSessionId;
  application_status?: "interest_submitted" | "pending_confirmation";
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackVolunteerEvent(
  event: VolunteerAnalyticsEvent,
  properties: VolunteerAnalyticsProperties = {},
) {
  window.dataLayer?.push({ event, ...properties });
}
