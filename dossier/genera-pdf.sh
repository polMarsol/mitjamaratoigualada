#!/usr/bin/env bash
# Genera els PDF del dossier amb Google Chrome (sense interfície).
#   ./genera-pdf.sh                          → dossier general (sense personalitzar) + dossier Coca-Cola
#   ./genera-pdf.sh "Bonpreu" [nivell] [contacte] [logo] [color]
#        → dossier general personalitzat, p. ex.:
#          ./genera-pdf.sh "Caldos Aneto" bossa "Marta Puig" assets/logos/aneto.svg c8102e
set -euo pipefail
cd "$(dirname "$0")"
CHROME=${CHROME:-$(command -v google-chrome || command -v chromium || command -v chromium-browser)}
mkdir -p pdf

render() { # $1 = html amb query, $2 = sortida
  "$CHROME" --headless=new --disable-gpu --no-sandbox --allow-file-access-from-files \
    --no-pdf-header-footer --virtual-time-budget=8000 --run-all-compositor-stages-before-draw \
    --print-to-pdf="$2" "file://$PWD/$1" 2>/dev/null
  echo "✓ $2"
}
urlenc() { python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$1"; }

if [[ $# -ge 1 ]]; then
  q="empresa=$(urlenc "$1")"
  [[ -n "${2:-}" ]] && q+="&nivell=$2"
  [[ -n "${3:-}" ]] && q+="&contacte=$(urlenc "$3")"
  [[ -n "${4:-}" ]] && q+="&logo=$(urlenc "$4")"
  [[ -n "${5:-}" ]] && q+="&color=${5#\#}"
  slug=$(python3 -c 'import sys,re,unicodedata;s=unicodedata.normalize("NFKD",sys.argv[1]).encode("ascii","ignore").decode();print(re.sub(r"[^A-Za-z0-9]+","-",s).strip("-"))' "$1")
  render "general.html?$q" "pdf/Dossier-Patrocini-MM-Igualada-$slug.pdf"
else
  render general.html "pdf/Dossier-Patrocini-MM-Igualada-2026.pdf"
  if [[ -f coca-cola.html ]]; then render coca-cola.html "pdf/Dossier-MM-Igualada-by-Coca-Cola.pdf"; fi
fi
