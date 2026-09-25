import sys; sys.path.insert(0,'/home/pol/Documents/TFG_marti/branding/src')
from lib import *
NAVY='#0d2233'; BLUE='#0b5cad'; GREEN='#1a7a50'
def zig(x0,y0,s=1.0):
    pts=[(0,220),(60,22),(120,140),(180,22),(240,220),(300,22),(360,140),(420,22),(480,220)]
    return 'M'+' L'.join(f'{x0+px*s:.1f} {y0+py*s:.1f}' for px,py in pts)
def river(x0,y,w,amp=9,per=60):
    d=f'M{x0} {y}'; x=x0
    while x<x0+w-1e-6: d+=f' q{per/4} {-amp} {per/2} 0 t{per/2} 0'; x+=per
    return d
def svg(W,H,body,defs=''): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Mitja Marató d\'Igualada"><title>Mitja Marató d\'Igualada</title>{defs}{body}</svg>'
GRAD=f'<defs><linearGradient id="g" x1="40" y1="0" x2="520" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="{BLUE}"/><stop offset="1" stop-color="{GREEN}"/></linearGradient></defs>'
def stacked(variant='ring',col=None,bg=None):
    """stacked lockup 560 wide"""
    mk = col or 'url(#g)'; tx = col or NAVY; rv = col or GREEN
    sz=fit('IGUALADA',480,800,-5); ig,_=text_path('IGUALADA',sz,800,300,440,-5,'middle')
    sz2=fit('MITJA MARATÓ',480,700,240,90); mj,_=text_path('MITJA MARATÓ',sz2,700,300,372,240,'middle',90)
    b=''
    if bg: b+=f'<rect width="560" height="490" fill="{bg}"/>'
    b+=f'<path d="{zig(40,40)}" fill="none" stroke="{mk}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>'
    if variant=='sun': b+=f'<circle cx="280" cy="118" r="30" fill="{rv}"/>'
    b+=f'<path d="{river(40,304,480,8,60)}" fill="none" stroke="{rv}" stroke-width="9" stroke-linecap="round"/>'
    b+=f'<path d="{mj}" fill="{tx}"/><path d="{ig}" fill="{tx}"/>'
    return svg(560,490,b,GRAD if not col else '')
if __name__=='__main__':
    open('../a1.svg','w').write(stacked('ring')); open('../a2.svg','w').write(stacked('sun'))
