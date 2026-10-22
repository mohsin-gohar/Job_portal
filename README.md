# Lumina Careers — Premium Job Portal

A production-grade, responsive job portal built with React 19, TypeScript, Vite, and Tailwind CSS v4. It ships with a curated dataset of 50+ open roles across 30 verified companies, 165+ talent profiles, a recruiter ATS console, saved jobs, applications tracking, and an admin-only dashboard.

## Tech Stack

- **Frontend:** React 19, TypeScript 7, Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`), Plus Jakarta Sans
- **Routing:** react-router-dom v7 (route-level code splitting)
- **Icons:** lucide-react
- **State:** React Context (Auth, Jobs, Saved Jobs, Applications, Candidates, Toast)
- **Persistence:** localStorage-backed mock API (no backend required)
- **Deploy:** Vercel (SPA)

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # tsc --noEmit
npm run build      # production build -> dist/
npm run preview
```

> The project ships with `.npmrc` (`legacy-peer-deps=true`) and a pinned `esbuild@^0.28.0` to resolve the Vite 8 peer dependency on Vercel.

## Demo Credentials

| Role       | Email                          | Password   | Access |
|------------|--------------------------------|------------|--------|
| Admin      | `admin@shopsphere.studio`      | `admin123` | Admin Dashboard (`/admin`), ATS Console, Post Job |
| Admin (alt)| `admin@lumina.careers`         | `admin123` | Same as above |
| Employer   | any non-admin email            | any        | Post Job, ATS Console, Talent Sourcing |
| Candidate  | any non-admin email            | any        | Browse, Save, Apply, Track Applications |

> Any email starting with `admin@` combined with one of `admin123` / `admin` / `admin2026` / `secret123` grants admin access. Registration never offers an admin option.

## Key Features

- **Job Discovery:** Search, filter (category, type, location, experience, salary, remote), sort, pagination, quick-view drawer.
- **Job Detail:** Rich description, responsibilities, requirements, skills, benefits, company profile, apply modal.
- **Saved Jobs & Applications:** Persisted locally; candidate pipeline tracking.
- **Employer Tools:** Post a job, ATS dashboard with status updates, CSV export, talent sourcing directory.
- **Admin Dashboard:** Platform overview, job/company/candidate management, featured toggles, database reset.
- **Talent Directory:** 165+ searchable candidate profiles with skills, experience, open-to-work status.
- **Companies:** 30 verified companies with detail pages and open roles.
- **Auth & RBAC:** Role-based navigation (admin dashboard button gated to admins; ATS link restricted to employer/admin).
- **Responsive & Accessible:** Mobile-first layouts, focus-visible styles, reduced-motion support, lazy-loaded images.
- **Performance:** Route-level code splitting, vendor chunk splitting (react/react-dom/router), memoized Header/Footer.

## Routes

`/` Home · `/explore` · `/jobs/:id` · `/saved` · `/applications` · `/post-job` · `/companies` · `/companies/:id` · `/talent` · `/ats` · `/about` · `/contact` · `/login` · `/register` · `/admin` (admin only)

## Deployment (Vercel)

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install` (uses `.npmrc` legacy-peer-deps). If ERESOLVE persists, set to `npm install --legacy-peer-deps`.

## Project Structure

```
src/
  App.tsx, main.tsx, index.css
  components/common/   Header, Footer, ErrorBoundary, ProtectedRoute
  components/jobs/     JobCard, JobFilters, ApplicationModal, ...
  context/             Auth, Job, SavedJobs, Application, Candidate, Toast
  data/                db (seed companies, jobs, candidates), mockJobs
  pages/               Home, Explore, JobDetail, Saved, Applications, PostJob,
                       Companies, CompanyDetail, Talent, AtsDashboard, About,
                       Contact, Login, Register, AdminDashboard
  services/            api (localStorage-backed)
  types/               job.ts
```

## Notes

- All data is mock/seeded and persisted in `localStorage`; use "Reset Database" in the admin console to restore defaults.
- No real backend or email delivery; contact form and job alerts are UI-only simulations.
