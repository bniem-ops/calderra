# Building a faction

Factions are built in the order they arrived in Calderra, so later ones can fill gaps and react to earlier ones. The Ashen Pretender is built last among the claimants, so his tactics can exploit everyone else's flaws. The Order of the Dawn Lantern is written last of all, on top of everything.

| Order | Faction | Arrived | Status |
| --- | --- | --- | --- |
| 1 | Stonecrown Holds | Before the empire; the oldest people in Calderra | Done |
| 2 | House Ironhart | The march-lords who built and held the Thornwall | Done |
| 3 | The Regency | The imperial court in Solace | Done |
| 4 | Saltreach Compact | The newest power: merchants grown rich in the empire's last century | Done |
| 5 | The Ashen Pretender | Exiled heir, built to exploit everyone's weak points | To do |
| 6 | Order of the Dawn Lantern | Sworn to the realm; ties everything together | To do |

Smaller peoples worth a pass later: the Prince-Merchants of Vareth (Gilded Delta), the Verdant Court (Millhaven's Fey), the orc and giant clans beyond the Thornwall.

## The questions

Answer these in the faction's file under `world/factions/`, in the markdown body (DM-only). Only the header's `public_blurb`, `name`, `seat` and `face` reach the player map.

**Origins and identity**
- Where did they come from, and what story do they tell about it? How true is that story?
- What do they call themselves, and what do others call them?
- What single trait or value would they say defines them? What would outsiders say instead?

**Environment and survival**
- What does their land give them, and what does it withhold?
- How do they feed themselves? Who does the hard labour?
- What's the biggest threat to their survival: nature, neighbours, or themselves?

**Power and structure**
- Who makes decisions, and how did they get that right? How is power passed on?
- Who's at the bottom, and why do they put up with it (or not)?
- What happens to someone who breaks the rules?

**Beliefs and values**
- What do they consider sacred? What's taboo?
- What do they believe happens after death?
- What virtue do they praise most? What vice do they tolerate more than they should?

**Relationships**
- Who are their allies, rivals, and old grudges, and why?
- What do they want from other groups, and what do others want from them?
- What do they misunderstand about their neighbours?

**Internal tension**
- What do they argue about among themselves?
- Where is the gap between their ideals and how they actually behave?
- Who within the faction is unhappy, and what would they do with power?

**Texture**
- What does a typical day look like for an ordinary member?
- What do they eat at a celebration? What does a wedding or funeral look like?
- What's a common saying, insult, or superstition?

**Story hooks**
- What do they want right now, and what's stopping them?
- What secret are they keeping?
- What would it take to change them, or destroy them?

**For the Pretender (record as each faction is finished):** the one weakness he would exploit, and how.

## Finishing a faction

1. Wrap the secret passages in `<!-- secret -->` … `<!-- /secret -->` and list giveaway words in `secret_terms` in the header.
2. Add 3–4 **private hooks** for a player of this people (inside a secret block).
3. Write the **player guide** in `players/<id>.md` (copy `players/holdfast.md`). Set `ready: true` once the DM approves.
4. `npm run build` — it fails if the guide leaks a secret.

| Faction | Player guide |
| --- | --- |
| Stonecrown Holds | `peoples/holdfast.html` |
| House Ironhart | `peoples/marcher.html` |
| The Regency | `peoples/solari.html` |
| Saltreach Compact | `peoples/reacher.html` |
