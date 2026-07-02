# Sources du lead magnet — Guide « Manger au rythme de ton cycle »

Ce dossier contient les **sources modifiables** des pages retravaillées du guide PDF
offert sur la landing page. Le PDF d'origine (fait dans un outil de design) n'avait
aucune source éditable : ces pages ont été reconstruites en **HTML/CSS** pour pouvoir
les retoucher facilement.

## Ce qu'il y a dedans

| Fichier | Page dans le PDF | Contenu |
|---|---|---|
| `page1-couverture.html` | 1 | Couverture (logo + « Ton cycle a 4 phases », 4 cartes-aliments) |
| `page2-energie.html`    | 2 | « Ton énergie n'est pas la même » + graphique + bénéfices |
| `page3-4phases.html`    | 3 | Les 4 phases (anneaux) + bloc « Le secret » |
| `page8-sans-avec.html`  | 8 | Tableau « Sans / Avec LUNA » |
| `page9-derniere.html`   | 9 | Dernière page (mockup + « Prochainement sur l'App Store ») |
| `common.css`            | — | Styles communs (couleurs, polices de la charte LUNA) |
| `assets/`               | — | Tous les visuels utilisés (logo, pictos de phase, aliments HD, mockup, lune) |

> **Les pages 4 à 7 ne sont pas ici** : elles n'ont pas été retouchées. Elles sont
> reprises telles quelles depuis le PDF existant (`public/…pdf`) au moment de l'assemblage.

## Modifier une page

1. Ouvre le fichier `.html` voulu dans un éditeur de texte (ou un navigateur pour prévisualiser).
2. Change le texte, les couleurs, les tailles… (le CSS est en haut de chaque fichier, section `<style>`).
3. Pour remplacer un visuel, dépose la nouvelle image dans `assets/` et garde le même nom
   (ou mets à jour le `src="assets/…"` dans le HTML).
4. Reconstruis le PDF (voir ci-dessous).

## Reconstruire le PDF

Prérequis : **Google Chrome**, **python3** avec **PyMuPDF** (`pip3 install pymupdf`), et internet
(les polices se chargent depuis Google Fonts au rendu).

```bash
cd lead-magnet-source
./build.sh
```

Ça génère `LUNA-Guide-FINAL.pdf` dans ce dossier (9 pages, HD).

## Mettre la nouvelle version en ligne

```bash
cp LUNA-Guide-FINAL.pdf ../public/LUNA-Guide-Manger-au-rythme-de-ton-cycle.pdf
git add ../public/LUNA-Guide-Manger-au-rythme-de-ton-cycle.pdf
git commit -m "Lead magnet : mise à jour"
git push origin main   # Vercel redéploie tout seul (~1-2 min)
```

Le nom du fichier et le lien de téléchargement sont définis dans
`src/pages/Landing.jsx` (constante `LEAD_MAGNET_PATH` + `link.download`). Si tu changes
le **nom** du PDF, pense à le mettre à jour là aussi.

## Notes techniques

- Format des pages : **A4** (794 × 1123 px à l'écran = rendu à 3× pour la HD).
- Polices : **Playfair Display** (titres) + **DM Sans** (texte), chargées via Google Fonts.
- Les pictos de phase (`assets/picto-*.png`) sont les anneaux colorés recadrés depuis
  `public/phase-*.png`. Les aliments HD (`assets/foodhd-*.png`) sont détourés depuis
  `CM/Instagram/photos-aliments/`. Le mockup (`assets/manger-hd-clean.png`) est la capture
  `CM/Instagram/screenshots-app/manger-menstruelle.png` avec l'îlot de statut nettoyé.
