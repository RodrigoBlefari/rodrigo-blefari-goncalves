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

  iniciar(escopo = window) {
    escopo.addEventListener("keydown", this._aoPressionar);
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
    this.pressionadas.add(codigo);
    this.disparos.add(codigo);
  }

  _aoSoltar(evento) {
    const codigo = evento.code;
    this.pressionadas.delete(codigo);
  }
}
