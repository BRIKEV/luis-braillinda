---
name: complete-story
description: Use when adding newly transcribed pages of the source PDF into the luis-braillinda story, or when the user says they have read more of the book and wants it in the app
---

# Completing the story

The book is transcribed by hand, a few pages at a time, into `src/data/content.ts`.
This is the loop for turning those pages into playable entries.

**The transcription is the user's. The staging is a decision. Everything else is
a question.** Most of what goes wrong here is not a wrong entry — it is deciding
something on their behalf and telling them afterwards.

## Three pages maximum

Never add more than three pages in one run. If more are supplied, take the first
three, say so, and tell the user to run the skill again for the rest.

| Excuse | Reality |
|--------|---------|
| "They gave me eight, they clearly want eight" | They want eight *added*. They want to review them in batches they can actually check. |
| "These pages are short" | Length is not the cost. Each page needs a cast, expressions and possibly an exercise reviewed. |
| "It is one continuous scene, splitting is artificial" | The scene survives the split. Say where you stopped. |
| "I will do all eight and flag the extras" | Flagging after the fact is the failure this rule exists to stop. |

## Before editing any file

Ask about anything below that the user has not already stated. Ask everything in
one batch, then wait. Do not begin editing to "get a head start".

1. **Which pages** — the range in the PDF, so the work can be traced back.
2. **Who is on stage** — for each page: who stands left, who stands right, or
   nobody. Do not infer this from who is speaking; narration often plays over a
   cast that is still standing there.
3. **Expressions** — only where a beat calls for one. Say which beats you think
   warrant it and let them confirm; do not assign moods silently.
4. **New signs** — does any page teach a letter not yet in `dictionary.ts`? If
   so, that letter must be added in the same change, and the user should confirm
   the story really teaches it here.

## Exercises stop the line

An exercise is any entry with a `solution`. When a page has one, stop and confirm
it with the user before writing it, because two invariants must hold and both are
easy to break while transcribing:

- the `<BRAILLE>` text must equal the `solution` exactly, ignoring case
- every letter in it must already be taught in `dictionary.ts`

A real example from this project: a page transcribed as `<BRAILLE>BEBE</BRAILLE>`
with the answer `bebé` breaks the first invariant, and would also have shown a
plain `e` cell on the page whose whole purpose is teaching `é`. Both tests catch
it, but the fix is a content decision, not a code one — so ask.

## Never decide these alone

Stop and ask if a page seems to require any of them:

- **Changing app code.** Widening the `<BRAILLE>` regex, altering how answers
  are graded, touching the parser. A page that needs code changed is a
  conversation, not a transcription.
- **Inventing content.** Only what the user transcribed goes in. If a teaching
  line reads better with its cell shown after it, propose that; do not add it.
- **Reordering or skipping.** If the PDF's order differs from the pages given,
  say so before writing, not after.

## Then write the entries

Each `Entry` carries its own `backdrop`, `left`, `right` and optional
`leftAs`/`rightAs`. Nothing is inherited. The field types are unions, so
`npm run build` catches a mistyped backdrop or an expression the character has no
art for.

Afterwards run `npm run lint` and `npm run build`, and ask the user to run
`npm run test:ci` — they run the suite, not you.

## Tests: usually none

Default to adding no test. `story-data.twd.test.ts` already runs both invariants
across the whole array, so new pages are covered the moment they are added — that
is the point of it.

Propose a test only for a new **mechanic**, never for new content:

| Situation | Test? |
|---|---|
| More dialogue, narration, backdrops, expressions | No |
| Another exercise of the existing kind | No |
| A new sign taught | No — extend the dot-number table in `braille.twd.test.ts` |
| A page type that behaves differently, or new interaction | Yes — discuss it first |

## Red flags

- Editing `content.ts` before the cast questions are answered
- More than three pages added
- Any file outside `content.ts`, `dictionary.ts` and `alphabet.ts` changed
  without asking
- A `<BRAILLE>` block containing text the user did not write
- Reporting a decision you made instead of a question you asked
