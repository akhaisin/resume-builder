# Resume Builder

Resume Builder is a browser-only app for editing a JSON Resume document and rendering it live with Typst.
It runs entirely on the client: no backend, no server-side compilation, and no remote persistence.

## What It Does

- Edit one resume document in JSON Resume format.
- Switch between raw JSON editing and form-based editing.
- Edit one selected built-in Typst template at a time.
- Preview the rendered document live in the right panel.
- Export the current resume as PDF.
- Import and export resume JSON and template files.
- Persist valid resume data and edited templates in `localStorage`.

## Current Stack

- React 19
- TypeScript
- Vite
- pnpm
- Monaco Editor via `@monaco-editor/react`
- Typst via `@myriaddreamin/typst.ts`
- Resizable layout via `react-resizable-panels`

## Getting Started

Requirements:

- Node.js
- pnpm

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Create a production build:

```bash
pnpm build
```

Run tests:

```bash
pnpm test
```

## Project Shape

- `src/App.tsx`: top-level shell and state wiring.
- `src/components/ResumePanel.tsx`: left-side editing panel.
- `src/components/TypstPdfPanel.tsx`: right-side preview and PDF download.
- `src/components/ResumeToolbar.tsx`: top-level toolbar and tab controls.
- `src/components/form/`: form-based resume editor components.
- `src/lib/typstCompiler.ts`: Typst compile and preview integration.
- `src/templates/`: bundled built-in Typst templates.
- `src/schemas/jsonresume.schema.json`: local JSON Resume schema copy.
- `AGENTS.md`: canonical product requirements and backlog.

## Notes

- The canonical product spec lives in `AGENTS.md`.
- Resume persistence and PDF generation are blocked when the JSON document is invalid.
- The app currently manages a single active resume document.
