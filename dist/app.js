const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const canTransition = () => 'startViewTransition' in document && !reduceMotion.matches;

// Library filter: rows glide to their new places
const filters = document.querySelectorAll('[data-filter]');
const rows = [...document.querySelectorAll('.library li')];
const status = document.getElementById('lib-status');
function applyFilter(button) {
  const filter = button.dataset.filter;
  let count = 0;
  filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  rows.forEach(row => {
    const show = filter === 'all' || row.dataset.category.split(' ').includes(filter);
    row.hidden = !show;
    if (show) count++;
  });
  status.textContent = `Showing ${count} ${count === 1 ? 'sample' : 'samples'}`;
}
filters.forEach(button => button.addEventListener('click', () => {
  if (button.getAttribute('aria-pressed') === 'true') return;
  if (!canTransition()) return applyFilter(button);
  rows.forEach((row, i) => { row.style.viewTransitionName = `lib-${i}`; });
  const t = document.startViewTransition(() => applyFilter(button));
  t.finished.finally(() => rows.forEach(row => { row.style.viewTransitionName = ''; }));
}));

// Library preview: show her own line from the sample on hover or keyboard focus
const peek = document.querySelector('.peek');
const peekText = peek?.querySelector('.peek-text');
const library = document.getElementById('library');
const canPeek = matchMedia('(hover: hover) and (min-width: 981px)');
let peekTimer;
function showPeek(link) {
  if (!peek || !canPeek.matches) return;
  clearTimeout(peekTimer);
  peekTimer = setTimeout(() => {
    const row = link.getBoundingClientRect();
    const box = library.getBoundingClientRect();
    peekText.textContent = link.dataset.excerpt;
    peek.querySelector('.peek-src').textContent = link.dataset.source || 'Google Docs';
    peek.style.setProperty('--peek-y', `${Math.round(row.bottom - box.top + 6)}px`);
    peek.classList.add('show');
  }, peek.classList.contains('show') ? 0 : 140);
}
function hidePeek() { clearTimeout(peekTimer); peek?.classList.remove('show'); }
document.querySelectorAll('.library a[data-excerpt]').forEach(link => {
  link.addEventListener('pointerenter', () => showPeek(link));
  link.addEventListener('focus', () => showPeek(link));
  link.addEventListener('blur', hidePeek);
});
document.querySelector('.library')?.addEventListener('pointerleave', hidePeek);
filters.forEach(b => b.addEventListener('click', hidePeek));

// Current section in the top bar + index highlight
const barN = document.getElementById('current-n');
const barLabel = document.getElementById('current-label');
const indexLinks = document.querySelectorAll('.index a');
function setBar(n, label) {
  if (barLabel.textContent === label) return;
  barN.textContent = n;
  barLabel.textContent = label;
  if (!reduceMotion.matches) {
    [barN, barLabel].forEach(el => el.animate(
      [{ opacity: 0, transform: 'translateY(8px)', filter: 'blur(3px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
      { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' }
    ));
  }
}
const tracked = [...document.querySelectorAll('#top, .section[id]')];
const inBand = new Set();
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.isIntersecting ? inBand.add(entry.target) : inBand.delete(entry.target));
  const s = tracked.filter(el => inBand.has(el)).pop();
  if (!s) return;
  setBar(s.dataset.n ? `${s.dataset.n}.` : '', s.dataset.label || 'Information for editors');
  indexLinks.forEach(a => {
    if (a.hash === `#${s.id}`) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
}, { rootMargin: '-35% 0px -60% 0px' });
tracked.forEach(s => observer.observe(s));

// Sections and creases reveal once as they arrive
const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('seen');
    reveal.unobserve(entry.target);
  });
}, { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('.section, .crease').forEach(el => reveal.observe(el));

// Quotes ink in word by word as the reader moves down the page
const quotes = [...document.querySelectorAll('.quote p')].map(p => {
  const words = p.textContent.trim().split(/\s+/);
  const text = p.textContent.trim();
  p.innerHTML = `<span class="sr">${text}</span>` + words.map(w => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
  return { el: p, words: [...p.querySelectorAll('.w')] };
});
const bar = document.querySelector('.bar');
let ticking = false;
function onScroll() {
  ticking = false;
  const vh = innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  bar.style.setProperty('--progress', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
  quotes.forEach(({ el, words }) => {
    const top = el.getBoundingClientRect().top;
    // starts inking when the quote enters the lower fifth, finished by mid-screen
    const p = reduceMotion.matches ? 1 : Math.min(1, Math.max(0, (vh * 0.88 - top) / (vh * 0.4)));
    const lit = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < lit));
  });
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);
onScroll();

// Copy email
const copy = document.querySelector('.copy');
copy?.addEventListener('click', async () => {
  const label = copy.querySelector('.copy-label');
  try {
    await navigator.clipboard.writeText(copy.dataset.email);
    label.textContent = 'Copied';
    copy.classList.add('done');
  } catch {
    label.textContent = 'Select the address below';
  }
  setTimeout(() => { label.textContent = 'Copy address'; copy.classList.remove('done'); }, 2200);
});

// Theme
const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const meta = document.querySelector('meta[name="theme-color"]');
function syncTheme() {
  const dark = root.dataset.theme === 'dark';
  toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  meta.content = dark ? '#0c0d0f' : '#eceef0';
}
function flipTheme() {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch {}
  syncTheme();
}
// Theme switch wipes outward from the toggle
toggle.addEventListener('click', () => {
  if (!canTransition()) return flipTheme();
  const r = toggle.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.classList.add('theme-switching');
  const t = document.startViewTransition(flipTheme);
  t.ready.then(() => root.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
    { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)', pseudoElement: '::view-transition-new(root)' }
  ));
  t.finished.finally(() => root.classList.remove('theme-switching'));
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  try { if (localStorage.getItem('portfolio-theme')) return; } catch {}
  root.dataset.theme = e.matches ? 'dark' : 'light';
  syncTheme();
});
syncTheme();
