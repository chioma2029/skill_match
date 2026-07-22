function openPopup(name, story, skills, job, company) {
    document.getElementById('popupName').textContent = name;
    document.getElementById('popupStory').textContent = story;
    document.getElementById('popupSkills').textContent = skills;
    document.getElementById('popupJob').textContent = job;
    document.getElementById('popupCompany').textContent = company;
    document.getElementById('popupOverlay').classList.add('active');
}

function closePopup() {
    document.getElementById('popupOverlay').classList.remove('active');
}

document.getElementById('popupOverlay').addEventListener('click', function (event) {
    if (event.target === this) {
        closePopup();
    }
});

const storyCards = document.querySelectorAll('.story-card');
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        filterButtons.forEach(function (btn) {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');
        storyCards.forEach(function (card) {
            const matches = filter === 'all' || card.getAttribute('data-category') === filter;
            card.classList.toggle('is-hidden', !matches);
        });
    });
});

storyCards.forEach(function (card) {
    card.addEventListener('click', function () {
        openPopup(
            card.getAttribute('data-name'),
            card.getAttribute('data-story'),
            card.getAttribute('data-skills'),
            card.getAttribute('data-job'),
            card.getAttribute('data-company')
        );
    });
});

const themeToggle = document.getElementById('themeToggle');
const themeLabel = themeToggle.querySelector('.theme-label');

function setTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    const isDark = theme === 'dark';
    themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    localStorage.setItem('skillMatchTheme', theme);
}

setTheme(localStorage.getItem('skillMatchTheme') || 'light');
themeToggle.addEventListener('click', function () {
    setTheme(document.body.classList.contains('dark-theme') ? 'light' : 'dark');
});
