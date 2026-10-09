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


def smooth_sdf(fg: np.ndarray, k: float) -> np.ndarray:
    """Distància amb signe (px de treball, + = dins) a un contorn «vectoritzat»: es treuen les
    petites ondulacions del perfil (soroll de la foto) però es conserven cantonades i escletxes.
    k = px de treball per px de la foto de davant (referència d'escala)."""
    sdf = ndi.distance_transform_edt(fg) - ndi.distance_transform_edt(~fg)
    sdf = np.where(fg, sdf - 0.5, sdf + 0.5)
    soft, fine = ndi.gaussian_filter(sdf, 7 * k), ndi.gaussian_filter(sdf, 1.2 * k)
    # on les dues versions discrepen hi ha una forma real (cantonada, punta, aixella): allà mana la fina
    w = np.clip((np.abs(soft - fine) - 1.0 * k) / (1.5 * k), 0, 1)
    w = ndi.gaussian_filter(ndi.maximum_filter(w, size=int(6 * k) | 1), 3 * k)
    return soft * (1 - w) + fine * w


def cutout(img: Image.Image, ref_h: float) -> Image.Image:
    rgb = np.asarray(img.convert('RGB'))
    a = rgb.astype(np.float32)
    fg = ~bg_mask(rgb)
    # només la peça principal, sense forats interiors (logos blancs) ni brossa solta
    lab, n = ndi.label(fg)
    if n > 1:
        sizes = ndi.sum(fg, lab, range(1, n + 1))
        fg = lab == (1 + int(np.argmax(sizes)))
    fg = ndi.binary_fill_holes(fg)
    fg = ndi.binary_opening(fg, iterations=1)
    s = fg.any(1).sum() / ref_h                              # escala respecte a la foto de davant
    # escuts que sobresurten de la vora de la màniga (a la foto queden tallats i esfilagarsats, i el
    # perfil hi feia una queixalada): en aquell tram la vora passa a ser l'envolupant convexa, de
    # l'espatlla al puny. El que s'afegeix es pinta després amb el color interior més proper.
    fg0 = fg.copy()
    r = int(round(10 * s))
    yy, xx = np.ogrid[-r:r + 1, -r:r + 1]
    bump = fg & ~ndi.binary_opening(fg, yy * yy + xx * xx <= r * r)
    white = (a.max(2) - a.min(2) < 28) & (a.mean(2) > 190)
    lab, n = ndi.label(bump)
    H, W = fg.shape
    crests = [sl for i, sl in enumerate(ndi.find_objects(lab), 1)
              if (lab[sl] == i).sum() >= 20 * s * s and white[sl][lab[sl] == i].mean() >= 0.2]
    for sl in crests:                                         # 1) fora el sortint esfilagarsat
        fg[sl] &= ~(lab[sl] > 0)
    for sl in crests:                                         # 2) vora recta/convexa d'espatlla a puny
        left = (sl[1].start + sl[1].stop) / 2 < W / 2
        edge = np.where(fg.any(1), fg.argmax(1) if left else W - 1 - fg[:, ::-1].argmax(1), -1)
        y0, y1 = max(sl[0].start - int(30 * s), 0), sl[0].stop
        while edge[y0] < 0:
            y0 += 1
        while y1 < H - 1 and edge[y1 + 1] >= 0 and abs(edge[y1 + 1] - edge[y1]) <= 8 * s:
            y1 += 1                                           # fins a la cantonada del puny
        ys = np.arange(y0, y1 + 1)
        xs = (edge[ys] if left else -edge[ys]).astype(float)
        hull = []                                             # envolupant inferior de x(y)
        for q in zip(ys, xs):
            while len(hull) >= 2 and (hull[-1][0] - hull[-2][0]) * (q[1] - hull[-2][1]) - (hull[-1][1] - hull[-2][1]) * (q[0] - hull[-2][0]) <= 0:
                hull.pop()
            hull.append(q)
        hx = np.interp(ys, [h[0] for h in hull], [h[1] for h in hull])
        for y, x in zip(ys, hx):
            if left:
                fg[y, int(round(x)):edge[y]] = True
            else:
                fg[y, edge[y]:int(round(-x)) + 1] = True
    fg = ndi.binary_fill_holes(fg)
    # 3) dins l'escut, el fons que s'hi havia colat (gris clar) es pinta amb el blanc del mateix escut,
    #    i la resta es deixa tal com és a la foto: nítid, sense repintar ni difuminar
    if crests:
        zone = np.zeros_like(fg)
        for sl in crests:
            zone[sl] |= lab[sl] > 0
        zone = ndi.binary_dilation(zone, yy * yy + xx * xx <= r * r)
        solid = ndi.binary_erosion(fg0)
        near = ndi.distance_transform_edt(~solid, return_distances=False, return_indices=True)
        whitish = (a.max(2) - a.min(2) < 40) & (a.mean(2) > 150)
        rows = np.zeros_like(fg)
        for sl in crests:
            rows[sl[0]] = True                                # a l'alçada de l'escut, tot el que queda dins la vora
        paint = zone & fg & ~solid & (a.max(2) - a.min(2) < 28) & (a.mean(2) > np.where(rows, 105, 170)) & (whitish[near[0], near[1]] | rows)
        rgb = rgb.copy()
        rgb[paint] = np.median(a[white & zone & solid], axis=0)
        img = Image.fromarray(rgb)
        fg0 = fg0 | paint

    big = img.convert('RGB').resize((img.width * UP, img.height * UP), Image.LANCZOS)
    c = np.asarray(big).astype(np.float32)
    m = np.asarray(Image.fromarray((fg * 255).astype(np.uint8)).resize(big.size, Image.BICUBIC)) > 127
    k = UP * s
    d_raw = ndi.distance_transform_edt(m)                    # distància a la vora (sense suavitzar)
    m0 = np.asarray(Image.fromarray((fg0 * 255).astype(np.uint8)).resize(big.size, Image.BICUBIC)) > 127
    d_fab = ndi.distance_transform_edt(m0)                   # distància al fons real de la foto
    d_in = np.minimum(smooth_sdf(m, k), d_raw + 0.5 * k)     # mai més enfora que la peça real
    px = fg.any(1).sum() * UP / H_OUT                        # 1 px final, en px de treball
    inset, feather = 1.3 * k, 1.5 * px
    alpha = np.clip((d_in - inset) / feather + 0.5, 0, 1)
    alpha = alpha * alpha * (3 - 2 * alpha)
    # descontaminació: a la franja de vora, el color ve del píxel interior segur més proper
    safe = d_fab > inset + 0.9 * k
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
        im = fit(cutout(views[name], 580))
        im.save(OUT / f'{name}.webp', quality=92, alpha_quality=100, method=6)
        meta[name] = {'w': im.width, 'h': im.height}
        print(name, im.size)
    (OUT / 'meta.json').write_text(json.dumps(meta))


if __name__ == '__main__':
    main()
