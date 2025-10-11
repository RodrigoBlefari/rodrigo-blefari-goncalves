import { aleatorioIntervalo, escolherAleatorio } from "../core/utilitarios.js";

const PESOS_CHAVES = Object.freeze([
  "posicaoX",
  "distanciaProjetil",
  "alturaProjetil",
  "memoria",
  "tempoImpactoProjetil",
  "distanciaInimigo",
  "alturaInimigo",
  "densidadeProjetil",
]);

function gerarUUID() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `uuid-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

function gerarPesosAleatorios() {
  const pesos = {};
  for (const chave of PESOS_CHAVES) {
    if (chave === "memoria") {
      pesos[chave] = aleatorioIntervalo(-0.5, 0.5);
    } else {
      pesos[chave] = aleatorioIntervalo(-1, 1);
    }
  }
  return pesos;
}

export class MotorEvolutivo {
  constructor(configuracao) {
    this.configuracao = configuracao;
    this.geracao = 0;
  }

  criarPopulacao() {
    const individuos = [];
    for (let i = 0; i < this.configuracao.tamanhoPopulacao; i += 1) {
      individuos.push(this._gerarCromossomo());
    }
    return individuos;
  }

  proximaGeracao(individuos) {
    const ordenados = [...individuos].sort((a, b) => b.fitness - a.fitness);
    const elite = ordenados.slice(0, Math.max(1, Math.floor(ordenados.length * 0.2)));
    const novaPopulacao = [...elite];
    while (novaPopulacao.length < this.configuracao.tamanhoPopulacao) {
      const paiA = escolherAleatorio(elite) ?? this._gerarCromossomo();
      const paiB = escolherAleatorio(ordenados) ?? this._gerarCromossomo();
      novaPopulacao.push(this._cruzar(paiA, paiB));
    }
    this.geracao += 1;
    return novaPopulacao.map((cromossomo) => ({
      ...cromossomo,
      pesos: this._mutar(cromossomo.pesos),
      fitness: 0,
      memoria: 0,
    }));
  }

  _gerarCromossomo() {
    return {
      id: gerarUUID(),
      pesos: gerarPesosAleatorios(),
      memoria: 0,
      fitness: 0,
    };
  }

  _cruzar(a, b) {
    const pesos = {};
    for (const chave of PESOS_CHAVES) {
      const valorA = a.pesos?.[chave] ?? 0;
      const valorB = b.pesos?.[chave] ?? 0;
      if (Math.random() < 0.5) {
        pesos[chave] = (valorA + valorB) / 2;
      } else {
        pesos[chave] = escolherAleatorio([valorA, valorB]);
      }
    }
    return {
      id: gerarUUID(),
      pesos,
      memoria: 0,
      fitness: 0,
    };
  }

  _mutar(pesos) {
    const mutados = { ...pesos };
    const chance = this.configuracao.taxaMutacao;
    for (const chave of PESOS_CHAVES) {
      if (Math.random() < chance) {
        const amplitude = chave === "memoria" ? 0.25 : 0.5;
        mutados[chave] = (mutados[chave] ?? 0) + aleatorioIntervalo(-amplitude, amplitude);
      }
    }
    return mutados;
  }
}
