# Icônes de l'app LUNA

Icône = le **U du logo LUNA** (son trait épais forme un croissant de lune) au centre de **l'anneau du cycle** (les 4 phases en dégradé fluide). Version aérée.

## Les 3 variantes

| Préfixe | Fond | U | Usage |
|---|---|---|---|
| `icon-rose-*` | rose pâle `#FDE8EB` | rose `#C4727F` | **Icône principale** (installée, mode clair) |
| `icon-prune-*` | prune nuit `#33283B` | crème `#FDF1F0` | **Mode sombre** (iOS 26 / natif) |
| `icon-fonce-*` | rose foncé `#A85A66` | blanc | Alternative plus « punchy » (non utilisée) |

## Les tailles

Pour chaque variante : `16`, `32`, `180`, `192`, `512`, `1024` px, plus le fichier vectoriel `.svg` (qualité infinie, idéal pour ré-exporter).

- `1024` = taille source pour l'App Store / Xcode
- `180` = apple-touch-icon (iPhone)
- `192` / `512` = PWA / manifest
- `16` / `32` = favicon navigateur

> Fichiers **full-bleed carrés** (coins non arrondis) : iOS et le navigateur appliquent eux-mêmes le masque arrondi.

## Couleurs des 4 phases (anneau)

Menstruelle `#D4727F` · Folliculaire `#7BAE7F` · Ovulatoire `#E8A87C` · Lutéale `#B09ACB`

## Tout régénérer

Depuis la racine du projet :

```bash
node scripts/generate-luna-icon.mjs App-Store-LUNA/Icones
```

Le tracé exact du U vient du logo (`public/logo-luna.png`) et est conservé dans `scripts/luna-u-path.json`. Pour changer une couleur ou l'épaisseur de l'anneau, modifier `scripts/generate-luna-icon.mjs` puis relancer la commande.
