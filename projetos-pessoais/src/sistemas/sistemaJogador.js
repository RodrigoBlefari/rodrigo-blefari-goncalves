import { Jogador, ESTADO_JOGADOR } from "../entidades/jogador.js";
import { gerarId } from "../core/utilitarios.js";

export class SistemaJogador {
  constructor(configuracaoJogador) {
    this.configuracaoJogador = configuracaoJogador;
    this.jogador = null;
    this.entrada = null;
  }

  definirContexto(contexto) {
    this.contexto = contexto;
    this._criarJogador();
  }

  definirEntrada(entrada) {
    this.entrada = entrada;
    if (this.jogador) {
      this.jogador.definirEntrada(entrada);
    }
  }

  atualizar(delta) {
    if (!this.jogador) {
      return;
    }
    this.jogador.atualizar(delta, this.contexto);
  }

  desenhar(contextoCanvas) {
    if (!this.jogador) {
      return;
    }
    this.jogador.desenhar(contextoCanvas);
  }

  aplicarConfiguracao(configuracaoJogador) {
    this.configuracaoJogador = configuracaoJogador;
    if (this.jogador) {
      this.jogador.configuracao = configuracaoJogador;
      this.jogador.largura = configuracaoJogador.larguraBase ?? this.jogador.largura;
      this.jogador.altura = configuracaoJogador.alturaBase ?? this.jogador.altura;
      const topo = this._obterTopoPlataforma();
      this.jogador.y = topo - this.jogador.altura;
      this.jogador.x = Math.min(
        this.jogador.x,
        Math.max(0, this.contexto.canvas.width - this.jogador.largura)
      );
    }
  }

  _criarJogador() {
    const largura = this.configuracaoJogador.larguraBase ?? 32;
    const altura = this.configuracaoJogador.alturaBase ?? 64;
    const topo = this._obterTopoPlataforma();
    this.jogador = new Jogador({
      id: gerarId("jogador"),
      x: this.contexto.canvas.width * 0.2,
      y: topo - altura,
      configuracao: this.configuracaoJogador,
    });
    this.jogador.reiniciar(this.contexto);
    if (this.entrada) {
      this.jogador.definirEntrada(this.entrada);
    }
  }

  reiniciar() {
    if (this.jogador) {
      this.jogador.reiniciar(this.contexto);
    }
  }

  estaDerrotado() {
    return this.jogador && this.jogador.estado === ESTADO_JOGADOR.DERROTADO;
  }

  _obterTopoPlataforma() {
    if (!this.contexto) {
      return this.configuracaoJogador.alturaBase ?? 64;
    }
    const alturaPlataforma = this.contexto.configuracao.plataforma?.altura ?? 0;
    return this.contexto.canvas.height - alturaPlataforma;
  }
}
