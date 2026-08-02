import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { PageHero } from "../components/Cards";
import { deleteMediaPost, type MediaPost } from "../api/client";
import mediaPosts from "../content/media-posts.json";
import { useLanguage } from "../hooks/useLanguage";
import { localizeDeep } from "../lib/zhConvert";
import type { Lang } from "../content/languageContextValue";
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
  lang,
}: {
  post: MediaPost;
  manage: boolean;
  onDelete: (id: string) => void;
  busy: boolean;
  lang: Lang;
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
              {busy
                ? lang === "en"
                  ? "Deleting…"
                  : localizeDeep("刪除中…", lang)
                : lang === "en"
                  ? "Delete post"
                  : localizeDeep("刪除貼文", lang)}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function MediaPage() {
  const { lang } = useLanguage();
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
      setError(
        err instanceof Error
          ? err.message
          : lang === "en"
            ? "Could not delete the post."
            : localizeDeep("無法刪除此貼文。", lang),
      );
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <div className="media-hero">
        <PageHero
          eyebrow={lang === "en" ? "Media" : localizeDeep("媒體", lang)}
          title={lang === "en" ? "Moments from the community" : localizeDeep("社群中的美好時刻", lang)}
          body={
            lang === "en"
              ? "Photos and updates from Love 21 programmes, published as they happen."
              : localizeDeep("Love 21 各項目的照片與最新消息，隨時發佈。", lang)
          }
          tone="blue"
        />
      </div>

      <section className="section">
        <div className="shell">
          {manage ? (
            <p className="media-manage-note">
              {lang === "en"
                ? "Managing posts. Deleting removes the image and its entry from the site."
                : localizeDeep("正在管理貼文。刪除會同時移除圖片及其在網站上的紀錄。", lang)}
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
                  lang={lang}
                />
              ))}
            </div>
          ) : (
            <p className="media-empty">{lang === "en" ? "No posts yet." : localizeDeep("暫無貼文。", lang)}</p>
          )}
        </div>
      </section>
    </>
  );
}
