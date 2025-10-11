import { InimigoVoador } from "../entidades/inimigoVoador.js";
import { aleatorioIntervalo } from "../core/utilitarios.js";

export class SimulacaoIndependente {
  constructor({
    canvasLargura,
    canvasAltura,
    configuracaoInimigos,
    configuracaoProjeteis,
    configuracaoPlataforma = {},
  }) {
    this.canvasLargura = canvasLargura;
    this.canvasAltura = canvasAltura;
    this.configuracaoInimigos = configuracaoInimigos;
    this.configuracaoProjeteis = configuracaoProjeteis;
    this.configuracaoPlataforma = configuracaoPlataforma;
    this.projeteis = [];
    this.inimigos = [];
    this.tempoDesdeSpawn = 0;
    this._sistemaProjeteis = {
      criarProjetil: (config) => this._criarProjetil(config),
    };
  }

  resetar(agente) {
    this.projeteis = [];
    this.inimigos = [];
    this.tempoDesdeSpawn = 0;
  }

  atualizar(delta, agente) {
    if (!agente) {
      return { projeteis: this.projeteis, inimigos: this.inimigos };
    }
    this._spawnSeNecessario(delta);
    this._atualizarInimigos(delta, agente);
    this._atualizarProjeteis(delta);
    return { projeteis: this.projeteis, inimigos: this.inimigos };
  }

  _spawnSeNecessario(delta) {
    this.tempoDesdeSpawn += delta;
    const intervalo = this.configuracaoInimigos.tempoEntreSpawns ?? 2.5;
    if (this.tempoDesdeSpawn < intervalo) {
      return;
    }
    this.tempoDesdeSpawn = 0;
    const alturaPlataforma = this.configuracaoPlataforma.altura ?? 0;
    const topoPlataforma = this.canvasAltura - alturaPlataforma;
    const variacao = this.configuracaoInimigos.variacaoAltura ?? 140;
    const posY =
      this.canvasAltura * 0.35 + aleatorioIntervalo(-variacao, variacao);
    const alturaInimigo = 48;
    const limiteSuperior = this.canvasAltura * 0.12;
    const limiteInferior = topoPlataforma - alturaInimigo - 32;
    const yClamped = Math.max(limiteSuperior, Math.min(posY, limiteInferior));
    const inimigo = new InimigoVoador({
      x: this.canvasLargura + 60,
      y: yClamped,
      largura: 64,
      altura: 48,
      velocidade: this.configuracaoInimigos.velocidadeBase ?? 120,
      agressividade: this.configuracaoInimigos.agressividade ?? 1,
      distanciaAtaque: this.configuracaoInimigos.distanciaAtaque ?? 320,
      tempoCiclo: this.configuracaoInimigos.tempoCiclo ?? 6.0,
      variacaoAltura: (this.configuracaoInimigos.variacaoAltura ?? 140) / 80,
      intervaloAtaque:
        (this.configuracaoProjeteis.cadencia ?? 1.6) /
        (this.configuracaoInimigos.agressividade ?? 1),
      velocidadeProjetil: this.configuracaoProjeteis.velocidade ?? 280,
      dano: this.configuracaoProjeteis.dano ?? 1,
      corProjetil: this.configuracaoProjeteis.cor ?? "#a670ff",
    });
    inimigo.ativo = true;
    this.inimigos.push(inimigo);
  }

  _atualizarInimigos(delta, agente) {
    const contexto = this._obterContexto(agente);
    for (const inimigo of this.inimigos) {
      inimigo.atualizar(delta, contexto);
      if (this._colidiuComAgente(inimigo, agente)) {
        agente.colisoes += 1;
        agente.morto = true;
      }
    }
    this.inimigos = this.inimigos.filter((inimigo) => inimigo.ativo);
  }

  _atualizarProjeteis(delta) {
    for (const proj of this.projeteis) {
      proj.x += proj.velX * delta;
      proj.y += proj.velY * delta;
      proj.trilha.push({ x: proj.x, y: proj.y, vida: 0.25 });
      for (const ponto of proj.trilha) {
        ponto.vida -= delta;
      }
      proj.trilha = proj.trilha.filter((ponto) => ponto.vida > 0);
      if (
        proj.x < -20 ||
        proj.x > this.canvasLargura + 20 ||
        proj.y < -20 ||
        proj.y > this.canvasAltura + 20
      ) {
        proj.ativo = false;
      }
    }
    this.projeteis = this.projeteis.filter((proj) => proj.ativo);
  }

  _criarProjetil({ x, y, velX, velY, dano, cor }) {
    this.projeteis.push({
      x: x - 6,
      y: y - 6,
      largura: 12,
      altura: 12,
      velX,
      velY,
      dano,
      cor: cor ?? this.configuracaoProjeteis.cor ?? "#a670ff",
      ativo: true,
      trilha: [],
      origemX: x,
      origemY: y,
    });
  }

  _obterContexto(agente) {
    const jogadorProxy = {
      x: agente.x - agente.larguraReferencia / 2,
      y: agente.y - agente.alturaReferencia,
      largura: agente.larguraReferencia,
      altura: agente.alturaReferencia,
    };
    return {
      canvas: { width: this.canvasLargura, height: this.canvasAltura },
      configuracao: {
        plataforma: this.configuracaoPlataforma,
        projeteis: this.configuracaoProjeteis,
      },
      obterSistema: (nome) => {
        if (nome === "jogador") {
          return { jogador: jogadorProxy };
        }
        if (nome === "projeteis") {
          return this._sistemaProjeteis;
        }
        return null;
      },
    };
  }

  _colidiuComAgente(inimigo, agente) {
    const agenteX = agente.x - agente.larguraReferencia / 2;
    const agenteY = agente.y - agente.alturaReferencia;
    return !(
      agenteX + agente.larguraReferencia < inimigo.x ||
      agenteX > inimigo.x + inimigo.largura ||
      agenteY + agente.alturaReferencia < inimigo.y ||
      agenteY > inimigo.y + inimigo.altura
    );
  }
}
