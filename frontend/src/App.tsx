import { Route, Routes } from "react-router-dom";

import { Layout } from "./components/Layout";
import { DonatePage } from "./pages/DonatePage";
import { HomePage } from "./pages/HomePage";
import { ImpactPage } from "./pages/ImpactPage";
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
        <Route path="volunteer" element={<VolunteerPage />} />
        <Route path="volunteer/match" element={<VolunteerMatchPage />} />
        <Route path="volunteer/roles" element={<VolunteerRolesPage />} />
        <Route path="volunteer/roles/:roleId" element={<VolunteerRolePage />} />
        <Route path="volunteer/sessions" element={<VolunteerSessionsPage />} />
        <Route path="volunteer/apply" element={<VolunteerApplicationPage />} />
        <Route path="volunteer/confirmed" element={<VolunteerConfirmedPage />} />
        <Route path="donate" element={<DonatePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
