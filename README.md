# Tony D-Line Weekly Scout — Week 5 South Alabama

Current opponent: **South Alabama**.

- Keeps the previous Tony D-Line app unchanged as `app-base.html`.
- Preserves Mississippi State, UAB, Southeastern Louisiana, and Florida Atlantic.
- Adds South Alabama as the Week 5/current opponent.
- Loads the current South Alabama Defensive Intelligence files directly from the existing public Supabase folder.
- Uses exact tagged ULM defensive formations first, then the same formation-signature learning approach used in Defensive Intelligence for untagged plays.
- Preserves every existing Tony D-Line chart, tab and filter. No chart/layout redesign.
- Uses current South Alabama roster, Week 5 depth chart, OL run/pass blocking, TTT, stunt, run concepts/directions, personnel and formation data.

Deployment structure:
- `index.html` — lightweight loader
- `app-base.html` — exact prior FAU FIXED v2.1 app
- `south-alabama-week5.js` — Week 5 South Alabama data/terminology extension
