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
    this.modoObservacao = false;
    this.sombras = [];
    this.simulacoes = [];
    this.motor = new MotorEvolutivo(configuracaoIA);
    this.tempoSimulacao = 0;
    this.relatorioIntervalo = 3;
    this.tempoDesdeRelatorio = 0;
    this.configuracaoJogador = null;
    this.configuracaoPlataforma = null;
    this.visualizacao = null;
    this.tempoVisualizacao = 0;
    this.indicePerspectiva = -1;
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
    const velocidade = this.modoObservacao ? 1 : this.configuracaoIA.velocidadeSimulacao;
    const passo = delta * velocidade;
    this.sombras.forEach((sombra, indice) => {
      const simulacao = this.simulacoes[indice];
      const percepcao = simulacao?.atualizar(passo, sombra) ?? { projeteis: [], inimigos: [] };
      sombra.atualizar(
        passo,
        this.contexto,
        percepcao.projeteis ?? [],
        this.configuracaoJogador,
        this.configuracaoPlataforma,
        percepcao.inimigos ?? []
      );
    });

    const vivos = this.sombras.filter((sombra) => !sombra.morto).length;
    this.tempoVisualizacao += passo;
    this.tempoDesdeRelatorio += passo;
    if (this.tempoVisualizacao >= 0.25) {
      const melhor = this._obterMelhorSombra();
      if (melhor?.ultimaAtivacao) {
        this.visualizacao?.atualizarAtivacoes({
          ...melhor.ultimaAtivacao,
          fitness: melhor.cromossomo.fitness,
        });
      }
      this.tempoVisualizacao = 0;
    }
    if (this.tempoDesdeRelatorio >= this.relatorioIntervalo) {
      this.monitor.atualizar(this._gerarResumo(), { instantaneo: true });
      this.tempoDesdeRelatorio = 0;
    }
    this.tempoSimulacao += passo;
    if (vivos === 0) {
      this._avaliarGeracao();
      this.tempoSimulacao = 0;
      this.tempoDesdeRelatorio = 0;
    }
  }

  desenharSombras(contextoCanvas) {
    if (!this.modoObservacao) {
      return;
    }
    this.sombras.forEach((sombra, indice) => {
      sombra.desenhar(contextoCanvas);
      const simulacao = this.simulacoes[indice];
      if (!simulacao) {
        return;
      }
      if (simulacao.inimigos?.length) {
        simulacao.inimigos.forEach((inimigo) =>
          this._desenharInimigoFantasma(contextoCanvas, inimigo, sombra.cor)
        );
      }
      if (simulacao.projeteis?.length) {
        this._desenharProjeteisFantasma(contextoCanvas, simulacao.projeteis, sombra.cor);
      }
      if (indice === this.indicePerspectiva) {
        this._desenharSensores(contextoCanvas, sombra);
      }
    });
  }

  aplicarConfiguracao(configuracaoIA) {
    this.configuracaoIA = configuracaoIA;
    this.motor.configuracao = configuracaoIA;
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

  _inicializarSombras() {
    const largura = this.contexto?.canvas.width ?? 960;
    const altura = this.contexto?.canvas.height ?? 540;
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
  }

  _avaliarGeracao() {
    const resumo = this._gerarResumo();
    this.monitor.atualizar(resumo, { evolucao: true });
    this.monitor.registrarEvento(
      `Geracao ${resumo.geracao} melhor ${resumo.melhorFitness.toFixed(2)} media ${resumo.mediaFitness.toFixed(
        2
      )}`
    );
    const melhor = this._obterMelhorSombra();
    if (melhor) {
      const pesos = melhor.cromossomo.pesos;
      this.monitor.registrarEvento(
        `Pesos destaque PX:${pesos.posicaoX.toFixed(2)} DP:${pesos.distanciaProjetil.toFixed(2)} AP:${pesos.alturaProjetil.toFixed(2)} ANG:${(pesos.anguloProjetil ?? 0).toFixed(2)} TMP:${(
          pesos.tempoImpactoProjetil ?? 0
        ).toFixed(2)} DIN:${(pesos.distanciaInimigo ?? 0).toFixed(2)} AIN:${(pesos.alturaInimigo ?? 0).toFixed(2)} ANGI:${(
          pesos.anguloInimigo ?? 0
        ).toFixed(2)} MEM:${pesos.memoria.toFixed(2)}`
      );
      if (melhor.ultimaAtivacao) {
        this.visualizacao?.atualizarAtivacoes({
          ...melhor.ultimaAtivacao,
          fitness: melhor.cromossomo.fitness,
        });
      }
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
    this.visualizacao?.atualizarFitness(resumo);
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
