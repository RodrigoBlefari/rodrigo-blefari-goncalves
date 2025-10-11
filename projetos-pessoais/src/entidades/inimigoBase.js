import { EntidadeBase } from "./entidadeBase.js";
import { gerarId } from "../core/utilitarios.js";

export class InimigoBase extends EntidadeBase {
  constructor({
    x,
    y,
    largura,
    altura,
    velocidade,
    agressividade,
    distanciaAtaque,
    tempoCiclo,
    variacaoAltura,
  }) {
    super({ id: gerarId("inimigo"), x, y, largura, altura });
    this.velocidade = velocidade;
    this.agressividade = agressividade;
    this.distanciaAtaque = distanciaAtaque;
    this.tempoCiclo = tempoCiclo;
    this.variacaoAltura = variacaoAltura;
    this.tempoTotal = 0;
    this.prontoParaAtacar = false;
  }

  atualizarInterno(delta, contexto) {
    this.tempoTotal += delta;
    const jogador = contexto.obterSistema("jogador").jogador;
    const direcao = jogador.x < this.x ? -1 : 1;
    this.x += -this.velocidade * delta;
    this.y += Math.sin((this.tempoTotal / this.tempoCiclo) * Math.PI * 2) * 20 * delta * this.variacaoAltura;
    const topoPlataforma = contexto.canvas.height - (contexto.configuracao.plataforma?.altura ?? 0);
    const limiteInferior = topoPlataforma - this.altura - 16;
    const limiteSuperior = 32;
    if (this.y > limiteInferior) {
      this.y = limiteInferior;
    } else if (this.y < limiteSuperior) {
      this.y = limiteSuperior;
    }
    const distanciaX = Math.abs(jogador.x - this.x);
    this.prontoParaAtacar = distanciaX < this.distanciaAtaque;
    if (this.x + this.largura < 0) {
      this.ativo = false;
    }
    this.direcaoAtaque = direcao;
  }

  desenharInterno(contextoCanvas) {
    const baseX = this.x + this.largura / 2;
    const baseY = this.y + this.altura;
    contextoCanvas.save();
    contextoCanvas.fillStyle = "rgba(0, 0, 0, 0.25)";
    contextoCanvas.beginPath();
    contextoCanvas.ellipse(baseX, baseY, this.largura * 0.6, this.altura * 0.25, 0, 0, Math.PI * 2);
    contextoCanvas.fill();
    contextoCanvas.restore();

    contextoCanvas.save();
    contextoCanvas.translate(baseX, this.y + this.altura / 2);
    const intensidade = Math.min(1, this.agressividade);
    const preenchimento = contextoCanvas.createRadialGradient(0, 0, this.largura * 0.15, 0, 0, this.largura * 0.5);
    preenchimento.addColorStop(0, `rgba(${140 + intensidade * 80}, ${60 + intensidade * 60}, 230, 0.95)`);
    preenchimento.addColorStop(0.7, `rgba(${120 + intensidade * 100}, ${40 + intensidade * 60}, 200, 0.8)`);
    preenchimento.addColorStop(1, "rgba(40, 28, 60, 0.65)");
    contextoCanvas.fillStyle = preenchimento;
    contextoCanvas.strokeStyle = `rgba(180, 120, 255, 0.9)`;
    contextoCanvas.lineWidth = 4;
    contextoCanvas.shadowColor = `rgba(120, 80, 200, 0.45)`;
    contextoCanvas.shadowBlur = 24;
    contextoCanvas.shadowOffsetY = 6;
    contextoCanvas.beginPath();
    contextoCanvas.ellipse(0, 0, this.largura / 2, this.altura / 2, 0, 0, Math.PI * 2);
    contextoCanvas.fill();
    contextoCanvas.stroke();
    contextoCanvas.beginPath();
    contextoCanvas.moveTo(-this.largura * 0.3, 0);
    contextoCanvas.lineTo(-this.largura * 0.6, this.altura * 0.4);
    contextoCanvas.moveTo(this.largura * 0.3, 0);
    contextoCanvas.lineTo(this.largura * 0.6, this.altura * 0.4);
    contextoCanvas.stroke();
    contextoCanvas.restore();
  }
}
