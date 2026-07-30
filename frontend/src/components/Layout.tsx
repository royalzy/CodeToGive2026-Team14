import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { navigation } from "../content/en";

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
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand-link" to="/" aria-label="Love 21 home">
          <Wordmark />
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? "active" : undefined)}
              key={item.href}
              to={item.href}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link className="button button-small button-dark header-cta" to="/volunteer">
          Join the community
        </Link>

        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => (
              <NavLink key={item.href} to={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Wordmark />
          <p className="footer-tagline">So much ability. So many ways to belong.</p>
        </div>
        <div>
          <p className="footer-heading">Explore</p>
          {navigation.map((item) => (
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

