# MaslaMap

**Report it. Map it. Resolve it.**

MaslaMap is a civic issue reporting prototype for Pakistani neighbourhoods. Residents can describe a local problem such as a pothole, overflowing garbage, a broken streetlight, or a leaking drain, attach a photo, and track it on a community board. The project is a front-end prototype: all data lives in the browser and nothing is sent to any government office.

---

## Overview

Across Pakistan's cities, everyday civic problems often go unrecorded. Residents report issues informally through word of mouth, WhatsApp groups, or complaints that never leave a single office. Without a shared, visible record, it is hard for a neighbourhood to see which problems persist, which are recurring, and which have already been raised by others.

MaslaMap explores a simpler model: a neighbourhood-level record of civic issues that anyone can file, browse, and support, with a clear status trail for each report. It is designed to make problems visible and easy to describe, so that residents can later take that information to the appropriate authority themselves.

## Problem Statement

- Civic complaints are scattered across informal channels and are rarely tracked from start to finish.
- Residents often do not know whether an issue has already been reported nearby.
- Written complaints are frequently vague about location, timing, and impact, which makes them harder to act on.
- Language barriers can prevent residents from preparing a clear complaint in the form officials expect.

## Proposed Solution

MaslaMap provides:

- A guided report form covering category, location, description, optional photo, and optional observation date.
- A community board where reports can be searched and filtered by category, status, and sort order.
- A schematic map view that groups reports by city and neighbourhood.
- A per-report detail page with a status timeline and community support votes.
- A Smart Assist page that turns a rough description into a structured report and draft letters in English and Urdu.
- English and Urdu interface languages.

## Features

### Implemented and working in the app

| Feature | Notes |
|---|---|
| Report submission | Form with category, title, description, city, neighbourhood, optional approximate coordinates (free text), optional observation date, optional reporter name, and a consent checkbox. |
| Photo attachment | Accepts JPEG, PNG, or WebP up to 5 MB. The image is stored as a data URL in the browser. |
| Report ID | Each submitted report receives an ID in the format `MM-XXXXXXXX`. |
| Community board | Lists reports with search, category, status, and sort filters, in card or list view. |
| Report detail page | Shows the report, its status timeline, and its community controls. |
| Community support votes | Each visitor can toggle a support vote per report. Votes are stored in the browser. |
| Flag for review | Marks a report as flagged within the prototype. It does not notify anyone. |
| Status updates | The detail page includes a control to change a report's status and add a timeline note. |
| Map view | A schematic grid that places each city and neighbourhood group at a deterministic position. It is not a geographic map. |
| Smart Assist (demo) | Keyword-based text analysis that suggests a category, title, structured description, and English and Urdu draft letters. |
| Static pages | How it works, Privacy, and Open Source pages. |
| Responsive layout | Tailwind CSS layout across mobile and desktop widths. |

### Demo-only functionality

- **Sample reports:** On first load, the app seeds a small set of sample reports for Karachi, Lahore, and Islamabad, marked as demo data.
- **Status updates and flags:** These are available to any visitor. There is no login or role system, so they are not a real moderation or administration workflow.
- **Map view:** Positions are derived from a hash of the location name. They do not reflect real coordinates.
- **Smart Assist:** Labelled "Demo Mode" in the interface. See the AI section below.
- **Community votes and flags:** Stored only in the current browser. They do not represent verified community input.

### Not implemented

- Shared storage or a backend database. The Supabase project mentioned in the platform configuration is not connected to the application code.
- User accounts, sign-in, or role-based access.
- Submission to, or any integration with, government systems, complaint portals, or municipal APIs.
- Real geocoding, GPS capture, or an interactive map.
- Real AI or language model inference.
- Email, SMS, or push notifications.

## Screenshots

Screenshots are not yet available.

- _Home page: placeholder_
- _Report form: placeholder_
- _Community board: placeholder_
- _Map view: placeholder_
- _Smart Assist: placeholder_

## Tech Stack

Based on `package.json`:

**Runtime dependencies**

- [React](https://react.dev/) 18.3 for the user interface
- [Supabase JavaScript client](https://github.com/supabase/supabase-js) 2.x listed as a dependency, not yet used in the source code
- [Lucide React](https://lucide.dev/) for icons

**Build and tooling**

- [Vite](https://vite.dev/) 7 with `@vitejs/plugin-react`
- [TypeScript](https://www.typescriptlang.org/) 5.5
- [Tailwind CSS](https://tailwindcss.com/) 3.4 with PostCSS and Autoprefixer
- [ESLint](https://eslint.org/) 9 with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`

## Project Structure

```
.
├── index.html               # Vite entry HTML
├── package.json             # Scripts and dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── eslint.config.js         # ESLint configuration
├── tsconfig*.json           # TypeScript configuration
└── src/
    ├── main.tsx             # Application entry point
    ├── App.tsx              # Page routing and provider setup
    ├── index.css            # Global styles
    ├── components/
    │   ├── Navbar.tsx, Footer.tsx
    │   ├── LandingSections.tsx      # Home page sections
    │   ├── ReportForm.tsx           # Submit a report
    │   ├── CommunityReportsPage.tsx # Community board
    │   ├── ReportDetail.tsx         # Single report, timeline, votes
    │   ├── ReportCard.tsx, StatusBadge.tsx, CategoryIcon.tsx
    │   ├── MapExplorer.tsx          # Schematic map and list view
    │   ├── SmartAssist.tsx          # Demo text analysis
    │   ├── StaticPages.tsx          # How it works, Privacy, Open Source
    │   └── ui/                      # Button, Card, Badge, Field
    ├── context/
    │   ├── LanguageContext.tsx      # English / Urdu switching
    │   ├── ReportsContext.tsx       # Report state and actions
    │   └── RouterContext.tsx        # Client-side page routing
    └── lib/
        ├── types.ts                 # Data types and category definitions
        ├── storage.ts               # Browser localStorage helpers
        ├── seed.ts                  # Sample demo reports
        ├── smartAssist.ts           # Keyword-based analysis and drafts
        └── i18n.ts                  # English and Urdu strings
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20.19 or later, or 22.12 or later (required by Vite 7)
- npm (installed with Node.js)
- A modern browser

## Installation and Running Locally

From the project root:

```bash
npm install
npm run dev
```

Then open the local address that Vite prints in the terminal.

Other scripts defined in `package.json`:

```bash
npm run build       # Production build to dist/
npm run preview     # Serve the production build locally
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript checks on the app source
```

## Environment Variables

The application does not currently read any environment variables, so no `.env` file is required to run it. If a Supabase backend is connected in the future, its URL and anon key would be needed as environment variables. Never commit real secret keys, and never place service-role keys in frontend code.

## Data Storage and Privacy

- **Local-only storage.** Reports, votes, flags, and the seeded flag are saved in the browser's `localStorage` under keys prefixed with `maslamap.`. Data is not sent to a server.
- **Per-browser, per-device.** A report submitted on one device or browser is not visible on another. Clearing site data removes it.
- **Not shared.** Other visitors cannot see your reports, and the project operator does not receive them.
- **Storage limits.** Browsers cap `localStorage` size, and photos are stored as data URLs, so a few large photos may exceed the limit. When saving fails, the app fails silently and the report may not persist.
- **Personal information.** The form asks for an optional reporter name and an optional coordinates field. The Privacy page states that reports should not include CNIC numbers, phone numbers, or exact home addresses. The app does not enforce this.
- **Consent checkbox.** The form records whether the reporter ticked the consent checkbox. Its legal effect has not been reviewed.

## AI Functionality and Limitations

The Smart Assist feature is a **rule-based demo, not real AI**.

- It checks the text for keywords associated with each category and selects the category with the most matches.
- It builds a title, a structured description with placeholder fields, and English and Urdu letter templates from fixed text.
- It runs entirely in the browser. No language model, external API, or network request is involved.
- Its suggestions may be wrong, especially for text that does not contain the expected keywords. Users must review and edit all output before using it.

The code contains a service interface intended for a future server-side model integration. That integration does not exist yet.

## Responsible Use

- **Reports are not submitted to any authority.** MaslaMap does not send reports to government offices, municipal corporations, police, or any complaint portal. Any report stays in the browser unless you take it to the appropriate authority yourself.
- **No government partnership.** This project is not affiliated with, endorsed by, or partnered with any government body.
- **Votes and flags are not verification.** Community support votes show interest only. They do not confirm an issue or guarantee action. Flags are a prototype control and do not notify anyone.
- **Sample and status data.** Seeded reports and status changes are demonstration content. Do not treat them as official records.
- **Accuracy.** Describe issues factually, avoid personal information, and do not post content that could endanger or identify individuals.

## Roadmap

These items are planned directions, not commitments and not features in the current app:

- Connect a real backend for shared, persistent reports
- Add user accounts and role-based moderation
- Replace the schematic grid with a real geographic map and coordinate capture
- Connect Smart Assist to a server-side language model with proper key handling
- Add image handling and storage beyond browser-local data URLs
- Define a documented, reviewed process for any future submission to authorities

## Contributing

Contributions are welcome.

1. Fork the repository and create a branch for your change.
2. Run `npm install`, then `npm run lint` and `npm run typecheck` before opening a pull request.
3. Keep changes focused on one feature or fix, and describe the user-visible effect in the pull request.
4. Follow the existing code style: React function components, Tailwind for styling, and the `@/` import alias for modules under `src/`.
5. Respect the privacy-first design. Do not add fields that collect CNIC numbers, phone numbers, or exact home addresses, and never add API keys to frontend code.

## Reporting Bugs

Open an issue in the project's issue tracker and include:

- What you expected to happen and what happened instead
- Steps to reproduce the problem
- Your browser and operating system
- Screenshots or screen recordings, if helpful
- Whether the problem occurs in English or Urdu mode

Do not include personal information or real CNIC, phone, or address details in an issue.

## License

MaslaMap is described as MIT-licensed in the application footer and on its Open Source page.

**Copyright holder: Nimra Tariq**

## Conclusion

MaslaMap is an early-stage prototype that shows how a shared, visible record of civic problems could help Pakistani neighbourhoods describe and follow up on issues. The core reporting, browsing, and status-tracking flows work in the browser today, while backend storage, real mapping, and genuine AI remain open work. If you care about civic technology, privacy-respecting design, or Urdu-first tools, we invite you to open an issue, suggest an improvement, or send a pull request.
