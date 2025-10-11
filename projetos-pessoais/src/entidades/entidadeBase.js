export class EntidadeBase {
  constructor({ id, x, y, largura, altura }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.velX = 0;
    this.velY = 0;
    this.ativo = true;
  }

  atualizar(delta, contexto) {
    this.x += this.velX * delta;
    this.y += this.velY * delta;
    if (this.atualizarInterno) {
      this.atualizarInterno(delta, contexto);
    }
  }

  desenhar(contextoCanvas) {
    if (this.desenharInterno) {
      this.desenharInterno(contextoCanvas);
    }
  }

  obterCentro() {
    return {
      x: this.x + this.largura / 2,
      y: this.y + this.altura / 2,
    };
  }

  verificarColisao(outra) {
    return !(
      this.x + this.largura < outra.x ||
      this.x > outra.x + outra.largura ||
      this.y + this.altura < outra.y ||
      this.y > outra.y + outra.altura
    );
  }
}
