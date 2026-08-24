# TWD Project Patterns

## Project Configuration

- **Framework**: React 19
- **Vite base path**: `/`
- **Dev server port**: `5173`
- **Entry point**: `src/main.tsx`
- **Public folder**: `public/`
- **Test location**: `src/twd-tests/`

### Relay Commands

```bash
# Run all tests
npx twd-relay run
```

If port 5173 is already taken, Vite falls back to 5174 and the relay needs telling:

```bash
npx twd-relay run --port 5174
```

## What to test: flows, not units

**Flow tests are the default and the priority.** A test should walk a real
scenario the way a reader would — land on a page, read what is there, click
something, see what changed. Cover journeys and states, not individual
components in isolation.

Unit tests are the exception, reserved for a specific function with real logic
worth pinning down on its own — the braille dot encoding, or the message parser.
Do not write a unit test for a component just because it exists.

## Standard Imports

```typescript
import { twd, userEvent, screenDom, expect } from "twd-js";
import { describe, it, beforeEach, afterEach } from "twd-js/runner";
```

**Import only what the file actually uses.** Test files are type-checked by
`npm run build`, and `tsconfig.app.json` sets `noUnusedLocals`, so an unused
import fails the build rather than just warning.

## Visit Paths

Base path is `/`, so paths are plain:

```typescript
await twd.visit("/");
await twd.visit("/story?page=1");
```

## Standard beforeEach / afterEach

```typescript
beforeEach(() => {
  twd.clearRequestMockRules();
  twd.clearComponentMocks();
});

afterEach(() => {
  twd.clearRequestMockRules();
});
```

No store reset, no query-cache reset and no Sinon: this project has no client
state library, no server-state cache and no third-party modules to stub.

## This app has no network layer

Worth knowing before writing tests, because it changes what they should assert.
The whole story is a static array in `src/data/content.ts`, and the React Router
`loader` and `action` read it directly — **nothing calls `fetch`**. So request
mocking is mostly irrelevant here; tests are about rendering, navigation and
interaction, not about intercepting requests.

The one thing that looks like a network call is the exercise form: it posts to
the route `action` via `useFetcher`, which stays inside the router. Assert on
what the user sees ("¡Correcto!" / "No es esa"), not on requests.

## State lives entirely in the URL

There is no client state to set up or tear down. Everything the story needs is
in the query string, so a test can jump straight to any state by visiting a URL:

| URL | State |
|---|---|
| `/story?page=1` | first page, narration, meadow |
| `/story?page=7` | the abuela speaking |
| `/story?page=30` | an exercise (has a `solution`, `baba`) |
| `/story?page=N&dictionary=open` | dictionary dialog open |
| `/story?page=N&log=open` | history dialog open |

`page` is a 1-based index into `bookContent`. An entry is an exercise when it
has a `solution`; there is no separate `exercise` flag. **Do not hard-code page numbers
for story beats in tests** — the story is only partly transcribed and inserting
an entry shifts every index after it. Derive them, or assert on content.

## Portals and Dialogs

The dictionary and history use the native `<dialog>` element via
`src/components/Dialog.tsx` and `showModal()`, so they render in the top layer.
Use `screenDomGlobal`, not `screenDom`:

```typescript
import { screenDomGlobal } from "twd-js";
const dialog = screenDomGlobal.getByRole("dialog");
```

## Querying braille cells

Braille is rendered as `<span>` grids of dots with no text, so it is invisible
to text queries. Each `BrailleMessage` exposes `role="img"` with an accessible
name of `En braille: <text>`, and the individual cells inside are
`aria-hidden`. Query the word, never the dots:

```typescript
screenDom.getByRole("img", { name: "En braille: baba" });
```

## Accessible names are Spanish

All UI copy is Spanish. Query by the real strings — `Continuar`, `Volver`,
`Comprobar palabra`, `Diccionario`, `Histórico`, `Comenzar la historia` — and
mind the accents.

## Characters are decorative

`Stage.tsx` is wrapped in `aria-hidden="true"`, so backdrops and character
sprites are deliberately invisible to queries. To assert on staging, check the
`<img>` `src` or `class` directly rather than reaching for a role.
