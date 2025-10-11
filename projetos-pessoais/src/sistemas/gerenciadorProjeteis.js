import { Projetil } from "../entidades/projetil.js";

export class GerenciadorProjeteis {
  constructor() {
    this.projeteis = [];
  }

  definirContexto(contexto) {
    this.contexto = contexto;
  }

  criarProjetil(config) {
    const projetil = new Projetil(config);
    this.projeteis.push(projetil);
    return projetil;
  }

  atualizar(delta) {
    const sistemaJogador = this.contexto.obterSistema("jogador");
    const jogador = sistemaJogador?.jogador;
    for (const projetil of this.projeteis) {
      projetil.atualizar(delta, this.contexto);
      if (jogador && projetil.ativo && projetil.verificarColisao(jogador)) {
        jogador.receberDano(projetil.dano);
        projetil.ativo = false;
      }
    }
    this.projeteis = this.projeteis.filter((proj) => proj.ativo);
  }

  desenhar(contextoCanvas) {
    for (const projetil of this.projeteis) {
      projetil.desenhar(contextoCanvas);
    }
  }

  limpar() {
    this.projeteis = [];
  }
}
