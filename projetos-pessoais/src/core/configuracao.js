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
    podeAtirar: false, // Parâmetro para definir se os inimigos podem atirar
    rangeAtaque: 1000, // Range de ataque dos inimigos (1 a 5000)
  },
  projeteis: {
    velocidade: 280,
    cadencia: 1.6,
    dano: 1,
    cor: "#a670ff", // Cor padrão para projéteis
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
    pesoSucesso: 1.0, // Peso dado aos exemplos de sucesso
    pesoFalha: 1.0, // Peso dado aos exemplos de falha
    focoSucesso: 0.7, // Quanto a IA foca em exemplos de sucesso (0.0 a 1.0)
    focoFalha: 0.3, // Quanto a IA foca em exemplos de falha (0.0 a 1.0)
    controleMultiInimigos: false, // Se a IA pode controlar múltiplos inimigos simultaneamente
    numeroMaximoInimigos: 5, // Número máximo de inimigos que a IA pode controlar simultaneamente
    taxaAprendizado: 0.1, // Taxa de aprendizado da IA (0.01 a 1.0)
    pesoAtaque: 1.0, // Peso dado à habilidade de atacar (0.0 a 50.0)
    pesoDefesa: 1.0, // Peso dado à habilidade de defender (0.0 a 50.0)
    pesoCooperacao: 1.0, // Peso dado à cooperação entre inimigos (0.0 a 50.0)
    adaptabilidade: 1.0, // Quanto a IA adapta seu comportamento (0.0 a 5.0)
    memoriaCurtoPrazo: 10, // Número de gerações mantidas na memória de curto prazo (1 a 100)
    memoriaLongoPrazo: 100, // Número de gerações mantidas na memória de longo prazo (10 a 1000)
    pesoExemplosSucesso: 1.0, // Peso dado aos exemplos de sucesso na evolução
    pesoExemplosFalha: 1.0, // Peso dado aos exemplos de falha na evolução
    taxaAprendizadoSucesso: 0.1, // Taxa de aprendizado com exemplos de sucesso
    taxaAprendizadoFalha: 0.1, // Taxa de aprendizado com exemplos de falha
  },
});
