import { Route, Routes } from "react-router-dom";

import { Layout } from "./components/Layout";
import { AdminPage } from "./pages/AdminPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DonatePage } from "./pages/DonatePage";
import { HelpPage } from "./pages/HelpPage";
import { HomePage } from "./pages/HomePage";
import { ImpactPage } from "./pages/ImpactPage";
import { LoginPage } from "./pages/LoginPage";
import { MemberProfilePage } from "./pages/MemberProfilePage";
import { MembersPage } from "./pages/MembersPage";
import { NeuroStrengthsConstellationPage } from "./pages/NeuroStrengthsConstellationPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PartnersPage } from "./pages/PartnersPage";
import { ResourcesPage } from "./pages/ResourcesPage";
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
        <Route path="volunteer" element={<VolunteerPage />} />
        <Route path="volunteer/match" element={<VolunteerMatchPage />} />
        <Route path="volunteer/roles" element={<VolunteerRolesPage />} />
        <Route path="volunteer/roles/:roleId" element={<VolunteerRolePage />} />
        <Route path="volunteer/sessions" element={<VolunteerSessionsPage />} />
        <Route path="volunteer/apply" element={<VolunteerApplicationPage />} />
        <Route path="volunteer/confirmed" element={<VolunteerConfirmedPage />} />
        <Route path="donate" element={<DonatePage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="partners" element={<PartnersPage />} />
        <Route path="members" element={<MembersPage />} />
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
