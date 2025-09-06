//  Scroll spy (active nav link) 
const links = [...document.querySelectorAll('#menu a[href^="#"]')];
const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

const spy = new IntersectionObserver(
    entries => {
        entries.forEach(e => {
            const id = '#' + e.target.id;
            const link = links.find(l => l.getAttribute('href') === id);
            if (!link) return;
            if (e.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0.01 }
);

sections.forEach(s => spy.observe(s));

//  Reveal on scroll 
const revealIO = new IntersectionObserver(
    entries => {
        for (const e of entries) {
            if (e.isIntersecting) {
                e.target.setAttribute('data-inview', 'true');
                revealIO.unobserve(e.target);
            }
        }
    },
    { threshold: 0.12 }
);
document.querySelectorAll('.observe').forEach(el => revealIO.observe(el));

//  Contact form (demo only) 
const form = document.getElementById('contactForm');
const status = document.getElementById('status');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        if (!data.name || !data.email || !data.message) {
            status.textContent = 'Please fill in all fields.';
            return;
        }
        status.textContent = 'Thanks! Your message has been staged locally (phase 1).';
        form.reset();
    });
}
//  Theme (Light/Dark) 
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

function detectInitialTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode) {
    root.setAttribute('data-theme', mode);
    if (themeBtn) {
        themeBtn.textContent = mode === 'dark' ? 'Dark' : 'Light';
        themeBtn.setAttribute('aria-pressed', String(mode === 'dark'));
    }
}

function toggleTheme() {
    const current = root.getAttribute('data-theme') || detectInitialTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
}

applyTheme(detectInitialTheme());
const mql = window.matchMedia('(prefers-color-scheme: dark)');
mql.addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});
if (themeBtn) themeBtn.addEventListener('click', toggleTheme);