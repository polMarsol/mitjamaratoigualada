import math
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
F='/home/pol/Documents/TFG_marti/web/node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2'
_cache={}
def font(w,wd=100,op=96):
    k=(w,wd,op)
    if k not in _cache:
        f=TTFont(F)
        _cache[k]=instancer.instantiateVariableFont(f,{'wght':w,'wdth':wd,'opsz':op})
    return _cache[k]
def text_path(text,size,w=800,x=0,y=0,track=0,anchor='start',wd=100,op=96):
    """Text as SVG path 'd' (y = baseline). track in em/1000. Returns (d,width)."""
    f=font(w,wd,op); gs=f.getGlyphSet(); cmap=f.getBestCmap(); upm=f['head'].unitsPerEm; s=size/upm
    adv=[]; names=[]
    for ch in text:
        n=cmap[ord(ch)]; names.append(n); adv.append(gs[n].width)
    # kerning ignorat (GPOS) -> ajust manual amb track
    total=sum(adv)*s+track*size/1000*(len(text)-1)
    x0=x-(total if anchor=='end' else total/2 if anchor=='middle' else 0)
    d=[];cx=x0
    for n,a in zip(names,adv):
        pen=SVGPathPen(gs); tp=TransformPen(pen,(s,0,0,-s,cx,y)); gs[n].draw(tp); d.append(pen.getCommands()); cx+=a*s+track*size/1000
    return ' '.join(d),total
def arc_text(text,size,cx,cy,r,w=800,track=0,mid_deg=-90,inside=False,wd=100,op=96):
    """Text on a circle (outlined), centered at angle mid_deg (SVG degrees, -90 = top). Reads clockwise on top."""
    f=font(w,wd,op); gs=f.getGlyphSet(); cmap=f.getBestCmap(); upm=f['head'].unitsPerEm; s=size/upm
    names=[cmap[ord(c)] for c in text]; adv=[gs[n].width*s+track*size/1000 for n in names]
    total=sum(adv)-track*size/1000
    ang_total=total/r  # rad
    a=math.radians(mid_deg)+ (-ang_total/2 if not inside else ang_total/2)
    out=[]
    pos=0
    for n,ad in zip(names,adv):
        gw=gs[n].width*s
        mid=pos+gw/2; pos+=ad
        th=(math.radians(mid_deg)-ang_total/2+mid/r) if not inside else (math.radians(mid_deg)+ang_total/2-mid/r)
        px=cx+r*math.cos(th); py=cy+r*math.sin(th)
        rot=th+math.pi/2 if not inside else th-math.pi/2
        # glifo centrat en (0,0) horitzontalment, baseline a y=0
        c,sn=math.cos(rot),math.sin(rot)
        tx=-gw/2
        pen=SVGPathPen(gs)
        # matriu: escala, després translació(-gw/2,0), després rotació i posició
        m=(s*c, s*sn, -(-s)*sn*-1 if False else s*sn*-1*-1, 0,0,0)
        tp=TransformPen(pen,(c,sn,-sn,c,px,py))
        tp2=TransformPen(tp,(s,0,0,-s,tx,0))
        gs[n].draw(tp2); out.append(pen.getCommands())
    return ' '.join(out)

def fit(text,width,w=800,track=0,wd=100,op=96):
    """size so that the text is exactly `width` wide"""
    _,w1=text_path(text,100,w,0,0,track,'start',wd,op); return 100*width/w1
