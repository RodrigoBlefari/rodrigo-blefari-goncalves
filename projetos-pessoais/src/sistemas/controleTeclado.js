const MAPA_PADRAO = Object.freeze({
  esquerda: ["ArrowLeft", "KeyA"],
  direita: ["ArrowRight", "KeyD"],
  pulo: ["ArrowUp", "KeyW", "Space"],
  modoObservacao: ["KeyO"],
  reiniciar: ["KeyR"],
});

export class ControleTeclado {
  constructor(mapa = MAPA_PADRAO) {
    this.mapa = mapa;
    this.pressionadas = new Set();
    this.disparos = new Set();
    this._aoPressionar = this._aoPressionar.bind(this);
    this._aoSoltar = this._aoSoltar.bind(this);
  }

  _alvoTexto(elemento) {
    if (!elemento) return false;
    const tag = (elemento.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (elemento.isContentEditable) return true;
    return false;
  }

  iniciar(escopo = window) {
    escopo.addEventListener("keydown", this._aoPressionar, { passive: false });
    escopo.addEventListener("keyup", this._aoSoltar);
  }

  destruir(escopo = window) {
    escopo.removeEventListener("keydown", this._aoPressionar);
    escopo.removeEventListener("keyup", this._aoSoltar);
    this.pressionadas.clear();
    this.disparos.clear();
  }

  estaAtivo(acao) {
    const teclas = this.mapa[acao] || [];
    return teclas.some((codigo) => this.pressionadas.has(codigo));
  }

  foiDisparado(acao) {
    const teclas = this.mapa[acao] || [];
    const houve = teclas.some((codigo) => this.disparos.has(codigo));
    if (houve) {
      teclas.forEach((codigo) => this.disparos.delete(codigo));
    }
    return houve;
  }

  _aoPressionar(evento) {
    const codigo = evento.code;

    // Evita que a barra de espaço/teclas de navegação desçam a página
    // quando estiver jogando (fora de campos de texto)
    const deveBloquearScroll =
      (codigo === "Space" || codigo === "ArrowUp" || codigo === "ArrowDown" || codigo === "PageDown" || codigo === "PageUp") &&
      !this._alvoTexto(evento.target);

    if (deveBloquearScroll) {
      try { evento.preventDefault(); } catch {}
    }

    this.pressionadas.add(codigo);
    this.disparos.add(codigo);
  }

  _aoSoltar(evento) {
    const codigo = evento.code;
    this.pressionadas.delete(codigo);
  }
}
