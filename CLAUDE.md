# Calderra — instructions for Claude Code

A shared D&D 5e world for standalone one-shots with rotating players and planned levels. This repo is the master copy of everything: world canon, adventures, the World Ledger and the player map.

The repo is public. Players *could* read it; the DM accepts that. What matters is that **the player map never shows anything private**.

## Layout

| Path | What it is | Who sees it |
| --- | --- | --- |
| `world/` | Canon: premise, regions, factions, Crown lore, DM notes, map prompts | DM. Only YAML header fields named `public_blurb`, `held_by`, `rumour`, `name`, `seat`, `face` and the `<!-- public-intro -->` block in `premise.md` reach the map |
| `adventures/NN-slug/adventure.md` | One folder per one-shot. YAML header = public card; body = DM-only | Header on the map; body DM-only |
| `ledger/state.yaml` | Current state: Realm's Peace, faction standings, gems, legacy heroes | Partly public (see comments in the file) |
| `ledger/sessions/NN-slug.md` | One file per played session. Header has `public_record`, `players`, `date` (public) and `outcome`, `changes`, `ripples` (private) | Partly public |
| `players/<id>.md` | Player guides, one per people. Published only when `ready: true`, as an **unlisted** page `map/peoples/<id>.html` that nothing links to; the DM sends the link to the player who picks that people | The player who gets the link |
| `scripts/build-public-data.mjs` | Builds `map/data.json` from the above, player-safe only, and fails on leaks | — |
| `map/` | The player map app (static, deployed to GitHub Pages). `map/data.json` is generated; never edit it by hand | Public |
| `map/map.config.json` | Map-only settings: background image, pin positions (% of image) | Public |

## Rules

1. **Never put secrets in public fields.** Twists, hidden truths, outcomes, gem locations and private notes go in markdown bodies or private YAML fields only.
2. **Story work and map work are separate.** Writing adventures or logging sessions touches `world/`, `adventures/`, `ledger/`. UI work touches `map/` only (except the generated `map/data.json`). Don't mix the two in one commit.
3. **Always run `npm run build` before committing.** It regenerates `map/data.json` and fails if anything private leaks. Commit the regenerated `map/data.json`.
4. **The cold open of an adventure appears only when its act is current** (the act of the next unplayed adventure). Write cold opens as spoiler-free hooks anyway.
5. **Mark secrets in DM files.** Wrap secret passages in `<!-- secret -->` … `<!-- /secret -->` and list giveaway words in a faction's `secret_terms`. The build fails if a player guide or the map contains them.
6. **Never link to a player guide** from the map or anywhere public.
7. **Spotlights are written by role** (face, brain, sneak, muscle, support), never by class.

## Logging a session (the usual request)

When the DM says something like *"Log Harrow's Ford: they held the bridge and spared the champion. Ironhart +1, peace +1. Played by Sam (Bryn), Alex (Lute)…"*:

1. Create `ledger/sessions/NN-<adventure-id>.md` copying the header shape of `00-festival-of-the-accord.md`. `NN` = the adventure number.
2. Write a one- or two-sentence `public_record` in past tense, from the realm's point of view. No twists, no private outcomes. **Show it to the DM for approval** before committing if they didn't dictate it.
3. Put private notes, the outcome and ripples in the session file.
4. Apply `changes` to `ledger/state.yaml` (peace, faction `standing` and `reason`, gem `revealed` / `public_location`, legacy heroes).
5. `npm run build`, then commit with a message like `Log session 01: Harrow's Ford`.

A session counts as played when a session file names its adventure; that is what turns its pin from planned to played.

## Player guides

Each finished faction gets a player guide in `players/<id>.md` (copy `players/holdfast.md`): the people's own story (the myth, not the truth), daily life, sayings, what they think of others, character ideas and a rules fit. Private hooks for a player of that people go in the faction file under "Private hooks", inside a secret block, and are handed out in person. Set `ready: true` after the DM approves; share `https://bniem-ops.github.io/Calderra/peoples/<id>.html`.

## Adding or editing an adventure

- Copy the header shape of an existing `adventure.md`. Required: `id`, `number`, `title`, `act` (`Prologue`, `I`, `II`, `III`), `level`, `region` (a file name in `world/regions/`), `location`, `genre`, `spotlight`, `cold_open`.
- Add a pin for the new `id` in `map/map.config.json` (x and y as percentages of the map image).
- Use the one-shot template in `world/dm-notes.md` for the body.

## Maps

Continent and battle-map images are made in Gemini. **Remind the DM to start a new Gemini chat for every map.** Prompts live in `world/maps.md`.

## Commands

- `npm install` once.
- `npm run build` builds `map/data.json` and runs the leak check.
- `npm run preview` serves `map/` at http://localhost:4173.
