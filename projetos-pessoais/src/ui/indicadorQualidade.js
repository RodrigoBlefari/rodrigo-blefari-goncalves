export class IndicadorQualidade {
  constructor(elementoRaiz) {
    this.elementoRaiz = elementoRaiz;
    this.ponteiro = elementoRaiz?.querySelector("#qualidade-ponteiro") ?? null;
    this.estado = elementoRaiz?.querySelector("#qualidade-estado") ?? null;
    this.medidor = elementoRaiz?.querySelector(".qualidade-medidor") ?? null;
    this.gradiente = elementoRaiz?.querySelector(".qualidade-gradiente") ?? null;
 }

  atualizar(score = 0.5, descricao = "") {
    if (!this.ponteiro) {
      return;
    }
    const clamped = Math.max(0, Math.min(1, Number(score) || 0));
    const deslocamento = clamped * 100;
    this.ponteiro.style.left = `${deslocamento}%`;
    this.ponteiro.style.transform = "translateX(-50%)";
    
    // Atualizar a cor do medidor com base na qualidade
    if (this.gradiente) {
      // Atualizar o gradiente para ter mais cores e ser mais analógico
      this.gradiente.style.background = this._obterGradienteQualidade(clamped);
    }
    
    if (this.estado) {
      this.estado.textContent = descricao || "Aguardando avaliacao";
    }
  }
  
  _obterGradienteQualidade(valor) {
    // Cria um gradiente mais analógico com transições suaves entre vermelho, amarelo e verde
    const r = Math.floor(255 * (1 - valor));
    const g = Math.floor(255 * valor);
    const b = Math.floor(10 * (1 - Math.abs(0.5 - valor) * 2));
    
    // Gradiente mais complexo para simular um medidor analógico
    return `linear-gradient(90deg, 
      #ff4d6d 0%, 
      #ff7a5d 15%, 
      #ff9e5b 30%, 
      #ffd43b 50%, 
      #a8d76f 70%, 
      #7cd977 85%, 
      #4ac95a 100%)`;
  }
}
