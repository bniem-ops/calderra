# Map prompts

**Reminder: if you use Gemini, start a new chat for every map.** Earlier images in the same chat bleed their style, layout and labels into the next one.

Make the continent map first so every later map can match its style. Paste the shared style line into every prompt.

**Shared style line:** *Hand-drawn fantasy map on aged parchment, ink linework with muted watercolour washes, compass rose, decorative border, top-down view, legible serif labels, no modern elements.*

## Continent map (done)

The continent map is `map/assets/calderra.png` (made in Gemini, no labels). The app accepts any image shape: set `image` and `imageSize` (pixel width and height) in `map/map.config.json`, then nudge pin and label percentages if needed. Ask Gemini for **no text, no labels and no pins**; the app draws those on top.

To replace it, start a new Gemini chat and keep this layout so the pins still line up: burnt wasteland with a war camp on the far west edge; hedged farmland west of centre with a village and coliseum; a long walled snowy north coast with a bridge village just south; snow-capped mountains and a smoking volcano in the north-east; a domed marble capital in the centre; a lone castle on a hill just south of it; harbour towns and ships on the east coast; a river delta with canals in the south.

## Battle maps

Add "square grid, 5-foot squares, no text labels" so they work on the TV.

| Map | Prompt |
| --- | --- |
| Harrow's Ford | Top-down battle map, north at the top. A fast river runs east to west across the middle. In the centre, a long bridge with a timber plank deck on squat stone piers. On the south bank, a small village behind a low fence, a timber gate at the bridge's south end, and a watermill on the riverbank at the village's west edge. On the north bank, a crowded camp of carts and lean-tos just east of the bridge's north end, and a war camp of hide tents further west. A shallow rocky wading place downstream to the west, marked by an old stone post. Reeds along both banks; a road leading north into fog. |
| The Black Gull | Top-down battle map, two sailing warships side by side at sea, planks and grappling lines between them, open water, rocks to one side. |
| Mount Kharag lair | Top-down battle map, a volcanic cavern with lava channels, piles of gold coins, a raised stone ledge, a narrow tunnel entrance. |
| The Regent's Vault | Top-down floor plan, palace vault level with a guard room, three locked chambers, a narrow service corridor and a hidden drain exit. |
| Millhaven coliseum | Top-down battle map, a small round stone arena overgrown with dark, dead vines and roots, a dug pit in the centre, festival banners, village rooftops beyond the walls. |
| The Lanternhold | Top-down floor plan of a small hilltop castle: great hall with long tables, a long gallery hung with lanterns, a chapel, a letter room, a wine cellar. |
| Kharag forge-heart | Top-down battle map, a great dwarven forge built into a volcanic chamber, an anvil on a stone island over lava, carved stone doors, a dragon's ledge above. |
