// Builds map/data.json — the ONLY data the player map sees — from world/, adventures/ and ledger/.
// Everything is opt-in: a field reaches the map only if this script copies it explicitly.
// Then a leak check scans the output for any private text and fails the build if it finds some.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const p = (...parts) => join(ROOT, ...parts);
const errors = [];

function readFrontMatter(file) {
  const text = readFileSync(file, "utf8");
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing YAML header between --- lines`);
  return { data: YAML.parse(m[1]) ?? {}, body: m[2] ?? "", raw: m[1] };
}
const mdFiles = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")).sort() : []);

// ---------- Canon ----------
const premise = readFileSync(p("world/premise.md"), "utf8");
const intro = (premise.match(/<!-- public-intro -->([\s\S]*?)<!-- \/public-intro -->/) || [, ""])[1].trim();

const regions = Object.fromEntries(
  mdFiles(p("world/regions")).map((f) => {
    const { data } = readFrontMatter(p("world/regions", f));
    return [data.id, data];
  })
);
const factionsCanon = mdFiles(p("world/factions")).map((f) => readFrontMatter(p("world/factions", f)));

const adventures = readdirSync(p("adventures"), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => ({ folder: d.name, ...readFrontMatter(p("adventures", d.name, "adventure.md")) }))
  .sort((a, b) => a.data.number - b.data.number);

// ---------- Ledger ----------
const state = YAML.parse(readFileSync(p("ledger/state.yaml"), "utf8"));
const sessions = mdFiles(p("ledger/sessions")).map((f) => ({ file: f, ...readFrontMatter(p("ledger/sessions", f)) }));
const sessionByAdventure = Object.fromEntries(sessions.map((s) => [s.data.adventure, s]));

// ---------- Validation ----------
const ACTS = ["Prologue", "I", "II", "III"];
const REQUIRED = ["id", "number", "title", "act", "level", "region", "location", "genre", "spotlight", "cold_open"];
for (const a of adventures) {
  for (const k of REQUIRED) if (a.data[k] === undefined || a.data[k] === "") errors.push(`adventures/${a.folder}: header is missing "${k}"`);
  if (!ACTS.includes(String(a.data.act))) errors.push(`adventures/${a.folder}: act must be one of ${ACTS.join(", ")}`);
  if (a.data.region && !regions[a.data.region]) errors.push(`adventures/${a.folder}: region "${a.data.region}" has no file in world/regions/`);
}
for (const s of sessions) {
  if (!adventures.some((a) => a.data.id === s.data.adventure)) errors.push(`ledger/sessions/${s.file}: adventure "${s.data.adventure}" doesn't exist`);
  if (!s.data.public_record) errors.push(`ledger/sessions/${s.file}: needs a public_record`);
}
for (const id of Object.keys(state.factions || {})) {
  if (!factionsCanon.some((f) => f.data.id === id)) errors.push(`ledger/state.yaml: faction "${id}" has no file in world/factions/`);
}

// ---------- Public projection ----------
const isPlayed = (a) => Boolean(sessionByAdventure[a.data.id]);
const next = adventures.find((a) => !isPlayed(a));
const currentActIndex = next ? ACTS.indexOf(String(next.data.act)) : ACTS.length - 1;
const REP = { "-2": "Hostile", "-1": "Wary", "0": "Neutral", "1": "Friendly", "2": "Allied" };

const out = {
  generated: new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" }),
  intro,
  realm_peace: Math.max(0, Math.min(10, Number(state.realm_peace ?? 5))),
  acts: [
    { id: "Prologue", name: "Prologue" },
    { id: "I", name: "Act I · Banners Rise" },
    { id: "II", name: "Act II · The Crown Hunt" },
    { id: "III", name: "Act III · The Pretender's War" },
  ],
  current_act: ACTS[currentActIndex],
  next_session: next ? next.data.id : null,
  sessions: adventures.map((a) => {
    const d = a.data;
    const s = sessionByAdventure[d.id];
    const actOpen = ACTS.indexOf(String(d.act)) <= currentActIndex;
    const region = regions[d.region] || {};
    return {
      id: d.id,
      number: d.number,
      title: d.title,
      act: String(d.act),
      level: d.level,
      region: region.name || d.region,
      location: d.location,
      genre: d.genre,
      spotlight: d.spotlight,
      status: s ? "played" : d.id === (next && next.data.id) ? "next" : "planned",
      cold_open: !s && actOpen ? d.cold_open : null,
      sealed: !s && !actOpen,
      public_record: s ? s.data.public_record : null,
      date: s ? s.data.date || null : null,
      players: s ? (s.data.players || []).map(String) : [],
    };
  }),
  regions: Object.values(regions).map((r) => ({ id: r.id, name: r.name, held_by: r.held_by, feel: r.feel, rumour: r.rumour })),
  factions: factionsCanon.map(({ data: f }) => {
    const st = (state.factions || {})[f.id] || { standing: 0 };
    const known = st.known_to_players !== false;
    return {
      id: f.id,
      name: f.name,
      seat: f.seat,
      face: f.face,
      blurb: f.public_blurb,
      reputation: known ? REP[String(Math.max(-2, Math.min(2, st.standing ?? 0)))] : "Unknown",
    };
  }),
  gems: Object.values(state.gems || {}).map((g) =>
    g.revealed ? { revealed: true, name: g.name, location: g.public_location || "Location unknown" } : { revealed: false }
  ),
  legacy_heroes: (state.legacy_heroes || []).map((h) => ({
    name: h.name,
    player: h.player,
    from: (adventures.find((a) => a.data.id === h.from) || { data: { title: h.from } }).data.title,
  })),
};
// Factions in a stable, friendly order: the Order first, the Pretender last.
const order = ["dawn-lantern", "regency", "ironhart", "saltreach", "stonecrown", "ashen-pretender"];
out.factions.sort((a, b) => (order.indexOf(a.id) + 99) % 99 - (order.indexOf(b.id) + 99) % 99);

// ---------- Leak check ----------
// Collect every private text and make sure no sentence of it appears in the output.
const privateTexts = [];
const pushText = (label, t) => { if (t) privateTexts.push([label, String(t)]); };
for (const a of adventures) {
  const sealedCold = !out.sessions.find((s) => s.id === a.data.id).cold_open;
  pushText(`adventures/${a.folder} body`, a.body.replace(/^#.*$/gm, ""));
  if (sealedCold) pushText(`adventures/${a.folder} cold_open (sealed)`, a.data.cold_open);
}
for (const f of mdFiles(p("world/factions"))) pushText(`world/factions/${f} body`, readFrontMatter(p("world/factions", f)).body.replace(/^#.*$/gm, ""));
for (const f of mdFiles(p("world/regions"))) pushText(`world/regions/${f} body`, readFrontMatter(p("world/regions", f)).body.replace(/^#.*$/gm, ""));
for (const f of ["world/sunfire-crown.md", "world/dm-notes.md"]) pushText(f, readFileSync(p(f), "utf8"));
pushText("world/premise.md (outside public intro)", premise.replace(/<!-- public-intro -->[\s\S]*?<!-- \/public-intro -->/, ""));
for (const s of sessions) {
  pushText(`ledger/sessions/${s.file} body`, s.body.replace(/^#.*$/gm, ""));
  pushText(`ledger/sessions/${s.file} outcome`, s.data.outcome);
  for (const r of s.data.ripples || []) pushText(`ledger/sessions/${s.file} ripples`, r);
}
for (const [id, f] of Object.entries(state.factions || {})) pushText(`ledger/state.yaml factions.${id}.reason`, f.reason);
for (const [id, g] of Object.entries(state.gems || {})) {
  if (!g.revealed) pushText(`ledger/state.yaml gems.${id}.location`, g.location);
  pushText(`ledger/state.yaml gems.${id}.known_by`, g.known_by);
}

const norm = (s) =>
  s.toLowerCase()
    .replace(/[*_`>"“”'’]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^(?:[-+•]|\d+[.)])\s+/, "") // leading list markers
    .replace(/[.!?:;,]+$/, ""); // trailing punctuation
const haystack = norm(JSON.stringify(out));
for (const [label, text] of privateTexts) {
  const pieces = text.split(/(?<=[.!?:;])\s+|\n+|—|\s-\s/).map(norm).filter((x) => x.length >= 28);
  for (const piece of pieces) {
    if (haystack.includes(piece)) errors.push(`LEAK: private text from ${label} appears in map data: "${piece.slice(0, 80)}…"`);
  }
}
const FORBIDDEN_KEYS = ["outcome", "ripples", "reason", "known_by", "changes", "standing"];
JSON.stringify(out, (k, v) => { if (FORBIDDEN_KEYS.includes(k)) errors.push(`LEAK: private key "${k}" in map data`); return v; });

if (errors.length) {
  console.error("\nBuild failed:\n" + errors.map((e) => "  • " + e).join("\n") + "\n");
  process.exit(1);
}
writeFileSync(p("map/data.json"), JSON.stringify(out, null, 2) + "\n");
const played = out.sessions.filter((s) => s.status === "played").length;
console.log(`map/data.json written: ${out.sessions.length} sessions (${played} played), next: ${out.next_session ?? "none"}. Leak check passed.`);
