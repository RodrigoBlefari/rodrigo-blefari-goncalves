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
  }

  definirIndicadorQualidade(indicador) {
    this.indicadorQualidade = indicador;
    this.indicadorQualidade?.atualizar(this.qualidadeScore, this.estadoAtual);
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
      if (deltaMelhor > 0.25) {
        this.ciclosSemMelhoria = 0;
      } else if (deltaMelhor < -0.1) {
        this.ciclosSemMelhoria = Math.max(0, this.ciclosSemMelhoria - 1);
      } else {
        this.ciclosSemMelhoria += 1;
      }
      const novoEstado = this._classificarEstado(deltaMelhor, deltaMedia);
      if (novoEstado !== this.estadoAtual && this.estadoAtual !== "fase inicial") {
        this.registrarEvento(`patamar aprendizado -> ${novoEstado}`);
      }
      this.estadoAtual = novoEstado;
      this.recomendacaoAtual = this._gerarRecomendacao(this.estadoAtual);
      this.deltaMelhor = deltaMelhor;
      this.deltaMedia = deltaMedia;
      this.ultimoMelhor = resumo.melhorFitness;
      this.ultimaMedia = resumo.mediaFitness;
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
    const status = [
      `Geracao: ${this.infos.geracao}`,
      `Melhor fitness: ${this.infos.melhorFitness.toFixed(2)} (delta ${this.deltaMelhor >= 0 ? "+" : ""}${this.deltaMelhor.toFixed(2)})`,
      `Media fitness: ${this.infos.mediaFitness.toFixed(2)} (delta ${this.deltaMedia >= 0 ? "+" : ""}${this.deltaMedia.toFixed(2)})`,
      `Desvios: ${this.infos.desviosTotais} | Colisoes: ${this.infos.colisoesTotais}`,
      `Estado aprendizado: ${this.estadoAtual}`,
      `Resumo: ${this.recomendacaoAtual}`,
    ];
    this.painel.atualizarResumo(status.join("\n"));
    this.indicadorQualidade?.atualizar(this.qualidadeScore ?? 0.5, this.estadoAtual);
  }

  _classificarEstado(deltaMelhor, deltaMedia) {
    if (deltaMelhor >= 5) {
      this.qualidadeScore = 1;
      return "hiperplastico (ganho explosivo)";
    }
    if (deltaMelhor >= 1) {
      this.qualidadeScore = 0.85;
      return "plasticidade acelerada";
    }
    if (deltaMelhor >= 0.2 || deltaMedia >= 0.2) {
      this.qualidadeScore = 0.7;
      return "melhora gradual";
    }
    if (this.ciclosSemMelhoria >= 6) {
      this.qualidadeScore = 0.25;
      return "estagnado";
    }
    if (deltaMelhor <= -0.3) {
      this.qualidadeScore = 0.1;
      return "regressivo";
    }
    this.qualidadeScore = 0.5;
    return "homeostase controlada";
  }

  _gerarRecomendacao(estado) {
    switch (estado) {
      case "hiperplastico (ganho explosivo)":
        return "rede assimilando rapido; mantenha taxa mutacao e acompanhe estabilidade";
      case "plasticidade acelerada":
        return "aprendizado saudavel; pode reduzir velocidade simulacao para observar estrategias";
      case "melhora gradual":
        return "progresso constante; registre pesos para baseline e considere variar inimigos";
      case "estagnado":
        return "sem progresso; aumente taxa mutacao ou diversifique projetis/inimigos";
      case "regressivo":
        return "fitness caindo; reduza agressividade inimiga ou estabilize parametros";
      default:
        return "ritmo estavel; monitore mais algumas geracoes antes de ajustes";
    }
 }
}
