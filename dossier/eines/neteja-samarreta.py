"""Neteja les fotos de la samarreta oficial (web/public/shirt) per al dossier: esborra els logos impresos
(MM antic, Tuga Wear, escuts de les mànigues, patrocinadors fictícis i títol de l'esquena) i deixa la roba neta.
Els logos reals s'hi posen per sobre des del dossier (dossier.js).
Necessita OpenCV:  python3 -m venv /tmp/v && /tmp/v/bin/pip install opencv-python-headless numpy pillow
Ús (des de l'arrel):  /tmp/v/bin/python dossier/eines/neteja-samarreta.py
També deixa a dossier/eines/_build/ les versions per a la web (mànigues amb els escuts, a mida completa),
que després compon eines/samarreta-web.html (vegeu eines/samarreta-web.sh).
"""
from pathlib import Path
import cv2, numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SRC, OUT = ROOT / 'web/public/shirt', ROOT / 'dossier/assets/img'

# Caixes (x0, y0, x1, y1) en píxels de la foto original. mode 'white' = només el traç blanc; 'all' = tota la caixa.
JOBS = {
    'front': [((282, 232, 450, 360), 'white'),   # MM antic (pit dret)
              ((592, 255, 724, 340), 'white'),   # Tuga Wear (pit esquerre)
              ((0, 245, 108, 418), 'all'),       # escut CAI (màniga dreta)
              ((850, 250, 957, 432), 'all')],    # Ajuntament (màniga esquerra)
    'back': [((228, 172, 724, 280), 'white'),    # títol MM, 10K i Caminada 2026
             ((295, 462, 690, 975), 'white'),    # patrocinadors fictícis
             ((0, 250, 120, 430), 'all')],       # Ajuntament (màniga)
}

# Per a la web: es mantenen els escuts de les mànigues; s'esborren el logo antic, Tuga Wear, el títol 2026 i els patrocinadors
WEB_JOBS = {
    'front': [j for j in JOBS['front'] if j[1] == 'white'],
    'back': [j for j in JOBS['back'] if j[1] == 'white'],
    'side-l': [((0, 250, 95, 350), 'light')],     # restes de «Tuga Wear» a la vora
    'side-r': [((428, 180, 498, 370), 'light')],  # restes del logo MM antic a la vora
}
BUILD = Path(__file__).resolve().parent / '_build'

def clean(name, jobs, web=False):
    rgba = np.array(Image.open(SRC / f'{name}.webp').convert('RGBA'))
    rgb, alpha = rgba[..., :3].copy(), rgba[..., 3]
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    mask = np.zeros(alpha.shape, np.uint8)
    for (x0, y0, x1, y1), mode in jobs:
        m = np.zeros_like(mask)
        if mode == 'all':
            m[y0:y1, x0:x1] = 255
        elif mode == 'light':
            sub = hsv[y0:y1, x0:x1]
            m[y0:y1, x0:x1] = ((sub[..., 2] > 100) & (sub[..., 1] < 120)).astype(np.uint8) * 255
        else:
            sub = hsv[y0:y1, x0:x1]
            m[y0:y1, x0:x1] = ((sub[..., 2] > (125 if name == 'back' else 150)) & (sub[..., 1] < (115 if name == 'back' else 90))).astype(np.uint8) * 255
        mask |= m
    mask = cv2.dilate(mask, np.ones((7, 7), np.uint8), iterations=2)
    mask[alpha < 200] = 0
    # 1) Estén el color de la roba cap al fons transparent (perquè l'emplenat no agafi el gris del fons)
    bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    # 2) Esborra els logos (en la mateixa passada que el fons, perquè el color només surti de roba neta)
    out = cv2.inpaint(bgr, mask | (alpha < 200).astype(np.uint8) * 255, 9, cv2.INPAINT_TELEA).astype(np.float32)
    # 3) Retorna la textura de mosaic: detall d'alta freqüència d'una zona neta de la samarreta de davant
    front = cv2.cvtColor(np.array(Image.open(SRC / 'front.webp').convert('RGB')), cv2.COLOR_RGB2BGR).astype(np.float32)
    tile = front[520:950, 235:420]
    det = tile - cv2.GaussianBlur(tile, (0, 0), 6)
    H, W = mask.shape
    reps = (H // det.shape[0] + 2, W // det.shape[1] + 2, 1)
    big = np.tile(np.concatenate([det, det[:, ::-1]], 1), (reps[0], reps[1] // 2 + 1, 1))[:H, :W]
    soft = cv2.GaussianBlur(mask.astype(np.float32) / 255, (0, 0), 4)[..., None]
    out = np.clip(out + big * soft * 0.9, 0, 255).astype(np.uint8)
    out = cv2.cvtColor(out, cv2.COLOR_BGR2RGB)
    res = np.dstack([out, alpha])
    im = Image.fromarray(res, 'RGBA')
    if web:
        BUILD.mkdir(exist_ok=True); im.save(BUILD / f'{name}.png'); return
    im = im.resize((im.width * 3 // 4, im.height * 3 // 4), Image.LANCZOS)  # més lleuger per al PDF
    im.save(OUT / f'samarreta-{name}.webp', quality=86, method=6)

for n, j in JOBS.items():
    clean(n, j)
for n, j in WEB_JOBS.items():
    clean(n, j, web=True)
print('ok')
