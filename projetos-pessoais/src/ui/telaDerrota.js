export class TelaDerrota {
  constructor(elementoRaiz, aoReiniciar) {
    this.elementoRaiz = elementoRaiz;
    this.aoReiniciar = aoReiniciar;
    this._montar();
  }

  _montar() {
    if (!this.elementoRaiz) {
      return;
    }
    this.elementoRaiz.innerHTML = `
      <div>Voce foi atingido. Deseja tentar novamente?</div>
      <button type="button" data-acao="reiniciar">Reiniciar</button>
    `;
    this.elementoRaiz.querySelector("[data-acao='reiniciar']").addEventListener("click", () => {
      this.ocultar();
      if (this.aoReiniciar) {
        this.aoReiniciar();
      }
    });
  }

  exibir() {
    if (this.elementoRaiz) {
      this.elementoRaiz.classList.remove("oculto");
    }
  }

  ocultar() {
    if (this.elementoRaiz) {
      this.elementoRaiz.classList.add("oculto");
    }
  }
}
