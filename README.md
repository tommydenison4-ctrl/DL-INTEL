# Tony D-Line Weekly Scout v13.1

Run filter population repair:
- Fixed accidental recursion in `renderRunFilteredArea()`.
- Main render now calls `populateRunFilters()` after the opponent/season data is loaded.
- Every run filter always includes an `All` option.
- ULM Formation uses the authoritative ALL_BREAKDOWN_GAMES vocabulary as a fallback if the live hybrid row mapping is not ready yet.
- Personnel, Backfield, Motion, Down, Distance, Hash and Run Concept populate from the current run sample.
- Both run-hit diagrams and run tables redraw from the selected run-filter sample.

All existing Tony app features are retained.
