const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const storageKey = 'skillmatch-theme';

function applyTheme(theme) {
    const isLight = theme === 'light';

    body.classList.toggle('light-theme', isLight);

    if (themeToggle) {
        const label = themeToggle.querySelector('.theme-label');
        const icon = themeToggle.querySelector('span[aria-hidden="true"]');

        if (label) {
            label.textContent = isLight ? 'Light mode' : 'Dark mode';
        }

        if (icon) {
            icon.textContent = isLight ? '☀' : '☾';
        }

        themeToggle.setAttribute('aria-pressed', String(isLight));
    }
}

function getInitialTheme() {
    const savedTheme = localStorage.getItem(storageKey);

    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
        localStorage.setItem(storageKey, nextTheme);
        applyTheme(nextTheme);
    });
}
