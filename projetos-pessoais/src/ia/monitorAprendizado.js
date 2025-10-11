const ESTADOS_LEIGOS = {
  "hiperplastico (ganho explosivo)": {
    emoji: "🚀",
    titulo: "turbina ligada",
    descricao: "os resultados disparam de uma geração para outra",
    dica: "aproveite para observar as jogadas e salve configurações de sucesso",
    score: 1,
  },
  "plasticidade acelerada": {
    emoji: "⚡",
    titulo: "acelerando bem",
    descricao: "o aprendizado cresce rápido de forma estável",
    dica: "você pode reduzir a velocidade da simulação para assistir às novas táticas",
    score: 0.85,
  },
  "melhora gradual": {
    emoji: "📈",
    titulo: "subindo steady",
    descricao: "cada geração rende um pouco mais que a anterior",
    dica: "mantenha os testes e considere variar cenários para estimular ainda mais",
    score: 0.7,
  },
  "homeostase controlada": {
    emoji: "🙂",
    titulo: "estável",
    descricao: "os números oscilam pouco, sem ganhos nem perdas grandes",
    dica: "aguarde algumas gerações ou ajuste parâmetros se quiser acelerar",
    score: 0.5,
  },
  estagnado: {
    emoji: "🧊",
    titulo: "parado no lugar",
    descricao: "a IA não melhora há várias gerações",
    dica: "aumente mutação ou mude a densidade de projéteis para trazer novidades",
    score: 0.25,
  },
  regressivo: {
    emoji: "⚠️",
    titulo: "voltando para trás",
    descricao: "o desempenho caiu; algo ficou difícil demais",
    dica: "reduza agressividade inimiga ou alivie a velocidade para recuperar confiança",
    score: 0.1,
  },
  "fase inicial": {
    emoji: "🌱",
    titulo: "aquecendo",
    descricao: "a IA ainda está explorando caminhos",
    dica: "deixe rodar algumas gerações antes de concluir algo",
    score: 0.5,
  },
};

const PESO_INSIGHTS = {
  posicaoX: { emoji: "🧭", descricao: "onde ficar na tela" },
  distanciaProjetil: { emoji: "🛡️", descricao: "a distância lateral dos tiros" },
  alturaProjetil: { emoji: "🪂", descricao: "se o tiro vem por cima ou por baixo" },
  anguloProjetil: { emoji: "🎯", descricao: "o ângulo de entrada dos projéteis" },
  tempoImpactoProjetil: { emoji: "⏱️", descricao: "quanto tempo falta até o tiro chegar" },
  distanciaInimigo: { emoji: "⚔️", descricao: "o quão perto o inimigo está" },
  alturaInimigo: { emoji: "🪜", descricao: "a diferença de altura para o inimigo" },
  anguloInimigo: { emoji: "🧿", descricao: "de que lado o inimigo aparece" },
  densidadeProjetil: { emoji: "🌧️", descricao: "quantos tiros chegam ao mesmo tempo" },
  memoria: { emoji: "🧠", descricao: "o que a IA lembra do que funcionou antes" },
};

const formatarPontos = (valor) => {
  if (!Number.isFinite(valor)) {
    return "0";
  }
  if (valor >= 1000) {
    return `${(valor / 1000).toFixed(1)}k`;
  }
  if (valor >= 100) {
    return valor.toFixed(0);
  }
  return valor.toFixed(1);
};

const classificarIntensidadePeso = (absValor) => {
  if (absValor >= 1.6) {
    return "muito forte";
  }
  if (absValor >= 0.9) {
    return "forte";
  }
  if (absValor >= 0.4) {
    return "moderado";
  }
  return "leve";
};

export class MonitorAprendizado {
  constructor(painel) {
    this.painel = painel;
    this.infos = {
      geracao: 0,
      melhorFitness: 0,
      mediaFitness: 0,
      desviosTotais: 0,
      colisoesTotais: 0,
    };
    this.historico = [];
    this.ultimoMelhor = 0;
    this.ultimaMedia = 0;
    this.ciclosSemMelhoria = 0;
    this.estadoAtual = "fase inicial";
    this.deltaMelhor = 0;
    this.deltaMedia = 0;
    this.recomendacaoAtual = "rede inicializando; aguarde algumas geracoes para diagnostico.";
    this.indicadorQualidade = null;
    this.historicoIA = null;
    this.qualidadeScore = 0.5;
    
    // Adiciona propriedades para rastrear o melhor e pior fitness de todas as gerações
    this.melhorFitnessGeral = 0;
    this.piorFitnessGeral = Infinity;
    this.geracaoMelhorFitness = 0;
  }

  definirIndicadorQualidade(indicador) {
    this.indicadorQualidade = indicador;
    const pacote = this._obterPacoteEstado(this.estadoAtual);
    this.indicadorQualidade?.atualizar(this.qualidadeScore, pacote.titulo);
  }

  definirHistoricoIA(historicoIA) {
    this.historicoIA = historicoIA;
  }

  atualizar(resumo, opcoes = {}) {
    this.infos = { ...this.infos, ...resumo };
    if (opcoes.evolucao) {
      this.historico.push({
        geracao: resumo.geracao,
        melhor: resumo.melhorFitness,
        media: resumo.mediaFitness,
      });
      if (this.historico.length > 120) {
        this.historico.shift();
      }
      const deltaMelhor = resumo.melhorFitness - this.ultimoMelhor;
      const deltaMedia = resumo.mediaFitness - this.ultimaMedia;
      if (deltaMelhor > 0.25 || deltaMedia > 0.25) {
        this.ciclosSemMelhoria = 0;
      } else {
        this.ciclosSemMelhoria += 1;
      }
      const novoEstado = this._classificarEstado(deltaMelhor, deltaMedia);
      if (novoEstado !== this.estadoAtual && this.estadoAtual !== "fase inicial") {
        const pacote = this._obterPacoteEstado(novoEstado);
        this.registrarEvento(`${pacote.emoji} Ritmo de aprendizado agora está ${pacote.titulo}`);
      }
      this.estadoAtual = novoEstado;
      const pacote = this._obterPacoteEstado(this.estadoAtual);
      this.recomendacaoAtual = pacote.dica;
      this.deltaMelhor = deltaMelhor;
      this.deltaMedia = deltaMedia;
      this.ultimoMelhor = resumo.melhorFitness;
      this.ultimaMedia = resumo.mediaFitness;
      
      // Atualiza o melhor e pior fitness de todas as gerações
      if (resumo.melhorFitness > this.melhorFitnessGeral) {
        this.melhorFitnessGeral = resumo.melhorFitness;
        this.geracaoMelhorFitness = resumo.geracao;
        this.registrarEvento(`🏆 Novo recorde de fitness: ${this.melhorFitnessGeral.toFixed(2)} na geração ${resumo.geracao}!`);
      }
      if (resumo.melhorFitness < this.piorFitnessGeral || this.piorFitnessGeral === Infinity) {
        this.piorFitnessGeral = resumo.melhorFitness;
        this.registrarEvento(`📉 Novo pior fitness: ${this.piorFitnessGeral.toFixed(2)} na geração ${resumo.geração || resumo.geracao}`);
      }
    }
    this._renderizar();
  }

  registrarEvento(texto) {
    this.painel?.registrarEventoRelatorio(texto);
    this.historicoIA?.adicionarEntrada(texto);
  }

   _renderizar() {
    if (!this.painel) {
      return;
    }
    const pacote = this._obterPacoteEstado(this.estadoAtual);
    const tendencia = this._descreverTendencia(this.deltaMelhor, this.deltaMedia);
    const linhas = [
      `${pacote.emoji} Geração ${this.infos.geracao} • ${tendencia}`,
      `Melhor agente: ${formatarPontos(this.infos.melhorFitness)} pontos`,
      `Turma toda: ${formatarPontos(this.infos.mediaFitness)} pontos (média)`,
      `Clima do treino: ${pacote.descricao}`,
      `Próximo passo: ${this.recomendacaoAtual}`,
    ];
    this.painel.atualizarResumo(linhas.join("\n"));
    this.indicadorQualidade?.atualizar(this.qualidadeScore ?? 0.5, pacote.titulo);
    
    // Atualiza o painel com informações do melhor e pior fitness de todas as gerações
    if (this.painel.areaStatus) {
      const melhorFitnessElement = this.painel.areaStatus.querySelector('#melhor-fitness');
      const piorFitnessElement = this.painel.areaStatus.querySelector('#pior-fitness');
      const geracaoMelhorElement = this.painel.areaStatus.querySelector('#geracao-melhor');
      
      if (melhorFitnessElement) {
        melhorFitnessElement.textContent = formatarPontos(this.melhorFitnessGeral);
      }
      if (piorFitnessElement) {
        piorFitnessElement.textContent = formatarPontos(this.piorFitnessGeral);
      }
      if (geracaoMelhorElement) {
        geracaoMelhorElement.textContent = this.geracaoMelhorFitness;
      }
    }
  }

  _classificarEstado(deltaMelhor, deltaMedia) {
    if (deltaMelhor >= 5) {
      return "hiperplastico (ganho explosivo)";
    }
    if (deltaMelhor >= 1) {
      return "plasticidade acelerada";
    }
    if (deltaMelhor >= 0.2 || deltaMedia >= 0.2) {
      return "melhora gradual";
    }
    if (this.ciclosSemMelhoria >= 6) {
      return "estagnado";
    }
    if (deltaMelhor <= -0.3) {
      return "regressivo";
    }
    return "homeostase controlada";
  }

  _gerarRecomendacao(estado) {
    return this._obterPacoteEstado(estado).dica;
  }

  _obterPacoteEstado(estado) {
    const pacote = ESTADOS_LEIGOS[estado] ?? ESTADOS_LEIGOS["fase inicial"];
    this.qualidadeScore = pacote.score ?? this.qualidadeScore ?? 0.5;
    return pacote;
  }

  _descreverTendencia(deltaMelhor, deltaMedia) {
    if (!Number.isFinite(deltaMelhor) || !Number.isFinite(deltaMedia)) {
      return "coletando dados";
    }
    if (deltaMelhor >= 2 || deltaMedia >= 1) {
      return "crescendo muito rápido";
    }
    if (deltaMelhor >= 0.5 || deltaMedia >= 0.5) {
      return "subindo bem";
    }
    if (deltaMelhor >= 0.1 || deltaMedia >= 0.1) {
      return "progredindo aos poucos";
    }
    if (deltaMelhor <= -0.3 || deltaMedia <= -0.3) {
      return "perdendo terreno";
    }
    if (Math.abs(deltaMelhor) < 0.05 && Math.abs(deltaMedia) < 0.05) {
      return "mantendo o ritmo";
    }
    return deltaMelhor >= 0 ? "subindo devagar" : "oscilando";
  }

  gerarMensagemGeracao(resumo) {
    if (!resumo) {
      return null;
    }
    const pacote = this._obterPacoteEstado(this.estadoAtual);
    const tendencia = this._descreverTendencia(this.deltaMelhor, this.deltaMedia);
    const melhor = formatarPontos(resumo.melhorFitness);
    const media = formatarPontos(resumo.mediaFitness);
    return `${pacote.emoji} Geração ${resumo.geracao}: ${tendencia}. Topo ${melhor} pts | média ${media} pts`;
  }

  obterInsightPesos(pesos) {
    if (!pesos) {
      return null;
    }
    const principal = Object.entries(pesos)
      .filter(([chave]) => PESO_INSIGHTS[chave])
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];
    if (!principal) {
      return null;
    }
    const [chave, valor] = principal;
    const info = PESO_INSIGHTS[chave];
    const intensidade = classificarIntensidadePeso(Math.abs(valor));
    return `${info.emoji} Foco do melhor agente: atenção ${intensidade} em ${info.descricao}.`;
  }
}
