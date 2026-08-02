# Media Page and Website Publishing

The admin composer can publish to the Love 21 website as well as Instagram and
Facebook. Website posts are written to disk in this repository and shown on a
new `/media` page, so the site carries its own feed rather than depending on
social platforms.

Website is the first of the three options in the composer, and is the only one
that works with no external credentials at all.

## Structure

```text
backend/app/
├── api/routes/media.py        # GET/DELETE /api/v1/media-posts
├── api/routes/social.py       # publishing, now including "website"
└── services/media_store.py    # writes, lists and deletes posts on disk

frontend/
├── public/media/              # published images (committed)
└── src/
    ├── content/media-posts.json   # the index the page reads (committed)
    ├── pages/MediaPage.tsx        # the feed, plus admin delete controls
    ├── pages/MediaPage.css
    └── components/admin/SocialComposer.tsx  # website added as a platform
```

## How a website post is stored

Nothing is sent anywhere. The already-normalised JPEG is written to
`frontend/public/media/<id>-<n>.jpg`, and an entry is prepended to
`frontend/src/content/media-posts.json`:

```json
{
  "id": "3d2dc320b319",
  "caption": "Cooking together",
  "images": ["/media/3d2dc320b319-1.jpg"],
  "published_at": "2026-08-02T07:11:10+00:00"
}
```

Both paths are tracked by git, so publishing produces an ordinary working-tree
change. **Nothing here runs git** — that was a deliberate choice. A web request
staging files or pushing to a shared branch can sweep up unrelated work, fail
when the remote has moved, and commit to whatever branch happens to be checked
out. Committing is left to a person.

The page imports the JSON directly rather than fetching it, so the feed still
works with the backend stopped and survives a production build.

## Publishing rules

| Images | Website | Instagram | Facebook |
| --- | --- | --- | --- |
| none | not available | not available | text-only post |
| one | single post | single post | photo post |
| 2–10 | first image with a `+N` badge | carousel | multi-photo post |

Website and Instagram both require an image; their checkboxes are disabled
until one is attached, and re-enable automatically afterwards.

Captions can be shared or written separately per platform. The split view
renders one box per selected platform with its own limit: Website 5,000,
Instagram 2,200, Facebook 63,206.

## Meta credentials are only required for Meta

`create_social_post` used to call `meta.require_token()` before doing anything.
That is now deferred until a Meta platform is actually targeted, so a
website-only post publishes with no Meta token and no Cloudinary account.

Once anything has published, later Meta problems are reported **per platform**
rather than raised. Without this, a post to all three while Meta was blocked
wrote the website files to disk and then returned a 502, so the interface
reported total failure while the files were already in the working tree. The
result now reads:

```text
Posted with some issues
1 of 3 platforms published.
  Website    Published   View post
  Instagram  Failed      API access blocked. (type=OAuthException, code=200)
  Facebook   Failed      API access blocked. (type=OAuthException, code=200)
```

## Managing posts

`GET /api/v1/media-posts` lists them; `DELETE /api/v1/media-posts/{id}` removes
the entry and its image files.

Delete controls are not on the public page. The admin dashboard links to
`/media?manage=1`, and only that query parameter reveals them. This is
presentation, not security — the endpoint is unauthenticated like the rest of
the demo.

Deleting also removes the post from local state, because the feed is imported
at build time and would otherwise linger until the dev server reloaded.

`DELETE` had to be added to the CORS `allow_methods` list in `main.py`, or the
browser preflight fails with a 400.

## Feed layout

Image on the left, caption on the right, date pinned to the bottom of the pane
with `margin-top: auto` so it sits on the same baseline whatever the caption's
length.

The image frame is a fixed width so every card lines up, but the photo inside
is never cropped — `object-fit: contain` with a 220–460px height bound, so a
9:16 portrait shows in full and letterboxes rather than being cut to a square.

## Notes for whoever touches this next

**`make demo` does not reload the backend.** Unlike `make dev` it runs uvicorn
without `--reload`, so backend changes need a full restart. A missing route or
a stale CORS list will otherwise look like a frontend bug.

**Tailwind utilities lose to `styles.css`,** whose rules are unlayered and beat
Tailwind's `@layer utilities` regardless of specificity. Page styling therefore
lives in `MediaPage.css`.

**The theme pads page heroes twice** — `.page-hero` and `.page-hero-inner` —
so `.media-hero` trims it locally. The same duplicate padding affects every
other banner on the site.

## Limitations

- **No editing.** A post can only be deleted and republished.
- **Carousels show the first image** with a `+N` badge; there is no lightbox.
- **Captions are not translated.** A post is written once in whatever language
  it was typed and reads the same in both language modes.
- **No authentication**, consistent with the rest of the admin page.
- **Images accumulate in the repository.** Fine at demo volume; a real site
  would want them on a CDN.
- **No automated tests** for the media route, store or page.
