# Paste-ready prompts

`style.md` and the other briefs are reference documents — do not paste their
markdown into a prompt box. Headers, tables and bullet lists are noise to an
image model. These are the same content flattened into prose, ready to paste.

## Which tool for what

| | Tool | Why |
|---|---|---|
| Backgrounds | **Firefly Image 4** | 16:9 preset built in, strong at landscapes, licensed training data |
| Characters | **Gemini (Nano Banana)** | Keeps a face consistent across expressions by editing your existing sprite. Firefly's reference transfers style, not identity. |

## Firefly settings for backgrounds

- **Proporción:** 16:9
- **Tema / style presets:** off. They fight the prose and push toward gloss.
- **Excluir de la imagen** (under **Más**) — this is a *separate field from the
  prompt box*. Never paste these words into the prompt itself: a model reads a
  positive prompt as a list of things to draw, so putting them there asks Firefly
  for text, people, neon and a watermark. Same list for all three:

```
text, letters, numbers, braille, watermark, signature, people, person,
characters, figures, fairy, photorealism, 3D render, CGI, anime, thick black
outlines, neon, oversaturated, harsh shadows, lens flare, glossy, plastic
```

Excluding people matters: these are empty stages, and the model will happily
populate a meadow with a wandering child otherwise — and then there is nowhere
to stand Braillinda.

Adobe has moved this field between Firefly versions and some builds no longer
have it. If you cannot find it, **skip the list rather than relocating it into
the prompt**. The prose already says the stage is open and empty; if figures
still appear, append the short phrase `no people, no characters` to the end of
the prompt, which reads as an instruction rather than a shopping list.

## Order

Generate the **meadow** first and iterate until the style is right. Then upload
that approved image as a style reference for the other two so all three match.

---

## 1. Meadow

```
Soft children's storybook illustration in coloured pencil and light watercolour,
warm and gentle, visible paper grain, delicate soft outlines rather than heavy
ink, muted saturation, matte finish. An autumn meadow at golden hour seen from
low down among the flowers: tall red poppies with dark round seed capsules
catching the light, large red and white spotted mushrooms with soft rounded
caps, a gnarled tree trunk with a small hollow at the left edge, dry golden
grasses, drifting dandelion seeds and tiny glowing motes in the air. Warm low
sunlight from the right, long soft shadows, a hazy pale gold and dusty violet
sky. The middle ground is open and empty. Peaceful, nostalgic, quietly magical.
```

## 2. Paris street

```
Soft children's storybook illustration in coloured pencil and light watercolour,
warm and gentle, visible paper grain, delicate soft outlines rather than heavy
ink, muted saturation, matte finish. A narrow cobbled Paris street on a cold
autumn night in the early nineteenth century: a tall pale stone building with a
heavy wooden door and rows of tall windows, three of them glowing warm amber
from within, a single wrought iron street lantern casting a pool of honey light
on wet cobbles, bare branches against a deep teal and violet sky with a scatter
of stars and a little mist. The foreground is open and empty. Quiet, hushed,
expectant.
```

## 3. Workshop

```
Soft children's storybook illustration in coloured pencil and light watercolour,
warm and gentle, visible paper grain, delicate soft outlines rather than heavy
ink, muted saturation, matte finish. The interior of an old stone institute
workroom at dusk: vaulted arched ceilings in warm pale stone, tall bookshelves
crammed with worn books, a large dark green chalkboard on the back wall which is
completely blank and empty, sturdy wooden work tables and stools, a tall arched
window on the right looking out on a misty teal twilight garden. Hanging brass
lanterns and a candle giving warm amber light, tiny golden motes drifting in the
air, one open book on a table glowing gently from its pages. The centre
foreground is open and empty. Cosy, scholarly, quietly magical.
```

Keep the chalkboard blank. The app renders real braille; decorative dots that do
not spell anything are a small lie in a story that teaches the code.

---

## Characters, in Gemini

Conversational rather than one-shot. Upload the existing sprite, then iterate in
the same thread so the face carries across.

**Turn 1** — attach `src/images/braillinda.png`:

```
This is a character from a children's story I am illustrating. Redraw her as a
full-body figure on a plain flat white background, three-quarter view, facing
to the left, with nothing else in the image: no furniture, no props, no scenery,
no border or outline around her.

Keep her exactly recognisable: long silver-blonde hair, pointed ears, large
translucent golden butterfly wings veined like a leaf, a simple sage-green dress
whose fabric is covered all over in small raised dots like braille pressed into
the cloth, barefoot, a slender wand with a small gold star, a soft golden glow
with a few drifting sparkles.

Soft children's storybook style in coloured pencil and light watercolour, warm
and gentle, visible paper grain, delicate outlines, muted colour, matte.

Her expression: head slightly lowered, a gentle sad smile, one hand touching a
wing. She is wistful.
```

**Turns 2–4** — same thread, no re-upload:

```
Same character, same pose framing and same style. Now: head tilted, alert and
curious, one hand reaching out with fingertips extended as if feeling something.
```

```
Same character, same framing and style. Now: a bright open smile, both hands
raised, wings spread wide, more sparkles. She is delighted.
```

```
Same character, same framing and style. Now: arms folded, brow furrowed,
pouting, wings tense. She is cross.
```

Then repeat for Luis, attaching `src/images/luis.png`, using his base
description from `characters.md` and asking for `asleep`, `explaining` and
`pleased`. Have him **face right**.

## After generating

Neither tool reliably gives transparent PNGs, so ask for a plain flat white or
plain flat green background and cut it out afterwards. `rembg` handles this
locally in one command, or use any background remover. Check the result against
the checklist at the end of `characters.md` before dropping files into
`src/images/`.
