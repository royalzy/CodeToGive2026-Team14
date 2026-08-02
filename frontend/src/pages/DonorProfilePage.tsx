import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import {
  ApiError,
  createDonorSession,
  deleteDonorSession,
  getMyDonorProfile,
  type DonorProfileResult,
} from "../api/client";
import { DonationImpactBreakdown } from "../components/donate/DonationImpactBreakdown";
import { donationPrograms, getDonationImpactMessage } from "../content/donations";
import { useLanguage } from "../hooks/useLanguage";

function formatDate(value: string, includeTime = false): string {
  return new Intl.DateTimeFormat("en-HK", {
    timeZone: "Asia/Hong_Kong",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(value));
}

function causeLabel(causeId: string): string {
  return donationPrograms.find((program) => program.value === causeId)?.label
    ?? causeId.replaceAll("_", " ");
}

export function DonorProfilePage() {
  const { lang } = useLanguage();
  const [profile, setProfile] = useState<DonorProfileResult | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    let active = true;
    getMyDonorProfile()
      .then((result) => {
        if (active) setProfile(result);
      })
      .catch((error: unknown) => {
        if (active && !(error instanceof ApiError && error.status === 401)) {
          setLoginError("We could not check your donor profile. Please try signing in.");
        }
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });
    return () => { active = false; };
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError(null);
    setIsSigningIn(true);
    try {
      await createDonorSession({ email: email.trim(), password });
      const result = await getMyDonorProfile();
      setProfile(result);
      setPassword("");
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "We could not sign you in. Please try again.",
      );
    } finally {
      setIsSigningIn(false);
    }
  }

  async function signOut() {
    await deleteDonorSession();
    setProfile(null);
    setEmail("");
    setPassword("");
  }

  if (!profile) {
    return (
      <section className="donor-profile-login-section">
        <div className="donor-profile-login-copy">
          <p className="donor-community-eyebrow">Private donor profile</p>
          <h1>{lang === "zh" ? "你的支持，留下清楚而真誠的記錄。" : "Your impact, kept honest."}</h1>
          <p>{lang === "zh" ? "登入後查看收據、實際落地記錄和只有你能看到的待審核留言。" : "Sign in to see your donation record, expected impact and supporter-wall notes that are still private to you."}</p>
        </div>
        <form className="donor-profile-login-card" onSubmit={signIn}>
          <p className="donor-community-eyebrow">Donor sign in</p>
          <h2>Welcome back</h2>
          {loginError && <div className="form-alert" role="alert">{loginError}</div>}
          <label><span>Email</span><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={checkingSession || isSigningIn} /></label>
          <label><span>Password</span><input type="password" required minLength={6} maxLength={128} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={checkingSession || isSigningIn} /></label>
          <button className="donor-community-button donor-community-button-primary" type="submit" disabled={checkingSession || isSigningIn}>
            {checkingSession ? "Checking your session…" : isSigningIn ? "Signing in…" : "View my profile"}
          </button>
          <small>Your password is securely verified by the donor service and is never displayed here.</small>
        </form>
      </section>
    );
  }

  const latestDonation = profile.donations[0];

  return (
    <div className="donor-profile-page">
      <header className="donor-profile-header">
        <div className="donor-profile-identity"><span>{profile.profile.nickname.slice(0, 2)}</span><div><p className="donor-community-eyebrow">Your donor profile</p><h1>{profile.profile.nickname}</h1><p>Member since {formatDate(profile.profile.created_at)} · {profile.donation_count} {profile.donation_count === 1 ? "gift" : "gifts"}</p></div></div>
        <div className="donor-profile-lifetime"><span>Lifetime giving</span><strong>HK${profile.lifetime_amount_hkd.toLocaleString("en-HK")}</strong><small>Prototype donations recorded</small></div>
      </header>
      <main className="donor-profile-grid">
        <div>
          <article className="donor-profile-achievement">
            <p className="donor-community-eyebrow">Your shared impact</p>
            {latestDonation ? (
              <>
                <h2>{getDonationImpactMessage(latestDonation.impact).headline}</h2>
                <p>Your latest HK${latestDonation.amount_hkd.toLocaleString("en-HK")} gift is directed to {causeLabel(latestDonation.cause_id)}. This is an expected-impact estimate until programme delivery is verified.</p>
                <ul><li><strong>{profile.donation_count}</strong><span>{profile.donation_count === 1 ? "gift recorded" : "gifts recorded"}</span></li><li><strong>HK${profile.lifetime_amount_hkd.toLocaleString("en-HK")}</strong><span>total support</span></li><li><strong>100%</strong><span>traceable in this profile</span></li></ul>
                <small>Impact is allocated from actual programme spend at quarter close. We never claim one gift caused an outcome alone.</small>
              </>
            ) : (
              <>
                <h2>Your first impact record will begin with your first gift.</h2>
                <p>Your donor profile is ready. Every future prototype donation will be kept here with its programme direction and expected impact.</p>
              </>
            )}
          </article>
          <article className="donor-profile-record">
            <p className="donor-community-eyebrow">The record behind the number</p><h2>Your donation timeline</h2>
            {profile.donations.length ? (
              <ol>
                {profile.donations.map((donation, index) => (
                  <li key={donation.donation_intent_id}>
                    <time>{formatDate(donation.created_at, true)} · prototype confirmed</time>
                    <h3>HK${donation.amount_hkd.toLocaleString("en-HK")} · {causeLabel(donation.cause_id)}</h3>
                    <p>{getDonationImpactMessage(donation.impact).headline} Reference: {donation.donation_intent_id}.</p>
                    <details className="donor-profile-donation-detail" open={index === 0}>
                      <summary><span>Detailed expected-impact record</span><small>Programme work, access, verification and reporting</small></summary>
                      <div className="donor-profile-donation-breakdown">
                        <h4>What your HK${donation.amount_hkd.toLocaleString("en-HK")} gift is expected to set in motion.</h4>
                        <p className="donation-outcome-lede"><strong>{getDonationImpactMessage(donation.impact).headline}</strong> This is a planning estimate, not a promise that one gift alone caused an outcome. It will be replaced with verified programme records after delivery.</p>
                        <DonationImpactBreakdown impact={donation.impact} />
                      </div>
                    </details>
                  </li>
                ))}
              </ol>
            ) : <p>No donations yet. When you make one, today’s record will appear here immediately.</p>}
          </article>
        </div>
        <aside>
          <article className="donor-profile-note"><img src="/images/crystal-performing.jpg" alt="Crystal performing with confidence at a Love 21 programme" /><p>“Thank you for helping create steady, practical support that lets people keep showing up.”</p><small>Participant imagery is shown with consent.</small></article>
          <article className="donor-profile-receipts"><h2>Donation records</h2>{profile.donations.length ? profile.donations.map((donation) => <p key={donation.donation_intent_id}><span>{formatDate(donation.created_at)} · HK${donation.amount_hkd.toLocaleString("en-HK")}</span><small>{donation.status}</small></p>) : <p><span>No records yet</span></p>}</article>
          <Link className="donor-community-button donor-community-button-primary" to="/donate">Make another donation</Link>
          <button className="donor-community-button" type="button" onClick={signOut}>Sign out</button>
        </aside>
      </main>
    </div>
  );
}
