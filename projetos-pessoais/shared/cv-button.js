(function(){
  try {
    const container = document.createElement('div');
    container.className = 'cv-menu-wrapper';

    const link = document.createElement('a');
    link.className = 'cv-menu-btn';
    // paths to try (project pages are at projetos-pessoais/<project>/index.html)
    link.href = '../../index.html';
    link.title = 'Ir para o meu CV';
    link.textContent = '📄 Meu CV';

    container.appendChild(link);
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(container);
    });
  } catch (e) {
    // silent
  }
})();
