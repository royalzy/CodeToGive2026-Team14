import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { useLanguage } from "../hooks/useLanguage";

export function DonorProfilePage() {
  const { lang } = useLanguage();
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPassword("");
    setSignedIn(true);
  }

  if (!signedIn) {
    return (
      <section className="donor-profile-login-section">
        <div className="donor-profile-login-copy">
          <p className="donor-community-eyebrow">Private donor profile</p>
          <h1>{lang === "zh" ? "你的支持，留下清楚而真誠的記錄。" : "Your impact, kept honest."}</h1>
          <p>{lang === "zh" ? "登入後查看收據、實際落地記錄和只有你能看到的待審核留言。" : "Sign in to see receipts, verified programme records and supporter-wall notes that are still private to you."}</p>
        </div>
        <form className="donor-profile-login-card" onSubmit={signIn}>
          <p className="donor-community-eyebrow">Demo sign in</p>
          <h2>Welcome back</h2>
          <label><span>Email</span><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label><span>Password</span><input type="password" required minLength={6} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button className="donor-community-button donor-community-button-primary" type="submit">View my profile</button>
          <small>Prototype only. Credentials are held in memory for this page and are never sent or stored.</small>
        </form>
      </section>
    );
  }

  return (
    <div className="donor-profile-page">
      <header className="donor-profile-header">
        <div className="donor-profile-identity"><span>阿</span><div><p className="donor-community-eyebrow">Your donor profile</p><h1>阿木</h1><p>Member since November 2023 · 6 gifts</p></div></div>
        <div className="donor-profile-lifetime"><span>Lifetime giving</span><strong>HK$2,400</strong><small>Receipts verified</small></div>
      </header>
      <main className="donor-profile-grid">
        <div>
          <article className="donor-profile-achievement">
            <p className="donor-community-eyebrow">Your shared impact</p>
            <h2>You made 72 hours of belonging possible.</h2>
            <p>Your six gifts helped fund coached movement sessions for 18 young people, family transport for 9 sessions, and two supported workplace visits.</p>
            <ul><li><strong>18</strong><span>participants supported</span></li><li><strong>9</strong><span>family journeys funded</span></li><li><strong>2</strong><span>workplace visits</span></li></ul>
            <small>Impact is allocated from actual programme spend at quarter close. We never claim one gift caused an outcome alone.</small>
          </article>
          <article className="donor-profile-record">
            <p className="donor-community-eyebrow">The record behind the number</p><h2>Your impact timeline</h2>
            <ol>
              <li><time>18 July 2026 · confirmed</time><h3>16 coached movement hours delivered</h3><p>Four Saturday sessions at Kwun Tong Centre, serving 12 participants. Attendance and coach report verified.</p></li>
              <li><time>2 May 2026 · confirmed</time><h3>Transport supported for 9 family visits</h3><p>Accessible taxis helped participants attend sessions they would otherwise have missed.</p></li>
              <li><time>12 February 2026 · in progress</time><h3>Two supported workplace visits</h3><p>Outcome follow-up is scheduled for 30 August. We will email you when the record closes.</p></li>
            </ol>
          </article>
        </div>
        <aside>
          <article className="donor-profile-note"><img src="/images/crystal-performing.jpg" alt="Crystal performing with confidence at a Love 21 programme" /><p>“More confident, cheerful, and motivated to keep learning.”</p><small>Shared with Crystal and her family’s consent.</small></article>
          <article className="donor-profile-receipts"><h2>Receipts & updates</h2><p><span>Jun 2026 · HK$600</span><button type="button">PDF</button></p><p><span>Feb 2026 · HK$600</span><button type="button">PDF</button></p><p><span>Oct 2025 · HK$300</span><button type="button">PDF</button></p></article>
          <Link className="donor-community-button donor-community-button-primary" to="/donate">Make another donation</Link>
        </aside>
      </main>
    </div>
  );
}
