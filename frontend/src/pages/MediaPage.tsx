import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { PageHero } from "../components/Cards";
import { deleteMediaPost, type MediaPost } from "../api/client";
import mediaPosts from "../content/media-posts.json";
import "./MediaPage.css";

// Written by the admin composer (backend/app/services/media_store.py), newest
// first, so the feed renders the file in order without sorting.
const initialPosts = mediaPosts as MediaPost[];

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function MediaEntry({
  post,
  manage,
  onDelete,
  busy,
}: {
  post: MediaPost;
  manage: boolean;
  onDelete: (id: string) => void;
  busy: boolean;
}) {
  const [cover, ...rest] = post.images;

  return (
    <article className="media-entry">
      <div className="media-entry-image">
        <img src={cover} alt="" loading="lazy" />
        {rest.length > 0 ? (
          <span className="media-entry-count">+{rest.length}</span>
        ) : null}
      </div>

      <div className="media-entry-body">
        <p>{post.caption}</p>

        {/* Pushed to the bottom of the pane, whatever the caption's length. */}
        <div className="media-entry-footer">
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>

          {manage ? (
            <button
              type="button"
              className="media-entry-delete"
              onClick={() => onDelete(post.id)}
              disabled={busy}
            >
              {busy ? "Deleting…" : "Delete post"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function MediaPage() {
  const [searchParams] = useSearchParams();
  // Delete controls only appear when the admin arrives via the dashboard link.
  const manage = searchParams.get("manage") === "1";

  const [posts, setPosts] = useState<MediaPost[]>(initialPosts);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setError(null);
    setDeleting(id);
    try {
      await deleteMediaPost(id);
      // Drop it locally too: the feed is imported at build time, so it would
      // otherwise linger until the dev server reloads the JSON.
      setPosts((current) => current.filter((post) => post.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the post.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <div className="media-hero">
        <PageHero
          eyebrow="Media"
          title="Moments from the community"
          body="Photos and updates from Love 21 programmes, published as they happen."
          tone="blue"
        />
      </div>

      <section className="section">
        <div className="shell">
          {manage ? (
            <p className="media-manage-note">
              Managing posts. Deleting removes the image and its entry from the
              site.
            </p>
          ) : null}

          {error ? (
            <p className="media-error" role="alert">
              {error}
            </p>
          ) : null}

          {posts.length > 0 ? (
            <div className="media-feed">
              {posts.map((post) => (
                <MediaEntry
                  key={post.id}
                  post={post}
                  manage={manage}
                  onDelete={handleDelete}
                  busy={deleting === post.id}
                />
              ))}
            </div>
          ) : (
            <p className="media-empty">No posts yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
