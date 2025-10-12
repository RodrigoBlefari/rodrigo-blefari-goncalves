import { InimigoBase } from "./inimigoBase.js";
import { gerarId } from "../core/utilitarios.js";

export class InimigoVoador extends InimigoBase {
  constructor(config) {
    super({
      ...config,
      podeAtirar: config.podeAtirar !== undefined ? config.podeAtirar : false,
      rangeAtaque: config.rangeAtaque !== undefined ? config.rangeAtaque : 320,
      intervaloAtaque: config.intervaloAtaque !== undefined ? config.intervaloAtaque : 2.0,
      velocidadeProjetil: config.velocidadeProjetil !== undefined ? config.velocidadeProjetil : 260,
      dano: config.dano !== undefined ? config.dano : 1,
      corProjetil: config.corProjetil !== undefined ? config.corProjetil : "#a670ff",
    });
    this.id = gerarId("inimigo-voador");
    this.tempoDesdeAtaque = 0;
  }

  atualizarInterno(delta, contexto) {
    super.atualizarInterno(delta, contexto);
  }

  atirar(contexto, jogador) {
    const projeteis = contexto.obterSistema("projeteis");
    if (!projeteis) {
      return;
    }
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
      largura: 8,
      altura: 8,
      velX,
      velY,
      dano: this.dano,
      cor: this.corProjetil,
      origem: this.id,
    });
  }
}
