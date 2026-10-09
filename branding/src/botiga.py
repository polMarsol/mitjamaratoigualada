"""Il·lustracions dels productes de la botiga amb la imatge corporativa de la cursa (SVG vectorials).
Mateix llenguatge que la samarreta oficial: rajoles en diagonal del blau al verd, onades de l'Anoia i la marca MMI.

Ús:  python3 branding/src/botiga.py      → web/public/shop/*.svg
"""
import random
from pathlib import Path

OUT = Path(__file__).resolve().parents[2] / 'web/public/shop'
W, H = 600, 450
BLUES = ['#0b5cad', '#0a4a8f', '#1f8fc4', '#1668b8', '#0e7f8c']
GREENS = ['#1a7a50', '#2aa37a', '#13a0a8', '#17906a', '#0e7f8c']
NAVY = '#0d2233'
MARK = 'M40 272L100 74L160 192L220 74L280 272L340 74L400 192L460 74L520 272L536 74'


def tiles(seed, x0, y0, x1, y1, s=17, flip=False):
    """Rajoles de la plaça de Cal Font: quadrats girats 45°, blaus a un costat i verds a l'altre."""
    r, out, row = random.Random(seed), [], 0
    y = y0 - s
    while y < y1 + s:
        x = x0 - s + (s if row % 2 else 0)
        while x < x1 + s:
            t = (x - x0) / (x1 - x0) + r.uniform(-0.28, 0.28)
            pal = (BLUES if t < 0.5 else GREENS) if not flip else (GREENS if t < 0.5 else BLUES)
            out.append(f'<path d="M{x:.0f} {y - s:.0f}l{s} {s}l-{s} {s}l-{s}-{s}z" fill="{r.choice(pal)}" opacity="{r.uniform(.72, 1):.2f}"/>')
            x += 2 * s
        y += s
        row += 1
    return ''.join(out)


def waves(y, x0=0, x1=W, n=3):
    """Onades del riu Anoia, com a la vora de la samarreta."""
    cols, out = ['#1f8fc4', '#13a0a8', '#0b5cad'], []
    for i in range(n):
        yy, d = y + i * 13, f'M{x0} {y + i * 13}'
        x, k = x0, 0
        while x < x1:
            d += f'q22 {(-11 if k % 2 == 0 else 11)} 44 0'
            x += 44
            k += 1
        out.append(f'<path d="{d}V{H}H{x0}z" fill="{cols[i % 3]}" opacity=".92"/><path d="{d}" fill="none" stroke="#fff" stroke-width="1.6" opacity=".75"/>')
    return ''.join(out)


def mark(cx, cy, w, color='#fff', word=True, sw=34):
    k = w / 576
    g = f'<g transform="translate({cx - w / 2:.1f} {cy - 173 * k:.1f}) scale({k:.4f})"><path d="{MARK}" fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/><circle cx="40" cy="272" r="27" fill="{color}"/><circle cx="536" cy="74" r="27" fill="{color}"/></g>'
    if word:
        g += f'<text x="{cx}" y="{cy + 173 * k + w * .13:.1f}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="{w * .15:.1f}" letter-spacing="{w * .035:.1f}" fill="{color}">IGUALADA</text>'
    return g


def svg(name, body, defs=''):
    doc = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="{name}">
<defs><radialGradient id="bg" cx="50%" cy="34%" r="75%"><stop offset="0" stop-color="#f9fafb"/><stop offset=".55" stop-color="#e8eaee"/><stop offset="1" stop-color="#cfd3da"/></radialGradient>
<linearGradient id="brand" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#0b5cad"/><stop offset=".55" stop-color="#0e7f8c"/><stop offset="1" stop-color="#1a7a50"/></linearGradient>
<linearGradient id="shL" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".22" stop-color="#000" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
<linearGradient id="shT" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
<filter id="soft" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>{defs}</defs>
<rect width="{W}" height="{H}" fill="url(#bg)"/>{body}</svg>'''
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f'{name}.svg').write_text(doc)
    print(name, f'{len(doc) / 1024:.0f} KB')


def shadow(cx, y, rx):
    return f'<ellipse cx="{cx}" cy="{y}" rx="{rx}" ry="13" fill="#1e2832" opacity=".3" filter="url(#soft)"/>'


def buff():
    shape = 'M196 92Q300 62 404 92L414 352Q300 392 186 352Z'
    body = shadow(300, 392, 135) + f'''<clipPath id="c"><path d="{shape}"/></clipPath>
<path d="M196 92Q300 122 404 92Q300 62 196 92Z" fill="#082a44"/>
<g clip-path="url(#c)"><rect x="180" y="60" width="240" height="340" fill="#0b5cad"/>{tiles(11, 186, 70, 414, 392)}{waves(318, 180, 430)}
<path d="M250 96Q262 220 244 372M356 94Q340 230 362 368" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="7" stroke-linecap="round"/>
<rect x="180" y="60" width="240" height="340" fill="url(#shL)"/><rect x="180" y="60" width="240" height="340" fill="url(#shT)"/></g>
<path d="M196 92Q300 122 404 92" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>
<path d="{shape}" fill="none" stroke="#06223a" stroke-opacity=".35" stroke-width="1.5"/>{mark(300, 205, 118)}'''
    svg('buff', body)


def cup():
    shape = 'M208 118H392L364 366Q300 384 236 366Z'
    ribs = ''.join(f'<path d="M{214 + i * 4.6:.0f} {168 + i * 42}Q300 {186 + i * 42} {386 - i * 4.6:.0f} {168 + i * 42}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="5"/><path d="M{214 + i * 4.6:.0f} {163 + i * 42}Q300 {181 + i * 42} {386 - i * 4.6:.0f} {163 + i * 42}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="2"/>' for i in range(5))
    body = shadow(300, 384, 110) + f'''<clipPath id="c"><path d="{shape}"/></clipPath>
<path d="M392 150c52-6 78 22 70 62-6 30-34 44-60 38" fill="none" stroke="#0d2233" stroke-width="11" stroke-linecap="round"/><path d="M392 150c52-6 78 22 70 62-6 30-34 44-60 38" fill="none" stroke="#8fa3b0" stroke-width="5" stroke-linecap="round"/>
<g clip-path="url(#c)"><rect x="200" y="110" width="200" height="280" fill="url(#brand)"/>{tiles(23, 200, 290, 400, 390, 13)}<rect x="200" y="110" width="200" height="280" fill="url(#shL)"/>{ribs}</g>
<ellipse cx="300" cy="118" rx="92" ry="17" fill="#0a3f63"/><ellipse cx="300" cy="118" rx="92" ry="17" fill="none" stroke="#bfe6ee" stroke-width="5"/><ellipse cx="300" cy="121" rx="78" ry="10" fill="#062c47"/>
{mark(300, 232, 96)}'''
    svg('cup', body)


def cap():
    crown = 'M138 286C132 168 250 108 352 128C420 142 462 196 468 262L470 286Z'
    visor = 'M452 268C506 262 556 280 578 306C584 314 578 322 566 320C520 312 478 304 444 300Z'
    body = shadow(330, 334, 220) + f'''<clipPath id="c"><path d="{crown}"/></clipPath>
<path d="{visor}" fill="#0d2233"/><path d="M452 268C506 262 556 280 578 306" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="3"/><path d="M452 290C500 292 540 302 568 314" fill="none" stroke="#3fc1c3" stroke-width="3"/>
<g clip-path="url(#c)"><rect x="120" y="100" width="360" height="200" fill="#0b5cad"/>{tiles(37, 130, 110, 470, 290, 15, True)}
<path d="M300 124C286 180 284 236 290 286M214 150C196 196 190 244 194 286M392 140C404 190 410 240 408 286" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2.5" stroke-dasharray="7 5"/>
<rect x="120" y="100" width="360" height="200" fill="url(#shT)"/><path d="M138 262H470V290H138z" fill="#0d2233" opacity=".9"/><path d="M138 262H470" stroke="#3fc1c3" stroke-width="2.5"/></g>
<circle cx="312" cy="124" r="9" fill="#0d2233"/><path d="{crown}" fill="none" stroke="#06223a" stroke-opacity=".4" stroke-width="1.5"/>
<path d="M150 276c-10 4-14 12-8 18" fill="none" stroke="#0d2233" stroke-width="7" stroke-linecap="round"/>{mark(372, 196, 92, word=False)}'''
    svg('cap', body)


def socks():
    def sock(dx, dy, seed, rot):
        s = 'M236 52H326V226L402 300A44 44 0 0 1 342 364L236 268Z'
        return f'''<g transform="translate({dx} {dy}) rotate({rot} 300 220)"><clipPath id="s{seed}"><path d="{s}"/></clipPath>
<g clip-path="url(#s{seed})"><rect x="220" y="40" width="210" height="350" fill="#0b5cad"/>{tiles(seed, 226, 96, 420, 380, 14)}
<rect x="220" y="40" width="210" height="64" fill="#0d2233"/><path d="M220 72H330M220 86H330" stroke="#3fc1c3" stroke-width="5"/>
<path d="M236 226Q262 262 250 300L226 262Z" fill="#0d2233" opacity=".85"/><path d="M372 286Q420 300 408 356L352 372Q386 338 350 310Z" fill="#0d2233" opacity=".85"/>
<path d="M240 122L262 150L284 122L306 150L326 122" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="220" y="40" width="210" height="350" fill="url(#shL)"/></g><path d="{s}" fill="none" stroke="#06223a" stroke-opacity=".4" stroke-width="1.5"/>
<path d="M240 58h82" stroke="#fff" stroke-opacity=".22" stroke-width="3"/></g>'''
    body = shadow(300, 398, 170) + sock(-78, 14, 51, -9) + sock(52, 4, 67, 7)
    svg('socks', body)


def hoodie():
    torso = 'M206 150L158 172L96 338L156 362L190 278V408H410V278L444 362L504 338L442 172L394 150Q300 196 206 150Z'
    hood = 'M214 152Q232 62 300 56Q368 62 386 152Q300 206 214 152Z'
    body = shadow(300, 418, 180) + f'''<clipPath id="c"><path d="{torso}"/></clipPath><clipPath id="h"><path d="{hood}"/></clipPath>
<g clip-path="url(#h)"><rect x="200" y="50" width="200" height="170" fill="#0b5cad"/>{tiles(83, 204, 54, 396, 200, 13)}<rect x="200" y="50" width="200" height="170" fill="url(#shT)"/></g>
<path d="M240 150Q300 96 360 150Q300 186 240 150Z" fill="#06182a"/>
<g clip-path="url(#c)"><rect x="90" y="140" width="420" height="280" fill="{NAVY}"/><g opacity=".95">{tiles(97, 190, 372, 410, 420, 13)}</g>{waves(360, 186, 414, 2)}
<rect x="186" y="384" width="228" height="26" fill="#0a1b29"/><path d="M96 338L156 362L162 344L104 320ZM504 338L444 362L438 344L496 320Z" fill="#0a1b29"/>
<path d="M236 300H364L378 356H222Z" fill="#12314a"/><path d="M236 300H364" stroke="#3fc1c3" stroke-width="2.5"/>
<path d="M190 278V408M410 278V408" stroke="#000" stroke-opacity=".35" stroke-width="2"/><rect x="90" y="140" width="420" height="280" fill="url(#shL)" opacity=".7"/></g>
<path d="M276 168C273 182 274 192 272 204M324 168C327 182 326 192 328 204" fill="none" stroke="#e8f1f4" stroke-width="4" stroke-linecap="round"/><circle cx="272" cy="208" r="5" fill="#3fc1c3"/><circle cx="328" cy="208" r="5" fill="#3fc1c3"/>
<path d="{torso}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.5"/><path d="{hood}" fill="none" stroke="#06223a" stroke-opacity=".4" stroke-width="1.5"/>
{mark(300, 248, 104, word=False)}<text x="300" y="292" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="15" letter-spacing="5" fill="#3fc1c3">FINISHER 2026</text>'''
    svg('hoodie', body)


if __name__ == '__main__':
    buff(); cup(); cap(); socks(); hoodie()
