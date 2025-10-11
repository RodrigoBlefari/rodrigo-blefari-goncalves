document.addEventListener("DOMContentLoaded", () => {
  const SELECTOR_COLAPSAVEL = "[data-collapsible]";
  const STORAGE_PREFIXO = "redeNeuralRogue_bloco_";
  const ESTADO_ABERTO = "open";
  const ESTADO_FECHADO = "closed";
  let contadorIds = 0;

  const gerarIdBase = (elemento, indiceFallback) => {
    if (elemento.id) {
      return elemento.id.trim();
    }
    if (elemento.dataset.colCollapseId) {
      return elemento.dataset.colCollapseId;
    }
    const titulo = (elemento.dataset.title || "").trim();
    if (titulo) {
      const normalizado = titulo
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (normalizado) {
        elemento.dataset.colCollapseId = normalizado;
        return normalizado;
      }
    }
    const novoId = `bloco-${Date.now().toString(36)}-${contadorIds++}-${indiceFallback}`;
    elemento.dataset.colCollapseId = novoId;
    return novoId;
  };

  const obterTitulo = (elemento, indiceFallback) => {
    const tituloDataset = (elemento.dataset.title || "").trim();
    if (tituloDataset) {
      return tituloDataset;
    }
    const heading = elemento.querySelector("h1, h2, h3, h4, h5, h6");
    if (heading?.textContent) {
      return heading.textContent.trim();
    }
    return `Bloco ${indiceFallback + 1}`;
  };

  const aplicarEstado = (section, toggle, conteudo, aberto) => {
    section.classList.toggle("is-open", aberto);
    section.classList.toggle("is-closed", !aberto);
    toggle.setAttribute("aria-expanded", aberto ? "true" : "false");
    conteudo.hidden = !aberto;
  };

  const salvarEstado = (chave, aberto) => {
    try {
      sessionStorage.setItem(chave, aberto ? ESTADO_ABERTO : ESTADO_FECHADO);
    } catch (erro) {
      console.warn("Nao foi possivel salvar o estado do bloco:", erro);
    }
  };

  const lerEstado = (chave) => {
    try {
      return sessionStorage.getItem(chave);
    } catch (erro) {
      console.warn("Nao foi possivel ler o estado do bloco:", erro);
      return null;
    }
  };

  const prepararBloco = (section, indiceFallback = 0) => {
    if (!(section instanceof HTMLElement)) {
      return;
    }
    if (section.dataset.collapsibleReady === "1") {
      return;
    }
    section.dataset.collapsibleReady = "1";

    const baseId = gerarIdBase(section, indiceFallback);
    const titulo = obterTitulo(section, indiceFallback);
    const storageKey = `${STORAGE_PREFIXO}${baseId}`;

    const headingOriginal = section.querySelector("h1, h2, h3, h4, h5, h6");
    if (headingOriginal) {
      headingOriginal.classList.add("visually-hidden");
    }

    const toggleHeader = document.createElement("h2");
    toggleHeader.className = "collapsible__header";

    const botaoToggle = document.createElement("button");
    botaoToggle.type = "button";
    botaoToggle.className = "collapsible__toggle";
    botaoToggle.innerHTML = `<span>${titulo}</span><span class="collapsible__icon" aria-hidden="true"></span>`;

    const conteudo = document.createElement("div");
    conteudo.className = "collapsible__content";
    const conteudoId = `${baseId}-conteudo`;
    conteudo.id = conteudoId;

    botaoToggle.setAttribute("aria-controls", conteudoId);

    const filhosOriginais = Array.from(section.childNodes);

    toggleHeader.appendChild(botaoToggle);
    section.prepend(toggleHeader);
    section.insertBefore(conteudo, toggleHeader.nextSibling);

    filhosOriginais.forEach((node) => {
      if (node === toggleHeader || node === conteudo) {
        return;
      }
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
        return;
      }
      if (node === headingOriginal) {
        conteudo.appendChild(node);
      } else {
        conteudo.appendChild(node);
      }
    });

    const estadoSalvo = lerEstado(storageKey);
    const abertoInicial = estadoSalvo ? estadoSalvo === ESTADO_ABERTO : false;
    aplicarEstado(section, botaoToggle, conteudo, abertoInicial);
    if (!estadoSalvo) {
      salvarEstado(storageKey, false);
    }

    const alternar = () => {
      const estaAberto = section.classList.contains("is-open");
      const proximo = !estaAberto;
      aplicarEstado(section, botaoToggle, conteudo, proximo);
      salvarEstado(storageKey, proximo);
    };

    botaoToggle.addEventListener("click", (evento) => {
      evento.preventDefault();
      alternar();
    });
  };

  const prepararTodos = () => {
    const blocos = document.querySelectorAll(SELECTOR_COLAPSAVEL);
    blocos.forEach((section, indice) => prepararBloco(section, indice));
  };

  prepararTodos();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }
        if (node.matches?.(SELECTOR_COLAPSAVEL)) {
          prepararBloco(node, contadorIds++);
        } else {
          const internos = node.querySelectorAll?.(SELECTOR_COLAPSAVEL);
          internos?.forEach((section) => prepararBloco(section, contadorIds++));
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
