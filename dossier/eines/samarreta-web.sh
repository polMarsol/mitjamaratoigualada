#!/usr/bin/env bash
# Regenera les fotos de la samarreta de la web (web/public/shirt/*.webp) amb el MMI nou, l'any 2028
# i els patrocinadors sense repetir. Abans cal haver executat neteja-samarreta.py (crea eines/_build/).
set -euo pipefail
cd "$(dirname "$0")"
CHROME=${CHROME:-$(command -v google-chrome || command -v chromium)}
OUT=../../web/public/shirt
for side in front back; do
  w=$([[ $side == front ]] && echo 957 || echo 947)
  "$CHROME" --headless=new --disable-gpu --no-sandbox --allow-file-access-from-files --hide-scrollbars \
    --default-background-color=00000000 --window-size=$w,1200 --virtual-time-budget=4000 \
    --screenshot="_build/$side-final.png" "file://$PWD/samarreta-web.html?side=$side" 2>/dev/null
done
python3 - "$OUT" <<'EOF'
import sys, json
from PIL import Image
out = sys.argv[1]; meta = {}
for n, src in [('front', '_build/front-final.png'), ('back', '_build/back-final.png'), ('side-l', '_build/side-l.png'), ('side-r', '_build/side-r.png')]:
    im = Image.open(src).convert('RGBA'); im.save(f'{out}/{n}.webp', quality=88, method=6); meta[n] = {'w': im.width, 'h': im.height}
open(f'{out}/meta.json', 'w').write(json.dumps(meta))
print('✓ web/public/shirt actualitzat', meta)
EOF
