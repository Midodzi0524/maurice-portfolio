# CLAUDE.md: Portfolio Website + Admin Dashboard

> This file is the single source of truth for the project. Claude should read it at the start of every session. The owner is a **beginner**, so every step must be explained in plain language, one small step at a time.

---

## 1. Project Overview

**What:** A professional, corporate-style portfolio website for a **Social Media / Business Manager with project management experience**, plus a private **admin dashboard** to manage all content without touching code.

**Owner:** One person (the only dashboard user). Has a GitHub account. Beginner level.

**Goals**
1. Look polished and credible to clients and employers.
2. Let the owner add, edit, delete, reorder and publish content from a dashboard.
3. Receive visitor contact messages (shown in the dashboard AND emailed).
4. Run live for **$0/month** to start, with a clear upgrade path.
5. Follow industry-standard practices (security, backups, version control).

**Starting point:** An existing static site (multiple files: HTML, CSS, JS) previously built by Claude. We keep its structure and content, and upgrade it. We do not throw it away.

---

## 2. Decisions Made (from the owner)

| Topic | Decision |
|---|---|
| Portfolio type | Social media / business manager with project management experience |
| Content managed by dashboard | **Everything** (see section 5) |
| Existing site | Yes, multiple files (HTML, CSS, JS) |
| Look and feel | **Corporate and polished** |
| Layout | **Single page with scrolling sections** |
| Dashboard users | **Only the owner** |
| Domain | **Free address for now** (custom domain later) |
| Budget | Not fixed. Claude advises. Start at **$0** |
| Contact messages | **Both** stored in the dashboard and emailed to the owner |
| Extra features | Drag-and-drop reordering, image uploads, draft/published, contact inbox, visitor analytics, dark/light mode, **switchable colour palettes** |

---

## 3. Tech Stack (and why)

Chosen to be beginner-friendly, free to start, and widely used in industry.

| Layer | Tool | Why |
|---|---|---|
| Public site | HTML, CSS, vanilla JavaScript | Matches the existing site. No build step, easy to understand |
| Database | **Supabase** (PostgreSQL) | Free tier, industry-standard database, built-in login and file storage |
| Login (Auth) | Supabase Auth | Secure email and password login. No custom security code |
| Image storage | Supabase Storage | Same account, public image URLs |
| Hosting | **Netlify** or **Vercel** (pick one: default **Netlify**) | Free, auto-deploys from GitHub, free HTTPS |
| Code storage | **GitHub** | Version history and backup, triggers auto-deploy |
| Contact email | Supabase Edge Function + **Resend** (free tier) | Sends an email when a message arrives |
| Analytics | Own simple page-view counter (Supabase table) + optional Cloudflare Web Analytics | Free and privacy-friendly. No cookie banner needed for the basic version |
| Drag and drop | **SortableJS** (loaded from a CDN) | Small, reliable, widely used |

**Rule:** Do not add new tools, frameworks or paid services without asking the owner and explaining the reason in plain language first.

**Future upgrade path (not now):** Move the front end to a framework such as Astro or Next.js if the site grows. The database and dashboard logic stay the same.

---

## 4. How the Pieces Connect

```
Visitor's browser
   │  reads published content
   ▼
Public site (index.html) ──────────┐
   │  sends contact form            │  reads / writes
   ▼                                ▼
Supabase Database  ◄──── Admin Dashboard (/admin/) ◄── Owner logs in
   │        │
   │        └── Storage (images)
   └── Edge Function ──► Resend ──► Email to owner
```

- One database feeds both the public site and the dashboard, so they are always in sync.
- Public site can only **read published** content and **insert** contact messages.
- Only the logged-in owner can read drafts, edit, delete, upload and see messages.

---

## 5. Content Sections and Data Model

Each section is a database table. Every content table has these shared columns:
`id`, `created_at`, `updated_at`, `status` (`draft` or `published`), `position` (number used for drag-and-drop order).

| Section on the site | Table | Main fields |
|---|---|---|
| Hero / intro | `profile` | name, title, tagline, photo, CV file link, social links |
| About | `profile` | bio text, years of experience, location |
| Services | `services` | title, description, icon |
| Projects / case studies | `projects` | title, client, platform(s), summary, challenge, approach, results (metrics), cover image, gallery images, tags, link |
| Skills and tools | `skills` | name, category (e.g. Social Media, PM Tools), level |
| Experience / CV | `experience` | role, company, start/end dates, description |
| Testimonials | `testimonials` | name, role/company, quote, photo |
| Blog / articles | `posts` | title, slug, excerpt, body, cover image, published date |
| Contact messages | `messages` | name, email, subject, message, `is_read`, received date |
| Theme and settings | `site_settings` | active palette, default mode (light/dark), site title, SEO description, contact email |
| Analytics | `page_views` | date, page/section, count |

*Case-study fields matter most: this audience wants results, such as "grew followers 120% in 6 months."*

---

## 6. Admin Dashboard Requirements

**Location:** `/admin/` (separate page, not linked from the public site, set to `noindex`).

**Must have**
- **Login screen** (email and password). Auto logout after inactivity. No public sign-up.
- **Overview page:** counts of projects, posts and unread messages, plus recent visits.
- **For every section:** list view, **Add**, **Edit**, **Delete** (with "Are you sure?" confirmation).
- **Drag-and-drop reordering** in list views. The new order is saved to `position`.
- **Draft / Published toggle** on every item. Drafts never appear on the public site.
- **Image uploads:** drag a file in, auto-resize and compress, show a preview. Limit 5 MB, JPG/PNG/WebP only.
- **Messages inbox:** read/unread, delete, reply by email link.
- **Appearance settings:**
  - Light / dark default
  - **Colour palette picker** (see section 7) with live preview and a Save button
- **Analytics page:** total visits, last 7/30 days chart, most viewed sections.
- **Friendly errors:** clear messages like "Could not save. Check your internet and try again."
- Mobile-friendly, since the owner may edit from a phone.

**Nice to have later:** Rich-text editor for blog posts, export/backup button (download all content as JSON), activity log.

---

## 7. Theme System (Palettes + Dark/Light Mode)

- All colours are defined as **CSS variables** (e.g. `--color-primary`, `--color-bg`, `--color-text`, `--color-accent`).
- A **palette** is a named set of those variables. Include at least 6 corporate palettes:
  1. Navy and Gold (default)
  2. Slate and Teal
  3. Charcoal and Crimson
  4. Forest and Sand
  5. Royal Purple and Silver
  6. Ocean Blue and Coral
- Each palette has a **light** and a **dark** version.
- Applied by setting `data-palette="..."` and `data-mode="light|dark"` on the `<html>` tag.
- **Owner's palette choice** → saved in `site_settings` → applies to *all visitors*.
- **Visitor's light/dark toggle** → saved in the visitor's own browser (`localStorage`). If unset, follow their device setting (`prefers-color-scheme`).
- Text and background combinations must meet **WCAG AA contrast** (4.5:1 for body text).

---

## 8. Design Guidelines (Corporate and Polished)

- One clean, professional typeface pair (e.g. a serif or semi-bold heading plus a clean sans-serif body). Max 2 fonts.
- Generous white space, consistent spacing scale (8px grid), consistent corner radius and shadows.
- Section order (single scroll page): **Hero → About → Services → Projects/Case Studies → Skills → Experience → Testimonials → Blog → Contact → Footer**.
- Sticky top navigation with smooth scrolling to sections and an active-section highlight.
- Subtle animations only (fade/slide on scroll). Respect `prefers-reduced-motion`.
- Fully responsive (mobile first). Test at 360px, 768px and 1280px widths.
- Accessibility: alt text on all images, keyboard navigation, visible focus outlines, proper heading order.
- Performance: compress images, use `loading="lazy"`, target Lighthouse score above 90.
- SEO basics: page title, meta description, Open Graph image (for link previews), `sitemap.xml`, `robots.txt`.

---

## 9. Security Rules (Non-Negotiable)

1. **Row Level Security (RLS) ON for every table.** Policies:
   - Public: may **read** rows where `status = 'published'`, and **insert only** into `messages`.
   - Owner (authenticated admin): full access.
2. **Never put the Supabase `service_role` key in any front-end file or in GitHub.** Only the public `anon` key goes in front-end code (safe when RLS is on).
3. Secrets (Resend API key, etc.) live in **Supabase secrets / Netlify environment variables**, never in code.
4. **Disable public sign-ups** in Supabase. The owner account is created manually.
5. Turn on a **strong password** and, if available, two-factor authentication on: Supabase, GitHub, Netlify, Resend.
6. Contact form protection: validation, rate limiting, a hidden "honeypot" field against bots (add Cloudflare Turnstile if spam appears).
7. Escape/sanitise any user-entered text before showing it on the page, to prevent XSS (script injection).
8. Add a `.gitignore` so `.env` files are never uploaded.

---

## 10. Folder Structure (target)

```
portfolio/
├── CLAUDE.md                 ← this file
├── README.md                 ← plain-English setup and deploy guide
├── .gitignore
├── index.html                ← public site
├── assets/
│   ├── css/
│   │   ├── base.css          ← reset, typography, layout
│   │   ├── components.css    ← buttons, cards, forms
│   │   └── themes.css        ← palettes (CSS variables)
│   ├── js/
│   │   ├── supabase-client.js
│   │   ├── site.js           ← loads content, renders sections
│   │   ├── theme.js          ← palette + dark/light logic
│   │   ├── contact.js
│   │   └── analytics.js
│   └── img/                  ← static images only (logo, favicon)
├── admin/
│   ├── index.html            ← login + dashboard shell
│   ├── admin.css
│   └── js/
│       ├── auth.js
│       ├── sections/         ← one file per content type
│       ├── upload.js
│       ├── reorder.js
│       └── settings.js
├── supabase/
│   ├── schema.sql            ← tables
│   ├── policies.sql          ← RLS rules
│   └── functions/
│       └── notify-new-message/   ← email function
├── sitemap.xml
└── robots.txt
```

---

## 11. Coding Conventions for Claude

- **Explain like a teacher.** Before each step say *what* we are doing and *why*. Define jargon the first time.
- **One step at a time.** Never dump 10 tasks at once. Wait for the owner to confirm each step worked.
- Give **copy-paste-ready** code with the exact file path above it.
- Keep code **simple and commented**. Prefer readable over clever.
- Use clear names (`projectCard`, not `pc1`). Use `camelCase` in JavaScript and `kebab-case` for CSS classes and file names.
- Every `async` database call is wrapped in try/catch with a user-friendly error message.
- Show loading states ("Saving…") and success messages ("Saved ✓").
- No inline styles. Use CSS classes and variables.
- No `localStorage` for important data. The database is the source of truth.
- Don't change working code that isn't part of the current task.
- After each phase, give a short **"How to test this"** checklist.
- Commit to GitHub after each working step, with clear messages (e.g. `Add projects list to dashboard`).

---

## 12. Build Roadmap (Phases)

| Phase | What we do | Done when |
|---|---|---|
| **0. Setup** | Create accounts: Supabase, Netlify, Resend. Set up the GitHub repo. Review the existing site files | Repo exists with current site in it |
| **1. Database** | Create tables, RLS policies and the storage bucket. Create the owner login | Tables visible in Supabase. Owner can log in |
| **2. Public site connection** | Make the public site read content from the database instead of hard-coded text. Migrate existing content in | Site looks the same, but content comes from the database |
| **3. Dashboard core** | Login, overview, add/edit/delete for Projects first, then the other sections | Owner can fully manage Projects from `/admin/` |
| **4. Dashboard features** | Drag-and-drop, draft/publish, image uploads for all sections | Reordering and drafts work on the live site |
| **5. Contact + inbox** | Contact form saves to the database, dashboard inbox, email notification | Test message appears in the inbox AND arrives by email |
| **6. Themes** | Palettes, light/dark toggle, appearance settings in the dashboard | Changing a palette in the dashboard changes the live site |
| **7. Analytics** | Page-view tracking and the dashboard analytics page | Visits are counted and charted |
| **8. Polish and QA** | Design refinement, accessibility, SEO, performance, cross-browser tests | Checklist in section 14 fully passed |
| **9. Go live** | Deploy, test on the real URL, back up | Site live on the free address |

---

## 13. Going Live: Plain-English Plan

**Step A: Put the code on GitHub**
1. Create a new repository on GitHub (e.g. `my-portfolio`).
2. Upload the project files (GitHub Desktop is the easiest for beginners).

**Step B: Set up Supabase** (free)
1. Create a project at supabase.com. Save the database password in a password manager.
2. Run `schema.sql` and `policies.sql` in the SQL Editor.
3. Create the owner user under Authentication → Users. Turn off public sign-ups.
4. Copy the **Project URL** and **anon key** into `supabase-client.js`.

**Step C: Deploy on Netlify** (free)
1. Sign in to Netlify with GitHub → "Add new site" → "Import from Git" → choose the repo.
2. Build command: *none*. Publish directory: `/` (root).
3. Netlify gives a free address like `your-name.netlify.app`. You can rename it.
4. Every `git push` automatically updates the live site.

**Step D: Email notifications**
1. Create a free Resend account and an API key.
2. Store the key as a Supabase secret and deploy the `notify-new-message` function.
3. Send a test message from the live site.

**Step E: Later, custom domain** (about $10–15 per year)
1. Buy a domain from Namecheap, Cloudflare or Porkbun.
2. In Netlify: Domain settings → Add custom domain → follow the DNS instructions. Free HTTPS is automatic.

### Estimated Costs

| Item | Start | Later (if needed) |
|---|---|---|
| Netlify hosting | $0 | $0 (free tier is generous) |
| Supabase | $0 | $25/month if traffic grows or you want no auto-pause |
| Resend email | $0 (3,000 emails/month) | Rarely needed |
| Domain | $0 (free address) | about $10–15/year |
| **Total** | **$0** | about $1–2/month for a domain only |

> ⚠️ **Free-tier note:** Supabase pauses free projects after about 1 week of inactivity. For a live portfolio, add a small scheduled "keep-alive" request (a free GitHub Action) or upgrade to Pro. Claude should set this up in Phase 9. Always verify current limits and pricing on each provider's website, since they change.

---

## 14. Quality Checklist (before launch)

**Functionality**
- [ ] Add, edit, delete work for every section
- [ ] Drag-and-drop order saves and shows on the public site
- [ ] Draft items are NOT visible publicly
- [ ] Image upload, resize and delete work
- [ ] Contact form → inbox + email both work
- [ ] Palette change in the dashboard updates the live site
- [ ] Dark/light toggle remembers the visitor's choice

**Security**
- [ ] RLS enabled on every table (test while logged out)
- [ ] No secret keys in GitHub
- [ ] Sign-ups disabled, 2FA on all accounts
- [ ] `/admin/` is `noindex`

**Quality**
- [ ] Looks correct on phone, tablet, desktop
- [ ] Lighthouse: Performance, Accessibility, SEO above 90
- [ ] All images have alt text
- [ ] No console errors
- [ ] Tested in Chrome, Safari, Firefox

**Safety net**
- [ ] Database backup/export saved
- [ ] Owner has a written copy of: account logins (in a password manager), how to deploy, how to restore

---

## 15. What Claude Needs From the Owner

Before building, gather:
1. The current site files (zip or paste) so we upgrade rather than restart.
2. Real content: bio, services, projects/case studies with results and numbers, testimonials, photos, CV.
3. Logo (if any) and brand colours (or choose from the palettes).
4. Email address for contact notifications.
5. Social media profile links.
6. Confirmation of the free site address name (e.g. `yourname.netlify.app`).

---

## 16. Glossary (for beginners)

- **Front end:** what visitors see in their browser.
- **Back end:** the hidden part that stores and protects data (here, Supabase).
- **Database:** an organised store of your content, like spreadsheets with tables.
- **Dashboard / Admin panel:** your private control room for editing the site.
- **Authentication (Auth):** proving who you are (login).
- **RLS (Row Level Security):** database rules that decide who can read or change which rows.
- **API key:** a code that lets your site talk to a service. The *anon* key is public-safe. Secret keys must stay hidden.
- **Deploy:** publishing your code so it goes live on the internet.
- **Repository (repo):** a project folder tracked by Git/GitHub with full history.
- **CDN:** a fast network that delivers files to visitors worldwide.
- **DNS:** the internet's address book that connects your domain name to your site.
- **Environment variable / Secret:** a private setting stored outside your code.

---

## 17. How to Start a Session With Claude

Paste this at the start of a new chat after uploading this file:

> "Read CLAUDE.md. We are on **Phase __**. I'm a beginner, so guide me one step at a time. Here is what I did last: ___."
