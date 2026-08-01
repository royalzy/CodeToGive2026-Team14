# Social Posting Implementation

The admin page can publish to Love 21's Instagram Business account and Facebook
Page at the same time. An admin attaches images, writes a caption, picks the
platforms, and the backend handles resizing, hosting and publishing through the
Meta Graph API (v26.0).

The shape of the post follows from what is attached:

| Images | Instagram | Facebook |
| ------ | --------- | -------- |
| none   | not available — Instagram always requires media | text-only post |
| one    | single image post | photo post |
| 2–10   | carousel | multi-photo post |

A carousel counts as one post against Instagram's quota, not one per image.
Captions can be shared across both platforms or written separately for each.

## Structure

```text
backend/app/
├── api/routes/social.py     # POST /api/v1/social-posts (multipart upload)
├── schemas/social.py        # PlatformResult, SocialPostResponse, caption limits
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
browser    attach images -> local previews -> FormData
              { images[], caption, caption_instagram?, caption_facebook?, platforms[] }
              |
backend    validate count, type and size
           Pillow, per image: fix EXIF rotation, resize to <=1440px,
           re-encode as JPEG
              |
Cloudinary signed upload per image -> permanent CDN URLs
              |
backend    fetch each URL as "facebookexternalhit" and confirm it is an image
              |
Meta       Instagram, one image:  POST /media -> /media_publish
           Instagram, carousel:   POST /media per child (is_carousel_item)
                                  -> POST /media (CAROUSEL, children=...)
                                  -> poll status_code until FINISHED
                                  -> /media_publish
           Facebook, no image:    POST /feed (message)
           Facebook, one image:   POST /photos
           Facebook, many:        POST /photos published=false per image
                                  -> POST /feed with attached_media[n]
              |
browser    one result card per platform: status, permalink, copy-link button
```

Each platform is published independently, so Instagram succeeding while
Facebook fails returns a partial success rather than losing both. Every
failure carries Meta's own `error.message`, `type` and `code`.

## API contract

`POST /api/v1/social-posts` — multipart form

| Field | Required | Notes |
| ----- | -------- | ----- |
| `platforms` | yes | repeated or comma-separated: `instagram`, `facebook` |
| `images` | no | repeated field, up to 10. JPEG, PNG or WebP, 10MB each |
| `caption` | no* | shared caption, used when no per-platform override |
| `caption_instagram` | no | overrides `caption` for Instagram, max 2200 |
| `caption_facebook` | no | overrides `caption` for Facebook, max 63206 |

\* Every selected platform must end up with a caption, from either its own
override or the shared one.

Returns `201` with `image_urls` (empty for a text-only post) and a `results`
array holding `platform`, `status`, `caption`, `permalink`, `media_url` and
`error` per platform.

Error responses use `detail` and are safe to show to the user directly:
`400` for a bad request, `413` for an oversized image, `503` when
configuration is missing or an image is not publicly reachable, `502` when
Meta rejects the request outright.

## Things that cost time, documented so they do not again

**Instagram cannot accept a file upload.** `POST /{ig-user-id}/media` takes an
`image_url` and Meta's servers fetch it themselves, so images must be publicly
reachable. This is why Cloudinary is required rather than serving files from
the backend.

**Error 9004 / subcode 2207052 is misleading.** It reads "Only photo or video
can be accepted as media type" but almost always means Meta could not fetch or
decode the image — a dead URL, an HTML interstitial, or dimensions outside
Instagram's limits. `image_host.verify_reachable()` catches these and reports
the real cause before Meta is called.

**Carousels must be polled before publishing.** A carousel parent container
assembles its children asynchronously. Publishing too early fails with
"Media ID is not available" (code 9007 / subcode 2207027), which says nothing
about the real cause. `meta._wait_for_container()` polls `status_code` until
`FINISHED`, with backoff and a 90 second timeout. Single-image containers are
ready immediately, which is why this only shows up once carousels are used.
A three-image carousel takes roughly 45 seconds end to end.

**FastAPI will not parse `list[UploadFile] | None` as a file list.** It arrives
empty with no error, so a multi-image request silently degrades to a text-only
post. Use a plain `list[UploadFile]` with a default instead.

**Instagram image limits:** 320–1440px wide, under 8MB, aspect ratio between
4:5 and 1.91:1, JPEG. A raw phone or camera photo will fail, which is why the
backend resizes every upload.

**Instagram allows 100 posts per rolling 24 hours** per account, and a carousel
counts as one. Check with
`GET /{ig-user-id}/content_publishing_limit?fields=config,quota_usage`.
Facebook Pages use engagement-based throttling instead, reported in the
`X-Business-Use-Case-Usage` response header.

**Tailwind utilities lose to `styles.css`.** Rules in `styles.css` are
unlayered while Tailwind's are in `@layer utilities`, and unlayered CSS wins
regardless of specificity. Anything overriding `styles.css` has to be written
as CSS, which is what `SocialComposer.css` is for. Watch for specificity ties
too: `.section-heading > p:last-child` and `.admin-social .section-heading p`
are both `(0,2,1)`, so source order decides and `styles.css` wins.

## Limitations

- **`/admin` has no authentication.** Anyone who can reach the route can
  publish to Love 21's real accounts. This must be addressed before deployment.
- **The Meta token expires 2026-09-29.** Cloudinary credentials do not expire.
- **The app is in Development mode**, so only users with a role on the
  `team14hk` app can publish. Public use needs Meta App Review plus Business
  Verification, which requires a registered legal entity.
- **Video is not supported.** Instagram would need `media_type=REELS` plus the
  same container polling, a much larger upload limit, and video handling in
  Cloudinary.
- **Images accumulate in Cloudinary.** Meta keeps its own copy once published,
  so the originals are disposable, but they are kept as a record.
- **The composer is English-only.** The admin page does not use `useLanguage()`.
- **No automated tests yet** for the endpoint or the component.
