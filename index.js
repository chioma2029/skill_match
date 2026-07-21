/* ============================================================
   Skill Match — script.js
   This file makes the page interactive. It is split into two
   parts:
     1. The mobile menu button (used on every page)
     2. The AI Assistant (only exists on the home page)
   Read the comments above each block to see what it does.
   ============================================================ */

/* ---- 1. Mobile menu toggle -----------------------------------
   On small screens the navigation links are hidden behind a
   button (the "hamburger" icon). This code shows/hides them
   when that button is clicked. It runs on every page that has
   a #navToggle button, and does nothing if that button isn't
   on the page (so it's safe to include everywhere).
   --------------------------------------------------------------*/
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close the menu automatically once a link is clicked
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---- 2. AI Assistant (home page only) ---------------------------
   The code below only runs if the page actually has the assistant
   panels on it (the "if (findBtn)" check near the bottom makes
   sure of that), so this same script.js file is safe to load on
   the contact page too, where none of these elements exist.
   --------------------------------------------------------------*/

// A small list of open roles the assistant can suggest from.
// In a real product this list would come from a database of live
// job postings — here it's just sample data so the demo works.
const JOBS = [
  { title: 'Software Developer', location: 'Nairobi', tags: ['javascript', 'python', 'react', 'sql', 'git', 'apis', 'coding', 'programming'] },
  { title: 'Marketing Associate', location: 'Mombasa', tags: ['social media', 'content', 'seo', 'campaigns', 'analytics', 'branding', 'copywriting'] },
  { title: 'Data Analyst', location: 'Kisumu', tags: ['excel', 'sql', 'python', 'dashboards', 'statistics', 'reporting', 'data'] },
  { title: 'Customer Support Lead', location: 'Remote', tags: ['communication', 'zendesk', 'conflict resolution', 'leadership', 'crm', 'customer service'] },
  { title: 'Accountant', location: 'Nakuru', tags: ['quickbooks', 'excel', 'reconciliation', 'tax', 'reporting', 'audit', 'bookkeeping'] }
];

// Keeps track of which job the user has picked, so step 2
// (tailoring the CV) knows which role to compare against.
let selectedJob = null;

// Grab references to every element the assistant needs to read
// from or write to. These will be "null" on pages that don't
// have the assistant, which is why everything is wrapped in the
// "if (findBtn)" check further down.
const skillsInput = document.getElementById('skillsInput');
const findBtn = document.getElementById('findBtn');
const suggestionsEl = document.getElementById('suggestions');
const prepHint = document.getElementById('prepHint');
const prepBody = document.getElementById('prepBody');
const selectedRoleName = document.getElementById('selectedRoleName');
const cvInput = document.getElementById('cvInput');
const tailorBtn = document.getElementById('tailorBtn');
const tailorResult = document.getElementById('tailorResult');

// Builds one small rounded "chip" label, e.g. [ python ]
// kind is either 'match' (skill they already have) or 'gap'
// (skill worth adding) — this only changes which CSS class is used.
function chip(label, kind) {
  const cssClass = kind === 'match' ? 'chip-match' : 'chip-gap';
  return `<span class="chip ${cssClass}">${label}</span>`;
}

// Compares the text the user typed against every job's tag list,
// and returns the 3 best matching jobs (most matching tags first).
function matchJobs(rawText) {
  const text = rawText.toLowerCase();
  return JOBS
    .map((job) => ({ ...job, matched: job.tags.filter((tag) => text.includes(tag)) }))
    .filter((job) => job.matched.length > 0)
    .sort((a, b) => b.matched.length - a.matched.length)
    .slice(0, 3);
}

// Draws the suggested job cards on the page, and wires up the
// "Select this role" button on each one.
function renderSuggestions(jobs) {
  if (!jobs.length) {
    suggestionsEl.innerHTML = '<p class="kiosk-hint">No close matches yet — try adding a few skills, like "excel" or "customer service".</p>';
    return;
  }

  suggestionsEl.innerHTML = jobs.map((job, index) => {
    const gaps = job.tags.filter((tag) => !job.matched.includes(tag)).slice(0, 3);
    return `
      <div class="suggestion-card">
        <div class="sc-head">
          <h4>${job.title}</h4>
          <span class="sc-loc">${job.location}</span>
        </div>
        <div class="chip-row">
          ${job.matched.map((tag) => chip(tag, 'match')).join('')}
          ${gaps.map((tag) => chip(tag, 'gap')).join('')}
        </div>
        <button class="btn btn-primary" type="button" data-select="${index}">Select this role</button>
      </div>`;
  }).join('');

  // Attach a click handler to each "Select this role" button
  jobs.forEach((job, index) => {
    suggestionsEl.querySelector(`[data-select="${index}"]`).addEventListener('click', () => {
      selectedJob = job;
      selectedRoleName.textContent = `${job.title} · ${job.location}`;
      prepHint.hidden = true;
      prepBody.hidden = false;
      tailorResult.innerHTML = '';
      cvInput.focus();
    });
  });
}

// Only set up the assistant if its buttons actually exist on
// this page (they only exist on index.html).
if (findBtn) {
  findBtn.addEventListener('click', () => {
    const value = skillsInput.value.trim();
    if (!value) {
      suggestionsEl.innerHTML = '<p class="kiosk-hint">Add a few skills or interests first.</p>';
      return;
    }
    renderSuggestions(matchJobs(value));
  });

  tailorBtn.addEventListener('click', () => {
    if (!selectedJob) return;

    const value = cvInput.value.trim();
    if (!value) {
      tailorResult.innerHTML = '<p class="kiosk-hint">Paste your CV or list a few skills first.</p>';
      return;
    }

    const text = value.toLowerCase();
    const covered = selectedJob.tags.filter((tag) => text.includes(tag));
    const gaps = selectedJob.tags.filter((tag) => !covered.includes(tag));

    const summary = `${selectedJob.title}-ready summary: skilled in ` +
      (covered.slice(0, 3).join(', ') || 'the fundamentals of this role') +
      ', with room to highlight ' +
      (gaps.slice(0, 2).join(' and ') || 'a few more specifics') + '.';

    tailorResult.innerHTML = `
      <h5>Already on your CV</h5>
      <div class="chip-row">${covered.length ? covered.map((tag) => chip(tag, 'match')).join('') : '<span class="kiosk-hint">Nothing matched yet.</span>'}</div>
      <h5>Worth adding</h5>
      <div class="chip-row">${gaps.length ? gaps.map((tag) => chip(tag, 'gap')).join('') : '<span class="kiosk-hint">You cover everything we look for.</span>'}</div>
      <h5>Suggested summary line</h5>
      <p class="tailor-summary">${summary}</p>`;
  });
}