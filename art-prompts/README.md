# Art prompts

Generation briefs for the story's illustrations. These exist so new art stays
consistent with the art already in `src/images/`, and with the design tokens in
`src/index.css` — which were sampled *from* that art, so a large palette shift
means re-tuning the stylesheet.

## Recommended tools

The job is not "make an illustration", it is "make art that matches art we
already have, with two recognisable characters". That needs a model you can feed
reference images to.

| Tool | Why |
|---|---|
| **Gemini image (Nano Banana)** | Best at "here is my character, change the expression" and "here is my style, new scene". Feed it the existing PNGs directly. Free in the Gemini app. Start here. |
| **Midjourney** | Best painterly quality. `--sref` locks style, omni-reference locks character, `--ar 16:9`. Paid, slower to iterate. |
| **Adobe Firefly** | Trained on licensed content. Worth considering since this sits alongside an ONCE publication. |
| **ComfyUI + Flux, local** | Free and reproducible, transparency via LayerDiffuse. Real setup cost. |

## Order of work

1. Generate **`bg-meadow`** first and iterate until the style feels right.
2. Use that image as the *style reference* for the remaining backgrounds.
3. Generate characters using the existing `braillinda.png` / `luis.png` as
   *character references*, plus the meadow as style reference.

Locking the style once and referencing it beats re-describing it every time.

## Delivery requirements

These are what the code needs, and the current assets get some of them wrong.

- **Backgrounds: 16:9, 2048×1152.** The current `background.png` is square, which
  a full-bleed stage cannot use without throwing away 40% of the image. Keep
  important content away from the extreme edges so phone crops survive.
- **Characters: transparent PNG, no background, no furniture.** `luis.png`
  currently has a desk and a book baked in, which will collide with the desks in
  the background.
- **Characters share a scale and a floor line** so they can be staged side by
  side. Braillinda's sprite is currently portrait with wide margins; Luis is
  cropped at the waist. Crop tight to the figure.
- **No sticker outline.** Braillinda's heavy golden keyline reads as a cut-out
  pasted onto the scene rather than a figure lit by it. A soft glow is fine.
- **Face inward:** Luis is staged left and should face right; Braillinda is
  staged right and should face left. Getting this right lets the `.flip-image`
  hack come out of the CSS.
- **Export WebP** alongside PNG. The three current PNGs are 1.58 MB together and
  that only grows with more backgrounds.

## Files

- `style.md` — the shared style block. Prepend it to every prompt.
- `backgrounds.md` — the three story locations.
- `characters.md` — both characters and their expressions.
