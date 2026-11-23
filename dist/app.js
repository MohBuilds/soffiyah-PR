// Library filter
const filters = document.querySelectorAll('[data-filter]');
const rows = document.querySelectorAll('.library li');
const status = document.getElementById('lib-status');
filters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  let count = 0;
  filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  rows.forEach(row => {
    const show = filter === 'all' || row.dataset.category.split(' ').includes(filter);
    row.hidden = !show;
    row.classList.remove('in');
    if (show) { count++; void row.offsetWidth; row.classList.add('in'); }
  });
  status.textContent = `Showing ${count} ${count === 1 ? 'sample' : 'samples'}`;
}));

// Current section in the top bar + index highlight
const barN = document.getElementById('current-n');
const barLabel = document.getElementById('current-label');
const indexLinks = document.querySelectorAll('.index a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const s = entry.target;
    barN.textContent = s.dataset.n ? `${s.dataset.n}.` : '';
    barLabel.textContent = s.dataset.label || 'Information for editors';
    indexLinks.forEach(a => {
      if (a.hash === `#${s.id}`) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-35% 0px -60% 0px' });
document.querySelectorAll('#top, .section[id]').forEach(s => observer.observe(s));

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
toggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch {}
  syncTheme();
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  try { if (localStorage.getItem('portfolio-theme')) return; } catch {}
  root.dataset.theme = e.matches ? 'dark' : 'light';
  syncTheme();
});
syncTheme();
