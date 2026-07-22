document.querySelectorAll('.portal-card').forEach((card) => {
  const toggleButtons = card.querySelectorAll('.toggle-btn');
  const form = card.querySelector('.portal-form');
  const dashboard = card.querySelector('.dashboard-panel');
  const submitBtn = card.querySelector('.submit-btn');
  const title = card.querySelector('.form-title');
  const hint = card.querySelector('.form-hint');

  if (!toggleButtons.length || !form || !dashboard || !submitBtn) return;

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      toggleButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const isSignup = button.dataset.mode === 'signup';
      const role = card.dataset.role === 'employer' ? 'employer' : 'candidate';

      title.textContent = isSignup ? `Create ${role === 'employer' ? 'an employer' : 'a candidate'} account` : `Welcome back, ${role}`;
      hint.textContent = isSignup
        ? `Start posting ${role === 'employer' ? 'jobs and roles' : 'your profile and skills'}.`
        : role === 'employer'
          ? 'Log in to manage your roles and applications.'
          : 'Access your profile and matching opportunities.';
      submitBtn.textContent = isSignup
        ? role === 'employer' ? 'Create employer account' : 'Create candidate profile'
        : role === 'employer' ? 'Open employer dashboard' : 'Open candidate dashboard';
    });
  });

  submitBtn.addEventListener('click', () => {
    form.style.display = 'none';
    dashboard.classList.add('active');
    submitBtn.style.display = 'none';
  });
});
