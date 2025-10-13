import { EntidadeBase } from "./entidadeBase.js";
import { limitar } from "../core/utilitarios.js";
import { desenharStick } from "./desenhoStick.js";

const ESTADO_JOGADOR = Object.freeze({
  VIVO: "vivo",
  DERROTADO: "derrotado",
  OBSERVANDO: "observando",
});

export class Jogador extends EntidadeBase {
  constructor({ id, x, y, configuracao }) {
    const larguraBase = configuracao.larguraBase ?? 32;
    const alturaBase = configuracao.alturaBase ?? 64;
    super({ id, x, y, largura: larguraBase, altura: alturaBase });
    this.configuracao = configuracao;
    this.estado = ESTADO_JOGADOR.VIVO;
    this.vidas = configuracao.vidasMaximas;
    this.invulneravel = 0;
    this.noChao = false;
    this.entrada = null;
    this.controladorIA = null;
    this.sombras = [];
    this.inputCooldown = 0;
  }

  definirEntrada(entrada) {
    this.entrada = entrada;
  }

  definirControladorIA(controlador) {
    this.controladorIA = controlador;
  }

  definirModoObservacao(ativo) {
    this.estado = ativo ? ESTADO_JOGADOR.OBSERVANDO : ESTADO_JOGADOR.VIVO;
    if (ativo) {
      this.vidas = this.configuracao.vidasMaximas;
      this.invulneravel = Number.POSITIVE_INFINITY;
    } else if (this.invulneravel === Number.POSITIVE_INFINITY) {
      this.invulneravel = 0;
    }
    if (this.controladorIA) {
      this.controladorIA.definirModoObservacao(ativo);
    }
  }

  atualizarInterno(delta, contexto) {
    const gravidade = contexto.configuracao.jogo.gravidade;
    if (this.estado !== ESTADO_JOGADOR.DERROTADO) {
      if (this.controladorIA && this.estado === ESTADO_JOGADOR.OBSERVANDO) {
        this.controladorIA.atualizarJogador(delta, this, contexto);
      }
      if (this.inputCooldown > 0) {
        this.inputCooldown = Math.max(0, this.inputCooldown - delta);
      }
      if (this.entrada) {
        this._aplicarEntrada(delta);
      }
      this.velY += gravidade * delta;
      // Posição já integrada por EntidadeBase; aqui apenas resolvemos colisões após integração
      this._resolverColisoes(contexto);
      this.velX *= this.configuracao.atritoAr;
    }
    if (this.invulneravel > 0) {
      this.invulneravel = Math.max(0, this.invulneravel - delta);
    }
  }

  _aplicarEntrada(delta) {
    if (!this.entrada) {
      return;
    }
    if (this.entrada.estaAtivo("esquerda")) {
      this.velX = -this.configuracao.velocidadeHorizontal;
    } else if (this.entrada.estaAtivo("direita")) {
      this.velX = this.configuracao.velocidadeHorizontal;
    }
    if (this.entrada.estaAtivo("pulo") && this.noChao && this.inputCooldown <= 0) {
      this.velY = -this.configuracao.impulsoPulo;
      this.noChao = false;
    }
    if (this.estado !== ESTADO_JOGADOR.OBSERVANDO) {
      if (this.entrada.foiDisparado("modoObservacao")) {
        this.definirModoObservacao(true);
      }
    } else if (this.entrada.foiDisparado("modoObservacao")) {
      this.definirModoObservacao(false);
    }
  }

  _resolverColisoes(contexto) {
    const topoPlataforma = this._obterTopoPlataforma(contexto);
    if (this.y + this.altura >= topoPlataforma) {
      this.y = topoPlataforma - this.altura;
      this.velY = 0;
      this.noChao = true;
    } else {
      this.noChao = false;
    }
    this.x = limitar(this.x, 0, contexto.canvas.width - this.largura);
  }

  receberDano(quantidade) {
    if (this.invulneravel > 0 || this.estado === ESTADO_JOGADOR.OBSERVANDO) {
      return;
    }
    this.vidas = Math.max(0, this.vidas - quantidade);
    this.invulneravel = this.configuracao.invulnerabilidade;
    if (this.vidas <= 0) {
      this.estado = ESTADO_JOGADOR.DERROTADO;
    }
  }

  reiniciar(contexto) {
    this.estado = ESTADO_JOGADOR.VIVO;
    this.vidas = this.configuracao.vidasMaximas;
    this.invulneravel = 0;
    if (contexto) {
      const topoPlataforma = this._obterTopoPlataforma(contexto);
      this.x = contexto.canvas.width * 0.2;
      this.y = topoPlataforma - this.altura;
    }
    this.velX = 0;
    this.velY = 0;
    this.noChao = true;
    this.inputCooldown = 0.25;
  }

  _obterTopoPlataforma(contexto) {
    if (!contexto) {
      return this.y + this.altura;
    }
    const alturaPlataforma = contexto.configuracao.plataforma?.altura ?? 0;
    return contexto.canvas.height - alturaPlataforma;
  }

  desenharInterno(contextoCanvas) {
    const centroBaseX = this.x + this.largura / 2;
    const baseY = this.y + this.altura;
    contextoCanvas.save();
    contextoCanvas.fillStyle = "rgba(0, 0, 0, 0.35)";
    contextoCanvas.beginPath();
    contextoCanvas.ellipse(centroBaseX, baseY, this.largura * 0.7, this.altura * 0.12, 0, 0, Math.PI * 2);
    contextoCanvas.fill();
    contextoCanvas.restore();

    desenharStick({
      contexto: contextoCanvas,
      x: this.x,
      y: this.y,
      largura: this.largura,
      altura: this.altura,
      corLinha: this.invulneravel > 0 ? "#ffe066" : "#f8f9fa",
      alpha: 1,
      sombraCor: this.invulneravel > 0 ? "rgba(255, 224, 102, 0.45)" : "rgba(82, 143, 255, 0.35)",
      sombraDeslocamentoY: 6,
      sombraBlur: 18,
    });
  }
}

export { ESTADO_JOGADOR };
