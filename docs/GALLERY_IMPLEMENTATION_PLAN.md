# Gallery Stage: Discovery, Curation, and Search Visibility

This stage prepares the gallery for a trustworthy, accessible, and discoverable shop/site experience. The gallery should show authentic outdoor-therapy moments while excluding content that is graphic, promotional, duplicated, or unsuitable for public display.

## Goals

- Establish a reviewed source of truth for every gallery image.
- Improve browsing on mobile, desktop, keyboard, and touch devices.
- Give search engines meaningful image context without sacrificing accessibility or privacy.
- Produce concise, human-reviewed descriptions for image recognition and alt text.
- Remove matching or near-matching duplicates, gore, logos, flyers, and marketing material.

## Stage 1 — Discovery and audit

1. Inventory all gallery files, dimensions, file sizes, current URLs, and existing metadata.
2. Compare the local asset set with the live WordPress gallery and record missing candidates separately; do not publish automatically downloaded content.
3. Group assets by likely event, scene, and visual similarity.
4. Identify images containing participants, minors, license plates, medical details, or other personally identifying information for consent/privacy review.
5. Define the gallery audience, primary conversion goal, and priority search topics with the organization before changing the presentation.

## Stage 2 — Content curation

Each candidate receives a review status: `keep`, `needs-review`, or `exclude`, plus an exclusion reason.

Exclude:

- Exact duplicates and near-duplicates (perceptual-hash review, followed by human confirmation).
- Gore, severe injury, blood, graphic medical scenes, or imagery likely to distress visitors.
- Standalone logos, flyers, posters, signs, screenshots, and other marketing collateral.
- Promotional graphics whose primary purpose is advertising rather than documenting the organization’s work.
- Images without appropriate permission or with unresolved privacy/consent concerns.

Keep the strongest representative when a sequence contains repeated frames. Preserve the original files outside the published gallery so exclusions remain reversible.

## Stage 3 — UX discovery and implementation brief

Evaluate a responsive grid or masonry layout against a simple editorial grid. Test:

- Clear grouping by event, activity, or year without forcing visitors to understand internal filenames.
- Fast thumbnails with stable aspect-ratio boxes, lazy loading below the fold, and responsive image sizes.
- A lightbox/detail view with a visible caption, next/previous controls, close control, focus management, Escape-key support, and touch gestures.
- Keyboard and screen-reader navigation, visible focus states, reduced-motion support, and adequate color contrast.
- A hover treatment that reveals the caption without obscuring the image; the same description must remain available on focus, touch, and in the detail view.

“Alt text on mouseover” is not reliable browser behavior: alt text is an accessibility fallback, not a dependable tooltip. Use concise alt text for the image and a visible caption or tooltip for hover/focus, with equivalent text available to assistive technology.

## Stage 4 — SEO and image recognition

For each published image, maintain structured metadata:

```text
id, src, alt, caption, event, activity, location, date, people/privacy review,
sort order, review status, and exclusion reason
```

SEO work should include descriptive filenames where practical, stable local URLs, semantic headings and captions, explicit image dimensions, meaningful page copy around the gallery, Open Graph image handling, and an image sitemap only if it adds value after launch. Avoid keyword stuffing, invented identities, or claims that cannot be verified.

Image-recognition tooling may suggest scenes, activities, and duplicate matches, but it must remain an assistive review step. A human should approve every public description and every exclusion, particularly for people, veterans, children, sensitive activities, and locations.

## Stage 5 — QA and launch checklist

- No published gallery URL returns 404.
- Every published image has useful, concise alt text; decorative images use empty alt text.
- Hover, focus, touch, and detail-view descriptions are equivalent.
- Duplicate, gore, logo, flyer, and marketing-material checks are complete.
- Privacy/consent review is complete for identifiable people.
- Lighthouse/Core Web Vitals, responsive layout, keyboard navigation, and screen-reader smoke tests pass.
- Search metadata and canonical/local image URLs are verified in production.

## Recommended implementation order

1. Audit and produce the reviewed manifest.
2. Remove/exclude unsuitable and duplicate assets.
3. Add metadata fields and approved alt text/captions.
4. Implement the responsive gallery and accessible detail view.
5. Optimize image delivery and add SEO enhancements.
6. Run QA, obtain content approval, and publish.

## Implementation record

Implemented in the current application:

- Local gallery assets are the default source and the quote-section image uses its existing local full-size file.
- Gallery records support alt text, captions, tags, year, publication status, sort order, and timestamps.
- The database-backed gallery falls back to the curated local manifest when no database is configured.
- Duplicate file paths are removed from the seed manifest and the known standalone logo asset is excluded.
- The public gallery has responsive optimized images, stable image containers, descriptive alt text, hover titles, captions in the lightbox, and keyboard Escape/arrow controls.
- Admins can upload batches of images, edit metadata, unpublish images, and delete records/uploads.
- Public and admin testimonial lists support category and year filters.
- Admin Wiki documentation is available at `/admin/wiki`.

Remaining editorial work is intentionally human review: inspect borderline images for gore, privacy/consent, logos, flyers, marketing collateral, and accuracy of each image description before publishing. The admin metadata fields make that review actionable without a code deployment.
