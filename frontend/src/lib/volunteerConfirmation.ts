import type { VolunteerApplicationResult } from "../api/client";
import type { VolunteerFirstStep } from "../content/volunteer";

export interface VolunteerConfirmationState {
  result: VolunteerApplicationResult;
  firstStep: VolunteerFirstStep;
}
