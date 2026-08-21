# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Interactive visual novel (in Spanish) that teaches the braille system, transcribed from
`sources/luis y braillinda te cuentan como es el braille1.pdf` — *"Luis y Braillinda te cuentan cómo es
el Braille"* by Carmen Roig, distributed free by the ONCE. The PDF is the source of truth for story
text and for the order in which letters are introduced.

Hobby project. It started on Remix, then moved to React Router framework mode, and now runs as a plain
Vite SPA using **React Router in data mode**. `README.md` is still the untouched Vite template — it
contains nothing project-specific, don't rely on it.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # serve the production build
```

No test runner is configured (no vitest/jest, no test files). If tests are wanted, that's a setup task,
not a missing script.

`npm run lint` and `npm run build` are both green — keep them that way. `vite build` still prints one
warning: `vite.config.ts` uses `__dirname`, unsupported by Vite's future native config loader
(`import.meta.dirname` is the replacement).

## Architecture

### Routing and data flow

`src/main.tsx` → `RouterProvider` → `src/routes/routes.tsx` (`createBrowserRouter`). Two routes: `/`
(Home) and `/story` (with a colocated `loader.ts` and `action.ts` in `src/routes/Story/`).

State lives entirely in the URL query string — there is no client store:

- `?page=N` — **1-based index into `bookContent`**; the loader returns `bookContent[N-1]` as `content`
  plus `fullContent = bookContent.slice(0, N)` for the history dialog.
- `?dictionary=open` / `?log=open` — modal visibility, read with `useSearchParams` in `story.tsx`.

Navigation is `<Link to={{ search: '?page=N' }} preventScrollReset>` rendered *through* `Button`.

`action.ts` grades exercises: compares `formData.solution` against `bookContent[page-1].solution`
lowercased, returns `{success:true}` or a **400 JSON response** `{success:false}`. `Form.tsx` reads
both through `useFetcher`, so a wrong answer is a deliberate non-2xx that the fetcher surfaces as data.

### Content model (`src/data/content.ts`)

The whole book is one ordered `Content[]`; array position *is* the page number. Each entry:

```ts
{ message: string; author: string; solution: string | null; exercise: boolean }
```

`message` carries two inline markup forms, parsed at render time by `src/components/Messages.tsx`:

- `<BRAILLE>texto</BRAILLE>` → replaced by a `<BrailleMessage>`. The regex is `/[A-Za-z ]+/` — **only
  unaccented letters and spaces**; punctuation, digits or accents inside the tag will not match and the
  tag leaks through as literal text.
- `<br>` → line break.

`author` is a plain string that drives two separate lookups, both of which need updating when a new
speaker appears:

- `src/components/Avatars.tsx` — which character image is highlighted (`hiddenAvatars` hides the
  avatar row for `narrador` and `tu turno`).
- `src/components/Message.tsx` — bubble header color per author.

Authors currently in use: `Narrador`, `Braillinda`, `Luis`, `Abuela`, `Tu turno` (the last one marks
exercise pages).

### Braille rendering (`src/components/Braille/`)

`dictionary.ts` maps a character to a **6-character string** where `1` is a raised dot and `-` is empty.
The string is consumed in DOM order by a 2-column × 3-row grid, so it is **row-major, not dot-numbered**:

```
index:  0 1     dots:  1 4
        2 3            2 5
        4 5            3 6
```

So `l: '1-1-1-'` = dots 1,2,3 and `d: '11-1--'` = dots 1,4,5.

The dictionary intentionally contains **only the 11 letters the story has taught so far**
(`a b d e i l m n o s u`). Any character missing from it renders the literal string
`Invalid character`, so a `<BRAILLE>` block must never use a letter the story hasn't introduced yet —
extend `dictionary.ts` in the same change that adds the story page teaching that letter.

`BrailleMessage` splits on spaces, renders each word as a run of cells, and inserts an empty spacer cell
between words.

### UI stack

- **Tailwind v4**, CSS-first: no `tailwind.config`. The whole design system is the `@theme` block
  at the top of `src/index.css`.
- **No component library.** shadcn/base-ui was removed once the custom design landed — a generic
  Button earned nothing against a bespoke visual identity. Controls are plain `<button>`/`<Link>`
  elements taking class strings from `src/components/styles.ts` (`buttonStyles`, `inputStyles`,
  `labelStyles`). That file is the single place to restyle controls. Icons are `lucide-react`.
- `Dialog.tsx` wraps the native `<dialog>` element (imperative `showModal()`/`close()`), and takes a
  required `title`. `Dictionary` and `Log` both build on it.
- Alias `@` → `src`, in both `vite.config.ts` and `tsconfig.app.json`.
- Character art is imported from `src/images/` (bundled by Vite). Both character sprites are palette
  PNGs carrying transparency via a `tRNS` chunk; `background.png` is opaque.

### Design language

Two registers, taken from the story itself:

- **The seen world** — the illustrated stage: lantern light, warm colour, soft focus.
- **The felt world** — everything braille: parchment and ink in real relief.

Relief (`.braille-cell`, `.braille-dot-raised`, `.braille-dot-empty`) is reserved for braille, which
genuinely is embossed. **Never apply it to buttons or inputs** — those stay flat and high-contrast so
the tactile conceit costs nobody usability.

Colours are sampled from the project's own artwork, not invented: honey lantern light, Braillinda's
sage dress, the teal dusk window, with poppy red carried over from the amapolas of the source book.
Poppy means *action* and appears nowhere decorative. Narrador deliberately gets no speaker chip —
narration is a different register, not a character with a name tag.

**Every colour pair used for text clears WCAG AA at normal size**, and the empty-dot ring clears 3:1
against parchment. Ratios are noted inline in `index.css`. This app is about blind readers and is
published in respect of the ONCE — verify contrast when changing a colour, do not eyeball it.

Type is **Fraunces** for display (variable, run with `SOFT`/`WONK` so it reads storybook rather than
editorial) and **Atkinson Hyperlegible** for body text — drawn by the Braille Institute for low-vision
readers. Both self-hosted via fontsource, imported in `main.tsx`. Do not swap the body face for a
generic sans; the choice is functional.

Motion is one orchestrated moment: dots emboss into the page when a cell appears. The stagger is
**capped** so a long phrase never takes more than ~350ms to finish arriving. `prefers-reduced-motion`
is honoured globally.

### Braille data

`alphabet.ts` holds the full Spanish alphabet; `dictionary.ts` derives the letters taught so far from
it, so dot patterns have one source of truth. `BrailleCharacter` defaults to the taught set, so the
story cannot silently show a sign the reader has not met — pass `map={brailleAlphabet}` only for
decorative braille the reader is not expected to decode (the home page title does this).

## Known gaps in content rendering

Relevant to the design / data-model work being planned:

- `Dictionary.tsx` always shows every entry in `dictionary.ts` regardless of the reader's page — it is
  not scoped to what has actually been taught up to `?page=N`.
- The transcription stops mid-story, at Braillinda asking about accented vowels; the rest is still in the PDF.
- `content.ts` currently mixes cases in `solution` values (`'baba'` vs `'ALA'`); the action lowercases
  both sides, so this is harmless but inconsistent.

## Conventions

- All user-facing copy is Spanish — keep new strings in Spanish, matching the book's wording.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`).
