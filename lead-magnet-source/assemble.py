#!/usr/bin/env python3
# Réassemble le PDF du lead magnet :
#   - pages 1, 2, 3, 8, 9 = images HD rendues depuis les fichiers HTML (dossier build/)
#   - pages 4, 5, 6, 7    = reprises telles quelles du PDF existant (jamais retouchées)
#
# Prérequis : pip3 install pymupdf
# Lancé automatiquement par build.sh (ne pas lancer seul en général).

import os, sys
import fitz  # PyMuPDF

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(HERE, "build")
# PDF de base : celui servi sur le site. Ses pages 4 à 7 sont les originales.
BASE = os.path.join(HERE, "..", "public", "LUNA-Guide-Manger-au-rythme-de-ton-cycle.pdf")
OUT  = os.path.join(HERE, "LUNA-Guide-FINAL.pdf")

W, H = 595.2756, 841.8898  # A4 en points

# index de page (0 = page 1) -> image rendue
repl = {
    0: os.path.join(BUILD, "final-1.png"),  # couverture
    1: os.path.join(BUILD, "final-2.png"),  # énergie / graphique
    2: os.path.join(BUILD, "final-3.png"),  # 4 phases
    7: os.path.join(BUILD, "final-8.png"),  # sans / avec LUNA
    8: os.path.join(BUILD, "final-9.png"),  # dernière page
}

for p in repl.values():
    if not os.path.exists(p):
        sys.exit(f"Image manquante : {p}\nLance ./build.sh (qui rend les HTML avant d'assembler).")

src = fitz.open(BASE)
out = fitz.open()
for i in range(src.page_count):
    if i in repl:
        page = out.new_page(width=W, height=H)
        page.insert_image(fitz.Rect(0, 0, W, H), filename=repl[i])
    else:
        out.insert_pdf(src, from_page=i, to_page=i)
out.save(OUT, deflate=True, garbage=4)
print(f"OK -> {OUT}  ({out.page_count} pages, {round(os.path.getsize(OUT)/1024/1024,2)} Mo)")
print("Pour publier : copie ce fichier dans public/ (même nom) puis git add + commit + push.")
