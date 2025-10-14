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
    
    // Atualiza o valor do HP - mostra infinito no modo IA para evitar NaN
    if (modoIA) {
      this.hpValorElemento.textContent = "∞";
      this.hpValorElemento.title = "Modo IA - vida infinita";
    } else {
      // Verifica se os valores são válidos para evitar NaN
      const vidas = isNaN(vidasAtuais) ? 0 : vidasAtuais;
      const vidasMax = isNaN(vidasMaximas) ? 0 : vidasMaximas;
      this.hpValorElemento.textContent = `${vidas}/${vidasMax}`;
      this.hpValorElemento.title = "";
    }
    
    // Atualiza o modo (IA ou Jogador)
    if (this.modoValorElemento) {
      this.modoValorElemento.textContent = modoIA ? "IA" : "Jogador";
    }
  }
}
