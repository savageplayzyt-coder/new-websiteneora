(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('nexora-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') root.dataset.theme = savedTheme;
  const updateThemeLabel = () => {
    const dark = root.dataset.theme === 'dark';
    themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    themeButton.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
    themeButton.querySelector('.theme-icon').textContent = dark ? '☼' : '◐';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#141a17' : '#f6f7f4';
  };
  updateThemeLabel();
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('nexora-theme', root.dataset.theme);
    updateThemeLabel();
  });

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
  };
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    nav.classList.toggle('is-open', !isOpen);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const filters = document.querySelectorAll('.filter-button');
  const cards = document.querySelectorAll('.project-card');
  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter));
  }));

  const quotes = [
    { quote: 'They understood what we were trying to do before we had the words for it. The result felt less like a launch and more like the beginning of what comes next.', name: 'Elena Cruz', role: 'CO-FOUNDER, KINFIELD', initials: 'EC' },
    { quote: 'Nexora made a complicated transformation feel clear, collaborative, and genuinely exciting. Our team is already imagining what we can do next.', name: 'Marcus Lee', role: 'CHIEF OPERATING OFFICER, MERIDIAN', initials: 'ML' },
    { quote: 'The work is thoughtful, the communication is honest, and the impact has been real. They became an extension of our team from day one.', name: 'Priya Nair', role: 'VP OF PRODUCT, ATLAS HEALTH', initials: 'PN' }
  ];
  let quoteIndex = 0;
  const quoteText = document.querySelector('.quote-grid blockquote');
  document.querySelectorAll('[data-quote-step]').forEach(button => button.addEventListener('click', () => {
    quoteIndex = (quoteIndex + Number(button.dataset.quoteStep) + quotes.length) % quotes.length;
    const quote = quotes[quoteIndex];
    quoteText.textContent = quote.quote;
    document.querySelector('.quote-person strong').textContent = quote.name;
    document.querySelector('.quote-person small').textContent = quote.role;
    document.querySelector('.quote-avatar').textContent = quote.initials;
    document.querySelector('.quote-progress-fill').style.width = `${((quoteIndex + 1) / quotes.length) * 100}%`;
  }));

  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const fields = [...form.querySelectorAll('input[required], textarea[required]')];
  const validate = field => {
    const valid = field.checkValidity();
    field.setAttribute('aria-invalid', String(!valid));
    return valid;
  };
  fields.forEach(field => {
    field.addEventListener('blur', () => validate(field));
    field.addEventListener('input', () => {
      if (field.hasAttribute('aria-invalid')) validate(field);
      if (status.classList.contains('error') && fields.every(item => item.checkValidity())) {
        status.textContent = 'We’ll be in touch within two working days.';
        status.className = 'form-status';
      }
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const allValid = fields.map(validate).every(Boolean);
    if (!allValid) {
      status.textContent = 'Please check the highlighted fields and try again.';
      status.className = 'form-status error';
      fields.find(field => !field.checkValidity())?.focus();
      return;
    }
    status.textContent = 'Thanks for your note. This demo is ready to connect to your inbox.';
    status.className = 'form-status success';
    form.reset();
    fields.forEach(field => field.removeAttribute('aria-invalid'));
  });

  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    revealTargets.forEach(target => observer.observe(target));
  } else revealTargets.forEach(target => target.classList.add('is-visible'));
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
