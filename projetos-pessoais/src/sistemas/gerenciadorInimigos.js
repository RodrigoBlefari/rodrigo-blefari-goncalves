import { InimigoVoador } from "../entidades/inimigoVoador.js";
import { aleatorioIntervalo } from "../core/utilitarios.js";

export class GerenciadorInimigos {
  constructor(configuracaoInimigos) {
    this.configuracao = configuracaoInimigos;
    this.inimigos = [];
    this.tempoDesdeSpawn = 0;
  }

  definirContexto(contexto) {
    this.contexto = contexto;
  }

  atualizar(delta) {
    this.tempoDesdeSpawn += delta;
    if (this.tempoDesdeSpawn >= this.configuracao.tempoEntreSpawns) {
      this._spawn();
      this.tempoDesdeSpawn = 0;
    }
    const jogador = this.contexto.obterSistema("jogador")?.jogador;
    for (const inimigo of this.inimigos) {
      inimigo.atualizar(delta, this.contexto);
      if (jogador && inimigo.ativo && inimigo.verificarColisao(jogador)) {
        jogador.receberDano(1);
        inimigo.ativo = false;
      }
    }
    this.inimigos = this.inimigos.filter((inimigo) => inimigo.ativo);
  }

  desenhar(contextoCanvas) {
    for (const inimigo of this.inimigos) {
      inimigo.desenhar(contextoCanvas);
    }
  }

  ajustarConfiguracao(configuracao) {
    this.configuracao = configuracao;
  }

  limpar() {
    this.inimigos = [];
  }

  obterAtivos() {
    return this.inimigos;
  }

  _spawn() {
    const canvas = this.contexto.canvas;
    const alturaPlataforma = this.contexto.configuracao.plataforma?.altura ?? 0;
    const topoPlataforma = canvas.height - alturaPlataforma;
    const posY =
      canvas.height * 0.35 +
      aleatorioIntervalo(-this.configuracao.variacaoAltura, this.configuracao.variacaoAltura);
    const alturaInimigo = 48;
    const limiteSuperior = canvas.height * 0.12;
    const limiteInferior = topoPlataforma - alturaInimigo - 32;
    const yClamped = Math.max(limiteSuperior, Math.min(posY, limiteInferior));
    const inimigo = new InimigoVoador({
      x: canvas.width + 60,
      y: yClamped,
      largura: 64,
      altura: 48,
      velocidade: this.configuracao.velocidadeBase,
      agressividade: this.configuracao.agressividade,
      distanciaAtaque: this.configuracao.distanciaAtaque,
      tempoCiclo: this.configuracao.tempoCiclo,
      variacaoAltura: this.configuracao.variacaoAltura / 80,
      intervaloAtaque: this.contexto.configuracao.projeteis.cadencia / this.configuracao.agressividade,
      velocidadeProjetil: this.contexto.configuracao.projeteis.velocidade,
      dano: this.contexto.configuracao.projeteis.dano,
    });
    this.inimigos.push(inimigo);
  }
}
