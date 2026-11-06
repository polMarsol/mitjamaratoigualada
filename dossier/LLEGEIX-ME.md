# Dossier de patrocini · MM Igualada 2026

| Fitxer | Què és |
|---|---|
| `general.html` | Dossier general (20 pàg.). Obre'l al navegador: la barra de dalt el personalitza (empresa, contacte, nivell recomanat, logo, color) i "Desa en PDF" l'exporta. |
| `coca-cola.html` | Dossier personalitzat "MM Igualada by Coca-Cola" (12 pàg.). **Confidencial: no es publica a la web.** |
| `correu/generador.html` | Generador de correus: omple, tria l'assumpte, "Copia el correu" → enganxa a Gmail. |
| `dades.js` | **Font única** de preus, places, dates i contacte. Canvia-ho aquí i es reflecteix als dos dossiers i al correu. |
| `pdf/` | PDF generats. |

## Ordres
```bash
./genera-pdf.sh                                   # PDF general + Coca-Cola
./genera-pdf.sh "Caldos Aneto" bossa "Marta Puig"  # PDF general personalitzat (empresa, nivell, contacte, [logo], [color])
./publica-web.sh                                  # copia el dossier general a web/public/patrocini/ (després: commit + push)
python3 eines/genera-assets.py                    # regenera traçats de ruta i logo blanc de Coca-Cola
node eines/email-assets.mjs                       # (des de l'arrel del projecte) regenera les imatges del correu
```

## Personalitzar per enllaç (versió web)
`https://mitjamaratoigualada.vercel.app/patrocini/?empresa=Bonpreu&contacte=Marta&nivell=modalitat&logo=URL&color=e30613`
Afegeix `&edit` per veure la barra d'edició a la web publicada.

Ids de nivell: naming, partner, modalitat, meta, avituallament, km, trofeus, medalla, bossa, calent, fotos, festa, animacio, llebres, voluntaris, eco, resultats, tanques, esquena, speaker, web, sorteig, mitjans.

## ⚠ Pendent abans d'enviar
- Contacte real (nom, correu, telèfon) a `dades.js` → `contacte`.
- Data de la cursa i terminis de candidatura (`event.data`, `terminis`): ara són provisionals.
- Logo de Coca-Cola: Wikimedia Commons (domini públic). Fer servir el logo oficial si l'empresa el facilita.
- Xifres de públic (2.000 espectadors) i retorn: estimacions.
