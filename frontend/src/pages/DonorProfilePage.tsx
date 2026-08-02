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
import { getLocalizedImpactMessage } from "../content/donations";
import { donorProfileCopy } from "../content/donorProfile";
import { useLanguage } from "../hooks/useLanguage";
import { localizeDeep } from "../lib/zhConvert";

function formatDate(value: string, includeTime = false): string {
  return new Intl.DateTimeFormat("en-HK", {
    timeZone: "Asia/Hong_Kong",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(value));
}

export function DonorProfilePage() {
  const { t, lang } = useLanguage();
  const copy = localizeDeep(donorProfileCopy[lang === "en" ? "en" : "zh"], lang);
  const causeLabel = (causeId: string): string =>
    t.donationPrograms.find((program) => program.value === causeId)?.label
      ?? causeId.replaceAll("_", " ");
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
          setLoginError("check_profile_failed");
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
      setLoginError(error instanceof Error ? error.message : "sign_in_failed");
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
          <p className="donor-community-eyebrow">{copy.privateDonorProfile}</p>
          <h1>{lang === "en" ? "Your impact, kept honest." : localizeDeep("你的支持，留下清楚而真誠的記錄。", lang)}</h1>
          <p>{lang === "en" ? "Sign in to see your donation record, expected impact and supporter-wall notes that are still private to you." : localizeDeep("登入後查看收據、實際落地記錄和只有你能看到的待審核留言。", lang)}</p>
        </div>
        <form className="donor-profile-login-card" onSubmit={signIn}>
          <p className="donor-community-eyebrow">{copy.donorSignIn}</p>
          <h2>{copy.welcomeBack}</h2>
          {loginError && (
            <div className="form-alert" role="alert">
              {loginError === "check_profile_failed"
                ? copy.checkProfileError
                : loginError === "sign_in_failed"
                  ? copy.signInError
                  : loginError}
            </div>
          )}
          <label><span>{copy.emailLabel}</span><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={checkingSession || isSigningIn} /></label>
          <label><span>{copy.passwordLabel}</span><input type="password" required minLength={6} maxLength={128} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={checkingSession || isSigningIn} /></label>
          <button className="donor-community-button donor-community-button-primary" type="submit" disabled={checkingSession || isSigningIn}>
            {checkingSession ? copy.checkingSession : isSigningIn ? copy.signingIn : copy.viewMyProfile}
          </button>
          <small>{copy.passwordNote}</small>
        </form>
      </section>
    );
  }

  const latestDonation = profile.donations[0];

  return (
    <div className="donor-profile-page">
      <header className="donor-profile-header">
        <div className="donor-profile-identity"><span>{profile.profile.nickname.slice(0, 2)}</span><div><p className="donor-community-eyebrow">{copy.yourDonorProfile}</p><h1>{profile.profile.nickname}</h1><p>{copy.memberSince(formatDate(profile.profile.created_at))} · {profile.donation_count} {copy.giftWord(profile.donation_count)}</p></div></div>
        <div className="donor-profile-lifetime"><span>{copy.lifetimeGiving}</span><strong>HK${profile.lifetime_amount_hkd.toLocaleString("en-HK")}</strong><small>{copy.prototypeDonationsRecorded}</small></div>
      </header>
      <main className="donor-profile-grid">
        <div>
          <article className="donor-profile-achievement">
            <p className="donor-community-eyebrow">{copy.yourSharedImpact}</p>
            {latestDonation ? (
              <>
                <h2>{getLocalizedImpactMessage(latestDonation.impact, lang).headline}</h2>
                <p>{copy.latestGiftDirected(latestDonation.amount_hkd.toLocaleString("en-HK"), causeLabel(latestDonation.cause_id))}</p>
                <ul><li><strong>{profile.donation_count}</strong><span>{copy.giftRecordedWord(profile.donation_count)}</span></li><li><strong>HK${profile.lifetime_amount_hkd.toLocaleString("en-HK")}</strong><span>{copy.totalSupport}</span></li><li><strong>100%</strong><span>{copy.traceable}</span></li></ul>
                <small>{copy.impactAllocatedNote}</small>
              </>
            ) : (
              <>
                <h2>{copy.firstImpactHeadline}</h2>
                <p>{copy.firstImpactBody}</p>
              </>
            )}
          </article>
          <article className="donor-profile-record">
            <p className="donor-community-eyebrow">{copy.recordBehindNumber}</p><h2>{copy.donationTimeline}</h2>
            {profile.donations.length ? (
              <ol>
                {profile.donations.map((donation, index) => (
                  <li key={donation.donation_intent_id}>
                    <time>{formatDate(donation.created_at, true)} · {copy.prototypeConfirmed}</time>
                    <h3>HK${donation.amount_hkd.toLocaleString("en-HK")} · {causeLabel(donation.cause_id)}</h3>
                    <p>{getLocalizedImpactMessage(donation.impact, lang).headline} {copy.referenceLabel(donation.donation_intent_id)}</p>
                    <details className="donor-profile-donation-detail" open={index === 0}>
                      <summary><span>{copy.detailedRecordSummary}</span><small>{copy.detailedRecordSubtitle}</small></summary>
                      <div className="donor-profile-donation-breakdown">
                        <h4>{copy.setInMotionHeading(donation.amount_hkd.toLocaleString("en-HK"))}</h4>
                        <p className="donation-outcome-lede"><strong>{getLocalizedImpactMessage(donation.impact, lang).headline}</strong> {copy.planningEstimateNote}</p>
                        <DonationImpactBreakdown impact={donation.impact} />
                      </div>
                    </details>
                  </li>
                ))}
              </ol>
            ) : <p>{copy.noDonationsYet}</p>}
          </article>
        </div>
        <aside>
          <article className="donor-profile-note"><img src="/images/crystal-performing.jpg" alt="Crystal performing with confidence at a Love 21 programme" /><p>“{copy.quoteNote}”</p><small>{copy.consentNote}</small></article>
          <article className="donor-profile-receipts"><h2>{copy.donationRecords}</h2>{profile.donations.length ? profile.donations.map((donation) => <p key={donation.donation_intent_id}><span>{formatDate(donation.created_at)} · HK${donation.amount_hkd.toLocaleString("en-HK")}</span><small>{donation.status}</small></p>) : <p><span>{copy.noRecordsYet}</span></p>}</article>
          <Link className="donor-community-button donor-community-button-primary" to="/donate">{copy.makeAnotherDonation}</Link>
          <button className="donor-community-button" type="button" onClick={signOut}>{copy.signOut}</button>
        </aside>
      </main>
    </div>
  );
}
