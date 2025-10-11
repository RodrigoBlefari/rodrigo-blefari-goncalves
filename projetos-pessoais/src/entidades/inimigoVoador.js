import { InimigoBase } from "./inimigoBase.js";
import { gerarId } from "../core/utilitarios.js";

export class InimigoVoador extends InimigoBase {
  constructor(config) {
    super(config);
    this.id = gerarId("inimigo-voador");
    this.tempoDesdeAtaque = 0;
    this.intervaloAtaque = config.intervaloAtaque ?? 2.0;
    this.velocidadeProjetil = config.velocidadeProjetil ?? 260;
    this.corProjetil = config.corProjetil ?? "#a670ff";
    this.dano = config.dano ?? 1;
  }

  atualizarInterno(delta, contexto) {
    super.atualizarInterno(delta, contexto);
    this.tempoDesdeAtaque += delta;
    if (this.prontoParaAtacar && this.tempoDesdeAtaque >= this.intervaloAtaque) {
      this._disparar(contexto);
      this.tempoDesdeAtaque = 0;
    }
  }

  _disparar(contexto) {
    const projeteis = contexto.obterSistema("projeteis");
    if (!projeteis) {
      return;
    }
    const jogador = contexto.obterSistema("jogador").jogador;
    const origemX = this.x + this.largura / 2;
    const origemY = this.y + this.altura / 2;
    const destinoX = jogador.x + jogador.largura / 2;
    const destinoY = jogador.y + jogador.altura / 2;
    const direcaoX = destinoX - origemX;
    const direcaoY = destinoY - origemY;
    const magnitude = Math.hypot(direcaoX, direcaoY) || 1;
    const velX = (direcaoX / magnitude) * this.velocidadeProjetil;
    const velY = (direcaoY / magnitude) * this.velocidadeProjetil;
    projeteis.criarProjetil({
      x: origemX,
      y: origemY,
      velX,
      velY,
      dano: this.dano,
      cor: this.corProjetil,
      origem: this.id,
    });
  }
}
