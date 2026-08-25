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

`action.ts` grades both kinds of exercise and returns `{success:true}` or a **400 JSON response**
`{success:false}`. `Form.tsx` and `BlanksForm.tsx` read both through `useFetcher`, so a wrong answer
is a deliberate non-2xx that the fetcher surfaces as data. The fill-in reply also carries
`wrong: number[]` — with eight words on a page, "no" without saying which is not usable.

### Content model (`src/data/content.ts`)

The whole book is one ordered `Entry[]`; array position *is* the page number. Every entry carries
`author`, `message` and `backdrop` plus its own staging (see **Story staging**), and at most one of
the two exercise fields:

```ts
solution: string      // read the braille, type it back. Graded case-insensitively.
blanks: Blank[]       // supply the accented vowel missing from each word.
```

They are a union in the type, so no entry can carry both.

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

### Story staging

`/story` is a visual novel: a fixed full-bleed backdrop with the cast standing on
it, and a parchment dialogue panel over the lower part of the stage.

**Every page carries its own staging.** An `Entry` in `content.ts` names its
`backdrop`, who is on the `left` and `right`, and optionally `leftAs`/`rightAs`
for expression. Nothing is inherited from the previous entry. That repeats the
same three fields down most of the file, which is the deliberate trade — the
story is transcribed by hand and still growing, and an explicit entry can never
have its staging shifted by a line inserted above it. The field types are string
unions, so a typo fails the build.

- `Stage.tsx` takes the whole entry and renders it. Sprites and backdrops resolve
  through `import.meta.glob`, so `content.ts` names assets as plain strings.
  A `leftAs` naming an expression that character has no art for logs a dev
  warning rather than silently rendering nothing.
- Three lighting states: `speaking` (lit, forward), `listening` (dimmed, pushed
  back), and `ambient` — used when nobody speaks, during narration and
  exercises. With only the first two, narration dimmed everybody at once and a
  lone character on an empty meadow became almost invisible.
- Characters are cut off at the bottom by the dialogue panel. That is
  deliberate: it removes the need to land feet convincingly on a painted floor.
  Braillinda floats and is drawn smaller, being a fairy; Luis and the abuela
  stand. She faces left and they face right, so they face each other.
- `parseMessage` is shared by the panel and the history dialog so both expand
  `<BRAILLE>` and `<br>` identically.

An entry is an exercise when it has a `solution` or `blanks` — there is no separate flag.
The old `exercise: boolean` was redundant with it across all 69 entries.

### The fill-in exercise (`BlanksForm.tsx`, `BlankItem.tsx`)

Page 12 of the PDF asks the reader to *"dibuja los puntitos que forman las vocales acentuadas donde
corresponda"*: braille words with one cell left empty, and the reader supplies the accented vowel.

A `Blank` is just the finished word. Exactly one of its letters is an accented vowel, so **where the
gap goes and what fills it are both read off the word** — `accentAt()` in `content.ts` — and there is
no position to keep in sync with the answer. A `story-data` test enforces the one-accent rule.

`also` lists other words the same gap spells. The book prints the gap empty, so **it never states an
answer of its own**: `d?melo` is *dámelo*, *dímelo* and *démelo* alike. Grading a reader wrong for
writing a real Spanish word would teach them wrong, so ordinary alternatives are accepted; marginal
conjugations of rare verbs are not carried. Every alternative must differ from the word *only* at the
gap — the action derives the accepted signs by reading each one's accented vowel, and a test enforces it.

Each word is a `<fieldset>` of five native radios labelled with their braille cells. Radios rather than
a `<select>` because five options belong all-visible, and because an option's text cannot carry a
braille cell — the dot pattern is the thing being taught. The visual braille is `aria-hidden` (drawn
dots offer a screen-reader user nothing) and the legend carries the word instead, gap named:
`Palabra 2: d, hueco, m, e, l, o`. That is real access to the exercise, but it is not the same
experience, and the code says so rather than implying otherwise.

The book prints all 24 words in one block; they are split across three entries so the check button is
never far. Splitting is a rendering choice — it is still one PDF page.

### Design language

Two registers, taken from the story itself:

- **The seen world** — the illustrated stage: lantern light, warm colour, soft focus.
- **The felt world** — everything braille: parchment and ink in real relief.

Relief (`.braille-cell`, `.braille-dot-raised`, `.braille-dot-empty`) is reserved for braille, which
genuinely is embossed. **Never apply it to buttons or inputs** — those stay flat and high-contrast so
the tactile conceit costs nobody usability. `.braille-blank` is the one cell pressed *into* the page
rather than raised out of it: the gap in a fill-in, paper not yet written on.

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
- The transcription stops at the end of PDF page 12, after the accented-vowel fill-in; the rest is still in the PDF.
- `content.ts` currently mixes cases in `solution` values (`'baba'` vs `'ALA'`); the action lowercases
  both sides, so this is harmless but inconsistent.

## Illustrations

Art lives in `src/images/`; the generation briefs live in `art-prompts/`, with
`paste-ready.md` as the operational file. `src/images/bg-workshop.jpg` is the
**style anchor** — new art matches it, and it is not regenerated.

**When transcribing more of the source PDF, watch for emotional beats that the
current expression set cannot cover, and add them to
`art-prompts/paste-ready.md`.** The set is deliberately small (curious,
delighted, cross, wistful for Braillinda; explaining, pleased, asleep, surprised
for Luis), so a new beat — Braillinda frightened, Luis thinking — needs a new
block written in the same shape: a `#### filename — story beat` heading, then a
self-contained prompt beginning "Same character, same full-body framing, same
style, same magenta background." Note it there even if the image is not
generated yet; the list is the backlog.

Sprites are generated on flat magenta and keyed locally with
`python3 art-prompts/key-magenta.py <files>`, which writes a `.webp` with alpha
beside each input. Two things that pass on a magenta canvas and only fail once
the sprite is over a scene, both already handled in that script:

- A plain colour-distance key gives partial alpha to any subject colour that
  happens to sit near the key. Luis's brown waistcoat leaked the room through
  his clothes that way. Only background **connected to the image border** is
  removable.
- Background enclosed by the figure — the gap in Luis's chair — is never reached
  by that flood, so it is removed separately, but only where the colour matches
  the key almost exactly.

Never dim a character with CSS `opacity`: the backdrop shows through and they
read as a ghost. Use `brightness`/`saturate`, which keeps them solid.

Two conventions worth not rediscovering: prompts must avoid "coloured pencil"
and "paper grain" (that language produces crayon output — the anchor is smooth
painterly gouache), and characters are generated on flat magenta with no glow or
sparkles, since the glow is added in CSS so it can adapt per background.

## Conventions

- All user-facing copy is Spanish — keep new strings in Spanish, matching the book's wording.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`).
