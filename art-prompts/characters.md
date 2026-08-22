# Characters

**Transparent PNG, no background, no furniture, tight crop.** Both characters at
a matching scale on a shared floor line, three-quarter view, full body.

Use the existing `src/images/braillinda.png` and `luis.png` as character
references so the faces stay recognisable, and a finished background as the
style reference.

Prepend `style.md` to each prompt.

---

## Braillinda

Staged on the **right**, so she should **face left**.

**Base description — keep constant across every expression:**

> A young fairy with long silver-blonde hair, pointed ears, and large translucent
> golden butterfly wings veined like a leaf. She wears a simple sage-green dress
> whose fabric is covered all over in small raised dots, like braille pressed into
> the cloth. Barefoot, floating just above the ground, with a soft golden glow and
> a few drifting sparkles around her. She carries a slender wand with a small gold
> star. Warm, kind, expressive face.

She is blind. Draw her eyes open and natural — she is not defined by it, and the
book does not draw her differently. Her hands and posture can carry the sense of
reaching and feeling her way.

| Expression | Story beat | Direction |
|---|---|---|
| `wistful` | Opening — proud of her wings, but sad she cannot read | Head slightly lowered, gentle sad smile, one hand touching a wing |
| `curious` | The discovery, and most dialogue | Head tilted, alert, one hand reaching out, fingertips extended as if feeling |
| `delighted` | "¡Qué fácil! Ya puedo escribir" | Bright open smile, both hands raised, wings spread, more sparkles |
| `cross` | She is "muy cascarrabias" and kicks dot 5 across the cell | Arms folded or one hand on hip, brow furrowed, pouting, wings tense |

---

## Luis

Staged on the **left**, so he should **face right**.

Note your current sprite draws him as an elderly teacher. The historical Louis
Braille devised the system at fifteen, as a student, and the source book draws
him as a young man with red hair tied back. Both readings are defensible —
"un hada y un maestro" is a fine reframing — but pick one deliberately. The
description below keeps your existing elderly-teacher take; swap the first
sentence if you change your mind.

**Base description — keep constant across every expression:**

> A kindly elderly teacher with a short white beard and swept-back white hair,
> wearing small round dark glasses. A soft ochre-yellow shirt with a buttoned
> collar under a warm brown quilted waistcoat. Gentle, animated hands. Patient and
> encouraging, a teacher who enjoys explaining. No desk, no book, no furniture.

| Expression | Story beat | Direction |
|---|---|---|
| `asleep` | Braillinda finds him dozing and wakes him | Seated posture, head tipped forward, peaceful, hands loose in lap |
| `explaining` | Most of his dialogue | One hand raised mid-gesture, open palm, mouth slightly open, engaged |
| `pleased` | "Queda muy bien" | Warm broad smile, both hands open, head tilted back a little |

---

## Checklist before dropping into `src/images/`

- [ ] Transparent background, no white box
- [ ] No desk, book, chair or scenery attached to the figure
- [ ] Both characters the same height on screen, feet on a common line
- [ ] Luis faces right, Braillinda faces left
- [ ] No hard keyline or sticker outline
- [ ] Exported as WebP as well as PNG
- [ ] Palette still sits inside the range in `style.md`
