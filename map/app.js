// Calderra player map. Reads data.json (generated from the ledger; player-safe)
// and map.config.json (map image, pins, labels). No build step.

const NS = "http://www.w3.org/2000/svg";
const W = 1000, H = 700; // viewBox; config uses percentages of this
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const tok = (n) => `var(--${n})`;

const [data, config] = await Promise.all([
  fetch("data.json", { cache: "no-cache" }).then((r) => r.json()),
  fetch("map.config.json", { cache: "no-cache" }).then((r) => r.json()),
]);

const svg = $("map");
const el = (tag, attrs = {}, parent = svg) => {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  parent.appendChild(n);
  return n;
};
const actName = (id) => (data.acts.find((a) => a.id === id) || { name: id }).name;
const actShort = (id) => actName(id).split(" · ")[0];
const regionByName = Object.fromEntries(data.regions.map((r) => [r.name, r]));

/* ---------- Header ---------- */
$("synced").textContent = "Updated " + new Date(data.generated + "T12:00:00").toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

/* ---------- Map ---------- */
if (config.image) {
  el("rect", { x: 0, y: 0, width: W, height: H, fill: tok("sea") });
  el("image", { href: config.image, x: 0, y: 0, width: W, height: H, preserveAspectRatio: "xMidYMid slice" });
} else {
  drawBuiltInMap();
}
if (config.showRegionLabels !== false) drawLabels();

function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

function drawBuiltInMap() {
  el("rect", { x: 0, y: 0, width: W, height: H, fill: tok("sea") });
  const r = rng(7);
  const waves = el("g", { stroke: tok("muted"), "stroke-width": 1.2, fill: "none", opacity: 0.35 });
  for (let i = 0; i < 46; i++) {
    const x = r() * W, y = r() * H;
    if (x > 80 && x < 880 && y > 70 && y < 640) continue;
    el("path", { d: `M${x} ${y} q6 -5 12 0 t12 0` }, waves);
  }
  const coast = "M 70 300 C 60 240, 110 190, 170 170 C 230 150, 260 110, 330 95 C 400 80, 430 60, 500 62 C 580 64, 620 80, 690 75 C 760 70, 820 95, 850 140 C 880 185, 860 230, 880 270 C 900 310, 905 350, 880 390 C 860 430, 870 470, 830 500 C 790 530, 760 560, 700 575 C 650 590, 620 640, 560 650 C 500 660, 470 620, 420 610 C 360 598, 320 600, 270 570 C 220 540, 200 500, 150 480 C 100 460, 80 420, 72 370 Z";
  el("path", { d: coast, fill: "none", stroke: tok("paper-edge"), "stroke-width": 14, "stroke-linejoin": "round", opacity: 0.6 });
  el("path", { d: coast, fill: tok("paper"), stroke: tok("ink"), "stroke-width": 2 });
  const clip = el("clipPath", { id: "land" });
  el("path", { d: coast }, clip);
  const land = el("g", { "clip-path": "url(#land)" });

  el("rect", { x: 0, y: 0, width: 205, height: H, fill: tok("ink"), opacity: 0.06 }, land);
  for (let i = 0; i < 40; i++) {
    const x = 85 + r() * 115, y = 210 + r() * 260;
    el("path", { d: `M${x - 3} ${y - 3} l6 6 M${x + 3} ${y - 3} l-6 6`, stroke: tok("muted"), "stroke-width": 1, opacity: 0.6 }, land);
  }
  for (let i = 0; i < 60; i++) {
    const x = 225 + r() * 150, y = 240 + r() * 300;
    if (Math.hypot(x - 300, y - 330) < 22 || Math.hypot(x - 268, y - 420) < 22) continue;
    el("circle", { cx: x, cy: y, r: 3 + r() * 2.5, fill: "none", stroke: tok("good"), "stroke-width": 1.2, opacity: 0.7 }, land);
  }
  for (let i = 0; i < 34; i++) {
    const x = 650 + r() * 190, y = 95 + r() * 150, h = 14 + r() * 14;
    if (Math.hypot(x - 760, y - 150) < 26) continue;
    el("path", { d: `M${x - h * 0.7} ${y} L${x} ${y - h} L${x + h * 0.7} ${y}`, fill: tok("paper"), stroke: tok("ink"), "stroke-width": 1.3 }, land);
    el("path", { d: `M${x} ${y - h} L${x + h * 0.25} ${y}`, stroke: tok("ink"), "stroke-width": 0.8, opacity: 0.5 }, land);
  }
  el("path", { d: "M 560 470 C 550 520, 520 560, 500 650 M 560 470 C 570 530, 600 580, 610 640 M 545 560 C 560 600, 540 630, 560 660", fill: "none", stroke: tok("blue"), "stroke-width": 1.4, opacity: 0.55 }, land);
  el("path", { d: "M 700 200 C 650 260, 600 290, 560 330 C 530 370, 570 420, 560 470", fill: "none", stroke: tok("blue"), "stroke-width": 2.2, opacity: 0.6 }, land);
  el("path", { d: "M 330 140 C 400 165, 440 185, 560 190 C 600 192, 640 210, 660 230", fill: "none", stroke: tok("blue"), "stroke-width": 2, opacity: 0.55 }, land);
  const wall = "M 300 110 C 400 95, 520 90, 640 100";
  el("path", { d: wall, fill: "none", stroke: tok("ink"), "stroke-width": 3 }, land);
  el("path", { d: wall, fill: "none", stroke: tok("ink"), "stroke-width": 8, "stroke-dasharray": "3 9", opacity: 0.8 }, land);
  const borders = el("g", { fill: "none", stroke: tok("muted"), "stroke-width": 1.2, "stroke-dasharray": "5 5", opacity: 0.8 }, land);
  ["M 205 160 C 215 280, 195 380, 212 540", "M 625 70 C 640 150, 612 220, 628 270", "M 300 590 C 380 515, 640 515, 735 565", "M 770 230 C 725 330, 745 430, 795 520"]
    .forEach((d) => el("path", { d }, borders));
  el("ellipse", { cx: 515, cy: 360, rx: 125, ry: 98 }, borders);
  el("circle", { cx: 515, cy: 360, r: 9, fill: tok("paper"), stroke: tok("gold"), "stroke-width": 2.5 }, land);
  for (let a = 0; a < 8; a++) {
    const t = (a * Math.PI) / 4;
    el("line", { x1: 515 + Math.cos(t) * 12, y1: 360 + Math.sin(t) * 12, x2: 515 + Math.cos(t) * 18, y2: 360 + Math.sin(t) * 18, stroke: tok("gold"), "stroke-width": 2 }, land);
  }
  const sea = el("g", { "font-family": "IM Fell English, Palatino, Georgia, serif", "font-style": "italic", fill: tok("muted"), "text-anchor": "middle", "font-size": 15 });
  [["The Pale Sea", 900, 600], ["The Western Deep", 70, 620], ["The Northern Reach", 500, 30]].forEach(([t, x, y]) => { el("text", { x, y }, sea).textContent = t; });
  const cp = el("g", { transform: "translate(940 80)" });
  el("circle", { r: 26, fill: "none", stroke: tok("ink"), "stroke-width": 1, opacity: 0.6 }, cp);
  el("path", { d: "M0 -30 L6 0 L0 30 L-6 0 Z", fill: tok("ink"), opacity: 0.8 }, cp);
  el("path", { d: "M-30 0 L0 5 L30 0 L0 -5 Z", fill: tok("ink"), opacity: 0.4 }, cp);
  el("text", { y: -36, "text-anchor": "middle", "font-size": 13, fill: tok("ink"), "font-family": "IM Fell English SC, Georgia, serif" }, cp).textContent = "N";
}

function drawLabels() {
  const lab = el("g", { "font-family": "IM Fell English SC, Palatino, Georgia, serif", fill: tok("ink"), "text-anchor": "middle", "paint-order": "stroke", stroke: tok("paper"), "stroke-width": config.image ? 4 : 0, "stroke-linejoin": "round" });
  (config.regionLabels || []).forEach((l) => {
    el("text", { x: (l.x / 100) * W, y: (l.y / 100) * H, "font-size": l.size || 16, "letter-spacing": 1.5 }, lab).textContent = l.text;
  });
}

/* ---------- Pins ---------- */
const pinLayer = el("g", {});
const pinEls = {};
data.sessions.forEach((s) => {
  const pos = (config.pins || {})[s.id];
  if (!pos) { console.warn(`No pin position for "${s.id}" in map.config.json`); return; }
  const x = (pos.x / 100) * W, y = (pos.y / 100) * H;
  const label = { played: "played", next: "up next", planned: "planned" }[s.status];
  const g = el("g", { class: `pin ${s.status}`, tabindex: 0, role: "button", "aria-label": `${s.number}. ${s.title}, level ${s.level}, ${label}` }, pinLayer);
  el("circle", { cx: x, cy: y, r: 15, class: "ring" }, g);
  el("circle", { cx: x, cy: y, r: 15, class: "body" }, g);
  el("text", { x, y: y + 1 }, g).textContent = s.number;
  g.addEventListener("click", () => select(s.id));
  g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(s.id); } });
  pinEls[s.id] = g;
});

/* ---------- Detail ---------- */
function select(id, { updateHash = true } = {}) {
  const s = data.sessions.find((x) => x.id === id);
  if (!s) return;
  Object.entries(pinEls).forEach(([k, g]) => g.classList.toggle("selected", k === id));
  document.querySelectorAll(".tl-item").forEach((b) => b.classList.toggle("selected", b.dataset.id === id));
  const statusText = { played: "Played", next: "Up next", planned: "Planned" }[s.status];
  const region = regionByName[s.region];
  let html = `<h2>${s.act === "Prologue" ? "Session zero" : "One-shot " + s.number}</h2>
    <h3>${esc(s.title)}</h3>
    <div class="meta">
      <span class="chip status-${s.status}">${statusText}</span>
      <span class="chip">Level ${s.level}</span>
      <span class="chip">${esc(actShort(s.act))}</span>
    </div>
    <p class="label">Where</p><p>${esc(s.location)}</p>`;
  if (region && region.held_by) html += `<p class="region-note">${esc(region.name)} · held by ${esc(region.held_by)}</p>`;
  html += `<p class="label">What kind of night</p><p>${esc(s.genre)} · spotlight: ${esc(s.spotlight)}</p>`;
  if (s.status === "played") {
    html += `<p class="label">What happened</p><p>${esc(s.public_record)}</p>`;
    if (s.date) html += `<p class="label">Played</p><p>${esc(s.date)}</p>`;
    if (s.players.length) html += `<p class="label">Heroes</p><p>${s.players.map(esc).join(", ")}</p>`;
  } else if (s.cold_open) {
    html += `<p class="label">The call</p><p class="cold">“${esc(s.cold_open)}”</p>`;
    if (region && region.rumour) html += `<p class="label">Word on the road</p><p>${esc(region.rumour)}</p>`;
  } else {
    html += `<p class="label">The call</p><p class="sealed">Sealed until ${esc(actShort(s.act))} begins.</p>`;
  }
  $("detail").innerHTML = html;
  if (updateHash) history.replaceState(null, "", "#" + id);
}

/* ---------- Peace ---------- */
const p = data.realm_peace;
$("peace-num").textContent = p + " / 10";
$("peace-word").textContent = p <= 3 ? "On the brink of war" : p <= 6 ? "Uneasy" : "Holding together";
$("meter").innerHTML = Array.from({ length: 10 }, (_, i) => `<i class="${i < p ? "on" : ""}"></i>`).join("");

/* ---------- Factions ---------- */
const REP_CLASS = { Hostile: "rm2", Wary: "rm1", Neutral: "r0", Friendly: "r1", Allied: "r2", Unknown: "rnull" };
$("factions").innerHTML = data.factions.map((f) =>
  `<li><span class="f-name">${esc(f.name)}</span><span class="rep ${REP_CLASS[f.reputation]}">${esc(f.reputation)}</span><span class="f-sub">${esc(f.face)} · ${esc(f.seat)}</span></li>`
).join("");

/* ---------- Gems ---------- */
const gemSvg = (found) => `<svg class="gem ${found ? "found" : "hidden-gem"}" viewBox="0 0 20 20" aria-hidden="true"><polygon points="10,1 18,7 15,18 5,18 2,7" stroke-width="1.5"/></svg>`;
const anyRevealed = data.gems.some((g) => g.revealed);
$("gems").innerHTML = data.gems.map((g) => g.revealed
  ? `<li>${gemSvg(true)}<div><strong>${esc(g.name)}</strong><div class="gem-where">${esc(g.location)}</div></div></li>`
  : `<li>${gemSvg(false)}<div><strong>A lost gem</strong><div class="gem-where">Whereabouts unknown</div></div></li>`).join("")
  + (anyRevealed ? "" : `<li class="gem-where">The Crown shattered into three gems the night the emperor died. None has been found.</li>`);

/* ---------- Timeline ---------- */
$("timeline").innerHTML = data.acts.map((act) => {
  const items = data.sessions.filter((s) => s.act === act.id);
  if (!items.length) return "";
  const lv = [...new Set(items.map((s) => s.level))];
  const range = lv.length > 1 ? `levels ${Math.min(...lv)}–${Math.max(...lv)}` : `level ${lv[0]}`;
  return `<li><div class="act-label">${esc(act.name)} · ${range}</div><div class="act-sessions">${items.map((s) =>
    `<button type="button" class="tl-item ${s.status}" data-id="${s.id}"><span class="tl-num">${s.number}</span><span class="tl-title">${esc(s.title)}</span><span class="tl-lvl">Lv ${s.level}</span></button>`).join("")}</div></li>`;
}).join("");
document.querySelectorAll(".tl-item").forEach((b) => b.addEventListener("click", () => select(b.dataset.id)));

/* ---------- Story so far ---------- */
const played = data.sessions.filter((s) => s.status === "played");
const next = data.sessions.find((s) => s.status === "next");
const paras = [
  data.intro,
  ...played.map((s) => s.public_record).filter(Boolean),
  next ? `The Order of the Dawn Lantern is gathering heroes for its next task: ${next.title}, in ${next.location}.` : "The Council of Banners has met. Calderra's future is decided.",
].filter(Boolean);
$("story").innerHTML = paras.map((t) => `<p>${esc(t)}</p>`).join("");
$("copy-recap").addEventListener("click", () => {
  const done = () => { $("copied").hidden = false; setTimeout(() => ($("copied").hidden = true), 1800); };
  const fallback = () => { const r = document.createRange(); r.selectNodeContents($("story")); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(paras.join("\n\n")).then(done, fallback);
  else fallback();
});

/* ---------- Legacy ---------- */
$("legacy").innerHTML = data.legacy_heroes.length
  ? `<ul class="factions">${data.legacy_heroes.map((h) => `<li><span class="f-name">${esc(h.name)}</span><span class="f-sub">${esc(h.player)} · from ${esc(h.from)}</span></li>`).join("")}</ul>`
  : `<p class="empty">No heroes have retired yet. When a character steps away, they're honoured here and may return as an NPC in a later tale.</p>`;

/* ---------- Initial selection (supports #session-id links) ---------- */
const fromHash = decodeURIComponent(location.hash.slice(1));
select(data.sessions.some((s) => s.id === fromHash) ? fromHash : (next || played.at(-1) || data.sessions[0]).id, { updateHash: false });

/* ---------- Offline / installable ---------- */
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
