const languagePanels = {
  fr: document.getElementById('site-fr'),
  en: document.getElementById('site-en')
};

function setLanguage(language, remember = true) {
  const selected = languagePanels[language] ? language : 'fr';
  const panel = languagePanels[selected];

  Object.entries(languagePanels).forEach(([code, element]) => {
    element.hidden = code !== selected;
  });

  document.documentElement.lang = selected;
  document.title = panel.dataset.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = panel.dataset.description;

  document.querySelectorAll('[data-language]').forEach(button => {
    const active = button.dataset.language === selected;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  document.querySelectorAll('.main-nav').forEach(nav => nav.classList.remove('open'));
  document.querySelectorAll('.menu-toggle').forEach(button => {
    button.setAttribute('aria-expanded', 'false');
    button.textContent = '☰';
  });

  if (remember) {
    try { localStorage.setItem('terravision-language', selected); } catch (_) {}
  }
}

document.addEventListener('click', event => {
  const languageButton = event.target.closest('[data-language]');
  if (languageButton) {
    setLanguage(languageButton.dataset.language);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const menuButton = event.target.closest('.menu-toggle');
  if (menuButton) {
    const nav = menuButton.closest('.site-language').querySelector('.main-nav');
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? '×' : '☰';
    return;
  }

  const navLink = event.target.closest('.main-nav a');
  if (navLink) {
    const nav = navLink.closest('.main-nav');
    nav.classList.remove('open');
    const button = nav.closest('.site-language').querySelector('.menu-toggle');
    button.setAttribute('aria-expanded', 'false');
    button.textContent = '☰';
  }
});

document.querySelectorAll('#year, #en-year').forEach(element => {
  element.textContent = new Date().getFullYear();
});

let initialLanguage = 'fr';
try { initialLanguage = localStorage.getItem('terravision-language') || 'fr'; } catch (_) {}
setLanguage(initialLanguage, false);
