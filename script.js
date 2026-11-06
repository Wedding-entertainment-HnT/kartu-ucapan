/* ====== UBAH DI SINI ====== */
const CONFIG = {
  to: "Sayang",                       // nama / panggilan dia
  from: "yang menyayangimu",          // tanda tangan, mis. "Hizul"
  typed: "Dan aku sungguh-sungguh. Aku akan berusaha menjadi pasangan hidupmu, selamanya."
};
/* ========================== */

const $ = s => document.querySelector(s);
document.querySelectorAll("[data-to]").forEach(e => e.textContent = CONFIG.to);
document.querySelectorAll("[data-from]").forEach(e => e.textContent = CONFIG.from);

const bgm = $("#bgm"), vid = $("#vid"), btn = $("#music");
let musicOn = false;
const setMusic = on => { musicOn = on; btn.classList.toggle("on", on); btn.classList.toggle("off", !on); on ? bgm.play().catch(() => {}) : bgm.pause(); };
btn.onclick = () => setMusic(!musicOn);
vid.onplay = () => { if (musicOn) bgm.pause(); };
vid.onpause = vid.onended = () => { if (musicOn) bgm.play().catch(() => {}); };
vid.onerror = () => { vid.hidden = true; $("#vnote").hidden = false; };

$("#open").onclick = () => {
  $("#gate").classList.add("out");
  $("#card").hidden = false;
  requestAnimationFrame(() => $("#card").classList.add("show"));
  btn.hidden = false; bgm.volume = .7; setMusic(true);
  burst(innerWidth / 2, innerHeight / 2, 60);
  let i = 0; const t = $("#typed");
  setTimeout(function type() { if (i < CONFIG.typed.length) { t.textContent += CONFIG.typed[i++]; setTimeout(type, 55); } }, 2200);
};

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .3 });
document.querySelectorAll(".r").forEach((e, n) => { e.style.transitionDelay = (n % 4) * .15 + "s"; io.observe(e); });

/* ====== Kelopak, hati & ledakan cinta ====== */
const c = $("#fx"), x = c.getContext("2d"), cols = ["#f6cfd6", "#e88aa5", "#e3b48f", "#ffd9e2"];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let W, H, D, P = [], B = [];
function size() { D = devicePixelRatio || 1; W = c.width = innerWidth * D; H = c.height = innerHeight * D; }
addEventListener("resize", size); size();
const mk = init => ({ x: Math.random() * W, y: init ? Math.random() * H : -30 * D, s: (7 + Math.random() * 13) * D, v: (.4 + Math.random() * .9) * D, w: Math.random() * 6.3, r: Math.random() * 6.3, c: cols[Math.random() * 4 | 0], h: Math.random() < .35 });
for (let i = 0; i < 38; i++) P.push(mk(true));
function shape(p) {
  x.fillStyle = p.c; x.beginPath();
  if (p.h) { const s = p.s; x.moveTo(0, s * .3); x.bezierCurveTo(-s, -s * .4, -s * .3, -s, 0, -s * .35); x.bezierCurveTo(s * .3, -s, s, -s * .4, 0, s * .3); }
  else x.ellipse(0, 0, p.s * .35, p.s * .6, 0, 0, 7);
  x.fill();
}
function burst(px, py, n) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.3, v = (2 + Math.random() * 7) * D; B.push({ x: px * D, y: py * D, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: (6 + Math.random() * 12) * D, r: a, c: cols[i % 4], h: true, life: 1 }); } }
$("#again").onclick = e => burst(e.clientX, e.clientY, 80);
document.addEventListener("click", e => { if ($("#card").classList.contains("show")) burst(e.clientX, e.clientY, 10); });
function frame() {
  x.clearRect(0, 0, W, H); x.globalAlpha = .75;
  for (const p of P) {
    p.y += p.v; p.w += .02; p.x += Math.sin(p.w) * .8 * D; p.r += .015;
    if (p.y > H + 30 * D) Object.assign(p, mk(false));
    x.save(); x.translate(p.x, p.y); x.rotate(p.r); shape(p); x.restore();
  }
  B = B.filter(b => b.life > 0);
  for (const b of B) {
    b.x += b.vx; b.y += b.vy; b.vy += .12 * D; b.vx *= .985; b.life -= .012; b.r += .05;
    x.globalAlpha = Math.max(b.life, 0); x.save(); x.translate(b.x, b.y); x.rotate(b.r * .2); shape(b); x.restore();
  }
  if (!reduce) requestAnimationFrame(frame);
}
frame();
