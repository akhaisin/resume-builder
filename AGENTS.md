# Resume Builder

## Document Status

This file is the product spec and backlog for the project.
The `Requirements` section below is the canonical source of truth.
If any summary text in this file drifts from the requirements, the requirements win.

---

## Current Product Snapshot

- Browser-only React + TypeScript + Vite single-page application with no backend.
- Two vertically split resizable panels: `ResumePanel` on the left and `TypstPdfPanel` on the right.
- The left panel contains a toolbar area and one active editor area.
- The toolbar exposes two top-level tabs: `Resume` and `Template`.
- The `Resume` tab contains nested `JSON` and `Forms` modes.
- The `Template` tab edits one selected built-in Typst template at a time.
- Built-in templates come from `src/templates` and currently include `resume.typ`, `minimal.typ`, and `demo.typ`.
- Resume JSON and template source are editable in Monaco-based editors.
- Resume JSON is validated against a local copy of the JSON Resume schema.
- Invalid resume JSON blocks persistence and PDF generation.
- Typst compilation runs fully in-browser via WebAssembly using the current in-memory resume JSON and selected template.
- The right panel shows a live Typst-rendered preview and allows PDF download.

---

## Tech Stack

| Concern | Library |
|---|---|
| Framework | React + TypeScript (Vite) |
| Package manager | pnpm |
| Resizable layout | `react-resizable-panels` |
| JSON editor | `@monaco-editor/react` with local JSON schema validation |
| Template editor | `@monaco-editor/react` in plaintext mode |
| Typst integration | `@myriaddreamin/typst.ts` |
| Typst preview renderer | `@myriaddreamin/typst-ts-renderer` |
| File I/O | `<input type="file">` for import, `URL.createObjectURL` for export/download |

---

## Requirements

This section is the canonical backlog for formal product requirements.
Add new requirements here as they are dictated, grouped by category.

### Requirement ID Format

- Every requirement must use the format `XXX_YYY`.
- `XXX` is the requirement category key.
- `YYY` is the ordinal within that category, padded to three digits starting at `001`.
- Example pattern: `UIX_001`, `DAT_003`, `EXP_012`.

### Category Rules

- Create a new category only when an incoming requirement does not fit an existing category.
- Category keys should be short uppercase identifiers, ideally three letters.
- Category names should describe a coherent concern area such as user interface, editing workflow, storage, import/export, compilation, or preview behavior.
- Once a category key is assigned, keep it stable.

### Category Registry

Add categories here before adding the first requirement in that category.

| Key | Name | Scope |
|---|---|---|
| ARC | Architecture | Application architecture, runtime boundaries, and platform constraints |
| CMP | Compilation | Resume-to-document compilation pipeline, renderer integration, and output format constraints |
| DAT | Resume Data | Resume document format, editing capabilities, and document-count constraints |
| STO | Storage | Local persistence behavior, persistence timing, and shared storage utilities |
| TPL | Templates | Built-in template catalog, editable template content, and template file workflows |
| UIX | User Interface | Layout structure, panel composition, and UI component ownership constraints |
| VAL | Validation | Schema validation sources, editor validation behavior, and invalid-state gating rules |

### Requirement Template

Use this structure for each requirement entry:

```md
#### XXX_YYY — Short requirement title
Category: Category Name
Status: Proposed

Requirement:
- Clear, testable statement of the requirement.

Notes:
- Optional clarifications, constraints, or follow-up questions.
```

### Requirements List

Add categorized requirements below this line.

#### ARC_001 — Frontend-only SPA architecture
Category: Architecture
Status: Proposed

Requirement:
- The product must be implemented as a single-page application built with React, TypeScript, Vite, and pnpm.
- The product must run without any backend service or server-side application logic.

Notes:
- This establishes a browser-only architecture constraint for implementation and deployment decisions.

#### DAT_001 — JSON Resume document operations
Category: Resume Data
Status: Proposed

Requirement:
- The product must allow the user to view, edit, import, and export a resume document in JSON Resume format.

Notes:
- This requirement covers the core document workflow for a single resume payload.

#### DAT_002 — Single resume document only
Category: Resume Data
Status: Proposed

Requirement:
- The product must not support multiple resume documents or profile switching.

Notes:
- The application manages exactly one active resume document.

#### STO_001 — Persist resume edits locally
Category: Storage
Status: Proposed

Requirement:
- Resume edits must be persisted to `localStorage` as the user edits the document.
- Local persistence must be implemented through a shared hook stored at `src/hooks/useLocalStorage.ts`.

Notes:
- This requirement defines local browser persistence as the source of continuity between sessions.

#### STO_002 — Debounced persistence writes
Category: Storage
Status: Proposed

Requirement:
- Writes to `localStorage` for resume persistence must be debounced by 1 second.
- The debounce behavior must be implemented through a shared hook stored at `src/hooks/useDebounce.ts`.

Notes:
- This requirement defines shared debounce behavior for resume persistence writes.

#### CMP_001 — Typst PDF compilation pipeline
Category: Compilation
Status: Proposed

Requirement:
- The product must transform a JSON Resume document into a PDF document using Typst.
- The Typst integration used by the application must be provided through `@myriaddreamin/typst.ts`.

Notes:
- This requirement defines the required document compilation technology and output format.

#### CMP_002 — Typst WASM shadow filesystem compilation
Category: Compilation
Status: Proposed

Requirement:
- The Typst compiler integration provided by `@myriaddreamin/typst.ts` must run as a WebAssembly library in the browser.
- When PDF document compilation is triggered, the current resume JSON document and the currently selected Typst template must be mounted into the Typst compiler shadow filesystem.
- The compilation request must use the current in-memory versions of the resume JSON document and selected Typst template rather than stale or bundled defaults.

Notes:
- This requirement fixes the runtime model and the compile-time input source for document generation.

#### CMP_003 — Renderer-backed buffered preview updates
Category: Compilation
Status: Proposed

Requirement:
- On-screen Typst preview rendering must be driven through the Typst renderer rather than through a static pre-rendered bundled artifact.
- Preview updates must preserve the currently visible document until the next render is ready, so rerenders do not flash blank content or partially updated first-page-only output.
- The preview implementation must support multi-page output and swap the newly rendered document into view only after the replacement render has completed.

Notes:
- This captures the renderer-backed double-buffered preview behavior implemented for stable live updates.

#### TPL_001 — Static built-in template catalog
Category: Templates
Status: Proposed

Requirement:
- The product must manage multiple built-in resume templates that are editable by the user.
- The available templates must come from a static application-defined list.
- Built-in template source files must be stored in `src/templates`.
- The built-in template catalog must contain exactly these templates: `resume.typ`, `minimal.typ`, and `demo.typ`.

Notes:
- This requirement fixes both the location and membership of the initial built-in template set.

#### TPL_002 — Seed templates on first load
Category: Templates
Status: Proposed

Requirement:
- On the first application load for a user, the built-in templates must be initialized from the bundled files in `src/templates`.
- After initialization, the user must be able to edit template contents in the UI.

Notes:
- The bundled template files act as the original source of truth for first-run template state.

#### STO_003 — Persist edited templates locally
Category: Storage
Status: Proposed

Requirement:
- Modified template content must be persisted to `localStorage`.
- Template persistence must be implemented through a shared hook stored at `src/hooks/useTemplateStorage.ts`.
- The shared template persistence hook must accept a template id and template content.

Notes:
- This requirement applies to template content independently of resume JSON persistence.

#### STO_004 — Debounced template persistence
Category: Storage
Status: Proposed

Requirement:
- Persistence of modified template content must be debounced by 1 second.
- The debounce behavior for template persistence must be implemented through a shared hook stored at `src/hooks/useDebounce.ts`.

Notes:
- This mirrors the debounce requirement already defined for resume document persistence.

#### TPL_003 — Template revert, export, and import actions
Category: Templates
Status: Proposed

Requirement:
- The UI must allow the user to revert a modified template to its original bundled content.
- The UI must allow the user to export a template by downloading a file whose filename is the template id.
- The UI must allow the user to import template content from an uploaded file with the `.typ` extension.

Notes:
- These actions apply to user-editable template files rather than the resume JSON document.

#### UIX_001 — Resizable two-panel application shell
Category: User Interface
Status: Proposed

Requirement:
- The UI must be composed of two vertical resizable panels.
- The resizable panel implementation must use the `react-resizable-panels` dependency.
- Left panel functionality must be encapsulated in `src/components/ResumePanel.tsx`.
- Right panel functionality must be encapsulated in `src/components/TypstPdfPanel.tsx`.

Notes:
- This requirement defines both the primary application layout and the owning component modules for each side of the shell.

#### UIX_002 — Resume panel internal composition
Category: User Interface
Status: Proposed

Requirement:
- `ResumePanel` must contain two horizontal panels.
- The top, narrow panel must be encapsulated in `src/components/ResumeToolbar.tsx`.
- The bottom panel must render one of these editor panels based on the current toolbar selection: `ResumeJsonEditorPanel.tsx`, `ResumeFormEditorPanel.tsx`, or `TemplateEditorPanel.tsx`.

Notes:
- This requirement fixes the structural decomposition of the left-side editing experience and the allowed bottom-panel variants.

#### UIX_003 — Resume JSON editor implementation
Category: User Interface
Status: Proposed

Requirement:
- `ResumeJsonEditorPanel` must use `@monaco-editor/react` to display and edit the resume JSON document as text.

Notes:
- This requirement fixes the editor technology for the raw JSON editing experience.

#### UIX_004 — Template editor implementation
Category: User Interface
Status: Proposed

Requirement:
- `TemplateEditorPanel` must use `@monaco-editor/react` to display and edit Typst template documents.

Notes:
- This requirement fixes the editor technology for Typst template editing.

#### UIX_005 — Global styling token source
Category: User Interface
Status: Proposed

Requirement:
- The application must use `src/styles/tokens.css` as the global styling theme source.

Notes:
- This requirement establishes a single global token file for shared visual theme values.

#### UIX_006 — Resume toolbar tab structure
Category: User Interface
Status: Proposed

Requirement:
- `ResumeToolbar` must present a tab-like user experience with exactly two top-level tabs: `Resume` and `Template`.
- Each top-level tab header must contain additional UI controls within the header area.
- The `Resume` tab header must include nested mode tabs labeled `JSON` and `Forms`.
- The `Template` tab must not include nested tabs and must correspond to a single `TemplateEditorPanel` view.

Notes:
- This requirement defines the toolbar interaction model and the allowed top-level and nested tab structure.

#### UIX_007 — Resume toolbar editor switching
Category: User Interface
Status: Proposed

Requirement:
- Clicking the `JSON` nested tab in the `Resume` header must render `ResumeJsonEditorPanel` in the bottom area of `ResumePanel`.
- Clicking the `Forms` nested tab in the `Resume` header must render `ResumeFormEditorPanel` in the bottom area of `ResumePanel`.
- Selecting the `Template` top-level tab must render `TemplateEditorPanel` in the bottom area of `ResumePanel`.

Notes:
- This requirement defines how toolbar selection maps to the active editor panel.

#### UIX_008 — Resume toolbar actions and enablement
Category: User Interface
Status: Proposed

Requirement:
- The `Resume` tab header must provide controls to reset the resume to seeded data and to import and export the resume document.
- The `Template` tab header must provide a template selector plus controls to reset, import, and export the selected template.
- Header buttons belonging to the inactive top-level tab must be disabled until that tab is selected.
- Selecting an inactive top-level tab must require only one click and must enable that tab's header buttons as part of the tab activation.
- The template selector in the `Template` tab header must remain enabled even while the `Resume` tab is active, so the user can change the selected template without switching to the `Template` tab.

Notes:
- This requirement defines control availability and the exception that keeps template selection available across top-level tab states.

#### UIX_009 — Resume form editor module structure
Category: User Interface
Status: Proposed

Requirement:
- `ResumeFormEditorPanel.tsx` must be located in `src/components/form`.
- `ResumeFormEditorPanel` must be composed from multiple supporting components, with each supporting form component stored as an individual `.tsx` file in `src/components/form`.
- `ResumeFormEditorPanel` must present its content through a generic accordion component stored at `src/components/Accordion.tsx`, with sections corresponding to top-level JSON Resume schema elements.

Notes:
- This requirement fixes both the module location and the high-level structural decomposition of the form editor.

#### UIX_010 — Summary form section mapping
Category: User Interface
Status: Proposed

Requirement:
- `ResumeFormEditorPanel` must include a `Summary` accordion section that maps to the `basics` object.
- The `Summary` section implementation must be owned by `FormSummary.tsx`.
- The `Summary` section must provide text-field editing controls for `basics/name`, `basics/label`, `basics/email`, `basics/phone`, `basics/url`, and `basics/summary`.
- The `Summary` section must also expose editing of `basics/profiles`.
- When the `Summary` accordion section is collapsed, its collapsed label/value must use `basics/name`.

Notes:
- This requirement defines the initial `basics` field mapping for the form-based resume editor.

#### UIX_011 — Profiles form section behavior
Category: User Interface
Status: Proposed

Requirement:
- Profile editing within the form experience must be implemented in `FormProfiles.tsx`.
- When the `Profiles` accordion section is collapsed, each profile summary must be displayed using the format `{profile/network}: {profile/username}`.

Notes:
- This requirement fixes both the component ownership and collapsed-summary format for profile entries.

#### UIX_012 — Cover letter form section layout
Category: User Interface
Status: Proposed

Requirement:
- The `Cover Letter` form section must map to `basics/cover_letter` and must be implemented in `FormCoverLetter.tsx`.
- Each item in `basics/cover_letter` must be rendered and edited through `FormHighlights.tsx`.
- `FormHighlights.tsx` must be generic enough to support both work highlights and `basics/cover_letter` items.
- `FormHighlights.tsx` must use two vertical panels.
- The left narrow panel must contain vertical action buttons for type selection, delete, and add.
- The right panel must contain a single-line `Title` input at the top and a multiline text editor below it.

Notes:
- This requirement fixes the component ownership and reusable editing layout for cover letter content.

#### UIX_013 — Work experience form section mapping
Category: User Interface
Status: Proposed

Requirement:
- `ResumeFormEditorPanel` must include a `Work Experience` accordion section.
- The `Work Experience` section must map to the `work` JSON array.
- The section implementation must be owned by `FormWorkExperience.tsx`.
- Each element of the `work` array must be rendered by `FormWorkExperienceEntry.tsx`.

Notes:
- This requirement defines the component ownership and data mapping for work history editing.

#### UIX_014 — Work experience entry field mapping
Category: User Interface
Status: Proposed

Requirement:
- Each work entry editor must provide input controls for `work/name`, `work/position`, `work/startDate`, `work/endDate`, `work/location`, and `work/summary`.
- Editing of `work/highlights` must be implemented through `FormHighlights.tsx`.

Notes:
- This requirement defines the field-level mapping for work history entries and reuses the shared highlights editor abstraction.

#### UIX_015 — Education form section mapping
Category: User Interface
Status: Proposed

Requirement:
- `ResumeFormEditorPanel` must include an `Education` accordion section.
- The `Education` section must map to the `education` JSON array.
- The section implementation must be owned by `FormEducation.tsx`.
- Each element of the `education` array must be rendered by `FormEducationEntry.tsx`.

Notes:
- This requirement defines the component ownership and data mapping for education history editing.

#### UIX_016 — Education entry field mapping
Category: User Interface
Status: Proposed

Requirement:
- Each education entry editor must provide input controls for `education/institution`, `education/area`, `education/studyType`, `education/startDate`, `education/endDate`, and `education/location`.

Notes:
- This requirement defines the field-level mapping for education entries.

#### UIX_017 — Skills form section mapping
Category: User Interface
Status: Proposed

Requirement:
- `ResumeFormEditorPanel` must include a `Skills` accordion section.
- The `Skills` section must map to the `skills` JSON array.
- The section implementation must be owned by `FormSkills.tsx`.
- Each element of the `skills` array must be rendered by `FormSkillsCategory.tsx`.

Notes:
- This requirement defines the component ownership and data mapping for skills editing.

#### UIX_018 — Skills category field mapping
Category: User Interface
Status: Proposed

Requirement:
- Each skills category editor must provide a text input for `skills/name`.
- Each skills category editor must provide a multiline input for `skills/keywords`.

Notes:
- This requirement defines the field-level mapping and input types for skills categories.

#### UIX_019 — Projects form section mapping
Category: User Interface
Status: Proposed

Requirement:
- `ResumeFormEditorPanel` must include a `Projects` accordion section.
- The `Projects` section must map to the `projects` JSON array.
- The section implementation must be owned by `FormProjects.tsx`.
- Each element of the `projects` array must be rendered by `FormProjectsEntry.tsx`.

Notes:
- This requirement defines the component ownership and data mapping for project editing.

#### UIX_020 — Project entry field mapping
Category: User Interface
Status: Proposed

Requirement:
- Each project entry editor must provide text inputs for `projects/name`, `projects/description`, and `projects/url`.

Notes:
- This requirement defines the field-level mapping for project entries.

#### UIX_021 — Generic accordion composition
Category: User Interface
Status: Proposed

Requirement:
- The generic accordion implementation for the form experience must be stored in `src/components/Accordion.tsx`.
- `ResumeFormEditorPanel` must compose its top-level sections by rendering section components inside `Accordion`, including `FormSummary`, `FormSkills`, `FormWorkExperience`, `FormEducation`, and `FormCoverLetter`.

Notes:
- This requirement defines the shared accordion abstraction used to host form sections.

#### UIX_022 — Nested entry accordion behavior
Category: User Interface
Status: Proposed

Requirement:
- Subsections representing individual entries of profiles, work history, education history, and skill categories must be rendered as accordions.

Notes:
- This requirement establishes accordion behavior for repeated entry editors inside form sections.

#### UIX_023 — Accordion section reordering
Category: User Interface
Status: Proposed

Requirement:
- The generic accordion implementation in `src/components/Accordion.tsx` must support drag-and-drop reordering of sections.

Notes:
- This requirement applies to the shared accordion component rather than a single form section.

#### UIX_024 — Floating preview download control
Category: User Interface
Status: Proposed

Requirement:
- `TypstPdfPanel` must expose PDF download through a floating overlay button anchored to the top-right corner of the right panel rather than through a header card or scrolling document content.
- The floating download control must remain fixed in place while the preview document scrolls beneath it.
- The control must use a compact icon-only presentation and support a semi-transparent idle state with a more prominent hover state.

Notes:
- This requirement captures the implemented fixed overlay download button behavior for the preview panel.

#### VAL_001 — Local JSON Resume schema enforcement
Category: Validation
Status: Proposed

Requirement:
- The JSON editor must validate the resume document against the JSON Resume schema `https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json`.
- The schema document must be copied into the project and used locally rather than fetched from an external site at runtime.

Notes:
- This requirement fixes both the validation schema source and the offline/runtime-independence constraint.

#### VAL_002 — Block invalid resume persistence and PDF generation
Category: Validation
Status: Proposed

Requirement:
- Resume persistence must be blocked while the JSON document fails schema validation.
- PDF generation must be blocked while the JSON document fails schema validation.

Notes:
- This requirement makes schema validity a hard prerequisite for both saved state and compiled output.


---

## Future Ideas

- Multiple named resume profiles (stored in `localStorage`).
- Shareable state via URL hash (base64-encoded JSON + template id).
- Import a template or template bundle from external files.
- Cover letter toggle (show/hide cover letter pages in preview).
- save different resumes - simple select box with list of saved resume and two top items for new and clone current. Use name from meta/name
- use meta/template for template selector
- check ref impl https://registry.jsonresume.org/editor
