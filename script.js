const env = document.getElementById('env');
const box = document.getElementById('hearts');
const HEART = '<svg viewBox="0 0 24 24"><path fill="#e5173f" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
let opened = false;
const small = innerWidth < 600;   // موبايل؟

// نجوم الخلفية
const stars = document.getElementById('stars');
for (let i = 0; i < (small ? 40 : 70); i++) {
  const s = document.createElement('i');
  s.className = 'star';
  s.style.left = Math.random() * 100 + '%';
  s.style.top = Math.random() * 100 + '%';
  s.style.setProperty('--t', (2 + Math.random() * 4) + 's');
  s.style.setProperty('--d', (-Math.random() * 5) + 's');
  stars.appendChild(s);
}

function origin() {
  const r = env.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height * 0.4 };
}

function heart(x, y, kind) {
  const h = document.createElement('div');
  h.className = 'heart ' + kind;
  const size = (small ? 12 : 16) + Math.random() * (small ? 20 : 34);
  h.style.width = h.style.height = size + 'px';
  h.style.left = x + 'px';
  h.style.top = y + 'px';
  h.style.setProperty('--bd', (-Math.random()) + 's');
  h.innerHTML = HEART;
  const W = innerWidth, H = innerHeight;
  if (kind === 'burst') {
    const a = Math.random() * Math.PI * 2;
    const d = Math.max(W, H) * (0.3 + Math.random() * 0.7);
    h.style.setProperty('--dx', Math.cos(a) * d + 'px');
    h.style.setProperty('--dy', Math.sin(a) * d - 80 + 'px');
    h.style.setProperty('--rot', (Math.random() * 120 - 60) + 'deg');
    h.style.setProperty('--dur', (2.6 + Math.random() * 2.6) + 's');
  } else {
    h.style.setProperty('--dy', -(y * (0.6 + Math.random() * 0.5)) + 'px');
    h.style.setProperty('--sway', (30 + Math.random() * 90) + 'px');
    h.style.setProperty('--dur', (4.5 + Math.random() * 3) + 's');
  }
  box.appendChild(h);
  h.addEventListener('animationend', e => { if (e.target === h) h.remove(); });
}

function sparks(x, y) {
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('i');
    s.className = 'spark';
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    const a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 90;
    s.style.setProperty('--dx', Math.cos(a) * d + 'px');
    s.style.setProperty('--dy', Math.sin(a) * d + 'px');
    box.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
}

function ring(x, y) {
  const r = document.createElement('div');
  r.className = 'ring';
  r.style.left = x + 'px';
  r.style.top = y + 'px';
  document.body.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

function openEnvelope() {
  if (opened) return;
  opened = true;
  env.classList.add('open');
  document.body.classList.add('opened');
  env.setAttribute('aria-label', 'الظرف مفتوح');
  const o = origin();

  // الختم ينكسر: موجات + شرارات
  ring(o.x, o.y);
  setTimeout(() => ring(o.x, o.y), 250);
  setTimeout(() => ring(o.x, o.y), 500);
  sparks(o.x, o.y);

  // الرسالة بتصير قدام الظرف بعد ما تطلع
  setTimeout(() => env.classList.add('front'), 1500);

  // انفجار القلوب
  setTimeout(() => {
    const p = origin();
    for (let i = 0; i < (small ? 35 : 70); i++) setTimeout(() => heart(p.x, p.y, 'burst'), i * 30);
  }, 500);

  // قلوب عايمة باستمرار
  setTimeout(() => setInterval(() => {
    const p = origin();
    heart(p.x + (Math.random() - .5) * (small ? 90 : 140), p.y, 'drift');
  }, small ? 380 : 260), 1500);
}

env.addEventListener('click', openEnvelope);

// بعد الفتح: كل كبسة بتطلع قلوب وشرارات
document.addEventListener('pointerdown', e => {
  if (!opened) return;
  sparks(e.clientX, e.clientY);
  for (let i = 0; i < 6; i++) heart(e.clientX, e.clientY, 'burst');
});
