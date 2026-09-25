import sys, json, math; sys.path.insert(0,'/home/pol/Documents/TFG_marti/branding/src')
from lib import *
NAVY='#0d2233'; BLUE='#0b5cad'; GREEN='#1a7a50'; MIST='#eaf3f6'
def svg(W,H,body,defs=''): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Mitja Marató d\'Igualada"><title>Mitja Marató d\'Igualada</title><defs>{defs}</defs>{body}</svg>'
def wave(x0,x1,y,amp,per):
    d=f'M{x0} {y}'; x=x0
    while x<x1-1e-6: d+=f' q{per/4} {-amp} {per/2} 0 t{per/2} 0'; x+=per
    return d
# ---------------- B: Xemeneia ----------------
def concept_b():
    C=260
    defs=f'''<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{BLUE}"/><stop offset="1" stop-color="#0e7f8c"/></linearGradient>
<linearGradient id="gr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{BLUE}"/><stop offset="1" stop-color="{GREEN}"/></linearGradient>
<clipPath id="disc"><circle cx="{C}" cy="{C}" r="168"/></clipPath>'''
    top=arc_text("MITJA MARATÓ D’IGUALADA",33,C,C,203,800,60,-90)
    bot=arc_text("21K · 10K · CAMINADA",26,C,C,196,700,120,90,inside=True)
    ch='<path d="M228 392 L244 152 H276 L292 392 Z" fill="#0d2233"/>'
    bands=''.join(f'<path d="M{244-(y-152)*0.0667+0:.1f} {y} H{276+(y-152)*0.0667:.1f}" stroke="{MIST}" stroke-width="7"/>' for y in (188,226))
    cap='<rect x="238" y="134" width="44" height="20" rx="3" fill="#0d2233"/><rect x="238" y="134" width="44" height="5" rx="2" fill="#eaf3f6" opacity=".9"/>'
    mont='<path d="M92 300 L120 262 L134 274 L152 244 L168 268 L186 252 L204 296 Z" fill="#0d2233" opacity=".22"/><path d="M316 296 L340 258 L354 270 L374 240 L392 266 L410 250 L430 300 Z" fill="#0d2233" opacity=".22"/>'
    b=f'''<circle cx="{C}" cy="{C}" r="250" fill="{NAVY}"/>
<circle cx="{C}" cy="{C}" r="176" fill="none" stroke="url(#gr)" stroke-width="6"/>
<g clip-path="url(#disc)"><rect x="80" y="80" width="360" height="360" fill="url(#sky)"/>
<circle cx="{C}" cy="252" r="86" fill="{MIST}" opacity=".95"/>{mont}
<rect x="80" y="330" width="360" height="120" fill="{GREEN}"/>
<path d="{wave(70,450,352,7,52)}" fill="none" stroke="{MIST}" stroke-width="5" stroke-linecap="round" opacity=".9"/>
<path d="{wave(60,460,378,7,52)}" fill="none" stroke="{MIST}" stroke-width="4" stroke-linecap="round" opacity=".55"/>
{ch}{bands}{cap}</g>
<path d="{top}" fill="{MIST}"/><path d="{bot}" fill="{MIST}"/>'''
    return svg(520,520,b,defs)
# ---------------- C: Traçat ----------------
def rdp(pts,eps):
    if len(pts)<3: return pts
    (x1,y1),(x2,y2)=pts[0],pts[-1]; dx,dy=x2-x1,y2-y1; n=math.hypot(dx,dy) or 1
    dm,i=0,0
    for k in range(1,len(pts)-1):
        d=abs(dy*pts[k][0]-dx*pts[k][1]+x2*y1-y2*x1)/n
        if d>dm: dm,i=d,k
    if dm>eps: return rdp(pts[:i+1],eps)[:-1]+rdp(pts[i:],eps)
    return [pts[0],pts[-1]]
def chaikin(p,n=2):
    for _ in range(n):
        q=[p[0]]
        for a,b in zip(p,p[1:]): q+= [(0.75*a[0]+0.25*b[0],0.75*a[1]+0.25*b[1]),(0.25*a[0]+0.75*b[0],0.25*a[1]+0.75*b[1])]
        q.append(p[-1]); p=q
    return p
def route_pts(size=300):
    R=json.load(open('/home/pol/Documents/TFG_marti/web/src/data/routes.json'))['21k']['points']
    la=[p[0] for p in R]; lo=[p[1] for p in R]; k=math.cos(math.radians((min(la)+max(la))/2))
    w=(max(lo)-min(lo))*k; h=max(la)-min(la); sc=size/max(w,h)
    pts=[((p[1]-min(lo))*k*sc,(max(la)-p[0])*sc) for p in R]
    ox=(size-w*sc)/2; oy=(size-h*sc)/2
    return [(x+ox,y+oy) for x,y in pts]
def concept_c():
    C=260
    P=chaikin(rdp(route_pts(300),2.2),2)
    ox,oy=C-150,C-150-10
    d='M'+' L'.join(f'{x+ox:.1f} {y+oy:.1f}' for x,y in P)
    sx,sy=P[0][0]+ox,P[0][1]+oy
    defs=f'<linearGradient id="gr" gradientUnits="userSpaceOnUse" x1="{ox}" y1="0" x2="{ox+300}" y2="0"><stop offset="0" stop-color="#6db8ff"/><stop offset="1" stop-color="#5fd6a0"/></linearGradient>'
    bot=arc_text("MITJA MARATÓ D’IGUALADA",30,C,C,214,800,60,90,inside=True)
    mm,_=text_path('MM',74,800,C,C+152,20,'middle')
    b=f'''<circle cx="{C}" cy="{C}" r="250" fill="{NAVY}"/>
<circle cx="{C}" cy="{C}" r="238" fill="none" stroke="url(#gr)" stroke-width="3" opacity=".8"/>
<path d="{d}" fill="none" stroke="#0b5cad" stroke-opacity=".45" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
<path d="{d}" fill="none" stroke="url(#gr)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="{sx:.1f}" cy="{sy:.1f}" r="15" fill="{MIST}"/><circle cx="{sx:.1f}" cy="{sy:.1f}" r="7" fill="{GREEN}"/>
<path d="{mm}" fill="{MIST}"/><path d="{bot}" fill="{MIST}" opacity="0"/>'''
    return svg(520,520,b,defs)
if __name__=='__main__':
    open('../b1.svg','w').write(concept_b()); open('../c1.svg','w').write(concept_c())
