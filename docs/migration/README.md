# Migration Index

This folder tracks the transition to the Supabase + Prisma stack.

## Key Docs
- MIGRATION_GUIDE.md: End-to-end steps and decisions
- MIGRATION_STATUS.md: Current state and next actions
- CONSOLIDATION_COMPLETE.md: Consolidation milestone notes
- migration-completed.md: Final verification details

## Completed Artifacts
See `_completed/` for extracted notes and playbooks:
- Phase summaries, verification reports
- Docs consolidation dashboards and decisions
- Tooling: Bun, Biome, Vitest, Prisma

## How to Use
- Before changes: update MIGRATION_STATUS.md
- After merging a slice: append notes to CONSOLIDATION_COMPLETE.md
- Keep PRs small and topic-focused (auth UX, services parity, docs, tests)
