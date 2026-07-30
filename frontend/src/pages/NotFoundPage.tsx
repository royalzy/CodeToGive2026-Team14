import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="not-found">
      <div className="shell">
        <p className="eyebrow">404</p>
        <h1>This path has not been added yet.</h1>
        <p>Return to the community hub and choose another way in.</p>
        <Link className="button button-dark" to="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}

