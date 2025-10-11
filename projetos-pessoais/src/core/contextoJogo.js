export class ContextoJogo {
  constructor({ canvas, configuracao }) {
    this.canvas = canvas;
    this.contexto = canvas.getContext("2d");
    this.configuracao = configuracao;
    this.sistemas = new Map();
    this.dados = new Map();
  }

  registrarSistema(nome, sistema) {
    this.sistemas.set(nome, sistema);
    if (typeof sistema.definirContexto === "function") {
      sistema.definirContexto(this);
    }
    return sistema;
  }

  obterSistema(nome) {
    return this.sistemas.get(nome);
  }

  armazenarDado(chave, valor) {
    this.dados.set(chave, valor);
  }

  obterDado(chave) {
    return this.dados.get(chave);
  }
}
