import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { useLanguage } from "../hooks/useLanguage";
import { useAuth } from "../hooks/useAuth";

const routePageTitles: Record<string, string> = {
  "/volunteer": "Volunteer with Love 21",
  "/volunteer/match": "Volunteer personality quiz",
  "/volunteer/roles": "Browse volunteer roles",
  "/volunteer/sessions": "Browse volunteer sessions",
};

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/love21foundation/",
    className: "social-link-instagram",
    Icon: InstagramIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/love21/",
    className: "social-link-linkedin",
    Icon: LinkedInIcon,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCo_nITpqZaac5Gd5B_hCcig",
    className: "social-link-youtube",
    Icon: YouTubeIcon,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/love21foundation/",
    className: "social-link-facebook",
    Icon: FacebookIcon,
  },
] as const;

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38.67-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0z" />
      <path d="M12 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8z" />
      <circle cx="18.41" cy="5.59" r="1.44" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.91 1.65-1.85 3.39-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26zM5.34 7.43a2.07 2.07 0 110-4.13 2.07 2.07 0 010 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.97 0 1.78-.77 1.78-1.72V1.72C24 .77 23.19 0 22.22 0z" />
    </svg>
  );
}

function YouTubeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M23.5 6.2a3.04 3.04 0 00-2.14-2.15C19.46 3.5 12 3.5 12 3.5s-7.46 0-9.36.55A3.04 3.04 0 00.5 6.2 31.9 31.9 0 000 12a31.9 31.9 0 00.5 5.8 3.04 3.04 0 002.14 2.15c1.9.55 9.36.55 9.36.55s7.46 0 9.36-.55a3.04 3.04 0 002.14-2.15A31.9 31.9 0 0024 12a31.9 31.9 0 00-.5-5.8zM9.6 15.5v-7l6.18 3.5-6.18 3.5z" />
    </svg>
  );
}

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

function Wordmark() {
  return (
    <span className="wordmark wordmark-image" aria-label="Love 21 Foundation">
      <img src="/images/love21_logo.png" alt="Love 21 Foundation" />
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
            This hackathon experience stores demo donor profiles securely but
            does not process real donations.
          </p>
        </div>
        <div>
          <p className="footer-heading footer-social-heading">Follow us</p>
          <div className="footer-social-links" aria-label="Social media links">
            {socialLinks.map(({ label, href, className, Icon }) => (
              <a
                key={label}
                className={`footer-social-link ${className}`}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
              >
                <span className="footer-social-icon" aria-hidden="true">
                  <Icon className="footer-social-icon-svg" />
                </span>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>Love 21 Foundation hackathon prototype</span>
        <span>#SoMuchAbility</span>
      </div>
    </footer>
  );
}

function SupporterQuickActions({ pathname }: { pathname: string }) {
  const { lang } = useLanguage();
  if (pathname !== "/community" && pathname !== "/donate") return null;

  return (
    <aside className={`supporter-quick-actions supporter-quick-actions-${pathname.slice(1)}`} aria-label="Supporter quick actions">
      {pathname === "/community" ? (
        <Link className="supporter-quick-action supporter-quick-action-primary" to="/donate">
          {lang === "zh" ? "立即捐款" : "Make a donation"}
        </Link>
      ) : (
        <Link className="supporter-quick-action supporter-quick-action-primary" to="/community">
          {lang === "zh" ? "支持者社群" : "Our community"}
        </Link>
      )}
      <Link className="supporter-quick-action" to="/donor-profile">
        {lang === "zh" ? "我的捐款檔案" : "My donor profile"}
      </Link>
    </aside>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  const pageTitle = routePageTitles[pathname];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <>
      <Header />
      <main id="main-content">
        {pageTitle && <h1 className="sr-only">{pageTitle}</h1>}
        <Outlet />
      </main>
      <SupporterQuickActions pathname={pathname} />
      <Footer />
    </>
  );
}
