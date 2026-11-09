---
name: git-padrao
description: Git standard for the L.E.V. repo — branch naming, Conventional Commits in English with mandatory body, scopes, atomic commits, PR flow and forbidden content. Use whenever creating a branch, writing a commit message, splitting changes into commits, or opening a PR.
---

# Git standard — L.E.V.

## Golden rules
1. **English only** in commit messages, PR titles and PR descriptions.
2. **Never** add AI co-authorship or AI mentions (`Co-authored-by:`, "Generated with…", etc.).
3. **Atomic commits**: one logical change per commit. Code + its tests go together.
4. Every commit must pass `check-types` + `lint`. Tests may fail **only** in TDD red commits (see below); the PR as a whole must be fully green.

## TDD cycle (commit order)
```
test(<scope>): add failing specs for <rule>     # red   — specs + type stubs only
feat(<scope>): implement <rule>                  # green — makes specs pass
refactor(<scope>): <improvement>                 # optional
```
- Red commit includes only specs and the minimal stubs/signatures (e.g. `throw new Error("not implemented")`) so `check-types` passes.
- Red commit body must state which specs are expected to fail.
- Never merge a PR whose last commit is red.

## Commit format
```
<type>(<scope>): <subject>

<body — mandatory>

[footer — optional]
```

### Subject
- Imperative, lowercase, no period, max 72 chars.
- ✅ `feat(inscricoes): add guardian consent step`
- ❌ `Added consent.` / `feat: adiciona consentimento`

### Types
| Type | Use for |
|---|---|
| `feat` | new user-facing behavior |
| `fix` | bug fix |
| `refactor` | code change without behavior change |
| `test` | add/adjust tests only |
| `docs` | README, docs, comments |
| `chore` | deps, configs, tooling |
| `build` | Docker, build system |
| `ci` | GitHub Actions |
| `perf` | performance |
| `style` | formatting only |

### Scopes
Use the module/package name (keep domain names as in code, in Portuguese):
- Modules: `inscricoes`, `pontuacao`, `iniciativas`, `nucleos`, `projetos`, `pessoas`, `saude`, `mural`, `pagamentos`, `privacidade`, `consentimentos`, `gamificacao`, `participante`, `demo`, `shared`
- Packages/infra: `database`, `ui`, `auth`, `cms`, `web`, `e2e`, `docker`, `deps`, `repo`
- Omit scope only when the change is truly global.

### Body (mandatory)
- Explain **why** and **what changed** — not how (the diff shows how).
- Wrap at 72 chars. Bullets allowed.

### Footer
- Breaking change: `BREAKING CHANGE: <description>` (and `!` after scope: `feat(database)!: ...`).
- Issues: `Closes #12`.
- Prisma schema change → footer `Schema: <impact on DB / migration needed>`.

### Full example
```
feat(saude): encrypt health record fields at application level

Health records contain sensitive data from minors (LGPD art. 11).
Encrypting before persisting ensures a DB leak does not expose them.

- add AES-256-GCM encryption service behind a port
- encrypt allergies, medications and notes on save
- decrypt only in the leader read use case

Schema: FichaSaude text columns now store ciphertext (no migration)
```

## Branches
- `main` → stable, deployed to production. No direct push.
- Short-lived branches from `main`: `feat/<kebab-desc>`, `fix/…`, `chore/…`, `docs/…`, `refactor/…`, `test/…`, `ci/…`
- Example: `feat/stripe-checkout`, `fix/ranking-tiebreak`.

## Pull requests
- Title follows the commit format (`feat(pagamentos): add stripe checkout`).
- Merge with **Rebase and merge** (keeps the small atomic commits, linear history).
- CI must pass on the PR head: `lint`, `check-types`, Vitest, Playwright.
- One feature/fix per PR. Schema changes → describe DB impact in the PR.

## Splitting work into commits (procedure)
1. `git status` / `git diff` → group changes by logical unit.
2. Order: `chore`/`build` (setup) → `database` → `domain` → `application` → `infra` → `actions`/UI → `test` → `docs`.
3. Stage per unit with `git add <paths>` (or `git add -p`).
4. Write message following this skill; verify no forbidden content.

## Never commit
- `.env*` (except `.env.example`), Stripe/Resend/Auth keys, `*.pem`
- DB dumps, real personal data, health data, photos of participants
- Institutional files from outside the repo (`arquivos/`, `Vault LEV/`)
