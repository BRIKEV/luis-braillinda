# Paste-ready prompts

Reference docs (`style.md`, `backgrounds.md`, `characters.md`) are the thinking.
This file is what you actually paste. Do not paste markdown into a prompt box.

**The style anchor is `src/images/bg-workshop.jpg`.** Everything matches that.

## What we learned

- **Do not say "coloured pencil" or "visible paper grain".** That language made
  Paris come out as a crayon colouring-book. The workshop is smooth painterly
  gouache with no visible outlines.
- **"like an animated film background"** is the single most effective phrase.
- **Firefly prompts max out at 1024 characters.** Both below are under.
- **Magenta background for characters, not white.** Her hair is silver-white and
  skin is pale — a white key eats into both. Magenta appears nowhere on either
  character.
- **No glow, no sparkles in the art.** Those go in CSS so they adapt to each
  background and can brighten on whoever is speaking.

## Backgrounds — Firefly

Settings: **16:9**, **Tema off**, upload `bg-workshop.jpg` in **Cargar imagen**.

Exclusions go under **Más** → *Excluir de la imagen*, a separate field from the
prompt. Never paste them into the prompt itself — a positive prompt is a list of
things to draw. If your Firefly build has no such field, skip them.

```
text, letters, numbers, braille, watermark, signature, people, person,
characters, figures, fairy, photorealism, 3D render, CGI, anime, thick black
outlines, neon, oversaturated, harsh shadows, lens flare, glossy, plastic
```

### Meadow — 729 chars

```
Soft painterly storybook illustration, watercolour and gouache, smooth blended shading with no visible outlines, muted and low contrast, cosy and dreamlike, like an animated film background. An autumn meadow in late afternoon: tall red poppies on slender stems with dark round seed capsules, a few red and white spotted mushrooms, a gnarled tree with a hollow at the left edge, sage green leaves and dry golden grasses, distant misty teal trees. Warm honey sunlight with cool teal shadows, a soft dusty violet and pale teal sky, tiny golden motes drifting in the air. The middle ground is open and empty and the lower third is simple and uncluttered. Peaceful and quietly magical. An empty landscape with no people or characters.
```

### Paris — 766 chars

```
Soft painterly storybook illustration, watercolour and gouache, smooth blended shading with no visible outlines, muted and low contrast, cosy and dreamlike, like an animated film background. A quiet cobbled Paris street at blue hour on an autumn evening, early nineteenth century: a tall pale cream stone building on the left with a heavy wooden door and rows of tall windows, two of them glowing soft warm amber, a wrought iron lantern with a gentle honey halo, a bare delicate tree on the right, a soft dusty violet and pale teal sky with the last light still in it, muted grey blue cobbles, tiny golden motes in the air. The street is open and empty and the lower third is simple and uncluttered. Quiet and expectant. An empty street with no people or characters.
```

### Workshop — done

`src/images/bg-workshop.jpg`. Do not regenerate; it is the anchor.

---

## Characters — Gemini

One thread per character. Upload the old sprite on turn 1, then iterate in the
same thread with no re-upload so the face stays consistent.

Staging: **Braillinda is on the right and faces LEFT. Luis is on the left and
faces RIGHT.** They look at each other. She floats (she is a fairy, so no floor
contact needed); he stands.

### Braillinda — turn 1, attach `src/images/braillinda.png`

```
This is a character from a children's story. Redraw her full body, head to feet, floating slightly above the ground, three-quarter view facing LEFT so both eyes are visible. Nothing else in the image: no furniture, no props, no scenery, no glow, no sparkles. Plain flat magenta background filling the whole image.

Keep her recognisable: long silver-blonde hair, pointed ears, large golden butterfly wings veined like a leaf, a simple sage-green dress covered all over in small raised dots like braille pressed into the cloth, barefoot, a slender wand with a small gold star.

Soft painterly storybook style, watercolour and gouache, smooth blended shading, warm muted colour, directional light from the left, like an animated film background.

Expression: head tilted, alert and curious, one hand reaching out with fingertips extended as if feeling something.
```

### Luis — turn 1, attach `src/images/luis.png`

```
This is a character from a children's story. Redraw him full body, head to feet, standing, three-quarter view facing RIGHT so both eyes are visible. Remove the desk, the book and all furniture — just the man alone. Nothing else in the image: no props, no scenery, no glow. Plain flat magenta background filling the whole image.

Keep him recognisable: elderly teacher, short white beard, swept-back white hair, small round dark glasses, soft ochre-yellow shirt with a buttoned collar, warm brown quilted waistcoat.

Soft painterly storybook style, watercolour and gouache, smooth blended shading, warm muted colour, directional light from the left, like an animated film background.

Expression: one hand raised mid-gesture, open palm, mouth slightly open, explaining something patiently.
```

### Braillinda — follow-up turns, same thread, no re-upload

The first turn already gave you `braillinda-curious`. These are the rest.

#### `braillinda-delighted` — "¡Qué fácil! Ya puedo escribir"

```
Same character, same full-body framing, same style, same magenta background. Now: a bright open smile, both hands raised, wings spread wide. She is delighted.
```

#### `braillinda-cross` — she kicks dot 5 across the cell

```
Same character, same full-body framing, same style, same magenta background. Now: arms folded, brow furrowed, pouting, wings tense. She is cross.
```

#### `braillinda-wistful` — the opening, sad she cannot read

```
Same character, same full-body framing, same style, same magenta background. Now: head slightly lowered, a gentle sad smile, one hand touching a wing. She is wistful.
```

### Luis — follow-up turns, same thread, no re-upload

The first turn already gave you `luis-explaining`. These are the rest.

#### `luis-pleased` — "Queda muy bien"

```
Same character, same full-body framing, same style, same magenta background. Now: a warm broad smile, both hands open, head tilted back a little. He is pleased.
```

#### `luis-asleep` — Braillinda finds him dozing and wakes him

```
Same character, same full-body framing, same style, same magenta background. Now: seated, head tipped forward, peaceful, hands loose in his lap. He is asleep.
```

#### `luis-surprised` — "¿Quién eres tú? ¿Qué haces aquí?"

```
Same character, same full-body framing, same style, same magenta background. Now: eyebrows raised, head turned slightly toward the viewer, mouth open in mild surprise. He is surprised.
```

## Filenames

Two expressions each is enough for the POC.

```
src/images/braillinda-curious.jpg     src/images/luis-explaining.jpg
src/images/braillinda-delighted.jpg   src/images/luis-pleased.jpg
```

## After generating

Hand the magenta files over — the key-out is done locally in one command, and
the glow is added back in CSS. Do not try to cut them out yourself.
