# Tony D-Line Weekly Scout v15.3

Hybrid-language update:
- Uses the newly supplied 328-row ALL_BREAKDOWN_GAMES hybrid as the authoritative ULM tagging source.
- Exact hybrid-tagged plays keep their exact ULM Formation values.
- Extra PFF game-feed plays are translated only when their PFF formation structure maps cleanly/high-confidence to a ULM formation learned from the tagged hybrid.
- Formation map coverage: 725 of 975 PFF plays.
- Exact tagged matches: 322.
- Ambiguous/unseen structures are left unassigned rather than guessed.
- The same formation map is used by visible tables and stunt formation analysis.
- Raw PFF/offensive formation language remains hidden from Tony's visible tables.
