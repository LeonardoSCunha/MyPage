/* Carregado no <head> (sem defer): roda antes da pintura para evitar flash de tema
   e manter o conteúdo visível caso o JS falhe. */
document.documentElement.classList.add('js');

(function () {
  try {
    var s = localStorage.getItem('portfolio-tema');
    var d = (s === 'light' || s === 'dark') ? s
      : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', d);
  } catch (e) {}
})();
