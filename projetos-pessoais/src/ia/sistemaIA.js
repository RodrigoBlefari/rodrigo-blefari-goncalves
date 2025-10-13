import { MotorEvolutivo } from "./motorEvolutivo.js";
import { AgenteSombra } from "./sombrasAgentes.js";
import { MonitorAprendizado } from "./monitorAprendizado.js";
import { SimulacaoIndependente } from "./simulacaoIndependente.js";

const PALETA = ["#5be9ff", "#68ff9a", "#ffef5b", "#ff9e5b", "#ff5bd9"];

export class SistemaIA {
  constructor(configuracaoIA, painelControles) {
    this.configuracaoIA = configuracaoIA;
    this.painelControles = painelControles;
    this.monitor = new MonitorAprendizado(painelControles);
    // Expõe o monitor na configuração para que o PainelControles possa ler estado em tempo real
    this.configuracaoIA.monitor = this.monitor;
    this.modoObservacao = false;
    this.sombras = [];
    this.simulacoes = [];
    this.motor = new MotorEvolutivo(configuracaoIA);
    this.tempoSimulacao = 0;
    this.relatorioIntervalo = configuracaoIA.relatorioIntervalo || 3; // Usa o valor da configuração ou 3 como padrão
    this.tempoDesdeRelatorio = 0;
    this.configuracaoJogador = null;
    this.configuracaoPlataforma = null;
    this.visualizacao = null;
    this.tempoVisualizacao = 0;
    this.indicePerspectiva = -1;
    this.cohortsProcessados = 0;
    this.pesoSucesso = configuracaoIA.pesoSucesso !== undefined ? configuracaoIA.pesoSucesso : 1.0;
    this.pesoFalha = configuracaoIA.pesoFalha !== undefined ? configuracaoIA.pesoFalha : 1.0;
    this.focoSucesso = configuracaoIA.focoSucesso !== undefined ? configuracaoIA.focoSucesso : 0.7;
    this.focoFalha = configuracaoIA.focoFalha !== undefined ? configuracaoIA.focoFalha : 0.3;
    this.controleMultiInimigos = configuracaoIA.controleMultiInimigos !== undefined ? configuracaoIA.controleMultiInimigos : false;
    this.numeroMaximoInimigos = configuracaoIA.numeroMaximoInimigos !== undefined ? configuracaoIA.numeroMaximoInimigos : 5;
    this.taxaAprendizado = configuracaoIA.taxaAprendizado !== undefined ? configuracaoIA.taxaAprendizado : 0.1;
    this.pesoAtaque = configuracaoIA.pesoAtaque !== undefined ? configuracaoIA.pesoAtaque : 1.0;
    this.pesoDefesa = configuracaoIA.pesoDefesa !== undefined ? configuracaoIA.pesoDefesa : 1.0;
    this.pesoCooperacao = configuracaoIA.pesoCooperacao !== undefined ? configuracaoIA.pesoCooperacao : 1.0;
    this.adaptabilidade = configuracaoIA.adaptabilidade !== undefined ? configuracaoIA.adaptabilidade : 1.0;
    this.memoriaCurtoPrazo = configuracaoIA.memoriaCurtoPrazo !== undefined ? configuracaoIA.memoriaCurtoPrazo : 10;
    this.memoriaLongoPrazo = configuracaoIA.memoriaLongoPrazo !== undefined ? configuracaoIA.memoriaLongoPrazo : 100;
    this.pesoExemplosSucesso = configuracaoIA.pesoExemplosSucesso !== undefined ? configuracaoIA.pesoExemplosSucesso : 1.0;
    this.pesoExemplosFalha = configuracaoIA.pesoExemplosFalha !== undefined ? configuracaoIA.pesoExemplosFalha : 1.0;
    this.taxaAprendizadoSucesso = configuracaoIA.taxaAprendizadoSucesso !== undefined ? configuracaoIA.taxaAprendizadoSucesso : 0.1;
    this.taxaAprendizadoFalha = configuracaoIA.taxaAprendizadoFalha !== undefined ? configuracaoIA.taxaAprendizadoFalha : 0.1;
  }

  definirContexto(contexto) {
    this.contexto = contexto;
    this.configuracaoPlataforma = contexto.configuracao.plataforma;
    this._inicializarSombras();
  }

  definirModoObservacao(ativo) {
    this.modoObservacao = ativo;
    if (ativo) {
      this.monitor.registrarEvento("IA em modo observacao");
    } else {
      this.monitor.registrarEvento("IA em modo jogador");
    }
    this.tempoVisualizacao = 0;
    this.tempoDesdeRelatorio = 0;
    this.tempoSimulacao = 0;
  }

  atualizarSombras(delta) {
    if (!this.modoObservacao) {
      return;
    }
const renderAtivo = this.contexto?.obterDado("efeitosVisuaisAtivos") !== false;
const velocidade = this.modoObservacao ? (this.configuracaoIA.velocidadeSimulacao ?? 1) : 1;
const passo = delta * velocidade;

const quantidadeAtivas = this._calcularTamanhoCoorte();

// Treinamento por coortes: processa blocos sequenciais até cobrir toda a população
const inicio = this.cohortsProcessados * quantidadeAtivas;
const fim = Math.min(this.sombras.length, inicio + quantidadeAtivas);

// Atualiza apenas as IAs da coorte atual
for (let idx = inicio; idx < fim; idx++) {
  const sombra = this.sombras[idx];
  const simulacao = this.simulacoes[idx];
      const percepcao = simulacao?.atualizar(passo, sombra) ?? { projeteis: [], inimigos: [] };
      sombra.atualizar(
        passo,
        this.contexto,
        percepcao.projeteis ?? [],
        this.configuracaoJogador,
        this.configuracaoPlataforma,
        percepcao.inimigos ?? []
      );
    }

    // Conta apenas as IAs ativas da coorte atual
    let vivos = 0;
    for (let idx = inicio; idx < fim; idx++) {
      if (!this.sombras[idx].morto) {
        vivos += 1;
      }
    }
    this.tempoVisualizacao += passo;
    this.tempoDesdeRelatorio += passo;
    if (renderAtivo && this.tempoVisualizacao >= 0.25) {
      const melhor = this._obterMelhorSombra();
      if (melhor?.ultimaAtivacao) {
        this.visualizacao?.atualizarAtivacoes({
          ...melhor.ultimaAtivacao,
          fitness: melhor.cromossomo.fitness,
        });
      }
      this.tempoVisualizacao = 0;
    } else if (!renderAtivo) {
      this.tempoVisualizacao = 0;
    }
    if (this.tempoDesdeRelatorio >= this.relatorioIntervalo) {
      this.monitor.atualizar(this._gerarResumo(), { instantaneo: true });
      this.tempoDesdeRelatorio = 0;
    }
    this.tempoSimulacao += passo;
    
    // Quando toda a coorte atual morrer, avança para a próxima.
    if (vivos === 0) {
      this.cohortsProcessados += 1;
      // Se todas as coortes foram processadas, avalia a geração inteira
      if (this.cohortsProcessados * quantidadeAtivas >= this.sombras.length) {
        this._avaliarGeracao();
        this.cohortsProcessados = 0;
        this.tempoSimulacao = 0;
        this.tempoDesdeRelatorio = 0;
      } else {
        // Prepara a próxima coorte (reset de estado para iniciar novo subciclo)
        const proxInicio = this.cohortsProcessados * quantidadeAtivas;
        const proxFim = Math.min(this.sombras.length, proxInicio + quantidadeAtivas);
        const largura = this.contexto?.canvas.width ?? 960;
        const altura = this.contexto?.canvas.height ?? 540;
        for (let i = proxInicio; i < proxFim; i++) {
          const sombra = this.sombras[i];
          sombra.resetar(largura, altura, this.configuracaoPlataforma, this.configuracaoJogador);
          const sim = this.simulacoes[i];
          sim?.resetar(sombra);
        }
      }
    }
  }

  desenharSombras(contextoCanvas) {
    if (!this.modoObservacao) {
      return;
    }
    const quantidadeAtivas = this._calcularTamanhoCoorte();

    // Desenha apenas as IAs da coorte atual
    const inicio = this.cohortsProcessados * quantidadeAtivas;
    const fim = Math.min(this.sombras.length, inicio + quantidadeAtivas);
    for (let idx = inicio; idx < fim; idx++) {
      const sombra = this.sombras[idx];
      sombra.desenhar(contextoCanvas);
      const simulacao = this.simulacoes[idx];
      if (!simulacao) {
        continue;
      }
      if (simulacao.inimigos?.length) {
        simulacao.inimigos.forEach((inimigo) =>
          this._desenharInimigoFantasma(contextoCanvas, inimigo, sombra.cor)
        );
      }
      if (simulacao.projeteis?.length) {
        this._desenharProjeteisFantasma(contextoCanvas, simulacao.projeteis, sombra.cor);
      }
      if (idx === this.indicePerspectiva) {
        this._desenharSensores(contextoCanvas, sombra);
      }
    }
  }

  aplicarConfiguracao(configuracaoIA) {
    this.configuracaoIA = configuracaoIA;
    this.motor.configuracao = configuracaoIA;

    // Saneamento e clamps de parâmetros críticos
    const tp = Math.max(1, Math.floor(this.configuracaoIA.tamanhoPopulacao ?? 1));
    this.configuracaoIA.tamanhoPopulacao = tp;

    this.relatorioIntervalo = configuracaoIA.relatorioIntervalo || 3; // Atualiza o intervalo de relatório com base na configuração
    this.pesoSucesso = configuracaoIA.pesoSucesso !== undefined ? configuracaoIA.pesoSucesso : 1.0;
    this.pesoFalha = configuracaoIA.pesoFalha !== undefined ? configuracaoIA.pesoFalha : 1.0;
    this.focoSucesso = configuracaoIA.focoSucesso !== undefined ? configuracaoIA.focoSucesso : 0.7;
    this.focoFalha = configuracaoIA.focoFalha !== undefined ? configuracaoIA.focoFalha : 0.3;
    this.controleMultiInimigos = configuracaoIA.controleMultiInimigos !== undefined ? configuracaoIA.controleMultiInimigos : false;
    this.numeroMaximoInimigos = configuracaoIA.numeroMaximoInimigos !== undefined ? configuracaoIA.numeroMaximoInimigos : 5;
    this.taxaAprendizado = configuracaoIA.taxaAprendizado !== undefined ? configuracaoIA.taxaAprendizado : 0.1;
    this.pesoAtaque = configuracaoIA.pesoAtaque !== undefined ? configuracaoIA.pesoAtaque : 1.0;
    this.pesoDefesa = configuracaoIA.pesoDefesa !== undefined ? configuracaoIA.pesoDefesa : 1.0;
    this.pesoCooperacao = configuracaoIA.pesoCooperacao !== undefined ? configuracaoIA.pesoCooperacao : 1.0;
    this.adaptabilidade = configuracaoIA.adaptabilidade !== undefined ? configuracaoIA.adaptabilidade : 1.0;
    this.memoriaCurtoPrazo = configuracaoIA.memoriaCurtoPrazo !== undefined ? configuracaoIA.memoriaCurtoPrazo : 10;
    this.memoriaLongoPrazo = configuracaoIA.memoriaLongoPrazo !== undefined ? configuracaoIA.memoriaLongoPrazo : 100;
    this.pesoExemplosSucesso = configuracaoIA.pesoExemplosSucesso !== undefined ? configuracaoIA.pesoExemplosSucesso : 1.0;
    this.pesoExemplosFalha = configuracaoIA.pesoExemplosFalha !== undefined ? configuracaoIA.pesoExemplosFalha : 1.0;
    this.taxaAprendizadoSucesso = configuracaoIA.taxaAprendizadoSucesso !== undefined ? configuracaoIA.taxaAprendizadoSucesso : 0.1;
    this.taxaAprendizadoFalha = configuracaoIA.taxaAprendizadoFalha !== undefined ? configuracaoIA.taxaAprendizadoFalha : 0.1;
    if (this.contexto) {
      this.configuracaoPlataforma = this.contexto.configuracao.plataforma;
    }
    if (this.sombras.length !== configuracaoIA.tamanhoPopulacao) {
      this._inicializarSombras();
    }
 }

  definirConfiguracaoJogador(configuracaoJogador, configuracaoPlataforma) {
    this.configuracaoJogador = configuracaoJogador;
    if (configuracaoPlataforma) {
      this.configuracaoPlataforma = configuracaoPlataforma;
    }
    for (const sombra of this.sombras) {
      sombra.definirConfiguracoes(this.configuracaoJogador, this.configuracaoPlataforma);
      sombra.resetar(
        this.contexto?.canvas.width ?? 960,
        this.contexto?.canvas.height ?? 540,
        this.configuracaoPlataforma,
        this.configuracaoJogador
      );
    }
    this.simulacoes = this.simulacoes.map((simulacao, indice) => {
      if (!simulacao) {
        return this._criarSimulacao(this.sombras[indice]);
      }
      simulacao.configuracaoInimigos = this.contexto?.configuracao?.inimigos ?? simulacao.configuracaoInimigos;
      simulacao.configuracaoProjeteis = this.contexto?.configuracao?.projeteis ?? simulacao.configuracaoProjeteis;
      simulacao.configuracaoPlataforma = this.contexto?.configuracao?.plataforma ?? simulacao.configuracaoPlataforma;
      simulacao.resetar(this.sombras[indice]);
      return simulacao;
    });
    this.visualizacao?.limpar();
  }

  definirVisualizacao(visualizacao) {
    this.visualizacao = visualizacao;
  }

  obterMultiplicadorVelocidade() {
    if (this.modoObservacao) {
      return this.configuracaoIA.velocidadeSimulacao ?? 1;
    }
    return 1;
  }

  atualizarJogador(delta, jogador) {
    if (!this.modoObservacao) {
      return;
    }
    const melhor = this._obterMelhorSombra();
    if (!melhor) {
      return;
    }
    const alvoX = melhor.x - jogador.largura / 2;
    const diferenca = alvoX - jogador.x;
    jogador.velX += diferenca * 0.6 * delta;
    jogador.velX = Math.max(Math.min(jogador.velX, this.contexto.configuracao.jogador.velocidadeHorizontal), -this.contexto.configuracao.jogador.velocidadeHorizontal);
  }

  forcarGeracao() {
    this.monitor.registrarEvento("Geracao forcada manualmente");
    this._avaliarGeracao();
    this.tempoSimulacao = 0;
    this.tempoDesdeRelatorio = 0;
  }

  resetarTudo() {
    try {
      const largura = this.contexto?.canvas.width ?? 960;
      const altura = this.contexto?.canvas.height ?? 540;
      // Reset de todas as sombras para a posição base/solo
      for (let i = 0; i < this.sombras.length; i++) {
        const sombra = this.sombras[i];
        sombra?.resetar(largura, altura, this.configuracaoPlataforma, this.configuracaoJogador);
      }
      // Reset das simulações independentes mantendo configurações atuais
      this.simulacoes = this.simulacoes.map((sim, i) => {
        if (!sim) return sim;
        sim.configuracaoInimigos = this.contexto?.configuracao?.inimigos ?? sim.configuracaoInimigos;
        sim.configuracaoProjeteis = this.contexto?.configuracao?.projeteis ?? sim.configuracaoProjeteis;
        sim.configuracaoPlataforma = this.contexto?.configuracao?.plataforma ?? sim.configuracaoPlataforma;
        sim.resetar(this.sombras[i]);
        return sim;
      });
      // Zera contadores/temporizadores
      this.cohortsProcessados = 0;
      this.tempoSimulacao = 0;
      this.tempoDesdeRelatorio = 0;
      this.tempoVisualizacao = 0;
      // Atualiza monitor/visualização
      this.monitor?.registrarEvento?.("Reset global do sistema IA");
      this.monitor?.atualizar?.(this._gerarResumo(), { instantaneo: true });
      this.visualizacao?.limpar?.();
    } catch (e) {
      try { this.monitor?.registrarEvento?.("Falha ao resetar IA: " + (e?.message ?? String(e))); } catch {}
    }
  }

  _inicializarSombras() {
    const largura = this.contexto?.canvas.width ?? 960;
    const altura = this.contexto?.canvas.height ?? 540;
    // Cria a população completa com base no tamanho definido
    this.sombras = this.motor.criarPopulacao().map((cromossomo, indice) => {
      const cor = PALETA[indice % PALETA.length];
      const sombra = new AgenteSombra({
        cromossomo,
        cor,
        configuracaoJogador: this.configuracaoJogador,
        configuracaoPlataforma: this.configuracaoPlataforma,
      });
      sombra.resetar(largura, altura, this.configuracaoPlataforma, this.configuracaoJogador);
      return sombra;
    });
    this.simulacoes = this.sombras.map((sombra) => {
      const simulacao = this._criarSimulacao(sombra);
      simulacao.resetar(sombra);
      return simulacao;
    });
    this.cohortsProcessados = 0;
    if (this.indicePerspectiva >= this.sombras.length) {
      this.indicePerspectiva = -1;
    }
    this.monitor.registrarEvento("Nova populacao inicializada");
    this.monitor.atualizar(this._gerarResumo(), { evolucao: true });
    const melhor = this._obterMelhorSombra();
    if (melhor?.ultimaAtivacao) {
      this.visualizacao?.atualizarAtivacoes({
        ...melhor.ultimaAtivacao,
        fitness: melhor.cromossomo.fitness,
      });
    }
    this._aplicarTemaPorAgente(melhor?.cor);
  }

  _avaliarGeracao() {
    const resumo = this._gerarResumo();
    this.monitor.atualizar(resumo, { evolucao: true });
    const mensagemGeracao = this.monitor.gerarMensagemGeracao?.(resumo);
    if (mensagemGeracao) {
      this.monitor.registrarEvento(mensagemGeracao);
    }
    const melhor = this._obterMelhorSombra();
    if (melhor) {
      const pesos = melhor.cromossomo.pesos;
      const insightPesos = this.monitor.obterInsightPesos?.(pesos);
      if (insightPesos) {
        this.monitor.registrarEvento(insightPesos);
      }
      if (melhor.ultimaAtivacao && this.contexto?.obterDado("efeitosVisuaisAtivos") !== false) {
        this.visualizacao?.atualizarAtivacoes({
          ...melhor.ultimaAtivacao,
          fitness: melhor.cromossomo.fitness,
        });
      }
      this._aplicarTemaPorAgente(melhor.cor);
    }
    const cromossomos = this.sombras.map((sombra) => sombra.cromossomo);
    const novaGeracao = this.motor.proximaGeracao(cromossomos);
    const largura = this.contexto.canvas.width;
    const altura = this.contexto.canvas.height;
    const novasSombras = [];
    const novasSimulacoes = [];
    novaGeracao.forEach((cromossomo, indice) => {
      const cor = PALETA[indice % PALETA.length];
      const sombraExistente = this.sombras[indice];
      const sombra =
        sombraExistente ??
        new AgenteSombra({
          cromossomo,
          cor,
          configuracaoJogador: this.configuracaoJogador,
          configuracaoPlataforma: this.configuracaoPlataforma,
        });
      sombra.cromossomo = cromossomo;
      sombra.configuracao = this.configuracaoJogador;
      sombra.definirConfiguracoes?.(this.configuracaoJogador, this.configuracaoPlataforma);
      sombra.resetar(largura, altura, this.configuracaoPlataforma, this.configuracaoJogador);
      sombra.cor = cor;
      novasSombras.push(sombra);
      const simulacaoExistente = this.simulacoes[indice] ?? this._criarSimulacao(sombra);
      simulacaoExistente.resetar(sombra);
      novasSimulacoes.push(simulacaoExistente);
    });
    this.sombras = novasSombras;
    this.simulacoes = novasSimulacoes;
    if (this.indicePerspectiva >= this.sombras.length) {
      this.indicePerspectiva = -1;
    }
    if (this.contexto?.obterDado("efeitosVisuaisAtivos") !== false) {
      this.visualizacao?.atualizarFitness(resumo);
    }
  }

  _gerarResumo() {
    if (!this.sombras.length) {
      return {
        geracao: this.motor.geracao,
        melhorFitness: 0,
        mediaFitness: 0,
        desviosTotais: 0,
        colisoesTotais: 0,
      };
    }
    const fitness = this.sombras.map((sombra) => sombra.cromossomo.fitness);
    const melhor = Math.max(...fitness);
    const soma = fitness.reduce((total, valor) => total + valor, 0);
    const desviosTotais = this.sombras.reduce((total, sombra) => total + sombra.desvios, 0);
    const colisoesTotais = this.sombras.reduce((total, sombra) => total + sombra.colisoes, 0);
    return {
      geracao: this.motor.geracao,
      melhorFitness: melhor,
      mediaFitness: soma / fitness.length,
      desviosTotais,
      colisoesTotais,
    };
  }

  _obterMelhorSombra() {
    if (!this.sombras.length) {
      return null;
    }
    return this.sombras.reduce((melhor, sombra) => {
      const fitnessAtual = sombra.cromossomo.fitness;
      const fitnessMelhor = melhor?.cromossomo.fitness ?? -Infinity;
      return fitnessAtual > fitnessMelhor ? sombra : melhor;
    }, null);
  }

  alternarPerspectiva() {
    if (!this.sombras.length) {
      this.indicePerspectiva = -1;
      return this.indicePerspectiva;
    }
    if (this.indicePerspectiva === -1) {
      this.indicePerspectiva = 0;
    } else if (this.indicePerspectiva >= this.sombras.length - 1) {
      this.indicePerspectiva = -1;
    } else {
      this.indicePerspectiva += 1;
    }
    return this.indicePerspectiva;
  }

  _calcularTamanhoCoorte() {
    const tp = this.sombras?.length || Math.max(1, Math.floor(this.configuracaoIA?.tamanhoPopulacao ?? 1));
    const renderAtivo = this.contexto?.obterDado("efeitosVisuaisAtivos") !== false;
    // Quando renderiza, coortes menores para preservar FPS; sem render, coortes maiores para acelerar aprendizado
    const base = Math.ceil(tp / (renderAtivo ? 12 : 4));
    const tamanho = Math.max(8, Math.min(base, 256));
    return Math.min(tamanho, tp);
  }

  _aplicarTemaPorAgente(cor) {
    try {
      // Respeita override manual (tema fixo ou arco-íris)
      const override = globalThis?.window?.redeNeuralTemaOverride;
      if (override) {
        return;
      }
      if (!cor) {
        return;
      }
      document.documentElement.style.setProperty("--accent-1", cor);
    } catch {
      // Ambiente sem DOM; ignorar
    }
  }

  _criarSimulacao(sombra) {
    return new SimulacaoIndependente({
      canvasLargura: this.contexto?.canvas.width ?? 960,
      canvasAltura: this.contexto?.canvas.height ?? 540,
      configuracaoInimigos: this.contexto?.configuracao?.inimigos ?? {},
      configuracaoProjeteis: this.contexto?.configuracao?.projeteis ?? {},
      configuracaoPlataforma: this.contexto?.configuracao?.plataforma ?? {},
    });
  }

  _desenharSensores(contexto, sombra) {
    const largura = sombra.larguraReferencia ?? 32;
    const altura = sombra.alturaReferencia ?? 64;
    const origemX = sombra.x;
    const origemY = sombra.y - altura * 0.6;
    contexto.save();
    contexto.setLineDash([8, 6]);
    contexto.lineWidth = 2;
    contexto.strokeStyle = "rgba(255, 255, 255, 0.65)";

    if (this.contexto?.canvas) {
      const raio = this.contexto.canvas.width * 0.18;
      contexto.beginPath();
      contexto.arc(origemX, sombra.y - altura * 0.5, raio, 0, Math.PI * 2);
      contexto.stroke();
    }

    if (sombra.alvoProjetilAtual) {
      const proj = sombra.alvoProjetilAtual;
      const projX = proj.x + (proj.largura ?? 12) / 2;
      const projY = proj.y + (proj.altura ?? 12) / 2;
      contexto.strokeStyle = "rgba(154, 212, 255, 0.9)";
      contexto.beginPath();
      contexto.moveTo(origemX, origemY);
      contexto.lineTo(projX, projY);
      contexto.stroke();
      contexto.fillStyle = "rgba(154, 212, 255, 0.55)";
      contexto.beginPath();
      contexto.arc(projX, projY, 8, 0, Math.PI * 2);
      contexto.fill();
    }

    if (sombra.alvoInimigoAtual) {
      const inimigo = sombra.alvoInimigoAtual;
      const inimigoX = inimigo.x + inimigo.largura / 2;
      const inimigoY = inimigo.y + inimigo.altura / 2;
      contexto.strokeStyle = "rgba(255, 180, 120, 0.9)";
      contexto.beginPath();
      contexto.moveTo(origemX, origemY);
      contexto.lineTo(inimigoX, inimigoY);
      contexto.stroke();
      contexto.fillStyle = "rgba(255, 190, 120, 0.45)";
      contexto.beginPath();
      contexto.arc(inimigoX, inimigoY, 10, 0, Math.PI * 2);
      contexto.fill();
    }

    contexto.setLineDash([]);
    contexto.fillStyle = "#e2ecff";
    contexto.font = "11px 'Segoe UI'";
    contexto.textAlign = "center";
    const sensores = sombra.ultimaAtivacao?.sensores ?? {};
    const texto = `proj:${this._formatarNumeroCurto(sensores.distanciaProjetil)}  ang:${this._formatarNumeroCurto(
      sensores.anguloProjetil
    )}  tempo:${this._formatarNumeroCurto(sensores.tempoImpactoProjetil)}  inim:${this._formatarNumeroCurto(
      sensores.distanciaInimigo
    )}  angI:${this._formatarNumeroCurto(sensores.anguloInimigo)}`;
    contexto.fillText(texto, origemX, origemY - 14);
    contexto.restore();
  }

  _desenharInimigoFantasma(contexto, inimigo, corBase) {
    const cor = corBase ?? "rgba(120, 170, 255, 0.7)";
    contexto.save();
    contexto.globalAlpha = 0.35;
    contexto.fillStyle = cor;
    contexto.strokeStyle = "rgba(180, 210, 255, 0.65)";
    contexto.lineWidth = 2;
    contexto.beginPath();
    contexto.ellipse(
      inimigo.x + inimigo.largura / 2,
      inimigo.y + inimigo.altura / 2,
      inimigo.largura / 2,
      inimigo.altura / 2,
      0,
      0,
      Math.PI * 2
    );
    contexto.fill();
    contexto.stroke();
    contexto.beginPath();
    contexto.moveTo(inimigo.x + inimigo.largura * 0.25, inimigo.y + inimigo.altura * 0.1);
    contexto.lineTo(inimigo.x, inimigo.y + inimigo.altura * 0.45);
    contexto.moveTo(inimigo.x + inimigo.largura * 0.75, inimigo.y + inimigo.altura * 0.1);
    contexto.lineTo(inimigo.x + inimigo.largura, inimigo.y + inimigo.altura * 0.45);
    contexto.stroke();
    contexto.restore();
  }

  _desenharProjeteisFantasma(contexto, projeteis, corBase) {
    for (const proj of projeteis) {
      const cor = proj.cor ?? corBase ?? "#a670ff";
      contexto.save();
      contexto.globalAlpha = 0.25;
      contexto.lineWidth = 3;
      contexto.strokeStyle = cor;
      contexto.beginPath();
      const origemX = proj.origemX ?? proj.x + proj.largura / 2 - proj.velX * 0.1;
      const origemY = proj.origemY ?? proj.y + proj.altura / 2 - proj.velY * 0.1;
      contexto.moveTo(origemX, origemY);
      contexto.lineTo(proj.x + proj.largura / 2, proj.y + proj.altura / 2);
      contexto.stroke();
      contexto.globalAlpha = 0.45;
      contexto.fillStyle = cor;
      contexto.beginPath();
      contexto.arc(proj.x + proj.largura / 2, proj.y + proj.altura / 2, 7, 0, Math.PI * 2);
      contexto.fill();
      if (proj.trilha?.length) {
        contexto.globalAlpha = 0.18;
        proj.trilha.forEach((ponto) => {
          contexto.beginPath();
          contexto.arc(ponto.x + proj.largura / 2, ponto.y + proj.altura / 2, 5 * Math.max(0, ponto.vida * 2), 0, Math.PI * 2);
          contexto.fill();
        });
      }
      contexto.restore();
    }
  }

  _formatarNumeroCurto(valor) {
    const numero = Number(valor);
    if (!Number.isFinite(numero)) {
      return "0.00";
    }
    return numero.toFixed(2);
  }
}
