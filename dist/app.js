const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.work-card');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => {item.classList.toggle('selected', item === button); item.setAttribute('aria-pressed', String(item === button));});
  let count = 0;
  cards.forEach(card => {const show = button.dataset.filter === 'all' || card.dataset.category.split(' ').includes(button.dataset.filter); card.hidden = !show; if(show) count++;});
  document.querySelector('#work-count').textContent = `${count} ${count === 1 ? 'piece' : 'pieces'}`;
}));
const menu = document.querySelector('.menu-button');
const sidebar = document.querySelector('.sidebar');
const mobileLayout = matchMedia('(max-width: 760px)');
function syncSidebar(){sidebar.inert=mobileLayout.matches && !sidebar.classList.contains('open');}
function closeMenu(){sidebar.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');syncSidebar();}
mobileLayout.addEventListener('change',closeMenu);
syncSidebar();
menu.addEventListener('click', () => {const open = sidebar.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation');syncSidebar();});
document.addEventListener('click', event => {if(!sidebar.contains(event.target) && !menu.contains(event.target)) closeMenu();});
document.addEventListener('keydown', event => {if(event.key === 'Escape') {closeMenu();menu.focus();}});
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', closeMenu));
const labels = {home:'Welcome',work:'Selected work',services:'Services',approach:'My approach',about:'About me',contact:'Get in touch'};
const observer = new IntersectionObserver(entries => {entries.forEach(entry => {if(entry.isIntersecting){document.querySelector('#current-section').textContent=labels[entry.target.id];document.querySelectorAll('nav a, .services-nav').forEach(link=>{const active=link.hash===`#${entry.target.id}`;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}});},{rootMargin:'-10% 0px -65% 0px',threshold:0});
document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section));
document.querySelector('.services-nav').addEventListener('click', closeMenu);
const themeToggle=document.querySelector('.theme-toggle');
function syncTheme(){const dark=document.documentElement.dataset.theme==='dark';themeToggle.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');themeToggle.querySelector('.theme-label').textContent=dark?'Light':'Dark';document.querySelector('meta[name="theme-color"]').content=dark?'#191919':'#ffffff';}
themeToggle.addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('portfolio-theme',document.documentElement.dataset.theme);}catch{}syncTheme();});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',event=>{try{if(localStorage.getItem('portfolio-theme'))return;}catch{}document.documentElement.dataset.theme=event.matches?'dark':'light';syncTheme();});
syncTheme();

