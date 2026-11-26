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

document.addEventListener('submit', event => {
  const form = event.target.closest('[data-contact-form]');
  if (!form) return;
  event.preventDefault();

  const values = new FormData(form);
  const english = form.dataset.formLanguage === 'en';
  const topic = values.get('topic');
  const subject = `${english ? 'Website enquiry' : 'Demande depuis le site'} - ${topic}`;
  const body = [
    `${english ? 'Name' : 'Nom'}: ${values.get('name')}`,
    `${english ? 'Email' : 'E-mail'}: ${values.get('email')}`,
    `${english ? 'Phone / WhatsApp' : 'Téléphone / WhatsApp'}: ${values.get('phone') || (english ? 'Not provided' : 'Non renseigné')}`,
    `${english ? 'Topic' : 'Sujet'}: ${topic}`,
    '',
    `${english ? 'Message' : 'Message'}:`,
    values.get('message')
  ].join('\n');

  window.location.href = `mailto:terravisionetudesconseil@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.querySelectorAll('#year, #en-year').forEach(element => {
  element.textContent = new Date().getFullYear();
});

let initialLanguage = 'fr';
try { initialLanguage = localStorage.getItem('terravision-language') || 'fr'; } catch (_) {}
setLanguage(initialLanguage, false);
