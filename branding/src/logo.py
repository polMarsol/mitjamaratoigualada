import sys, math; sys.path.insert(0,'/home/pol/Documents/TFG_marti/branding/src')
from lib import *
NAVY='#0d2233'; BLUE='#0b5cad'; GREEN='#1a7a50'; MIST='#eaf3f6'; BRICK='#b4472a'
PTS=[(0,220),(60,22),(120,140),(180,22),(240,220),(300,22),(360,140),(420,22),(480,220)]
SW=34; DOT=27
def esc(s): return s
def svg(W,H,body,defs='',label="Mitja Marató d'Igualada"):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="{label}"><title>{label}</title><defs>{defs}</defs>{body}</svg>'
def gradient(id,x0,x1,c0=BLUE,c1=GREEN):
    return f'<linearGradient id="{id}" x1="{x0}" y1="0" x2="{x1}" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="{c0}"/><stop offset="1" stop-color="{c1}"/></linearGradient>'
def wave(x0,x1,y,amp,per):
    d=f'M{x0} {y}'; x=x0
    while x<x1-1e-6: d+=f' q{per/4} {-amp} {per/2} 0 t{per/2} 0'; x+=per
    return d
def mark(ox,oy,s,mode,gid='g',sw=SW,dots=True,wave_on=True,wave_gap=84):
    """MM route mark. mode: 'color' | 'navy' | 'white' | hex. returns svg fragments"""
    P=[(ox+x*s,oy+y*s) for x,y in PTS]
    d='M'+' L'.join(f'{x:.1f} {y:.1f}' for x,y in P)
    stroke = f'url(#{gid})' if mode=='color' else (NAVY if mode=='navy' else '#ffffff' if mode=='white' else mode)
    c0 = BLUE if mode=='color' else stroke; c1 = GREEN if mode=='color' else stroke
    wc = GREEN if mode=='color' else stroke
    out=f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{sw*s:.1f}" stroke-linecap="round" stroke-linejoin="round"/>'
    if dots:
        out+=f'<circle cx="{P[0][0]:.1f}" cy="{P[0][1]:.1f}" r="{DOT*s:.1f}" fill="{c0}"/><circle cx="{P[-1][0]:.1f}" cy="{P[-1][1]:.1f}" r="{DOT*s:.1f}" fill="{c1}"/>'
    if wave_on:
        out+=f'<path d="{wave(P[0][0]-DOT*s*0.2,P[-1][0]+DOT*s*0.2,oy+(220+wave_gap)*s,8*s,60*s)}" fill="none" stroke="{wc}" stroke-width="{9*s:.1f}" stroke-linecap="round"/>'
    return out, (gradient(gid,P[0][0],P[-1][0]) if mode=='color' else '')
def words(mode,cx,base,width,size_ig=None):
    tx = NAVY if mode in ('color','navy') else ('#ffffff' if mode=='white' else mode)
    s1=fit('IGUALADA',width,800,10,100,44); ig,_=text_path('IGUALADA',s1,800,cx,base,10,'middle',100,44)
    s2=fit('MITJA MARATÓ',width,700,300,100,22); mj,_=text_path('MITJA MARATÓ',s2,700,cx,base+s2*1.55+8,300,'middle',100,22)
    return f'<path d="{ig}" fill="{tx}"/><path d="{mj}" fill="{tx}"/>', s1, s2
def stacked(mode='color',bg=None):
    W,H=560,580
    m,defs=mark(40,52,1.0,mode)
    w,s1,s2=words(mode,280,468,480)
    b=(f'<rect width="{W}" height="{H}" fill="{bg}"/>' if bg else '')+m+w
    return svg(W,H,b,defs)
def horizontal(mode='color',bg=None):
    # marca a l'esquerra (ample 300), text a la dreta
    s=0.66; W,H=1000,300
    m,defs=mark(30,40,s,mode,dots=True,wave_on=True,wave_gap=80)
    tx = NAVY if mode in ('color','navy') else ('#ffffff' if mode=='white' else mode)
    s1=fit('IGUALADA',560,800,10,100,44); ig,_=text_path('IGUALADA',s1,800,410,222,10,'start',100,44)
    s2=fit('MITJA MARATÓ',560,700,300,100,22); mj,_=text_path('MITJA MARATÓ',s2,700,410,96+s2*0.0,300,'start',100,22)
    # MITJA MARATÓ a sobre (base 118), IGUALADA a sota
    mj,_=text_path('MITJA MARATÓ',s2,700,410,104,300,'start',100,22)
    b=(f'<rect width="{W}" height="{H}" fill="{bg}"/>' if bg else '')+m+f'<path d="{mj}" fill="{tx}"/><path d="{ig}" fill="{tx}"/>'
    return svg(W,H,b,defs)
def icon(kind='gradient'):
    """app icon / favicon: rounded square, MM en blanc, sense onada"""
    W=512
    defs='<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b5cad"/><stop offset=".55" stop-color="#0e7f8c"/><stop offset="1" stop-color="#1a7a50"/></linearGradient>'
    s=0.84
    m,_=mark(256-240*s,256-121*s-14,s,'white',sw=40,dots=False,wave_on=False)
    m2=f'<path d="M{256-240*s:.1f} {256-121*s-14+220*s:.1f}" />'
    bg=f'<rect width="{W}" height="{W}" rx="112" fill="url(#bg)"/>'
    return svg(W,W,bg+m,defs)
def mark_only(mode='color',bg=None):
    W,H=560,330
    m,defs=mark(40,40,1.0,mode)
    return svg(W,H,(f'<rect width="{W}" height="{H}" fill="{bg}"/>' if bg else '')+m,defs)
# ----- Insígnia (xemeneia de maó) -----
def badge():
    C=260
    defs=f'''<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{BLUE}"/><stop offset="1" stop-color="#3a9fc4"/></linearGradient>
<linearGradient id="gr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{BLUE}"/><stop offset="1" stop-color="{GREEN}"/></linearGradient>
<linearGradient id="br" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c85a37"/><stop offset=".55" stop-color="{BRICK}"/><stop offset="1" stop-color="#8f3520"/></linearGradient>
<clipPath id="disc"><circle cx="{C}" cy="{C}" r="168"/></clipPath>
<clipPath id="chim"><path d="M231 396 L246 160 H274 L289 396 Z"/></clipPath>'''
    top=arc_text("MITJA MARATÓ D’IGUALADA",31,C,C,203,800,70,-90,wd=100,op=22)
    bot=arc_text("21K · 10K · CAMINADA",25,C,C,197,700,140,90,inside=True,wd=100,op=22)
    rows=''.join(f'<path d="M200 {y} H320" stroke="#eaf3f6" stroke-opacity=".35" stroke-width="2"/>' for y in range(172,396,14))
    cols=''.join(f'<path d="M{x} {y} v14" stroke="#eaf3f6" stroke-opacity=".3" stroke-width="2"/>' for y in range(172,396,28) for x in (236,252,268,284)) 
    smoke='<circle cx="290" cy="146" r="12" fill="#eaf3f6" opacity=".85"/><circle cx="308" cy="126" r="16" fill="#eaf3f6" opacity=".7"/><circle cx="334" cy="108" r="20" fill="#eaf3f6" opacity=".5"/><circle cx="366" cy="94" r="24" fill="#eaf3f6" opacity=".3"/>'
    mont='<path d="M90 320 L126 266 L142 280 L166 240 L184 270 L206 252 L226 320 Z" fill="#0d2233" opacity=".2"/><path d="M296 320 L322 262 L338 274 L362 236 L382 268 L404 252 L432 320 Z" fill="#0d2233" opacity=".2"/>'
    b=f'''<circle cx="{C}" cy="{C}" r="250" fill="{NAVY}"/>
<circle cx="{C}" cy="{C}" r="176" fill="none" stroke="url(#gr)" stroke-width="6"/>
<g clip-path="url(#disc)"><rect x="80" y="80" width="360" height="360" fill="url(#sky)"/>{mont}
<rect x="80" y="330" width="360" height="120" fill="{GREEN}"/>
<path d="{wave(70,450,356,7,52)}" fill="none" stroke="{MIST}" stroke-width="5" stroke-linecap="round" opacity=".85"/>
<path d="{wave(60,460,384,7,52)}" fill="none" stroke="{MIST}" stroke-width="4" stroke-linecap="round" opacity=".5"/>
{smoke}
<path d="M231 396 L246 160 H274 L289 396 Z" fill="url(#br)"/><g clip-path="url(#chim)">{rows}{cols}</g>
<path d="M238 146 H282 L278 162 H242 Z" fill="#8f3520"/><rect x="238" y="140" width="44" height="9" rx="2" fill="#c85a37"/></g>
<path d="{top}" fill="{MIST}"/><path d="{bot}" fill="{MIST}"/>'''
    return svg(520,520,b,defs)
OUT='/home/pol/Documents/TFG_marti/branding/'
FILES={
 'logo-principal.svg':stacked('color'),
 'logo-horitzontal.svg':horizontal('color'),
 'logo-icona.svg':icon(),
 'logo-marca.svg':mark_only('color'),
 'logo-mono-blau-fosc.svg':stacked('navy'),
 'logo-mono-blanc.svg':stacked('white'),
 'logo-insignia.svg':badge(),
}
if __name__=='__main__':
    for n,c in FILES.items(): open(OUT+n,'w').write(c)
    import os
    for n in ['a1.svg','a2.svg','b1.svg','c1.svg']:
        if os.path.exists(OUT+n): os.remove(OUT+n)
