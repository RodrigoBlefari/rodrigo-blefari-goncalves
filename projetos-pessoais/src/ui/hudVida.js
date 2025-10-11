export class HudVida {
  constructor(elementoRaiz) {
    this.elementoRaiz = elementoRaiz;
    this.hpValorElemento = this.elementoRaiz?.querySelector(".hp-valor") ?? null;
    this.modoValorElemento = this.elementoRaiz?.querySelector(".modo-valor") ?? null;
  }

  atualizar(vidasAtuais, vidasMaximas, modoIA = false) {
    if (!this.hpValorElemento) {
      return;
    }
    
    // Atualiza o valor do HP
    this.hpValorElemento.textContent = `${vidasAtuais}/${vidasMaximas}`;
    
    // Atualiza o modo (IA ou Jogador)
    if (this.modoValorElemento) {
      this.modoValorElemento.textContent = modoIA ? "IA" : "Jogador";
    }
  }
}
