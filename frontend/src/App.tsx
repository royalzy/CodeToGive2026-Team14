import { Route, Routes } from "react-router-dom";

import { Layout } from "./components/Layout";
import { AdminPage } from "./pages/AdminPage";
import { CommunityPage } from "./pages/CommunityPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DonatePage } from "./pages/DonatePage";
import { DonorProfilePage } from "./pages/DonorProfilePage";
import { HelpPage } from "./pages/HelpPage";
import { HomePage } from "./pages/HomePage";
import { ImpactPage } from "./pages/ImpactPage";
import { LoginPage } from "./pages/LoginPage";
import { MemberProfilePage } from "./pages/MemberProfilePage";
import { NeuroStrengthsConstellationPage } from "./pages/NeuroStrengthsConstellationPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { VolunteerPage } from "./pages/VolunteerPage";
import { VolunteerApplicationPage } from "./pages/VolunteerApplicationPage";
import { VolunteerConfirmedPage } from "./pages/VolunteerConfirmedPage";
import { VolunteerMatchPage } from "./pages/VolunteerMatchPage";
import { VolunteerRolePage } from "./pages/VolunteerRolePage";
import { VolunteerRolesPage } from "./pages/VolunteerRolesPage";
import { VolunteerSessionsPage } from "./pages/VolunteerSessionsPage";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="impact" element={<ImpactPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="volunteer" element={<VolunteerPage />} />
        <Route path="volunteer/match" element={<VolunteerMatchPage />} />
        <Route path="volunteer/roles" element={<VolunteerRolesPage />} />
        <Route path="volunteer/roles/:roleId" element={<VolunteerRolePage />} />
        <Route path="volunteer/sessions" element={<VolunteerSessionsPage />} />
        <Route path="volunteer/apply" element={<VolunteerApplicationPage />} />
        <Route path="volunteer/confirmed" element={<VolunteerConfirmedPage />} />
        <Route path="donate" element={<DonatePage />} />
        <Route path="donor-profile" element={<DonorProfilePage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="members/:slug" element={<MemberProfilePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="neuro-strengths" element={<NeuroStrengthsConstellationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
