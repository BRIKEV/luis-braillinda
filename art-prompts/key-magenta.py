"""Chroma-key flat magenta to transparency, without punching holes in the subject.

Usage:  python3 art-prompts/key-magenta.py src/images/characters/*/*.jpeg
Writes a .webp with alpha beside each input. Re-runnable; nothing else needed.


A plain colour-distance test is not enough: Luis's brown waistcoat and the
shadows in Braillinda's green dress sit close enough to magenta that they were
being made semi-transparent, so the background bled through them.

So the removable region is restricted to background actually CONNECTED to the
image border. Anything enclosed by the figure stays opaque no matter its colour.
"""
from PIL import Image
import numpy as np, sys, os

T0, T1 = 26.0, 62.0     # alpha ramp, in RGB distance from the key colour
REACH  = 90.0           # generous "could be background" test, used for connectivity
SCALE  = 2              # connectivity is solved at half size for speed
EXACT  = 18.0           # 'this is unmistakably the key colour'

def border_connected(mask):
    """Flood from the image border through `mask`, iteratively and vectorised."""
    small = mask[::SCALE, ::SCALE]
    reach = np.zeros_like(small)
    reach[0, :] = small[0, :]; reach[-1, :] = small[-1, :]
    reach[:, 0] = small[:, 0]; reach[:, -1] = small[:, -1]
    while True:
        grown = reach.copy()
        grown[1:, :]  |= reach[:-1, :]
        grown[:-1, :] |= reach[1:, :]
        grown[:, 1:]  |= reach[:, :-1]
        grown[:, :-1] |= reach[:, 1:]
        grown &= small
        if np.array_equal(grown, reach):
            break
        reach = grown
    return np.kron(reach, np.ones((SCALE, SCALE), dtype=bool))[:mask.shape[0], :mask.shape[1]]

def key_out(path, out):
    im = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    h, w, _ = im.shape
    c = np.concatenate([im[:24,:24].reshape(-1,3), im[:24,-24:].reshape(-1,3),
                        im[-24:,:24].reshape(-1,3), im[-24:,-24:].reshape(-1,3)])
    K = np.median(c, axis=0)

    d = np.linalg.norm(im - K, axis=2)
    outside = border_connected(d < REACH)

    # Background enclosed by the figure — the gap in Luis's chair — is never
    # reached by the flood. Remove it too, but only where the colour matches the
    # key almost exactly: real background sits within a few units of it, while
    # his waistcoat, the nearest subject colour, is ~63 away and stays safe.
    removable = outside | (d < EXACT)

    a = np.clip((d - T0) / (T1 - T0), 0.0, 1.0)
    a = a * a * (3 - 2 * a)
    a = np.where(removable, a, 1.0)        # enclosed subject pixels stay opaque

    a3 = a[..., None]
    F = np.where(a3 > 0.004, (im - (1 - a3) * K) / np.maximum(a3, 0.004), im)
    rgba = np.dstack([np.clip(F, 0, 255), a * 255]).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(out, "WEBP", quality=88, method=6)

    solid = (a > 0.98).sum() / (h * w)
    partial = ((a > 0.02) & (a < 0.98)).sum() / (h * w)
    return solid, partial

for path in sys.argv[1:]:
    out = os.path.splitext(path)[0] + ".webp"
    solid, partial = key_out(path, out)
    who = path.split("/")[-2][:4]
    print(f"  {who}/{os.path.basename(out):<18} solid={solid*100:5.1f}%  soft-edge={partial*100:4.2f}%")
