#!/bin/zsh
# Reconstruit le PDF du lead magnet à partir des pages HTML.
#
# Prérequis :
#   - Google Chrome installé (rendu HTML -> image HD, 3x)
#   - python3 + PyMuPDF  ->  pip3 install pymupdf
#   - une connexion internet (les polices Google Fonts se chargent au rendu)
#
# Utilisation :
#   cd lead-magnet-source
#   ./build.sh
# Le PDF final est écrit dans ce dossier : LUNA-Guide-FINAL.pdf
# (il ne remplace PAS automatiquement celui de public/ — voir la fin.)

set -e
HERE="${0:A:h}"
cd "$HERE"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p build

# page HTML -> nom d'image attendu par assemble.py
render() {
  local html="$1" out="$2"
  echo "  rendu $html -> build/$out"
  "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --force-device-scale-factor=3 --window-size=794,1123 \
    --screenshot="build/$out" "file://$HERE/$html" 2>/dev/null
}

echo "1/2 — rendu des pages (HD 3x)…"
render page1-couverture.html  final-1.png
render page2-energie.html     final-2.png
render page3-4phases.html     final-3.png
render page8-sans-avec.html   final-8.png
render page9-derniere.html    final-9.png

echo "2/2 — assemblage du PDF…"
python3 assemble.py

echo
echo "Terminé. Pour mettre en ligne la nouvelle version :"
echo "  cp LUNA-Guide-FINAL.pdf ../public/LUNA-Guide-Manger-au-rythme-de-ton-cycle.pdf"
echo "  (puis git add + commit + push)"
