# Recovery Tracker

> Snapshot of consolidated recovery work and small PRs that folded in changes from historical branches.

## Completed PRs
- #14 docs: recovery status + docs index
- #15 ux: redirects unauthenticated to /login; CTA unification
- #17 refactor: consolidate API service imports
- #18 ui: calendar dialog +1h end-time behavior
- #19 ui: admin dashboard/communications a11y polish
- #20 ui/tests: CTA alignment, a11y labels, time-utils unit tests
- #21 ui: announcements pinned-only filter
- #22 ui: 'Pinned' badge on cards
- #23 ui: useId for filter; 'Pinned' badge in detail
- #24 ui: announcements copy polish; EventDialog testids
- #25 tests: EventDialog render tests; ResizeObserver polyfill

## In Progress / Ongoing
- Admin/UI parity micro-copy in tiles and headers
- Calendar recurring schedule interpretation (placeholder)

## Notes
- All auth flows point to `/login` (signup/register redirect).
- Services consistently import via `@/lib/services`.
- CI build stabilized; test suite green with jsdom polyfills.

