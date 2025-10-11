import { aleatorioIntervalo } from "../core/utilitarios.js";

export class FundoParalaxe {
  constructor(configuracao, largura, altura) {
    this.configuracao = configuracao;
    this.largura = largura;
    this.altura = altura;
    this.offsetLento = 0;
    this.offsetRapido = 0;
    this.estrelas = this._criarEstrelas();
  }

  redimensionar(largura, altura) {
    this.largura = largura;
    this.altura = altura;
  }

  atualizar(delta) {
    this.offsetLento += this.configuracao.parallaxLento * delta;
    this.offsetRapido += this.configuracao.parallaxRapido * delta;
    this.offsetLento %= this.largura;
    this.offsetRapido %= this.largura;
    for (const estrela of this.estrelas) {
      estrela.x -= estrela.velocidade * delta;
      if (estrela.x < -2) {
        estrela.x = this.largura + aleatorioIntervalo(0, 64);
        estrela.y = aleatorioIntervalo(0, this.altura);
        estrela.tamanho = aleatorioIntervalo(1, 3);
        estrela.brilho = aleatorioIntervalo(0.4, 1);
      }
    }
  }

  desenhar(contexto) {
    const gradiente = contexto.createLinearGradient(0, 0, 0, this.altura);
    gradiente.addColorStop(0, "#04030a");
    gradiente.addColorStop(0.5, "#080d25");
    gradiente.addColorStop(1, "#1b213f");
    contexto.fillStyle = gradiente;
    contexto.fillRect(0, 0, this.largura, this.altura);

    contexto.fillStyle = "rgba(35, 48, 94, 0.8)";
    contexto.fillRect(
      -this.offsetLento,
      this.altura * 0.65,
      this.largura * 2,
      this.altura * 0.35
    );

    contexto.fillStyle = "rgba(47, 66, 122, 0.6)";
    contexto.fillRect(
      -this.offsetRapido,
      this.altura * 0.75,
      this.largura * 2,
      this.altura * 0.25
    );

    for (const estrela of this.estrelas) {
      contexto.globalAlpha = estrela.brilho;
      contexto.fillStyle = "#9ad4ff";
      contexto.beginPath();
      contexto.arc(estrela.x, estrela.y, estrela.tamanho, 0, Math.PI * 2);
      contexto.fill();
    }
    contexto.globalAlpha = 1;
  }

  _criarEstrelas() {
    const lista = [];
    for (let i = 0; i < this.configuracao.estrelasQuantidade; i += 1) {
      lista.push({
        x: aleatorioIntervalo(0, this.largura),
        y: aleatorioIntervalo(0, this.altura),
        tamanho: aleatorioIntervalo(1, 3),
        brilho: aleatorioIntervalo(0.4, 1),
        velocidade: aleatorioIntervalo(8, 32),
      });
    }
    return lista;
  }
}
