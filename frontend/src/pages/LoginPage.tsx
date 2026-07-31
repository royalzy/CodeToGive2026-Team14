import { useNavigate } from "react-router-dom";
import { PageHero } from "../components/Cards";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";

export function LoginPage() {
  const { login, family } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (family) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  function handleLogin(familyId: string) {
    login(familyId);
    navigate("/dashboard");
  }

  return (
    <>
      <PageHero
        eyebrow="Member sign in"
        title="Welcome back"
        body="Choose your family account to browse programmes, book activities and see your calendar."
        tone="blue"
      />

      <section className="section">
        <div className="shell">
          <div className="help-grid">
            {t.demoFamilies.map((fam) => {
              const members = fam.memberSlugs
                .map((slug) => t.memberProfiles.find((m) => m.slug === slug))
                .filter(Boolean);

              return (
                <article key={fam.id} className="support-card login-card">
                  <h3>{fam.name}</h3>
                  <p className="login-members">
                    {members.map((m) => m?.name).join(", ")}
                  </p>
                  <button
                    className="button button-dark"
                    type="button"
                    onClick={() => handleLogin(fam.id)}
                  >
                    Sign in
                  </button>
                </article>
              );
            })}
          </div>
          <p className="section-cta" style={{ marginTop: "1.5rem", color: "var(--muted)", fontSize: "0.85rem" }}>
            Demo sign-in — no real authentication. In a live service, families would use secure login.
          </p>
        </div>
      </section>
    </>
  );
}
