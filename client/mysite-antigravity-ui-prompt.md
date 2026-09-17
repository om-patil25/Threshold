# Threshold — Frontend UI Build Prompt (for Antigravity)

## Scope boundary — read this first

You are building **UI components only**: markup, layout, styling, client-side
UI state (form inputs, toggles, tab switching, carousel position, etc.).

You are **NOT** building:
- Any `fetch`/`axios`/API call logic
- Any auth logic, cookie handling, or token logic
- Any data-loading, caching, or state-management library wiring (Redux, React Query, etc.)
- Any hardcoded or mock API responses baked into components

All real data (links, showcase items, updates, user profile, analytics) will
be fetched and wired in **separately, by hand, after you build these
components**. Every component must receive its data via **props only** —
never fetch its own data, never assume a global store exists.

If a component needs data it doesn't have yet, accept it as a prop with a
sensible shape (see "Data shapes" below) and render nothing / an empty
state if the prop is missing, rather than inventing placeholder fetch logic.

---

## Project context

**Threshold** is a portfolio/work-profile/link in bio platform for independent workers 
freelancers, consultants, small service providers, creatives — to present
their work, post updates, and link out, in order to get hired, get calls,
show work, sell something, or look professional to a client.

**It is explicitly NOT:**
- A Linktree/Beacons clone (no single portrait-only layout stretched to fit desktop)
- A drag-and-drop website builder (no arbitrary custom layouts/canvas)
- A local-business storefront tool with maps/hours/reviews (no e-commerce, no checkout, no location/hours fields)

**Core differentiators to preserve in the UI:**
1. **Portfolio-first content.** Showcase items (featured work) are the
   visual centerpiece — treated as first-class, larger/featured content —
   not styled the same as a plain link row.
2. **Two real, separately-designed layouts** — a horizontal desktop layout
   and a vertical mobile layout — not one responsive template reflowed
   between breakpoints. Build them as **two distinct components** per
   screen where the wireframes show two distinct structures (see below),
   sharing only data shape, not markup structure.
3. **Sections auto-hide when empty.** A user might use this purely as a
   portfolio, purely as a link-in-bio, or purely as an updates feed. Any
   section (Updates, Featured Work, Links) with an empty array should not
   render at all on the **public profile** page — no empty state, no
   placeholder, it simply doesn't appear.

---

## Tech stack

- **JavaScript, not TypeScript.** Use plain `.jsx` files, no `.ts`/`.tsx`,
  no TypeScript syntax or type annotations anywhere. Use the standard Vite
  `react` template (not `react-ts`). Document prop shapes with `prop-types`
  or JSDoc comments instead of TypeScript types.
- React (functional components, hooks)
- Router: React Router (assume this unless told otherwise)
- Styling: your choice of a clean, modern utility approach (Tailwind
  preferred if available in the project) — no inline style objects for
  layout-heavy components
- No backend framework code — this is frontend-only
- pnpm is installed so use that instead of npm

---

## Persona (design for this person, not a beginner/non-technical user)

A design-literate freelancer, consultant, or creative who is comfortable
with a dashboard, wants some visual control, and checks a live preview
while editing. Not optimizing for zero-learning-curve/"anyone can use it"
simplicity — richer controls (showcase item types, analytics charts,
sidebar navigation) are appropriate.

---

## Screens to build

Build each of these as **separate component files**. Wireframe descriptions
below are based on hand-drawn sketches — use your best layout judgment for
exact spacing/styling, but follow the described structure and hierarchy.

### 1. Public Profile — Desktop
Full-width layout, NOT centered-narrow-column:
- Top bar: avatar (circle), Name + work title, back/menu icon top-right
- **Updates** section: horizontal row of update cards with prev/next arrow
  navigation (carousel-style, not a vertical stack)
- **Featured Work / Achievement** section: horizontal row of larger cards
  with prev/next arrow navigation — these cards should read as visually
  bigger/more prominent than update cards or link rows
- **Links** section: 2-column grid of link rows/buttons
- Footer: "by [platform name]"
- Sections auto-hide if their data array is empty (see auto-hide rule above)

### 2. Public Profile — Mobile
Vertical single-column layout, NOT a shrunk version of desktop:
- Top: avatar, Name + work title, icon top-right
- **Updates**: shown as a "stacked" overlapping card treatment (peek of
  cards behind the front card, not a horizontal scroll row)
- **Featured Work**: vertical stack of cards, with dot-style pagination
  indicator (`•••` style) instead of arrows
- **Links**: full-width stacked rows, one per line
- Footer: "by [platform]"
- Sections auto-hide if empty

### 3. Dashboard — Updates (Desktop)
Three-column layout:
- Left: persistent sidebar nav (Updates, Featured, Links, Analytics,
  Settings, Help — icon + label list)
- Middle: editor panel — "Edit Updates" header, "Create New" button, list
  of existing update cards each with edit/delete controls
- Right: live preview panel showing a phone-frame mockup of how it looks
  on mobile

### 4. Dashboard — Updates (Mobile)
Single column: top icon bar, "Updates" header, "Create New" button, list
of update cards each with edit/delete controls. No live preview panel
inline — preview is a separate full-screen view reached via the icon bar.

### 5. Dashboard — Links (Desktop)
Four-region layout: far-left compact icon rail (links icon + menu), main
sidebar-style "Links" panel with "Create New" button and a list of link
rows (each showing label/url with edit/delete), then a live preview panel
on the right.

### 6. Dashboard — Links (Mobile)
Single column: icon bar, "Links" header, "Create" button, stacked list of
link rows each with label/url and edit/delete controls.

### 7. Dashboard — Showcase Items (Desktop)
Sidebar-style panel: "Featured Work/Achievements" header, "Create New"
button, grid of showcase item cards (each with edit/delete), live preview
panel on the right.

### 8. Dashboard — Showcase Items (Mobile)
Single column: icon bar, "Featured Work" header, "Create New" button,
stacked list/grid of showcase item cards with edit/delete.

### 9. Dashboard — Analytics (Desktop)
Sidebar-style panel: "Analytics" header, a line/area chart card (clicks
over time, with a dropdown/filter), a second summary stat row, a second
chart card (views over time), live preview panel on the right.

### 10. Dashboard — Analytics (Mobile)
Single column: icon bar, "Analytics" header, a clicks chart card with
dropdown filter, a views stat/chart card below it.

### 11. Settings
Holds profile identity fields: avatar upload, name, work title, bio. (No
wireframe provided — use a clean form layout consistent with the rest of
the dashboard style.)

### 12. Auth + Onboarding
Signup/login forms, plus an onboarding wizard for first-time setup
(profile basics → first link or showcase item → done). No wireframe
provided — keep it simple, step-based, consistent with dashboard styling.

### 13. Marketing / Home Page — Desktop
This is the public-facing landing page (NOT a user's profile). It is
purely informational — no live/real data, static content only. Structure:

- **Top bar**: logo/icon left, Login and Signup buttons right
- **Hero**: large title with **rotating dynamic text** cycling through a
  short list of words emphasizing flexibility, e.g. "Your work. Your
  links. Your **[portfolio / storefront / page]**. One page that's
  whatever you need it to be." Below it, a username input field ("Let
  user type") + a "Start" button. On typing, this should check username
  availability (visual only — accept an `onCheckUsername` prop/callback,
  don't implement the actual check). The Start button takes the user to
  signup with the username pre-filled (accept as a prop/callback, don't
  implement routing logic).
- **"Make Your Presence" section**: show an illustrative preview of a
  filled-out profile (mini mockup of a real portfolio page) alongside
  copy — OR show a desktop/mobile device pair side by side to visually
  demonstrate the two-layout differentiator. Use static/placeholder
  content, not real data.
- **Benefits section** (three short blocks, side by side):
  1. *Show your work* — featured projects, not just links
  2. *Everything in one place* — updates, links, contact
  3. *Only show what you want* — sections appear only when you use them
- **"Connect with the developer" section**: small, credit-style, NOT a
  second hero. Placeholder name/photo, one short line, 2-3 social/contact
  links (GitHub, LinkedIn, portfolio). Should sit near the bottom, close
  to the footer — not compete visually with the benefits section above it.
- **Footer**: standard footer row.

### 14. Marketing / Home Page — Mobile
Same content and section order as desktop, in a single vertical column:
top bar (logo + login/signup, may collapse to a menu icon), hero with
rotating dynamic text + username input + Start button, "Make Your
Presence" section (stacked, not side-by-side), benefits section (stacked
blocks, not side-by-side), "Connect with the developer" section, footer.

---

## Theme / color presets

Users can choose a **preset color theme only** — no free color picker, no
layout/template changes. This maps to the existing `theme` field on the
user (a string). Build a small set of preset swatches (4-6) the user can
pick from in Settings, and apply the chosen theme's colors via CSS
variables at the root of the public profile components, so switching
themes doesn't require different markup — only different CSS variable
values.

Suggested starting presets (name : background / text / primary / accent):
- **Ink & Ochre**: `#FAF7F2` / `#1C1B19` / `#2B2620` / `#C9622A`
- **Midnight Slate**: `#0F1115` / `#E7E9EC` / `#181B21` / `#5EEAD4`
- **Paper & Moss**: `#F5F3ED` / `#22261F` / `#3F4A38` / `#D98E5D`
- **Bone & Violet**: `#FAFAFA` / `#171417` / `#6C4AB6` / `#F2C94C`

Do not build this as a "template" system with different layout
arrangements — it is strictly a color-only preset choice, consistent with
the scope boundary above (no drag-and-drop/arbitrary layout building).

---

## Data shapes (for prop contracts — do not fetch this, just accept as props)

Plain JavaScript objects with these shapes. Document them via JSDoc
`@typedef` comments and `prop-types` on each component — do not use
TypeScript syntax anywhere.

```js
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} name
 * @property {string} bio
 * @property {string} worktitle
 * @property {string|null} profileimage
 * @property {string|null} resume_url
 * @property {boolean} open_to_work
 * @property {string} theme
 */

/**
 * @typedef {Object} Link
 * @property {string} id
 * @property {string} label
 * @property {string} url
 * @property {number} click_count
 * @property {number} position
 */

/**
 * @typedef {Object} ShowcaseItem
 * @property {string} id
 * @property {string} file_name
 * @property {string} url
 * @property {string} mimetype
 * @property {"certification"|"project"|"achievement"|"document"} filetype
 * @property {number} size
 * @property {string} file_title
 * @property {string} description
 * @property {string|null} link_url
 * @property {string} created_at
 */

/**
 * @typedef {Object} Update
 * @property {string} id
 * @property {string} content
 * @property {string|null} img_url
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} AnalyticsTotals
 * @property {number} totalClicks
 * @property {number} totalViews
 */

/**
 * @typedef {Object} AnalyticsSummary
 * @property {{date: string, count: number}[]} clicksByDay
 * @property {{date: string, count: number}[]} profileViewsByDay
 */
```

Each screen component should declare clear props (via `prop-types`)
matching the relevant shapes above (e.g.
`<PublicProfileDesktop user={} links={} showcaseItems={} updates={} />`).

---

## What NOT to do

- Don't add API calls, loading spinners tied to fetch state, or error
  toasts tied to network requests — that's handled outside these
  components.
- Don't store anything in `localStorage`/`sessionStorage` for auth or user
  data.
- Don't collapse the desktop and mobile layouts into one responsive
  component with breakpoint classes where the wireframes show genuinely
  different structure (carousel vs. stacked, sidebar vs. icon bar, etc.) —
  build them as separate components sharing only prop shapes.
- Don't invent new sections/fields not described above or in the data
  shapes (no location, hours, cart, checkout, reviews).
- Don't render empty-state placeholders for Updates/Featured
  Work/Links on the **public profile** — just omit the section entirely
  when the array is empty. (Dashboard editor views should still show an
  empty state with a "Create New" prompt, since the user is actively
  managing that section there.)

---

## Deliverable

A component per screen listed above (plain JavaScript `.jsx`, no
TypeScript), organized into a sensible folder structure (e.g.
`components/publicProfile/`, `components/dashboard/`, `components/auth/`,
`components/marketing/`), each with clear `prop-types` declarations
matching the data shapes above, and no data-fetching logic anywhere.
Marketing page components should accept callback props (`onCheckUsername`,
`onStart`) rather than implementing any real logic themselves.
