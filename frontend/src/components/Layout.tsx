import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { useLanguage } from "../hooks/useLanguage";
import { useAuth } from "../hooks/useAuth";

function Wordmark() {
  return (
    <span className="wordmark" aria-label="Love 21 Foundation">
      <span>LO</span>
      <span className="wordmark-heart">2</span>
      <span>VE</span>
      <small>Foundation</small>
    </span>
  );
}

function Header() {
  const { lang, setLang, t } = useLanguage();
  const { family, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand-link" to="/" aria-label="Love 21 home">
          <Wordmark />
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {t.navigation.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? "active" : undefined)}
              key={item.href}
              to={item.href}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {family ? (
          <div className="header-actions">
            <div className="header-auth">
              <Link className="button button-small button-dark" to="/dashboard">
                Dashboard
              </Link>
              <button className="lang-toggle" type="button" onClick={logout}>
                Sign out
              </button>
            </div>
            <button
              className="lang-toggle"
              type="button"
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
              aria-label={`Switch to ${lang === "en" ? "Traditional Chinese" : "English"}`}
            >
              {lang === "en" ? "繁" : "EN"}
            </button>
          </div>
        ) : (
          <div className="header-actions">
            <Link className="button button-small button-dark header-cta" to="/login">
              Sign in
            </Link>
            <button
              className="lang-toggle"
              type="button"
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
              aria-label={`Switch to ${lang === "en" ? "Traditional Chinese" : "English"}`}
            >
              {lang === "en" ? "繁" : "EN"}
            </button>
          </div>
        )}

        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            {t.navigation.map((item) => (
              <NavLink key={item.href} to={item.href}>
                {item.label}
              </NavLink>
            ))}
            <hr style={{ margin: "0.5rem 0", borderColor: "var(--line)" }} />
            {family ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <button type="button" onClick={logout} className="mobile-nav-button">
                  Sign out
                </button>
              </>
            ) : (
              <NavLink to="/login">Sign in</NavLink>
            )}
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
              className="mobile-nav-button"
            >
              {lang === "en" ? "繁體中文" : "English"}
            </button>
          </nav>
        </details>
      </div>
    </header>
  );
}

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Wordmark />
          <p className="footer-tagline">So much ability. So many ways to belong.</p>
        </div>
        <div>
          <p className="footer-heading">Explore</p>
          {t.navigation.map((item) => (
            <Link key={item.href} to={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <div>
          <p className="footer-heading">Prototype note</p>
          <p>
            This hackathon experience does not store personal information or
            process real donations.
          </p>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>Love 21 Foundation hackathon prototype</span>
        <span>#SoMuchAbility</span>
      </div>
    </footer>
  );
}

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

