// UI v2 - Preferências de Tema e Modal de Introdução
// - Persistência de tema em localStorage
// - Seletor de tema sincronizado com body[data-theme]
// - Modal introdutório com "lembrar por 7 dias"
// - Eventos customizados: window dispatch 'ui:theme-change'
(() => {
  const THEME_KEY = "rr_theme";
  const INTRO_HIDE_UNTIL_KEY = "rr_intro_hide_until";
  const DEFAULT_THEME = "neon";

  const qs = (sel, scope = document) => scope.querySelector(sel);
  const qsa = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

  function applyTheme(theme) {
    try {
      if (!theme) theme = DEFAULT_THEME;
      document.body.dataset.theme = theme;
      const select = qs("#themeSelect");
      if (select && select.value !== theme) {
        select.value = theme;
      }
      // Evento para que outros módulos possam reagir a troca de tema
      window.dispatchEvent(new CustomEvent("ui:theme-change", { detail: { theme } }));
      // Persistir
      localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
      console.warn("Falha ao aplicar o tema:", err);
    }
  }

  function initTheme() {
    const stored = safeGetLocal(THEME_KEY);
    const initial = stored || document.body.dataset.theme || DEFAULT_THEME;
    applyTheme(initial);

    const select = qs("#themeSelect");
    if (select) {
      select.value = initial;
      select.addEventListener("change", () => {
        applyTheme(select.value);
      });
    }
  }

  function safeGetLocal(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function shouldShowIntroModal() {
    try {
      const until = parseInt(localStorage.getItem(INTRO_HIDE_UNTIL_KEY) || "0", 10);
      if (!until) return true;
      return Date.now() > until;
    } catch {
      return true;
    }
  }

  function openIntroModal() {
    const modal = qs("#gameIntroModal");
    if (!modal) return;

    const backdrop = qs("[data-modal-backdrop]", modal);
    const closeBtn = qs("[data-modal-close]", modal);
    const acceptBtn = qs("[data-modal-accept]", modal);
    const rememberChk = qs("#gameIntroModalRemember", modal);

    // Tornar visível
    modal.classList.add("is-open");
    modal.removeAttribute("hidden");
    document.body.classList.add("modal-open");

    const close = (persist = false) => {
      try {
        if (persist && rememberChk?.checked) {
          const sevenDays = 7 * 24 * 60 * 60 * 1000;
          localStorage.setItem(INTRO_HIDE_UNTIL_KEY, String(Date.now() + sevenDays));
        }
      } catch {
        // ignore storage errors
      }
      modal.classList.remove("is-open");
      document.body.classList.remove("modal-open");
      modal.setAttribute("hidden", "");
      detach();
    };

    const onEsc = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(false);
      }
    };

    const onBackdrop = (e) => {
      if (e.target === backdrop) {
        close(false);
      }
    };

    function detach() {
      document.removeEventListener("keydown", onEsc);
      backdrop?.removeEventListener("click", onBackdrop);
      closeBtn?.removeEventListener("click", onClose);
      acceptBtn?.removeEventListener("click", onAccept);
    }

    const onClose = () => close(false);
    const onAccept = () => close(true);

    document.addEventListener("keydown", onEsc);
    backdrop?.addEventListener("click", onBackdrop);
    closeBtn?.addEventListener("click", onClose);
    acceptBtn?.addEventListener("click", onAccept);
  }

  // API simples para uso externo
  window.UI = Object.assign(window.UI || {}, {
    setTheme: (theme) => applyTheme(theme),
    getTheme: () => document.body.dataset.theme || DEFAULT_THEME,
    showIntro: () => openIntroModal(),
  });

  // Inicialização
  document.addEventListener("DOMContentLoaded", () => {
    // Garante classes de UI v2
    document.body.classList.add("ui-v2");
    if (!document.body.dataset.theme) {
      document.body.dataset.theme = DEFAULT_THEME;
    }

    initTheme();

    if (shouldShowIntroModal()) {
      openIntroModal();
    }
  });
})();
