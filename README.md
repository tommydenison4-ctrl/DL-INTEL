# Tony D-Line Weekly Scout v13.2

Run diagram synchronization fix:

- Both run diagrams now use the exact same filtered run rows.
- The second TE / H chart no longer re-filters itself to a dominant formation.
- Every hit-lane count, YPP, frequency arrow and circle is calculated from the exact same sample in both charts.
- The only difference between the two visuals is:
  1. Chart 1 = clean run-hit distribution
  2. Chart 2 = same run-hit distribution + attached Y / U / H / TE surface overlay
- If ULM Formation or Personnel is explicitly selected in the run filters, that exact selection controls the structure drawn on chart 2.
- If no formation is explicitly selected, the dominant formation is used only to draw the attached-player structure. It does not change the run sample.
- Both charts display the same run count for verification.

All existing filters and Tony app features remain intact.
