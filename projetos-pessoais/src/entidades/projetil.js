import { EntidadeBase } from "./entidadeBase.js";
import { gerarId } from "../core/utilitarios.js";

export class Projetil extends EntidadeBase {
  constructor({ x, y, velX, velY, dano, cor }) {
    super({
      id: gerarId("proj"),
      x: x - 6,
      y: y - 6,
      largura: 12,
      altura: 12,
    });
    this.velX = velX;
    this.velY = velY;
    this.dano = dano;
    this.cor = cor;
    this.trilha = [];
  }

  atualizarInterno(delta, contexto) {
    this.trilha.push({ x: this.x, y: this.y, vida: 0.3 });
    for (const ponto of this.trilha) {
      ponto.vida -= delta;
    }
    this.trilha = this.trilha.filter((ponto) => ponto.vida > 0);
    if (
      this.x < -16 ||
      this.x > contexto.canvas.width + 16 ||
      this.y < -16 ||
      this.y > contexto.canvas.height + 16
    ) {
      this.ativo = false;
    }
  }

  desenharInterno(contextoCanvas) {
    for (const ponto of this.trilha) {
      contextoCanvas.globalAlpha = Math.max(0, ponto.vida * 2);
      contextoCanvas.fillStyle = this.cor;
      contextoCanvas.beginPath();
      contextoCanvas.arc(ponto.x + 6, ponto.y + 6, 4, 0, Math.PI * 2);
      contextoCanvas.fill();
    }
    contextoCanvas.globalAlpha = 1;
    contextoCanvas.fillStyle = this.cor;
    contextoCanvas.beginPath();
    contextoCanvas.arc(this.x + 6, this.y + 6, 6, 0, Math.PI * 2);
    contextoCanvas.fill();
  }
}
