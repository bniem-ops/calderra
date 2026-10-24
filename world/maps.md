# Map prompts

**Reminder: if you use Gemini, start a new chat for every map.** Earlier images in the same chat bleed their style, layout and labels into the next one.

Make the continent map first so every later map can match its style. Paste the shared style line into every prompt.

**Shared style line:** *Hand-drawn fantasy map on aged parchment, ink linework with muted watercolour washes, compass rose, decorative border, top-down view, legible serif labels, no modern elements.*

## Continent map (for the player map app)

For the app, ask for **no labels, no pins and no markers**: the app draws region names and session pins on top. Ask for a **10:7 landscape** image so the pins in `map/map.config.json` line up.

> A continent with a marble capital city in the centre; a snowy, walled northern border; north-eastern mountains; an eastern coast of harbour towns; a southern river delta with canal cities; western farmland with hedges and villages; a far-western burnt wilderness of ruined forts. Ocean on all sides. No text, no labels, no pins. 10:7 landscape.

Save it as `map/assets/calderra.png` and set `"image": "assets/calderra.png"` in `map/map.config.json`, then nudge pin percentages if needed.

## Battle maps

Add "square grid, 5-foot squares, no text labels" so they work on the TV.

| Map | Prompt |
| --- | --- |
| Harrow's Ford | Top-down battle map, a stone bridge over a fast river, a small village on the south bank with fences and a mill, open fields on the north bank, a road leading north into fog. |
| The Black Gull | Top-down battle map, two sailing warships side by side at sea, planks and grappling lines between them, open water, rocks to one side. |
| Mount Kharag lair | Top-down battle map, a volcanic cavern with lava channels, piles of gold coins, a raised stone ledge, a narrow tunnel entrance. |
| The Regent's Vault | Top-down floor plan, palace vault level with a guard room, three locked chambers, a narrow service corridor and a hidden drain exit. |
