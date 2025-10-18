# FormFillr 2.0 — Developer Guide

Goal
- A privacy-first, client-side fake data generator for developers and QA to compose custom data or define schemas using `@faker-js/faker`.

Overview
- Generates realistic test data across categories (Person, Company, Internet, Location,Modules, Airline, Animal, Book, Color, Commerce, Company, Database, Datatype, Date, Finance, Food, Git, Hacker, Helpers, Image, Internet, Location,Lorem,Music,Number,Person,Phone,Science,String,System,Vehicle, Word, etc.).
- Lets users pick fields or define a JSON schema.
- Exports to JSON and CSV; shows a table preview.
- Supports locales (English, Arabic, French, German, Japanese, Portuguese-BR).

Architecture
- UI (Next.js + Tailwind): Inputs, field toggles, preview, locale switch.
- Core Generator (`utils/generateData.ts`): Wraps `@faker-js/faker`, interprets selected fields or schema.
- Faker (`@faker-js/faker`): Localized generators for names, addresses, company, etc.
- Storage (optional): Local storage for schema presets.
- Deployment: Static export (Next.js `output: 'export'`) to GitHub Pages, Vercel, or Netlify.

Core Features

- Locale-Based Generation
  - Supported locales: `en`, `ar`, `es`, `fr`, `de`, `pt_BR`, `ja`.
  - The generator initializes a per-call Faker instance with a fallback:
    - `new Faker({ locale: [selectedLocale, en] })`
  - Notes:
    - Some Faker locales are partial; categories without localized data will gracefully fall back to English (e.g., certain `internet.*` fields).

- Composable Data Generator
  - Users select fields from categories and set a row count.
  - Available field keys:
    - `id`, `name`, `firstName`, `lastName`, `email`, `phone`, `username`, `company`, `jobTitle`, `address`, `city`, `state`, `zip`, `country`, `dob`, `avatar`.
  - Example (TypeScript):
    ```ts
    import { generateFakeUsers } from './utils/generateData'

    const fields = ['id','name','email','phone','address'] as const
    const rows = await generateFakeUsers(25, fields, 'ja')
    // rows: Array<{ id, name, email, phone, address }>
    ```

- Schema-Based Generator (Roadmap)
  - Intended for complex structures where developers map schema nodes to Faker methods.
  - Example schema:
    ```json
    {
      "id": "number.int",
      "name": "person.fullName",
      "email": "internet.email",
      "signupDate": "date.past",
      "address": {
        "street": "location.streetAddress",
        "city": "location.city",
        "country": "location.country"
      },
      "company": {
        "name": "company.name",
        "role": "person.jobTitle"
      }
    }
    ```
  - Planned approach:
    - Parse strings like `person.fullName` → call `f.person.fullName()`.
    - Recurse into objects/arrays for nested schemas.
    - Accept `count`, `locale`, and produce an array of records.

Generator Details

- Function
  - `generateFakeUsers(count: number, fields: FieldKey[], locale = 'en'): Promise<Record<string, any>[]>`
- Implementation highlights
  - Creates an isolated `Faker` instance per call using the selected locale with English fallback.
  - Maps field keys to `f.*` methods:
    - Examples: `f.person.fullName()`, `f.internet.email()`, `f.location.city()`, `f.image.avatar()`, `f.date.birthdate({...})`.
  - Address composition:
    ```ts
    `${f.location.streetAddress()}, ${f.location.city()}, ${f.location.state()} ${f.location.zipCode()}, ${f.location.country()}`
    ```

Output Formats

- JSON
  - Copy to clipboard or download as `formfillr_<timestamp>.json`.
- CSV
  - Uses `utils/toCSV.ts`.
  - Exports selected fields with CSV-safe escaping.

Internationalization

- Locale selector drives both Faker and output formatting.
- Language switcher (UI) supports path prefixing; when deployed under a base path, the switcher strips `NEXT_PUBLIC_BASE_PATH` before navigation.

Deployment

- Static Export (Next.js)
  - Config: `next.config.js` sets `output: 'export'`.
  - Build creates `out/` with HTML/CSS/JS.
  - Docs: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- GitHub Pages
  - GitHub Actions workflow builds and uploads `out/` to Pages.
  - Automatically sets `BASE_PATH`:
    - User/org pages (`<user>.github.io`) → empty basePath.
    - Project pages (`/<repo>`) → basePath=`/<repo>`.
- Vercel/Netlify
  - Deploy `out/` or let the platform build automatically.
  - Ensure static export mode is enabled.

Project Layout

- `pages/`: Next.js pages (`index.tsx`, `_app.tsx`, `_document.tsx`)
- `components/`: UI components (e.g., `LanguageSwitcher.tsx`)
- `utils/`: Data generator and CSV helper
- `locales/`: UI translations
- `styles/`: Tailwind CSS
- `docs/`: Developer documentation
- `.github/workflows/`: CI for GitHub Pages

Limitations

- Faker locale completeness varies; some categories (e.g., `internet.free_email`) may not exist in all locales.
- English fallback ensures generation succeeds, but some fields may appear in English for partial locales.
- Japanese locale code is `ja` (not `jp`).

Privacy

- Everything runs client-side.
- No data leaves the browser.
- Ideal for development, QA, demos, and prototyping.

---

## Step-by-Step Build Plan

Milestone 0 — Foundations (Done)
- Configure static export with `output: 'export'` in `next.config.js`.
- Set dynamic `basePath`/`assetPrefix` via `NEXT_PUBLIC_BASE_PATH`.
- Fix `_document.tsx` filename and favicon path.
- Update `LanguageSwitcher` to strip/handle `basePath`.
- Add GitHub Actions workflow to build and deploy `out/`.

Milestone 1 — Generator Core (Done)
- Use per-call `Faker({ locale: [selected, en] })` with locale modules.
- Map selected field keys to generator methods.
- Ensure English fallback for missing localized entries.

Milestone 2 — UI & Preview (Done)
- Field selection UI with categories and count input.
- Live preview table with pagination for large sets.
- JSON/CSV export buttons.

Milestone 3 — i18n & Locales (In Progress)
- Confirm supported locales: `en`, `ar`, `es`, `fr`, `de`, `pt_BR`, `ja`.
- Localize all UI labels for `en` and `ar` minimally.
- Verify RTL layout for Arabic.

Milestone 4 — Schema Generator (Planned)
- Build a JSON schema editor with validation.
- Implement schema-to-faker resolver (strings → methods, recurse objects/arrays).
- Add real-time preview and export for schema-based generation.

Milestone 5 — Presets & Storage (Planned)
- Save/load presets to local storage.
- Provide a few built-in templates (e.g., Users, Orders, Products).

Milestone 6 — Quality & Tests (Planned)
- Unit tests for `generateData` and CSV.
- E2E smoke test for locale switching and exports.

Milestone 7 — Polish & Docs (Planned)
- Improve accessibility (focus order, labels, ARIA).
- Expand docs with examples and known limitations.

### Current Focus
- Complete minimal UI i18n for `en` and `ar`.
- Validate RTL support and layout sanity.

### Next Task Candidates
- Implement schema-based generator MVP.
- Add presets and local storage integration.
- Write unit tests for generator methods.

How to Work One Task at a Time
- Pick one milestone or subtask, implement, and verify locally.
- If it affects UI, run dev server and review.
- Update this section with progress before moving on.