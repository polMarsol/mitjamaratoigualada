"""Genera els recursos derivats del dossier: traçats i perfils de les rutes (SVG) i variants de color de logos.
Executar des de l'arrel del projecte:  python3 dossier/eines/genera-assets.py
"""
import json, math, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'dossier' / 'assets'
routes = json.loads((ROOT / 'web' / 'src' / 'data' / 'routes.json').read_text())

def route_svg(pts, stroke, w=600, h=600, pad=24, sw=7):
    lat0 = sum(p[0] for p in pts) / len(pts)
    k = math.cos(math.radians(lat0))
    xs = [p[1] * k for p in pts]; ys = [-p[0] for p in pts]
    minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
    s = min((w - 2 * pad) / (maxx - minx), (h - 2 * pad) / (maxy - miny))
    ox = (w - (maxx - minx) * s) / 2; oy = (h - (maxy - miny) * s) / 2
    P = [((x - minx) * s + ox, (y - miny) * s + oy) for x, y in zip(xs, ys)]
    d = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in P)
    sx, sy = P[0]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">'
            f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<circle cx="{sx:.1f}" cy="{sy:.1f}" r="{sw*1.8}" fill="#fff" stroke="{stroke}" stroke-width="{sw*0.8}"/></svg>')

def profile_svg(pts, color, w=1000, h=200):
    dist = [p[3] for p in pts]; ele = [p[2] for p in pts]
    D = dist[-1]; lo, hi = min(ele) - 15, max(ele) + 10
    P = [(d / D * w, h - (e - lo) / (hi - lo) * h) for d, e in zip(dist, ele)]
    line = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in P)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" preserveAspectRatio="none">'
            f'<defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{color}" stop-opacity=".45"/>'
            f'<stop offset="1" stop-color="{color}" stop-opacity="0"/></linearGradient></defs>'
            f'<path d="{line} L{w} {h} L0 {h} Z" fill="url(#f)"/>'
            f'<path d="{line}" fill="none" stroke="{color}" stroke-width="3" vector-effect="non-scaling-stroke"/></svg>')

for rid, r in routes.items():
    pts = r['points']
    (OUT / 'img' / f'ruta-{rid}.svg').write_text(route_svg(pts, '#ffffff'))
    (OUT / 'img' / f'ruta-{rid}-color.svg').write_text(route_svg(pts, '#0b5cad'))
    (OUT / 'img' / f'perfil-{rid}.svg').write_text(profile_svg(pts, '#ffffff'))

# Posició (en % del requadre 600×600) de cada km de la 21K, per col·locar marcadors al mapa
def km_marks(pts, w=600, h=600, pad=24):
    lat0 = sum(p[0] for p in pts) / len(pts); k = math.cos(math.radians(lat0))
    xs = [p[1] * k for p in pts]; ys = [-p[0] for p in pts]
    minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
    s = min((w - 2 * pad) / (maxx - minx), (h - 2 * pad) / (maxy - miny))
    ox = (w - (maxx - minx) * s) / 2; oy = (h - (maxy - miny) * s) / 2
    total = pts[-1][3]; out = []
    for km in range(0, 22):
        target = min(km * 1000 * total / 21097, total)  # escala a la distància oficial
        i = min(range(len(pts)), key=lambda j: abs(pts[j][3] - target))
        out.append([round(((xs[i] - minx) * s + ox) / w * 100, 2), round(((ys[i] - miny) * s + oy) / h * 100, 2)])
    return out
(OUT / 'rutes-km.js').write_text('window.MM_KM = ' + json.dumps(km_marks(routes['21k']['points'])) + ';\n')

# Logo de Coca-Cola en blanc (per a fons de color / samarreta)
coca = (OUT / 'logos' / 'coca-cola.svg').read_text()
(OUT / 'logos' / 'coca-cola-blanc.svg').write_text(re.sub(r'fill="#e61d2b"', 'fill="#ffffff"', coca))
print('ok')
