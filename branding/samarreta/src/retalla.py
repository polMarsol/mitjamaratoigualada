"""Retalla el fons de les fotos oficials de la samarreta (branding/referencies/shirt/oficial_*.png)
i genera les 4 vistes del visor web (front, side-l, back, side-r) com a WebP amb transparència.

Ús:  python3 retalla.py [directori_de_sortida]      (per defecte: web/public/shirt)

Com funciona (sense IA, el fons és d'estudi gris/blanc):
  1. Fons = píxels sense croma, propers al model local de lluminositat del fons, connectats a la vora.
  2. Tot es treballa a x3 perquè la vora quedi suau.
  3. La màscara es menja ~1 px cap endins i el color de la franja de vora es copia de l'interior
     de la peça: així no queda cap halo clar (el que es veia sobre el fons fosc de la web).
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / 'branding/referencies/shirt'
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'web/public/shirt'
UP = 3          # factor de treball
H_OUT = 1200    # alçada final de totes les vistes (mateixa escala física)


def bg_mask(rgb: np.ndarray) -> np.ndarray:
    """Màscara booleana del fons, crescuda des de la vora amb un model local de lluminositat."""
    a = rgb.astype(np.float32)
    lum = a.mean(2)
    chroma = a.max(2) - a.min(2)
    cand = (chroma < 16) & (lum > 175)
    bg = np.zeros(lum.shape, bool)
    bg[0, :] = bg[-1, :] = bg[:, 0] = bg[:, -1] = True
    bg &= cand
    st = ndi.generate_binary_structure(2, 2)
    for _ in range(400):
        w = ndi.gaussian_filter(bg.astype(np.float32), 6)
        model = ndi.gaussian_filter(np.where(bg, lum, 0), 6) / np.maximum(w, 1e-4)
        grow = ndi.binary_dilation(bg, st, iterations=3) & cand & (np.abs(lum - model) < 9) & (w > 0.02)
        new = bg | grow
        if new.sum() == bg.sum():
            break
        bg = new
    # escletxes fines de fons que el model no atrapa (més blanques: aixella entre màniga i cos):
    # restes clares verticals d'1 px de gruix tocant el fons. Els blancs dels escuts de les mànigues
    # (més gruixuts o més curts) no compleixen la condició i es queden.
    rest = (chroma < 28) & (lum > 170) & ~bg
    lab, n = ndi.label(rest)
    near = ndi.binary_dilation(bg, st)
    dt = ndi.distance_transform_edt(rest)
    wedge = np.zeros_like(bg)
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        m = lab[sl] == i
        tall, wide = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if not (tall >= 4 and wide <= 3 and dt[sl][m].max() < 1.2 and (near[sl] & m).any()):
            continue
        # només escletxes de debò: peça a banda i banda (màniga a un costat, cos a l'altre), no la vora exterior
        ys = slice(sl[0].start, sl[0].stop)
        xl, xr = max(sl[1].start - 5, 0), min(sl[1].stop + 4, bg.shape[1] - 1)
        if (~bg[ys, xl] & ~bg[ys, xr]).mean() > 0.5:
            wedge[sl] |= m
    # i els píxels grisos del voltant (fons barrejat amb l'ombra): eren l'espurna de la punta de l'aixella
    grey = (chroma < 50) & (lum > 75) & (lum < 190)
    bg |= wedge | (ndi.binary_dilation(wedge, st, iterations=2) & grey)
    return bg


def cutout(img: Image.Image) -> Image.Image:
    rgb = np.asarray(img.convert('RGB'))
    fg = ~bg_mask(rgb)
    # només la peça principal, sense forats interiors (logos blancs) ni brossa solta
    lab, n = ndi.label(fg)
    if n > 1:
        sizes = ndi.sum(fg, lab, range(1, n + 1))
        fg = lab == (1 + int(np.argmax(sizes)))
    fg = ndi.binary_fill_holes(fg)
    fg = ndi.binary_opening(fg, iterations=1)

    big = img.convert('RGB').resize((img.width * UP, img.height * UP), Image.LANCZOS)
    c = np.asarray(big).astype(np.float32)
    m = np.asarray(Image.fromarray((fg * 255).astype(np.uint8)).resize(big.size, Image.BICUBIC)).astype(np.float32) / 255
    d_raw = ndi.distance_transform_edt(m > 0.5)             # distància al fons real (sense suavitzar)
    m = ndi.gaussian_filter(m, UP * 0.9)                    # contorn suau, sense escales
    d_in = ndi.distance_transform_edt(m > 0.5)              # px (a x3) cap endins
    # el suavitzat tanca les escletxes fines de fons (aixella entre màniga i cos): d_raw les manté obertes
    d_in = np.minimum(d_in, d_raw + UP * 0.5)
    inset, feather = UP * 1.1, UP * 0.9
    alpha = np.clip((d_in - inset) / feather, 0, 1)
    alpha = alpha * alpha * (3 - 2 * alpha)
    safe = d_in > inset + feather + UP * 0.6
    # espurnes clares soltes enganxades a la vora (punta de l'escletxa de l'aixella): no són tela,
    # així que no poden fer de color «segur» i es repinten amb la tela del costat
    light = (c.max(2) - c.min(2) < 50) & (c.mean(2) > 75) & (m > 0.5)   # gris: fons barrejat amb ombra
    lab, n = ndi.label(light)
    if n:
        ids = np.arange(1, n + 1)
        small = ndi.sum(light, lab, ids) < 9 * UP * UP
        edge = ndi.minimum(d_in, lab, ids) < UP * 4
        safe &= ~ndi.binary_dilation(np.isin(lab, ids[small & edge]), iterations=UP)
    # descontaminació: a la franja de vora, el color ve del píxel interior segur més proper
    idx = ndi.distance_transform_edt(~safe, return_distances=False, return_indices=True)
    c = np.where(safe[..., None], c, c[idx[0], idx[1]])
    out = np.dstack([c, alpha * 255]).round().clip(0, 255).astype(np.uint8)
    im = Image.fromarray(out, 'RGBA')
    return im.crop(im.getbbox())


def fit(im: Image.Image) -> Image.Image:
    return im.resize((round(im.width * H_OUT / im.height), H_OUT), Image.LANCZOS)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    lat = Image.open(SRC / 'oficial_laterales.png').convert('RGB')
    half = lat.width // 2
    top = 120                                               # per sota dels rètols «LATERAL …»
    views = {
        'front': Image.open(SRC / 'oficial_delante.png'),
        'back': Image.open(SRC / 'oficial_trasera.png'),
        'side-l': lat.crop((0, top, half, lat.height)),       # «lateral dret» (Ajuntament)
        'side-r': lat.crop((half, top, lat.width, lat.height)),  # «lateral esquerre» (CAI)
    }
    meta = {}
    for name in ('front', 'back', 'side-l', 'side-r'):
        im = fit(cutout(views[name]))
        im.save(OUT / f'{name}.webp', quality=92, alpha_quality=100, method=6)
        meta[name] = {'w': im.width, 'h': im.height}
        print(name, im.size)
    (OUT / 'meta.json').write_text(json.dumps(meta))


if __name__ == '__main__':
    main()
