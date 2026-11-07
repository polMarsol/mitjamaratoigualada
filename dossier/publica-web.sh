#!/usr/bin/env bash
# Copia la versió web del dossier GENERAL a web/public/patrocini/ (el de Coca-Cola NO es publica).
# Després cal fer commit + push perquè Vercel i GitHub Pages el publiquin a /patrocini/.
set -euo pipefail
cd "$(dirname "$0")"
OUT=../web/public/patrocini
mkdir -p "$OUT/assets/img" "$OUT/assets/logos" "$OUT/assets/fonts"
cp general.html "$OUT/index.html"
cp dossier.css dossier.js dades.js "$OUT/"
cp assets/rutes-km.js "$OUT/assets/"
cp assets/fonts/*.woff2 "$OUT/assets/fonts/"
cp assets/img/*.jpg assets/img/*.svg assets/img/*.webp "$OUT/assets/img/"
for f in logo-horitzontal logo-horitzontal-blanc logo-icona logo-marca logo-mono-blanc logo-principal; do cp "assets/logos/$f.svg" "$OUT/assets/logos/"; done
[[ -f pdf/Dossier-Patrocini-MM-Igualada-2028.pdf ]] && cp pdf/Dossier-Patrocini-MM-Igualada-2028.pdf "$OUT/"
echo "✓ Dossier web copiat a web/public/patrocini/"
