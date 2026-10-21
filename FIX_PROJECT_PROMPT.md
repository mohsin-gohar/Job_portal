# FIX PROMPT — NextRole Job Portal (F:\react\Job_portal)

> **How to use:** paste everything below this line to the AI agent that will fix the project.
> It is self-contained: it lists every verified defect, the exact location, the fix, and how to prove it is done.

---

## 0. ROLE & GOAL

You are a senior frontend engineer taking over an existing React 19 + TypeScript + Vite + Tailwind v4 project called **NextRole** (a job portal) located at `F:\react\Job_portal`.

Your job: **turn this prototype into a genuinely production-grade application whose code, bundle, data and documentation are all honest.** The UI design is already good — do not redesign it. Fix what is broken, fake, unverified, inaccessible, slow, or lying.

### 0.1 Non-negotiable rules

1. **Do NOT redesign the UI.** Keep the Tailwind utility styling, the 7-theme accent system (`data-theme` + `--color-primary-*` CSS variables in `src/index.css`), the Plus Jakarta Sans / JetBrains Mono typography, the card / list view toggle, and the existing page structure. This is an assignment project with a completed visual design.
2. **Do NOT remove features.** Search, multi-filter, pagination, grid/list toggle, bookmark/watchlist, job detail, applications tracker, post-a-job, theme switcher, toast notifications — all stay.
3. **Do NOT replace the curated dataset** in `src/data/mockJobs.ts` (24 jobs). It stays as the offline fallback.
4. **Do NOT write any explanatory code comments** unless the code is genuinely non-obvious.
5. **Do NOT add new frameworks.** Stay on React 19, TypeScript, Vite 8, Tailwind v4, react-router-dom 7, lucide-react. Adding a backend is allowed (Express is already a dependency) but keep it minimal and dependency-light.
6. **Work in verifiable increments.** After every task: run `npm run typecheck` and `npm run build` and make sure both pass. Never leave the tree broken.
7. **Re-verify before fixing.** Some items below may already have been fixed by an earlier pass (a 404 page, the `import.meta.dirname` fix in `vite.config.ts`, and the dependency version bumps in `package.json` are already in place). For each item, open the file, confirm the defect still exists, and fix only what is still broken.

---

## 1. VERIFIED PROJECT STATE (measured, not guessed)

Measured on this machine with `npm install`, `npx tsc --noEmit`, and `npm run build`:

| Check | Result |
|---|---|
| `npx tsc --noEmit` | passes (exit 0) — but only because `tsconfig.json` has **no `strict` flag** |
| `npm run build` | passes, but emits: **JS chunk 1,000.42 kB (266.66 kB gzip)** with a "chunks larger than 500 kB" warning, **CSS 275.30 kB (39.35 kB gzip)** |
| Built CSS contents | **2,587** `--bs-` variables and **524** Bootstrap component classes, while the source uses **zero** Bootstrap classes |
| `src/` usage of `motion`, `@google/genai`, `express`, `dotenv` | **0 imports** |
| Bootstrap classes used anywhere in `src/**/*.tsx` | **0** (all 15 grep hits were the words "row"/"container" inside Tailwind classes) |
| `tailwindcss-animate` installed? | **No** — but `animate-in`, `fade-in`, `zoom-in-95`, `slide-in-from-bottom-5` are used in 3 files |
| Remotive live API `?limit=30` | returns only **10** jobs (upstream caps the page size) |
| Remotive payload fields | `id, url, title, company_name, company_logo, category, tags, job_type, publication_date, candidate_required_location, salary, description` — **a real `salary` field exists and is currently discarded** |
| Remotive `salary` samples | `$1000 per task`, `$170k - $200k`, `$35,3k- $52k`, `OTE $25k - $35k`, `` (empty), `$50-$75 /hour` |
| `src/assets/images/` | 4.15 MB of JPGs; 2 of the 5 files (`luxury_exec_lounge_*.jpg` 802 kB, `luxury_exec_workspace_*.jpg` 790 kB) are **referenced nowhere** |
| Test files / test runner | **none** |
| ESLint / Prettier config | **none** (the `lint` script is just `tsc --noEmit`) |

---

## 2. DEFECT LIST — FIX ALL OF THESE

### P0 — Blockers (the project does not meet its own documentation)

**2.1 — `npm install` must succeed with no flags.**
`esbuild@^0.25.0` conflicted with `vite@8.3.5` (needs `esbuild@^0.27 || ^0.28`) → `npm install` aborted with ERESOLVE; only `--legacy-peer-deps` worked. A newer pass has already bumped `esbuild` to `^0.28.0` and `typescript` to `~5.9.3` — **verify** that a clean `rm -rf node_modules && npm install` now succeeds with zero errors and zero warnings, and that `npm run build` still works afterwards. Also decide the package manager: a `bun.lock` existed and is now replaced by `package-lock.json` — keep **one** lockfile, and make the README state the correct install command.

**2.2 — TypeScript must be strict.**
`tsconfig.json` has no `strict`, no `noUnusedLocals`, no `noUnusedParameters`, no `noFallthroughCasesInSwitch`, and no `include`/`exclude`. Enable `strict: true` (+ the `noUnused*` flags), add a proper `include: ["src"]`, and fix every resulting error. If `allowImportingTsExtensions` conflicts with anything, resolve it properly rather than by disabling the check.

**2.3 — The README's requirement table must be true.**
`README.md` marks every row "Done" and the checklist claims things that do not exist:
- line 19 claims `useEffect` is used for **"debouncing"** and **"URL param syncing"** — neither exists (§3.1, §3.2).
- line 29 claims the API layer "combines live public remote jobs **and curated tech positions**" with a "live public remote jobs (Remotive API)" — true, but the live payload is mangled (§3.4–3.6).
- line 16 claims "**Live REST API endpoints** with async/await, pagination, and persistence" — there is **no server at all**; `src/services/api.ts` is a client-side mock using `simulateNetworkDelay()` (lines 166–167) and `localStorage` (lines 307–313, 371–374).
- lines 13/36 claim **Bootstrap 5** — see §2.4.
- `metadata.json:5` declares `"majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]` but there is no server and `@google/genai` is imported nowhere; `.env.example` documents `GEMINI_API_KEY` / `APP_URL` that nothing reads; `package.json`'s `clean` script deletes a `server.js` that does not exist.

**Fix by choosing ONE of these two directions and executing it completely — do not leave it half-done:**
- **(A) Real backend (recommended, matches the assignment wording "complete REST API integration").** Add a small Express server (`server/index.ts`) that owns the job list, saved jobs, applications and posted jobs (SQLite via `better-sqlite3`, or a JSON-file store if you want zero new native deps), exposes real REST endpoints (`GET /api/jobs`, `GET /api/jobs/:id`, `POST /api/applications`, `POST /api/jobs`, `GET/POST/DELETE /api/saved`), and serves the Vite build. The frontend `src/services/api.ts` then becomes a thin `fetch` layer that talks to the server, with the existing mock/localStorage path kept only as an offline fallback. Wire the `.env.example` variables to real config, and either implement the Gemini feature (e.g. AI-generated job description enrichment or a "summarize this job" action) or remove `@google/genai` from the dependencies and drop the capability from `metadata.json`. Add `dev:api` / `dev:all` scripts and document them.
- **(B) Honest front-end-only app.** Delete `express`, `dotenv`, `@google/genai`, the Gemini capability in `metadata.json`, the `server.js` reference in the `clean` script, and rewrite the README to describe a client-side app that consumes a public REST API with a local-persistence fallback — and say so plainly.

Whichever you choose, the README, `metadata.json`, `.env.example` and `package.json` must all agree with the code.

**2.4 — Bootstrap 5: use it or remove it.**
`src/main.tsx:2` imports `bootstrap/dist/css/bootstrap.min.css` globally, yet no Bootstrap class is used anywhere in the app, and the Bootstrap **JS** bundle is never imported (so no Bootstrap component ever works). The result is ~230 kB of dead CSS (2,587 `--bs-` variables, 524 component classes) shipped to users.
**Fix:** remove the Bootstrap import and the `bootstrap` dependency, and remove "Bootstrap 5" from the README/tech stack — OR genuinely rebuild the app on Bootstrap 5 components and remove Tailwind. Do not keep both frameworks half-used. Recommended: Tailwind only, README corrected.

**2.5 — Add a real lint + test setup.**
- `package.json:11` `"lint": "tsc --noEmit"` — rename to `typecheck` and add a real ESLint 9 flat config (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, plus `npm run lint`. Keep `typecheck` as a separate script.
- Add **Vitest + Testing Library + jsdom** with at least these suites:
  - `src/services/api.ts` — filter/sort/pagination logic, salary parsing, upstream-failure fallback.
  - `src/hooks/useJobs.ts` — page reset on filter change, limit change clamping (§3.3), stale-response guard.
  - `src/components/ApplicationModal.tsx` — validation rules (email regex, phone digits, file type/size, 30-char cover letter) and reset-on-reopen (§4.1).
  - `src/components/Pagination.tsx` — page-number window for 1..N pages.
  - `src/context/JobPortalContext.tsx` — save/unsave, application submission, localStorage failure handling.
  - Aim for meaningful coverage of the data layer and the two most complex components; the app must be testable, so keep DOM assumptions out of `src/services/api.ts`.

---

### P1 — Correctness & data integrity

**2.6 — Stop fabricating salary data.**
`src/services/api.ts:104-105`:
```ts
salaryMin: 110000 + (idx % 6) * 15000,
salaryMax: 155000 + (idx % 6) * 20000,
```
Every live job gets a made-up salary while the real `salary` field sits unused in the payload. The landing page advertises "Transparent Salary Bands" — that is currently a lie. Write a `parseRemotiveSalary(raw): { min: number; max: number } | null` that handles `$170k - $200k`, `$35,3k- $52k`, `OTE $25k - $35k`, `$50-$75 /hour`, `$1000 per task`, `€`-style/`£` currencies, and empty strings. When it cannot parse, set the salary to `null`/omit it and render **"Not disclosed"** in `JobCard`, `JobDetailPage` and the salary filter — never a fake number. Make `Job.salaryMin`/`salaryMax` optional (`number | null`) and update every consumer, including the min-salary filter and the `salary-high`/`salary-low` sorts (null salaries must sort last, not as 0).

**2.7 — The live feed is 10 jobs, not 30.**
`src/services/api.ts:53` requests `?limit=30`; upstream returns 10. Either implement real upstream pagination (Remotive supports `page`), add a second public source, or state the real number in the code and UI. Do not leave a parameter that does nothing.

**2.8 — Live jobs are mis-mapped.**
`src/services/api.ts:99-101` hardcodes `isRemote: true` and `location: item.candidate_required_location || 'Worldwide (Remote)'` for every live job → the "Remote Positions Only" filter and the location filter are meaningless on live data, and the fallback masks an empty location. Derive `isRemote` from the location/description text, keep the real location string (or "Worldwide" when the field is empty), and add a `source: 'live' | 'curated' | 'posted'` field to `Job` so the UI can badge live vs. curated listings.

**2.9 — Description truncation lies.**
`src/services/api.ts:74` — `stripHtml(...).slice(0, 450) + '...'` always appends the ellipsis, even when the description is shorter than 450 chars, and it cuts mid-word. Trim to a word boundary and only append the ellipsis when text was actually cut. Also `stripHtml` uses `document.createElement` (`:16-20`), which makes the module unusable in Node/jest — move it to a DOM-free implementation (regex-based tag stripping + entity decoding) so the API layer is testable.

**2.10 — Live jobs share identical boilerplate.**
`src/services/api.ts:109-131` gives all live jobs the same 4 responsibilities, 3 requirements, 4 benefits, and a fabricated `companyDescription` ("{company} is a leading remote-first technology company hiring global talent."). `companyWebsite` is set to `item.url`, which is the **apply link**, not the company site — so "Visit website" on the detail page opens the job posting. Fix: use the real description for the overview, derive responsibilities/requirements/benefits from the real description text (or mark them as unavailable rather than inventing them), and set `companyWebsite` to a real company domain or omit the link entirely.

**2.11 — The live-fetch cache is declared but never used.**
`src/services/api.ts:8` defines `REMOTIVE_CACHE: 'nextrole_remotive_cache'` and it is never read or written → every page load re-hits the network, the network call happens on every `getJobs`/`getJobById`/`getFeaturedJobs`/`getCategoryStats` call, and there is no stale-data protection. Implement the cache (in-memory + `localStorage` with a TTL, e.g. 10 min), and make the failure visible: `src/services/api.ts:139-143` swallows every error with `console.info`, so a user with a blocked network silently sees only the 24 curated jobs with no explanation. Surface a non-blocking "Live feed unavailable — showing curated listings" notice.

**2.12 — Pagination state desyncs from the page size.**
`src/hooks/useJobs.ts:57-60` resets `page` to 1 in `updateFilters`, but `setLimit` (exposed at `:78`) does not. When the user changes "per page" from 9 to 12 on page 5, the request is clamped inside `getJobs` (`src/services/api.ts:240`, `validatedPage`) and the clamped page comes back in the result, but the hook's `page` state stays at 5 → the `<Pagination>` component highlights the wrong page and the user is stuck. Fix by resetting `page` to 1 whenever `limit` changes (or by syncing `page` from the response).

**2.13 — The apply modal keeps stale state between jobs.**
`src/components/ApplicationModal.tsx:35-42` (form) and `:47` (`successAppId`) are never reset when the modal closes or switches jobs. After one successful submission, opening the modal for a *different* job shows the **previous job's success screen**, and the previous applicant's name/email/cover letter are pre-filled into the next form. Reset all form state and the success state whenever `job.id` changes (and on close). Also make the modal react to an already-submitted application instead of showing an empty form (see §2.14).

**2.14 — "View Application" opens a blank apply form.**
`src/components/JobCard.tsx:118-128` and `src/pages/JobDetailPage.tsx:199-209` render the label "View Application" when the job is already applied to, but the click still calls `openApplyModal(job)` → the user gets an empty form for a job they already applied to. Wire the action to the existing application (open a read-only view of the submitted application, or route to `/applications` with that entry highlighted).

**2.15 — The resume is never stored.**
`src/components/ApplicationModal.tsx` collects a `File`, but `src/services/api.ts:295-317` persists only `resumeFileName` and `resumeFileSize` — the document itself is discarded. If you take direction (A) in §2.3, upload the file (multipart) and store it server-side with a size/type check. If you take direction (B), say so honestly in the UI ("file name and size are recorded locally; the file is not uploaded") instead of implying a real attachment.

**2.16 — Clipboard share can fail silently and lie.**
`src/pages/JobDetailPage.tsx:50` — `navigator.clipboard.writeText(window.location.href)` is neither awaited nor caught → on a non-secure origin (any plain `http://` LAN address) it rejects with an unhandled promise rejection, yet the toast still says "Job link copied to clipboard!". Add a `try/catch`, a `document.execCommand('copy')` fallback, and use `navigator.share` when available. Note the app uses `HashRouter`, so the copied URL contains a `#` — ugly for a shared job link; switch to `BrowserRouter` (see §2.21) and add the SPA rewrite for the host (e.g. `vercel.json` / `public/_redirects` / `netlify.toml`).

**2.17 — The cover-letter counter contradicts the validator.**
`src/components/ApplicationModal.tsx:405` counts `formData.coverLetter.length` (untrimmed) while `:114` validates `formData.coverLetter.trim().length < 30` → the counter can show 30 while the field is rejected. Use the same trimmed value in both places.

**2.18 — New visitors start with 2 "saved" jobs.**
`src/context/JobPortalContext.tsx:68` and `:70` seed `savedJobIds` with `['job-1', 'job-4']` for a user who has never saved anything → the navbar badge and the watchlist show 2 saved positions that the user did not save. Start from `[]`.

**2.19 — Saved jobs are rehydrated from a truncated slice.**
`src/context/JobPortalContext.tsx:94-99` calls `jobApi.getJobs({}, 1, 100)` and keeps only the first 100 jobs → any saved job beyond index 100 is silently dropped on reload, and it fires an extra network round-trip on every app start. Resolve saved jobs by id (`getJobsByIds` / `GET /api/jobs?ids=...`) instead of listing everything.

**2.20 — Unguarded `localStorage` writes can crash the app.**
`src/context/JobPortalContext.tsx:121` and `:130` (and `src/services/api.ts:311`, `:373`) call `localStorage.setItem` **outside** any `try/catch` — the initializers are guarded but the writers are not. A quota error or a privacy-mode browser throws during a state update and takes the app down. Wrap every write in `try/catch` and surface a friendly error via the existing `showNotification` instead of crashing.

**2.21 — Filter state and the URL are out of sync in both directions.**
`src/pages/HomePage.tsx:11-39` reads `searchParams` on every render but only passes them as `initialFilters`, which `useJobs` consumes **once** (`:12`). Consequences:
- Clicking a category link in the footer (`src/components/Footer.tsx:38,42,46,50,94`) while already on `/` changes nothing.
- Changing any filter never updates the URL → links are not shareable, and the browser back button does not restore the previous filter set.
- `src/pages/JobDetailPage.tsx:401` links to `/?category=...` for the same reason.
Fix: make the URL the single source of truth for the filter state — read it on every change (not just mount), and write every filter change back with `setSearchParams(..., { replace: true })`, including `page`, `limit` and `sortBy`. Clear filters → clear the query string.

**2.22 — Debouncing is missing (the README claims it).**
`src/hooks/useJobs.ts:47` recreates `fetchJobs` whenever the `filters` object identity changes, and `:49-51` fires it in an effect → **one API call per keystroke** in the search box. Add a 300–400 ms debounce for the text inputs (search / location) and keep the other filters instant. Make the debounce testable (injectable delay) and cover it with a test.

**2.23 — Three competing search inputs.**
The hero (`src/components/HeroSection.tsx:16-17`), the sidebar (`src/components/JobFilters.tsx:123`) and the URL each hold their own copy of the search text, and they never sync. Drive all of them from the single URL-backed filter state and keep the visible values controlled.

**2.24 — Posted jobs get a hardcoded department and a broken website.**
`src/pages/PostJobPage.tsx:213-221` — the field labelled "Department" writes `form.category`, and the real `form.department` value is never editable and is always posted as the hardcoded `'Core Team'` (`:99`) → every posted job claims the same department. Also `:16` defaults `companyWebsite` to the invalid literal `'https://'` and never validates it, so every posted job gets a broken "Visit website" link. Fix the label/field binding, add a real department input, and validate the URL (empty allowed, otherwise must be a valid absolute `http(s)` URL).

**2.25 — Validation messages do not match the validation.**
`src/pages/PostJobPage.tsx:46-51` says "at least 2 responsibilities" / "at least 2 requirements" but only checks that the field is non-empty. Either enforce the count or fix the message.

**2.26 — `HashRouter` produces ugly shareable links.**
`src/App.tsx:53` uses `HashRouter`, so every job URL is `http://host/#/jobs/job-1`. Switch to `BrowserRouter` and add the SPA fallback config for the deployment target, keeping deep links working on refresh.

---

### P2 — Accessibility

**2.27 — The application modal is not a dialog.**
`src/components/ApplicationModal.tsx:168` — missing `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the title, an initial focus target, a focus trap, Escape-to-close, a backdrop-click-to-close, and a body scroll lock. Implement all of them, and return focus to the trigger element on close.

**2.28 — The mobile filter sheet is not a dialog.**
`src/components/JobFilters.tsx:83` — the `<aside>` has no `role="dialog"`, no `aria-modal`, no Escape handler, no focus management, no scroll lock. Same treatment as §2.27. Also, on desktop the whole overlay wrapper is always in the DOM (`hidden lg:block`) — ensure the hidden state is not focusable (use `inert` or conditional rendering) so keyboard users cannot tab into an off-screen drawer.

**2.29 — The toast is never announced.**
`src/components/NotificationToast.tsx:14` — add `role="status"` and `aria-live="polite"` (and `aria-atomic="true"`). Also give it a dismiss button.

**2.30 — Icon-only and theme controls lack accessible names.**
`src/components/Navbar.tsx:120-127` — the theme swatch buttons have only `title`; add `aria-label` and `aria-pressed`. The "Color Theme" dropdown button (`:87`) needs `aria-expanded` and `aria-haspopup`. The dropdown itself (`:99`) should close on Escape and on outside click. The mobile theme swatches (`:241-248`) need the same `aria-label`/`aria-pressed`.

**2.31 — Form controls are not labelled.**
The `<select>` elements in `src/components/JobFilters.tsx:239` (min salary), `src/components/Pagination.tsx:56` (per page) and `src/pages/PostJobPage.tsx:198,216,232` have no `<label htmlFor>` / `aria-label`. The text inputs in `src/components/ApplicationModal.tsx` and `src/pages/PostJobPage.tsx` have `<label>` elements with **no `htmlFor`/`id` pairing**, so clicking the label does not focus the field. Add ids and `htmlFor` everywhere, and add `aria-invalid` + `aria-describedby` on the invalid fields in the application form.

**2.32 — No skip link.**
Add a "Skip to main content" link as the first focusable element, and give the results container `id="main-content"` + `tabIndex={-1}`.

**2.33 — Global CSS destroys focus affordances.**
`src/index.css:74-76`:
```css
*, a, button, span { text-decoration: none !important; }
```
This strips underlines from every element including focus-visible indicators, and `button { cursor: pointer; }` (`:88-90`) also applies to disabled buttons. Replace the blanket rule with a scoped, accessible reset that keeps a visible `:focus-visible` ring for every interactive element, and scope `cursor: pointer` to enabled buttons.

**2.34 — Colour contrast.**
`text-slate-400` on white is used for small meta text in several components (e.g. `src/components/JobCard.tsx:97,209`, `src/components/Pagination.tsx:83`, `src/pages/ApplicationsPage.tsx:98,108`) and fails WCAG AA (4.5:1). Bump these to `text-slate-500` or darker, and audit the amber/emerald badge pairs.

---

### P2 — Performance & bundle

**2.35 — 1 MB single JS chunk, no code splitting.**
The build emits one 1,000 kB chunk (266 kB gzip) and Vite warns. Convert the route components to `React.lazy` + `<Suspense>` with a skeleton fallback in `src/App.tsx` (keep `HomePage` eager if you want an instant first paint), lazy-load the large data module, and re-check the chunk sizes. Target: no chunk over ~250 kB, and a meaningful drop in the initial payload.

**2.36 — 275 kB CSS, ~230 kB of it dead Bootstrap.**
Covered in §2.4. After removing Bootstrap, the CSS should drop to roughly 40–50 kB (39 kB gzip today is the Tailwind + Bootstrap mix).

**2.37 — 4.15 MB of unoptimized images.**
- `src/assets/images/job_hero_workspace_1790882872474.jpg` — 936 kB, rendered in `src/components/HeroSection.tsx:142` with no `width`/`height` (causes layout shift) and no `loading`/`decoding` hints.
- `interview_session_1790882900579.jpg` — 765 kB (`src/pages/JobDetailPage.tsx:362`).
- `team_culture_banner_1790882887201.jpg` — 856 kB (`src/pages/JobDetailPage.tsx:329`).
- `luxury_exec_lounge_1790883985078.jpg` (802 kB) and `luxury_exec_workspace_1790883970237.jpg` (790 kB) are **referenced nowhere** → delete them (or use them) and remove them from the repo.
Convert the remaining three to WebP/AVIF at the right size, add explicit `width`/`height`, add `loading="lazy"` + `decoding="async"` to the below-the-fold ones, and keep the LCP hero eager with `fetchpriority="high"`.

**2.38 — Every detail-page view rebuilds the whole job list.**
`src/pages/JobDetailPage.tsx:38-47` calls `jobApi.getJobs({category}, 1, 3)` → another full list build (and another live-API pass) just to find 2 similar jobs. Reuse the already-loaded data or add a cheap server-side "similar" query.

---

### P3 — Dead code, consistency, robustness

**2.39 — Dead type members.**
`src/types/job.ts:14` — `JobType` includes `'Remote'`, but no filter offers it and `mapApiType` (`src/services/api.ts:35-41`) never returns it. `src/types/job.ts:82` — `JobApplication.status` includes `'Offer Extended'`, but `getStatusBadge` (`src/pages/ApplicationsPage.tsx:9-36`) has no case for it (it silently falls into the default grey badge) and nothing can ever set that status. Remove the dead members, or implement the status properly (a status-update flow is a nice addition — the README claims "monitor response stages").

**2.40 — Duplicated storage-key systems.**
`src/services/api.ts:4-9` declares `STORAGE_KEYS.SAVED = 'nextrole_saved_job_ids'`, but that key is never used — the context uses its own `SAVED_JOBS_KEY` / `SAVED_JOBS_OBJECTS_KEY` (`src/context/JobPortalContext.tsx:33-34`). Two sources of truth for saved jobs, plus a saved-jobs store that duplicates the job objects in `localStorage` while also keeping ids. Centralise the keys in one module and keep a single canonical representation.

**2.41 — Unused dependencies.**
`motion`, `@google/genai`, `dotenv`, `express` — **0 imports** in `src`. Remove them, or actually use them as described in §2.3.

**2.42 — A "bg-" utility that changes text colour and adds a border.**
`src/index.css:114-116` — `.bg-primary-light-theme` sets `background-color`, `color` **and** `border`. Split it into `.bg-primary-light-theme` (background only) and `.text-primary-theme` / `.border-primary-theme` so badges, buttons and chips can be styled independently. Check every call site afterwards so nothing loses its border or colour.

**2.43 — No error boundary.**
Any render-time error blanks the entire app to a white screen. Add an `ErrorBoundary` component in `src/components/` and wrap the router in `src/App.tsx`, with a "Something went wrong — Reload" fallback and a `console.error` report.

**2.44 — Inconsistent date rendering.**
`src/components/JobCard.tsx:23-30` renders a relative date ("3d ago"), while `src/pages/JobDetailPage.tsx:158` prints the raw ISO string ("Posted 2026-09-28"). Extract one `formatRelativeDate`/`formatAbsoluteDate` utility in `src/utils/` and use it in both places. Note the curated dataset uses 2026-09 dates — verify the "Today / 1d ago" logic still reads sensibly.

**2.45 — Missing quick category.**
`src/components/HeroSection.tsx:25-33` — the quick-category list omits `'Operations'`, although it is a valid `JobCategory` and appears in the filter sidebar (`src/components/JobFilters.tsx:20-29`). Drive both lists from a single exported constant so they can never drift.

**2.46 — `Job` needs a `source` field and nullable salary.**
Add `source: 'live' | 'curated' | 'posted'` to `src/types/job.ts` and badge live listings in the UI (e.g. "Live" chip on the card) so users can tell where a listing came from.

**2.47 — `metadata.json` / `index.html` / SEO.**
`index.html` has no favicon, no `lang` issues (fine), but no Open Graph image and no canonical link. `metadata.json` must match the delivered capabilities (see §2.3). Add a favicon and an OG image or remove the `og` meta tags that point nowhere.

**2.48 — `src/index.css` theme parity.**
`[data-theme="indigo"]` is defined in CSS (`:57-64`) and `ThemeColor` includes `'indigo'` (`src/context/JobPortalContext.tsx:5`), but the theme picker in `src/components/Navbar.tsx:12-19` offers only 6 themes and `:42-45` explicitly drops a saved `'indigo'` value on load. Either expose indigo in the picker or remove it from the type and the CSS.

---

## 3. EXECUTION ORDER

Do these in order. Each step must leave the project building.

**Step 1 — Foundation**
1.1 Verify a clean `npm install` (no `--legacy-peer-deps`) works; fix the dependency tree; keep exactly one lockfile.
1.2 Turn on `strict` TypeScript, add `include`/`exclude`, fix all resulting errors.
1.3 Add ESLint 9 (flat config) + `npm run lint`; add Vitest + Testing Library + jsdom and a first passing test for the data layer.

**Step 2 — Data layer**
2.1 Rewrite `src/services/api.ts`:
- DOM-free `stripHtml`.
- Real salary parsing (§2.6) with a "Not disclosed" state.
- Correct `isRemote` / `location` mapping and a `source` field (§2.8, §2.46).
- Word-boundary description truncation (§2.9).
- Real, per-job responsibilities/requirements/benefits, and a correct `companyWebsite` (§2.10).
- Working live-response cache with TTL + a visible "live feed unavailable" notice (§2.11).
- Upstream pagination or an honest job count (§2.7).
2.2 Make `src/types/job.ts` reflect all of the above: nullable salaries, `source`, the removed dead members (§2.39).
2.3 Update every consumer of the changed types (`JobCard`, `JobDetailPage`, `JobFilters`, `HomePage`, `PostJobPage`, `ApplicationsPage`, `SavedJobsPage`).

**Step 3 — State, routing and filters**
3.1 URL as the single source of truth for filters + page + limit + sort (§2.21); all three search inputs follow it (§2.23).
3.2 Debounce the text filters (§2.22).
3.3 Fix the page/limit desync (§2.12).
3.4 `BrowserRouter` + SPA rewrite config (§2.26).
3.5 Context: no seeded saved jobs (§2.18), id-based rehydration (§2.19), guarded storage writes (§2.20), centralised storage keys (§2.40).
3.6 Modal: reset state per job (§2.13), "View Application" opens the real application (§2.14), the resume is actually stored (§2.15), clipboard/share hardening (§2.16), counter/validator agreement (§2.17).
3.7 Post-job form: department field binding (§2.24), URL validation (§2.24), message/validation agreement (§2.25).

**Step 4 — Accessibility**
4.1 Modal + filter sheet as proper dialogs with focus trap, Escape, scroll lock, focus return (§2.27, §2.28).
4.2 `aria-live` toast (§2.29), accessible names for icon buttons and theme swatches (§2.30), `htmlFor`/`id` for every control (§2.31), skip link (§2.32).
4.3 Fix the global CSS reset so focus rings survive (§2.33) and fix the low-contrast meta text (§2.34).

**Step 5 — Performance**
5.1 Route-level code splitting (§2.35).
5.2 Remove the dead Bootstrap weight (§2.4) and the two unused images; convert the rest to WebP with dimensions and lazy loading (§2.37).
5.3 Cheap "similar jobs" lookup (§2.38).

**Step 6 — Truthfulness, robustness and polish**
6.1 Error boundary (§2.43).
6.2 Consistent date formatting (§2.44), single source for the category list (§2.45), theme parity (§2.48).
6.3 Delete the unused dependencies or use them as designed (§2.41).
6.4 **Rewrite `README.md` so every claim is true**: the requirement table must match the implementation, the tech stack list must match the installed packages, the "How to Run" section must use the real commands, and the project-structure tree must match the real files. Fix `metadata.json` and `.env.example` to match reality (§2.3).
6.5 Add `vercel.json` / `public/_redirects` (or the equivalent for the target host) for the SPA fallback.
6.6 Run the final verification in §4.

---

## 4. VERIFICATION — "DONE" MEANS ALL OF THIS IS TRUE

Run and paste the real output for each:

```bash
# 1. Clean install, no flags, no errors
rm -rf node_modules package-lock.json && npm install

# 2. Types
npm run typecheck          # tsc --noEmit, strict mode, 0 errors

# 3. Lint
npm run lint               # ESLint, 0 errors, 0 warnings

# 4. Tests
npm test                   # Vitest, all suites green

# 5. Production build
npm run build              # 0 errors, no chunk > 250 kB, CSS < 60 kB

# 6. Dev server smoke test
npm run dev                # app loads at http://localhost:3000 with no console errors
```

Plus a manual checklist (state the result of each):

- [ ] `npm run dev` starts with no terminal errors and no browser console errors.
- [ ] The home page renders the hero, the filter sidebar, job cards and the pagination.
- [ ] The live feed loads; if the network is blocked, a clear notice appears and the curated jobs still render — no infinite spinner.
- [ ] Search is debounced (one request after you stop typing, not one per keystroke).
- [ ] Every filter change updates the URL, and pasting that URL into a fresh tab restores the exact filter state.
- [ ] The browser back button restores the previous filter/page state.
- [ ] Changing "per page" on a high page number lands on a valid page and the pagination highlights the right button.
- [ ] Job cards show "Not disclosed" for live jobs whose salary cannot be parsed — never a fabricated number.
- [ ] Open the apply modal for job A, submit it, close it, then open job B → the form is empty and no success screen from job A is shown.
- [ ] For a job you already applied to, "View Application" shows the submitted application, not a blank form.
- [ ] The mobile filter sheet: opens, traps focus, closes on Escape, and the background does not scroll.
- [ ] The modal: focus moves into the dialog, cycles inside it, Escape closes it, and focus returns to the button that opened it.
- [ ] Tab through the whole navbar: every icon-only button has a spoken name; the theme swatches announce their state.
- [ ] Reload the page → saved jobs and applications are still there; the watchlist badge matches the real count (0 for a new visitor).
- [ ] Deep link `http://localhost:3000/jobs/job-1` works on a hard refresh (SPA rewrite configured).
- [ ] Every claim in `README.md` can be demonstrated in the running app.

---

## 5. OUTPUT FORMAT FOR YOUR FINAL REPORT

Report back with:
1. A table of every defect above → **Fixed / Not fixed (with the reason)**.
2. The real terminal output of `npm install`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.
3. The before/after bundle sizes (JS chunk count and total, CSS size).
4. The new project-structure tree and any new/changed files.
5. Any decision you took where §2.3 offered a choice (A = real backend, B = honest front-end-only) and why.

Do not claim anything is done that you have not executed and verified.
