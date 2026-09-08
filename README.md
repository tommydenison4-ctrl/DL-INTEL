# Tony D-Line Weekly Scout v14.9

UAB play alignment update:
- Aligned play_feed-93.csv directly to the embedded 975-row UAB hybrid by play sequence, 975 rows to 975 rows.
- Verification: quarter, down, run/pass, personnel and hash matched 975/975 rows. One distance value differs between sources but the sequence remains aligned.
- The aligned hybrid now carries authoritative PFF fields for RPO, Screen, Play Action, Stunt, Time To Throw, Time To Pressure, Dropback Type, Pass Result, pressure and pass-rusher fields.
- Stunt analysis now reads those aligned fields directly; no fuzzy play matching is required for UAB.
- Pass Family classification prioritizes PFF Screen, RPO and Play Action tags. Quick Game and Sprint Out fall back to the manual Play Type because play_feed-93 has no dedicated QUICKGAME field.
- play_feed-93.csv is included in the ZIP for verification.
