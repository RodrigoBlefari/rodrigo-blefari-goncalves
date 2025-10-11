export class LoopJogo {
  constructor({ atualizar, desenhar, taxaQuadros }) {
    this.atualizar = atualizar;
    this.desenhar = desenhar;
    this.taxaQuadros = taxaQuadros;
    this.idFrame = null;
    this.rodando = false;
    this.deltaAcumulado = 0;
    this.deltaIdeal = 1 / this.taxaQuadros;
    this.instanteAnterior = 0;
  }

  iniciar() {
    if (this.rodando) {
      return;
    }
    this.rodando = true;
    this.instanteAnterior = performance.now();
    this.deltaAcumulado = 0;
    this._ciclo = this._ciclo.bind(this);
    this.idFrame = requestAnimationFrame(this._ciclo);
  }

  parar() {
    if (!this.rodando) {
      return;
    }
    this.rodando = false;
    if (this.idFrame) {
      cancelAnimationFrame(this.idFrame);
      this.idFrame = null;
    }
  }

  _ciclo(instanteAtual) {
    if (!this.rodando) {
      return;
    }
    const deltaTempo = (instanteAtual - this.instanteAnterior) / 1000;
    this.instanteAnterior = instanteAtual;
    this.deltaAcumulado += deltaTempo;

    while (this.deltaAcumulado >= this.deltaIdeal) {
      this.atualizar(this.deltaIdeal);
      this.deltaAcumulado -= this.deltaIdeal;
    }

    this.desenhar();
    this.idFrame = requestAnimationFrame(this._ciclo);
  }
}
