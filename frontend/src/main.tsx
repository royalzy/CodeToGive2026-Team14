import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./content/auth";
import { LanguageProvider } from "./components/LanguageContext";
import { initAnalytics } from "./analytics/umami";
import { App } from "./App";
import "./styles.css";

initAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

