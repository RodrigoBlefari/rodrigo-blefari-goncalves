import { aleatorioIntervalo, limitar } from "../core/utilitarios.js";
import { desenharStick } from "../entidades/desenhoStick.js";

export class AgenteSombra {
  constructor({ cromossomo, cor, configuracaoJogador, configuracaoPlataforma }) {
    this.cromossomo = cromossomo;
    this.cor = cor;
    this.configuracaoJogador = configuracaoJogador;
    this.configuracaoPlataforma = configuracaoPlataforma;
    this.alturaReferencia = configuracaoJogador?.alturaBase ?? 64;
    this.larguraReferencia = configuracaoJogador?.larguraBase ?? 32;
    this.alvoProjetilAtual = null;
    this.alvoInimigoAtual = null;
    this.projeteisRecentes = [];
    this.resetar();
    this.ultimaAtivacao = null;
  }

  definirConfiguracoes(configuracaoJogador, configuracaoPlataforma) {
    this.configuracaoJogador = configuracaoJogador ?? this.configuracaoJogador;
    this.configuracaoPlataforma = configuracaoPlataforma ?? this.configuracaoPlataforma;
    this.alturaReferencia = this.configuracaoJogador?.alturaBase ?? this.alturaReferencia;
    this.larguraReferencia = this.configuracaoJogador?.larguraBase ?? this.larguraReferencia;
  }

  resetar(largura = 960, altura = 540, plataforma = this.configuracaoPlataforma, configuracaoJogador = this.configuracaoJogador) {
    this.definirConfiguracoes(configuracaoJogador, plataforma);
    const topo = this._obterTopoPlataforma(altura, plataforma);
    this.x = aleatorioIntervalo(largura * 0.2, largura * 0.4);
    this.y = topo;
    this.velX = 0;
    this.velY = 0;
    this.tempoVivo = 0;
    this.colisoes = 0;
    this.desvios = 0;
    this.distanciaPercorrida = 0;
    this.morto = false;
    this.ultimaAtivacao = null;
    this.alvoProjetilAtual = null;
    this.alvoInimigoAtual = null;
    this.projeteisRecentes = [];
  }

  atualizar(delta, contexto, projeteis, configuracaoJogador, configuracaoPlataforma, inimigos = []) {
    this.definirConfiguracoes(configuracaoJogador, configuracaoPlataforma);
    if (this.morto) {
      return;
    }
    this.tempoVivo += delta;
    const canvas = contexto.canvas;
    const topo = this._obterTopoPlataforma(canvas.height, this.configuracaoPlataforma);
    const velocidadeTarget = this.configuracaoJogador?.velocidadeHorizontal ?? 220;
    const impulso = this.configuracaoJogador?.impulsoPulo ?? 820;
    const aceleracao = velocidadeTarget * 3;
    const alvoProjetil = this._detectarProjetilMaisProximo(projeteis);
    const alvoInimigo = this._detectarInimigoMaisProximo(inimigos);
    const sensoriais = this._calcularSensores(alvoProjetil, alvoInimigo, canvas, projeteis);
    const decisao = this._processarRede(sensoriais, delta);
    this.alvoProjetilAtual = alvoProjetil;
    this.alvoInimigoAtual = alvoInimigo;
    this.projeteisRecentes = projeteis;
    this.velX += decisao.movimentoHorizontal * aceleracao * delta;
    this.velX = limitar(this.velX, -velocidadeTarget, velocidadeTarget);
    if (decisao.pular && Math.abs(this.y - topo) < 2) {
      this.velY = -impulso;
    }

    this.velY += contexto.configuracao.jogo.gravidade * 0.8 * delta;
    this.x += this.velX * delta;
    this.y += this.velY * delta;
    this.distanciaPercorrida += Math.abs(this.velX * delta);
    if (this.y >= topo) {
      this.y = topo;
      this.velY = 0;
    }
    this.x = limitar(this.x, 0, canvas.width);
    if (alvoProjetil && this._colidiu(alvoProjetil)) {
      this.colisoes += 1;
      this.morto = true;
    } else if (alvoProjetil && decisao.evadiu) {
      this.desvios += 1;
    }
    this._atualizarFitness();
    this.ultimaAtivacao = {
      sensores: {
        posicaoX: sensoriais.posicaoX ?? 0,
        distanciaProjetil: sensoriais.distanciaProjetil ?? 0,
        alturaProjetil: sensoriais.alturaProjetil ?? 0,
        anguloProjetil: sensoriais.anguloProjetil ?? 0,
        tempoImpactoProjetil: sensoriais.tempoImpactoProjetil ?? -1,
        distanciaInimigo: sensoriais.distanciaInimigo ?? 0,
        alturaInimigo: sensoriais.alturaInimigo ?? 0,
        anguloInimigo: sensoriais.anguloInimigo ?? 0,
        densidadeProjetil: sensoriais.densidadeProjetil ?? -1,
        memoria: decisao.memoriaAnterior ?? 0,
      },
      pesos: { ...this.cromossomo.pesos },
      movimentoBruto: decisao.movimentoBruto ?? 0,
      saidaMovimento: decisao.movimentoHorizontal ?? 0,
      saidaPulo: decisao.pular ? 1 : 0,
      fitness: this.cromossomo.fitness,
      memoriaAtual: decisao.memoriaAtual ?? 0,
      evadiu: decisao.evadiu ?? false,
      chancePulo: decisao.chancePulo ?? 0,
    };
  }

  desenhar(contextoCanvas) {
    const largura = this.larguraReferencia ?? 32;
    const altura = this.alturaReferencia ?? 64;
    const centroBaseX = this.x;
    const baseY = this.y;
    contextoCanvas.save();
    contextoCanvas.globalAlpha = 0.35;
    contextoCanvas.fillStyle = "rgba(0, 0, 0, 0.2)";
    contextoCanvas.beginPath();
    contextoCanvas.ellipse(centroBaseX, baseY + altura * 0.05, largura * 0.7, altura * 0.12, 0, 0, Math.PI * 2);
    contextoCanvas.fill();
    contextoCanvas.restore();

    desenharStick({
      contexto: contextoCanvas,
      x: centroBaseX - largura / 2,
      y: baseY - altura,
      largura,
      altura,
      corLinha: this.cor ?? "rgba(150, 200, 255, 0.8)",
      alpha: 0.45,
      sombraCor: "rgba(120, 180, 255, 0.2)",
      sombraDeslocamentoY: 4,
      sombraBlur: 12,
    });
  }

  _detectarProjetilMaisProximo(projeteis) {
    if (!projeteis || projeteis.length === 0) {
      return null;
    }
    let maisProximo = null;
    let menorDistancia = Infinity;
    for (const proj of projeteis) {
      const distancia = Math.abs(proj.x - this.x);
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        maisProximo = proj;
      }
    }
    return maisProximo;
  }

  _detectarInimigoMaisProximo(inimigos) {
    if (!inimigos || inimigos.length === 0) {
      return null;
    }
    let alvo = null;
    let menorDistancia = Infinity;
    for (const inimigo of inimigos) {
      if (!inimigo?.ativo) {
        continue;
      }
      const centroX = inimigo.x + inimigo.largura / 2;
      const distancia = Math.abs(centroX - this.x);
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        alvo = inimigo;
      }
    }
    return alvo;
  }

  _calcularSensores(projetil, inimigo, canvas, projeteis) {
    const normalizar = (valor, divisor) => (divisor === 0 ? 0 : valor / divisor);
    const posicaoX = normalizar(this.x - canvas.width / 2, canvas.width / 2);

    let distanciaProjetil = 1;
    let alturaProjetil = 0;
    let tempoImpactoProjetil = -1;
    let anguloProjetil = 0;
    if (projetil) {
      const centroProj = projetil.x + projetil.largura / 2;
      const centroProjY = projetil.y + projetil.altura / 2;
      const deltaX = centroProj - this.x;
      const deltaY = centroProjY - this.y;
      distanciaProjetil = normalizar(deltaX, canvas.width / 2);
      alturaProjetil = normalizar(deltaY, canvas.height / 2);
      if (deltaX !== 0 || deltaY !== 0) {
        anguloProjetil = Math.atan2(this.y - centroProjY, this.x - centroProj) / Math.PI;
      }
      const distancia = Math.hypot(deltaX, deltaY);
      const velocidade = Math.hypot(projetil.velX, projetil.velY) || 1;
      const tempo = distancia / velocidade;
      const urgencia = 1 - Math.min(1, tempo / 3);
      tempoImpactoProjetil = urgencia * 2 - 1;
    }

    let distanciaInimigo = 1;
    let alturaInimigo = 0;
    let anguloInimigo = 0;
    if (inimigo) {
      const centroInimigoX = inimigo.x + inimigo.largura / 2;
      const centroInimigoY = inimigo.y + inimigo.altura / 2;
      distanciaInimigo = normalizar(centroInimigoX - this.x, canvas.width / 2);
      alturaInimigo = normalizar(centroInimigoY - this.y, canvas.height / 2);
      const deltaInimigoX = this.x - centroInimigoX;
      const deltaInimigoY = this.y - centroInimigoY;
      if (deltaInimigoX !== 0 || deltaInimigoY !== 0) {
        anguloInimigo = Math.atan2(deltaInimigoY, deltaInimigoX) / Math.PI;
      }
    }

    const densidadeProjetil = (() => {
      if (!projeteis?.length) {
        return -1;
      }
      const alcance = canvas.width * 0.18;
      let contagem = 0;
      for (const proj of projeteis) {
        const cx = proj.x + proj.largura / 2;
        const cy = proj.y + proj.altura / 2;
        if (Math.hypot(cx - this.x, cy - this.y) <= alcance) {
          contagem += 1;
        }
      }
      const densidade = Math.min(1, contagem / 6);
      return densidade * 2 - 1;
    })();

    return {
      posicaoX,
      distanciaProjetil,
      alturaProjetil,
      anguloProjetil,
      tempoImpactoProjetil,
      distanciaInimigo,
      alturaInimigo,
      anguloInimigo,
      densidadeProjetil,
    };
  }

  _processarRede(sensores, delta) {
    const { pesos, memoria } = this.cromossomo;
    const memoriaAnterior = memoria;
    const movimento =
      pesos.posicaoX * sensores.posicaoX +
      pesos.distanciaProjetil * sensores.distanciaProjetil +
      pesos.alturaProjetil * sensores.alturaProjetil +
      (pesos.anguloProjetil ?? 0) * sensores.anguloProjetil +
      (pesos.tempoImpactoProjetil ?? 0) * sensores.tempoImpactoProjetil +
      (pesos.distanciaInimigo ?? 0) * sensores.distanciaInimigo +
      (pesos.alturaInimigo ?? 0) * sensores.alturaInimigo +
      (pesos.anguloInimigo ?? 0) * sensores.anguloInimigo +
      (pesos.densidadeProjetil ?? 0) * sensores.densidadeProjetil +
      pesos.memoria * memoria;
    let evadiu = false;
    if (Math.abs(sensores.distanciaProjetil) < 0.08 && sensores.alturaProjetil > -0.05) {
      evadiu = Math.sign(movimento) !== Math.sign(sensores.distanciaProjetil);
    }
    const urgenciaProjetil = Math.max(0, sensores.tempoImpactoProjetil);
    const densidadePositiva = Math.max(0, sensores.densidadeProjetil);
    const alinhamentoVertical = Math.max(0, -sensores.alturaProjetil);
    const alertaInimigo = Math.max(0, 1 - Math.abs(sensores.distanciaInimigo));
    let chanceBase =
      0.06 +
      urgenciaProjetil * 0.45 +
      densidadePositiva * 0.25 +
      alinhamentoVertical * 0.35 +
      alertaInimigo * 0.15;
    chanceBase = Math.max(0.01, Math.min(1, chanceBase));
    const dt = Math.max(1 / 240, delta);
    const chanceInstantanea = 1 - Math.exp(-chanceBase * dt * 60);
    const decisao = {
      movimentoHorizontal: Math.tanh(movimento),
      pular: Math.random() < chanceInstantanea,
      evadiu,
    };
    const novaMemoria = (memoriaAnterior + decisao.movimentoHorizontal) * 0.5;
    this.cromossomo.memoria = novaMemoria;
    decisao.movimentoBruto = movimento;
    decisao.memoriaAnterior = memoriaAnterior;
    decisao.memoriaAtual = novaMemoria;
    decisao.chancePulo = chanceInstantanea;
    return decisao;
  }

  _colidiu(projetil) {
    const largura = (this.larguraReferencia ?? 32) * 0.8;
    const altura = this.alturaReferencia ?? 64;
    const topo = this.y - altura;
    return (
      this.x + largura / 2 > projetil.x &&
      this.x - largura / 2 < projetil.x + projetil.largura &&
      this.y > projetil.y &&
      topo < projetil.y + projetil.altura
    );
  }

  _atualizarFitness() {
    const tempo = this.tempoVivo;
    const distancia = this.distanciaPercorrida ?? 0;
    const penalidade = this.colisoes * 30;
    const bonusDesvio = this.desvios * 6;
    const sobrevivente = this.morto ? 0 : 40;
    const base = tempo * 80 + distancia * 0.4 + bonusDesvio + sobrevivente - penalidade;
    this.cromossomo.fitness = Math.max(0, base);
  }

  _obterTopoPlataforma(alturaCanvas, plataforma = {}) {
    const alturaPlataforma = plataforma.altura ?? 0;
    return alturaCanvas - alturaPlataforma;
  }
}
