<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Rules

1. **No Code Edits Without Permission**: Never create, modify, or delete project code files unless explicitly instructed by the user. Explain or draft solutions in chat only.
2. **Read Next.js Docs First**: Always consult official docs at https://nextjs.org/docs before starting any task.
3. **Verify Docs When Uncertain**: Check https://nextjs.org/docs whenever unsure about APIs, behavior, or features before answering. Do not guess.
4. **Strict TypeScript**: Use precise type definitions. Avoid `any`. Use specific types or `unknown` with type guards.

# Git Team Workflow

## Branches
- `main` = production. Protected.
- `dev` = integration/staging. Protected.
- `feature/*`, `fix/*` = branch from `dev`. Short-lived (1-3 days).
- `hotfix/*` = branch from `main`. Merge back to BOTH `main` and `dev`.

Flow: `feature/* -> PR -> dev -> PR -> main`

## Rules
- NEVER push directly to `main`/`dev`. PR only.
- NEVER commit on local `dev`. Use it only to pull updates.
- Merge into `dev`/`main` happens on GitHub via PR, not locally.
- NEVER delete `main`/`dev`. NEVER force push.
- Revert broken prod with `git revert`, not force push.

## One-time setup
```bash
git checkout main && git pull origin main
git checkout -b dev
git push -u origin dev
git branch -a   # verify remotes/origin/dev exists
```
GitHub: Settings -> Rules -> Rulesets -> New branch ruleset
- Enforcement: Active
- Add target: include pattern `main` and `dev` (0 targets = rule not applied)
- Rules: restrict deletions, block force pushes, require PR (approvals 1; 0 if solo), require status checks (if CI exists)
- Bypass list: empty
- Settings -> General: enable "Automatically delete head branches"
- Private repo on free plan: rules may not enforce. Needs Pro/Team or public.

## Per-task workflow
1. Start:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/<name>
```
2. Work: small, frequent commits. Conventional prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
3. Before PR: sync `dev` into feature.
```bash
git checkout dev && git pull origin dev
git checkout feature/<name>
git merge dev   # conflict: edit files, git add ., git commit
```
   Run tests after merge. Long tasks: sync `dev` periodically.
4. Push and open PR to `dev`:
```bash
git push -u origin feature/<name>
```
   Not finished but want to share/backup: open Draft PR.
5. Reviewer approves + CI green -> merge on GitHub.
6. `dev` tested OK -> PR `dev` -> `main`. Tag release (`v1.0.1`).
7. Cleanup (remote auto-deleted):
```bash
git branch -d feature/<name>
git fetch --prune
```

## Conflict avoidance
- Small tasks, short branches.
- Do not let two people edit the same file at once.
- Conflicts are resolved in the feature branch, never in `dev`.

## Issues and PRs
- One Issue per task/bug. Branch name references it: `feature/12-login-page`.
- PR description includes `Closes #12` so the Issue closes on merge.
- PR title follows commit style: `feat: add login page`.
- PR checklist: tests pass, `dev` synced, no unrelated changes.

## Notes
- `git branch` shows local only. Use `git branch -a` for remote.
- Local branch delete does not affect remote, and vice versa.
- Feature branch must be pushed to GitHub to open a PR.

