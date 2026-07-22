const themeToggle = document.getElementById('themeToggle');
const themeStorageKey = 'skillmatch-theme';

function getStoredTheme() {
  const savedTheme = localStorage.getItem(themeStorageKey) || localStorage.getItem('skillMatchTheme');

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle('light-theme', isLight);
  document.body.classList.toggle('dark-theme', !isLight);

  if (!themeToggle) return;

  const label = themeToggle.querySelector('.theme-label');
  const icon = themeToggle.querySelector('[aria-hidden="true"]');

  if (label) label.textContent = isLight ? 'Dark mode' : 'Light mode';
  if (icon) icon.textContent = isLight ? '\u263e' : '\u2600';

  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  themeToggle.setAttribute('aria-pressed', String(!isLight));
}

applyTheme(getStoredTheme());

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
  localStorage.setItem(themeStorageKey, nextTheme);
  applyTheme(nextTheme);
});
