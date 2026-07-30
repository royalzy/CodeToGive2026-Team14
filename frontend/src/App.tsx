import { Route, Routes } from "react-router-dom";

import { Layout } from "./components/Layout";
import { DonatePage } from "./pages/DonatePage";
import { HomePage } from "./pages/HomePage";
import { ImpactPage } from "./pages/ImpactPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { VolunteerPage } from "./pages/VolunteerPage";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="impact" element={<ImpactPage />} />
        <Route path="volunteer" element={<VolunteerPage />} />
        <Route path="donate" element={<DonatePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

