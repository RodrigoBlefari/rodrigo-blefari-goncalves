export const configuracaoInicial = Object.freeze({
  jogo: {
    largura: 960,
    altura: 540,
    taxaQuadros: 60,
    gravidade: 2000,
    multiplicadorVelocidade: 1,
  },
  plataforma: {
    altura: 96,
    largura: 960,
    corTopo: "#2c3049",
    corFace: "#1a1e30",
    corBrilho: "#515d8a",
  },
  jogador: {
    larguraBase: 36,
    alturaBase: 70,
    velocidadeHorizontal: 220,
    impulsoPulo: 820,
    atritoAr: 0.85,
    vidasMaximas: 5,
    invulnerabilidade: 1.0,
  },
  inimigos: {
    tempoEntreSpawns: 2.5,
    velocidadeBase: 120,
    agressividade: 1.0,
    distanciaAtaque: 320,
    tempoCiclo: 6.0,
    variacaoAltura: 140,
    alturaBase: 90,
    distanciaAtaqueJogador: 280,
  },
  projeteis: {
    velocidade: 280,
    cadencia: 1.6,
    dano: 1,
  },
  efeitos: {
    parallaxLento: 12,
    parallaxRapido: 38,
    estrelasQuantidade: 48,
  },
  ia: {
    tamanhoPopulacao: 32,
    taxaMutacao: 0.1,
    velocidadeSimulacao: 2.0,
    pesoDesvio: 1.5,
    pesoSobrevivencia: 2.0,
    pesoExploracao: 0.5,
    relatorioIntervalo: 1, // Intervalo em segundos para atualização dos relatórios
  },
});
