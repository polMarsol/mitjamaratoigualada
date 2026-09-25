# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository nature

This is **not a software project**. It has no code, build system, tests, linter or git history. It is the working folder for a TFG (final degree project) about organising a road-running event, the **1a Mitja Marató d'Igualada (MM Igualada 2026)**, held in Igualada and Vilanova del Camí (Catalonia). The content is documents only, in `data/`:

- `data/TFG MM Igualada.docx` — the author's working notes (mixed Catalan/Spanish): involved entities, required documentation, an organisation roadmap, and a feasibility/budget analysis.
- `data/Reglament Oficial MM Igualada 2026 V2.docx` — the official event regulations (Catalan), version 2026.1, dated 21 Sep 2026.

Both are `.docx`. To read them from the shell, extract the text, e.g. `unzip -p "<file>.docx" word/document.xml | sed 's/<\/w:p>/\n/g; s/<[^>]*>//g'`, or use the `docx` skill for editing.

## Domain facts that must stay consistent across documents

The notes and the regulations describe the same event, so changes in one usually need to be mirrored in the other.

- **Three modalities**: Mitja Marató 21K (21,097 km, FCA-homologated, min. age 18, start 08:30), Cursa 10K (min. age 14, start 09:00), Caminada Popular (~6–8 km, non-competitive, start 09:15).
- **Cut-off times**: 21K km-10 checkpoint at 1h30 (10:00) and finish at 3h (11:30); 10K finish at 1h30 (10:30); walk finish at 2h30 (11:45). Note that the regulations' route section states the 10K maximum as "2 hora i 30 minuts" (finish closing 11:30) while the cut-off section says 1h30 (10:30). Check this discrepancy before relying on either figure.
- **Aid stations** roughly every 5 km (km 5, 10, 15 and finish area).
- **Entities involved**: Ajuntaments of Igualada and Vilanova del Camí, Servei Català de Trànsit, Federació Catalana d'Atletisme (FCA), local police, Protecció Civil.
- **Required paperwork** (from the notes): road-occupation request, technical memo, route tracks/maps, aid stations, affected streets, mobility and signage plan, PAU (Pla d'Autoprotecció / medical arrangement), sustainability plan (Parc Fluvial / Anella Verda permits), civil-liability and accident insurance.
- **Roadmap ordering matters**: design (9–6 months before) → technical documents (6–4) → official filing (min. 3) → contracting (3–2) → open registrations only once routes are approved.
- **Budget baseline**: 800 participants, estimated total €8,100–10,500 (insurance, medical, timing/bibs, shirts, aid stations, rentals/logistics).

## Working conventions

- Documents are written in Catalan (the notes drift into Spanish). Keep the language of the file being edited and preserve the formal register of the regulations.
- Edit the `.docx` files in place with the docx tooling rather than creating parallel copies. There is no version control here, so back up a file before large edits.
