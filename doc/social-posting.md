# Social Posting Implementation

The admin page can publish a post to Love 21's Instagram Business account and
Facebook Page at the same time. An admin uploads an image, writes a caption,
picks the platforms, and the backend handles resizing, hosting and publishing
through the Meta Graph API (v26.0).

## Structure

```text
backend/app/
├── api/routes/social.py     # POST /api/v1/social-posts (multipart upload)
├── schemas/social.py        # PlatformResult, SocialPostResponse
└── services/
    ├── meta.py              # Graph API calls, MetaError with Meta's own message
    └── image_host.py        # Cloudinary upload + reachability check

frontend/src/
├── components/admin/
│   ├── SocialComposer.tsx   # The composer form and result cards
│   └── SocialComposer.css   # Scoped styles for the section
├── pages/AdminPage.tsx      # Renders SocialComposer
└── api/client.ts            # publishSocialPost()
```

## Setup

Copy `backend/.env.example` to `backend/.env` and fill in five values.
Everything else on the site works without them; only the composer needs them.

**Meta** — generate a User Access Token in the Graph API Explorer for the
`team14hk` app, with `pages_show_list`, `pages_read_engagement`,
`pages_manage_posts`, `instagram_basic` and `instagram_content_publish`.

```text
META_USER_ACCESS_TOKEN=
META_PAGE_ID=            # optional; defaults to the first Page the token sees
```

**Cloudinary** — create a free account and copy the three values from the
dashboard homepage.

```text
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Then `make dev` is all that is needed. There is no tunnel to run.

## How a post is published

```text
browser    pick image -> local preview -> FormData { image, caption, platforms[] }
              |
backend    validate type and size
           Pillow: fix EXIF rotation, resize to <=1440px, re-encode as JPEG
              |
Cloudinary signed upload -> permanent CDN URL
              |
backend    fetch that URL as "facebookexternalhit" and confirm it is an image
              |
Meta       Instagram: POST /media -> POST /media_publish -> GET permalink
           Facebook:  POST /photos -> GET permalink
              |
browser    one result card per platform: status, permalink, copy-link button
```

Each platform is published independently, so Instagram succeeding while
Facebook fails returns a partial success rather than losing both. Every
failure carries Meta's own `error.message`, `type` and `code`.

## API contract

`POST /api/v1/social-posts` — multipart form

- `image` — JPEG, PNG or WebP, up to 10MB
- `caption` — up to 2200 characters (Instagram's limit)
- `platforms` — repeated field or comma-separated: `instagram`, `facebook`

Returns `201` with `caption`, `image_url`, and a `results` array holding
`platform`, `status`, `permalink`, `media_url` and `error` per platform.

Error responses use `detail` and are safe to show to the user directly:
`400` for a bad upload, `503` when configuration is missing or the image is
not publicly reachable, `502` when Meta rejects the request outright.

## Things that cost time, documented so they do not again

**Instagram cannot accept a file upload.** `POST /{ig-user-id}/media` takes an
`image_url` and Meta's servers fetch it themselves, so the image must be
publicly reachable. This is why Cloudinary is required rather than serving the
file from the backend.

**Error 9004 / subcode 2207052 is misleading.** It reads "Only photo or video
can be accepted as media type" but almost always means Meta could not fetch or
decode the image — a dead URL, an HTML interstitial, or dimensions outside
Instagram's limits. `image_host.verify_reachable()` exists to catch these and
report the real cause before Meta is called.

**Instagram image limits:** 320–1440px wide, under 8MB, aspect ratio between
4:5 and 1.91:1, JPEG. A raw phone or camera photo will fail, which is why the
backend resizes every upload.

**Instagram allows 100 posts per rolling 24 hours** per account. Check with
`GET /{ig-user-id}/content_publishing_limit?fields=config,quota_usage`.
Facebook Pages use engagement-based throttling instead, reported in the
`X-Business-Use-Case-Usage` response header.

**Tailwind utilities lose to `styles.css`.** Rules in `styles.css` are
unlayered while Tailwind's are in `@layer utilities`, and unlayered CSS wins
regardless of specificity. Anything that needs to override `styles.css` has to
be written as CSS, which is what `SocialComposer.css` is for.

## Limitations

- **`/admin` has no authentication.** Anyone who can reach the route can
  publish to Love 21's real accounts. This must be addressed before deployment.
- **The Meta token expires 2026-09-29.** Cloudinary credentials do not expire.
- **The app is in Development mode**, so only users with a role on the
  `team14hk` app can publish. Public use needs Meta App Review plus Business
  Verification, which requires a registered legal entity.
- **Images accumulate in Cloudinary.** Meta keeps its own copy once published,
  so the original is disposable, but it is kept as a record.
- **The composer is English-only.** The admin page does not use `useLanguage()`.
- **No automated tests yet** for the endpoint or the component.
