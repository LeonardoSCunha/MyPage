(function () {
  'use strict';

  /* ============================================================
     TEMA claro/escuro (respeita a preferência do sistema)
     ============================================================ */
  var STORAGE_KEY = 'portfolio-tema';
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
      function readTheme() { try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; } }

  function theme() {
    var saved = readTheme();
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (toggle) toggle.setAttribute('aria-pressed', String(t === 'dark'));
  }
  applyTheme(theme());

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
      applyTheme(next);
    });
  }
  // Acompanha mudanças do sistema quando o usuário ainda não escolheu nada
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!readTheme()) applyTheme(e.matches ? 'dark' : 'light');
  });

  /* ============================================================
     Menu mobile
     ============================================================ */
  var menuToggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    // fecha ao clicar em um link
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  /* ============================================================
     Sombra do header ao rolar + link ativo
     ============================================================ */
  var header = document.querySelector('.site-header');
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    var pos = window.scrollY + 90;
    var current = sections[0];
    sections.forEach(function (sec) { if (sec.offsetTop <= pos) current = sec; });
    links.forEach(function (a) {
      var on = current && a.getAttribute('href') === '#' + current.id;
      a.classList.toggle('active', on);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============================================================
     Fade-in ao rolar (IntersectionObserver)
     ============================================================ */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ============================================================
     Formulário → abre o app de e-mail (sem backend)
     ============================================================ */
  var form = document.getElementById('contact-form');
  var EMAIL_DESTINO = 'leonardosantosdacunha@gmail.com'; // edite se necessário
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = document.getElementById('nome').value.trim();
      var email = document.getElementById('email').value.trim();
      var msg = document.getElementById('mensagem').value.trim();
      if (!nome || !email || !msg) return;
      var assunto = encodeURIComponent('Contato pelo site — ' + nome);
      var corpo = encodeURIComponent('Nome: ' + nome + '\nE-mail: ' + email + '\n\n' + msg);
      window.location.href = 'mailto:' + EMAIL_DESTINO + '?subject=' + assunto + '&body=' + corpo;
    });
  }
/* ============================================================
   Copiar e-mail / telefone
   ============================================================ */
var toast = document.createElement('div');
toast.className = 'toast';
toast.setAttribute('role', 'status');
toast.setAttribute('aria-live', 'polite');
document.body.appendChild(toast);
var toastTimer;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2000);
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  return new Promise(function (resolve, reject) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); }
    document.body.removeChild(ta);
  });
}

document.querySelectorAll('[data-copy]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    copyText(btn.getAttribute('data-copy'))
      .then(function () { showToast(btn.getAttribute('data-msg') || 'Copiado!'); })
      .catch(function () { showToast('Não foi possível copiar'); });
  });
});
  /* ============================================================
     Ano no rodapé
     ============================================================ */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
