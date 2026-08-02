import { useCallback, useEffect, useState } from "react";

import {
  deleteScheduledPost,
  listScheduledPosts,
  publishScheduledPost,
  type PlatformId,
  type ScheduledPost,
} from "../../api/client";

const PLATFORM_LABEL: Record<PlatformId, string> = {
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
};

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

function PendingRow({
  post,
  busy,
  onPublish,
  onDelete,
}: {
  post: ScheduledPost;
  busy: boolean;
  onPublish: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  // Collapsed by default so a long list stays scannable; expanding shows
  // enough to identify which post it is.
  const [open, setOpen] = useState(false);
  const overdue = new Date(post.scheduled_for).getTime() < Date.now();
  // The backend only auto-publishes website-only posts; anything touching
  // Meta waits for a person. Say so rather than leaving it a hidden rule.
  const autoPublishes = post.platforms.length === 1 && post.platforms[0] === "website";
  const firstCaption =
    post.captions[post.platforms[0]] ?? Object.values(post.captions)[0] ?? "";

  return (
    <li className="pending-row">
      <div className="pending-summary">
        <button
          type="button"
          className="pending-toggle"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true">{open ? "▾" : "▸"}</span>
          <span className="pending-when">
            {formatWhen(post.scheduled_for)}
            {overdue && !autoPublishes ? <em className="pending-overdue"> · due</em> : null}
          </span>
          <span className="pending-preview">{firstCaption.slice(0, 48)}</span>
        </button>

        <span className="pending-platforms">
          {post.platforms.map((p) => PLATFORM_LABEL[p]).join(" · ")}
          <span className={autoPublishes ? "pending-auto" : "pending-manual"}>
            {autoPublishes ? "posts automatically" : "needs you"}
          </span>
        </span>
      </div>

      {open ? (
        <div className="pending-detail">
          <div className="pending-thumbs">
            {post.images.map((src) => (
              <img key={src} src={src} alt="" loading="lazy" />
            ))}
          </div>

          <dl className="pending-captions">
            {post.platforms.map((platform) => (
              <div key={platform}>
                <dt>{PLATFORM_LABEL[platform]}</dt>
                <dd>{post.captions[platform] ?? "—"}</dd>
              </div>
            ))}
          </dl>

          <div className="pending-actions">
            <button
              type="button"
              className="pending-publish"
              onClick={() => onPublish(post.id)}
              disabled={busy}
            >
              {busy ? "Posting…" : "Post now"}
            </button>
            <button
              type="button"
              className="pending-delete"
              onClick={() => onDelete(post.id)}
              disabled={busy}
            >
              Delete
            </button>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export function PendingPosts({ refreshKey }: { refreshKey: number }) {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setPosts(await listScheduledPosts());
    } catch {
      // The list is not critical enough to shout about; the composer still works.
      setPosts([]);
    }
  }, []);

  useEffect(() => {
    void load();
    // The backend publishes due website posts on its own, so refresh
    // periodically or the queue would show posts that have already gone out.
    const timer = window.setInterval(() => void load(), 30_000);
    return () => window.clearInterval(timer);
  }, [load, refreshKey]);

  async function handlePublish(id: string) {
    setError(null);
    setNotice(null);
    setBusyId(id);
    try {
      const response = await publishScheduledPost(id);
      const ok = response.results.filter((r) => r.status === "published");
      const failed = response.results.filter((r) => r.status === "failed");
      setNotice(
        failed.length === 0
          ? `Published to ${ok.map((r) => PLATFORM_LABEL[r.platform]).join(" and ")}.`
          : `Published to ${ok.length} of ${response.results.length}. ` +
              failed.map((r) => `${PLATFORM_LABEL[r.platform]}: ${r.error}`).join(" "),
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish that post.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    setNotice(null);
    setBusyId(id);
    try {
      await deleteScheduledPost(id);
      setPosts((current) => current.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete that post.");
    } finally {
      setBusyId(null);
    }
  }

  if (posts.length === 0 && !notice && !error) return null;

  return (
    <div className="pending-posts">
      <h3>Scheduled posts</h3>

      {notice ? <p className="pending-notice">{notice}</p> : null}
      {error ? (
        <p className="pending-error" role="alert">
          {error}
        </p>
      ) : null}

      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <PendingRow
              key={post.id}
              post={post}
              busy={busyId === post.id}
              onPublish={handlePublish}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      ) : (
        <p className="pending-empty">Nothing scheduled.</p>
      )}
    </div>
  );
}
