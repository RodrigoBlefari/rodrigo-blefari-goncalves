const INPUTS = [
  { chave: "posicaoX", titulo: "Posicao lateral" },
  { chave: "distanciaProjetil", titulo: "Delta proj x" },
  { chave: "alturaProjetil", titulo: "Delta proj y" },
  { chave: "tempoImpactoProjetil", titulo: "Tempo impacto" },
  { chave: "densidadeProjetil", titulo: "Densidade proj" },
  { chave: "distanciaInimigo", titulo: "Delta inimigo x" },
  { chave: "alturaInimigo", titulo: "Delta inimigo y" },
  { chave: "memoria", titulo: "Memoria" },
];

const SAIDAS = [
  { chave: "saidaMovimento", titulo: "Comando mover" },
  { chave: "saidaPulo", titulo: "Comando pular" },
];

export class VisualizacaoIA {
  constructor({ canvasAtivacoes, canvasFitness }) {
    this.canvasAtivacoes = canvasAtivacoes;
    this.canvasFitness = canvasFitness;
    this.ctxAtivacoes = canvasAtivacoes?.getContext("2d") ?? null;
    this.ctxFitness = canvasFitness?.getContext("2d") ?? null;
    this.historicoFitness = [];
    this._ajustarResolucao();
    window.addEventListener("resize", () => this._ajustarResolucao());
  }

  atualizarAtivacoes(dados) {
    if (!this.ctxAtivacoes || !dados) {
      return;
    }
    const area = this._prepararContexto(this.canvasAtivacoes, this.ctxAtivacoes);
    if (!area) {
      return;
    }
    this._desenharAtivacoes(area, dados);
  }

  atualizarFitness(resumo) {
    if (!this.ctxFitness || !resumo) {
      return;
    }
    this.historicoFitness.push({
      melhor: resumo.melhorFitness,
      media: resumo.mediaFitness,
    });
    if (this.historicoFitness.length > 180) {
      this.historicoFitness.shift();
    }
    const area = this._prepararContexto(this.canvasFitness, this.ctxFitness);
    if (!area) {
      return;
    }
    this._desenharGraficoFitness(area);
  }

  limpar() {
    if (this.ctxAtivacoes) {
      const areaAtivacoes = this._prepararContexto(this.canvasAtivacoes, this.ctxAtivacoes);
      if (areaAtivacoes) {
        this.ctxAtivacoes.clearRect(0, 0, areaAtivacoes.largura, areaAtivacoes.altura);
      }
    }
    if (this.ctxFitness) {
      const areaFitness = this._prepararContexto(this.canvasFitness, this.ctxFitness);
      if (areaFitness) {
        this.ctxFitness.clearRect(0, 0, areaFitness.largura, areaFitness.altura);
      }
    }
  }

  _ajustarResolucao() {
    if (this.canvasAtivacoes) {
      this._prepararContexto(this.canvasAtivacoes, this.ctxAtivacoes);
    }
    if (this.canvasFitness) {
      this._prepararContexto(this.canvasFitness, this.ctxFitness);
    }
  }

  _prepararContexto(canvas, contexto) {
    if (!canvas || !contexto) {
      return null;
    }
    const dpr = window.devicePixelRatio || 1;
    const larguraCss = canvas.clientWidth || canvas.width || 1;
    const alturaCss = canvas.clientHeight || canvas.height || 1;
    const alvoLargura = Math.max(1, Math.round(larguraCss * dpr));
    const alvoAltura = Math.max(1, Math.round(alturaCss * dpr));
    if (canvas.width !== alvoLargura || canvas.height !== alvoAltura) {
      canvas.width = alvoLargura;
      canvas.height = alvoAltura;
    }
    contexto.setTransform(1, 0, 0, 1, 0, 0);
    contexto.scale(dpr, dpr);
    return { largura: larguraCss, altura: alturaCss };
  }

  _desenharAtivacoes(area, dados) {
    const ctx = this.ctxAtivacoes;
    const { largura, altura } = area;
    ctx.clearRect(0, 0, largura, altura);

    const gradiente = ctx.createLinearGradient(0, 0, largura, altura);
    gradiente.addColorStop(0, "rgba(6, 12, 24, 0.95)");
    gradiente.addColorStop(1, "rgba(16, 24, 36, 0.95)");
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, largura, altura);

    ctx.strokeStyle = "rgba(120, 150, 210, 0.08)";
    for (let x = 40; x < largura; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, altura - 20);
      ctx.stroke();
    }
    for (let y = 30; y < altura; y += 60) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(largura - 30, y);
      ctx.stroke();
    }

    const paddingX = 90;
    const paddingY = 48;
    const colunaInputsX = paddingX;
    const colunaOutputsX = largura - paddingX;
    const hubX = (colunaInputsX + colunaOutputsX) / 2;

    const espacamentoInput = (altura - paddingY * 2) / Math.max(INPUTS.length - 1, 1);
    const espacamentoOutput = (altura - paddingY * 2) / Math.max(SAIDAS.length - 1, 1);

    const pesos = dados.pesos ?? {};
    const sensores = dados.sensores ?? {};
    const hiddenAtivacoes = this._calcularHiddenAtivacoes(dados);
    const espacamentoHidden = (altura - paddingY * 2) / Math.max(hiddenAtivacoes.length - 1, 1);

    const inputsPos = INPUTS.map((entrada, index) => ({
      entrada,
      peso: pesos?.[entrada.chave] ?? 0,
      valor: sensores?.[entrada.chave] ?? 0,
      x: colunaInputsX,
      y: paddingY + espacamentoInput * index,
    }));

    const hiddenPos = hiddenAtivacoes.map((hidden, index) => ({
      ...hidden,
      x: hubX,
      y: paddingY + espacamentoHidden * index,
    }));

    const outputsPos = SAIDAS.map((saida, index) => ({
      saida,
      valor: dados[saida.chave] ?? 0,
      x: colunaOutputsX,
      y: paddingY + espacamentoOutput * index,
    }));

    inputsPos.forEach((input, index) => {
      const alvoHidden = hiddenPos[index % hiddenPos.length];
      this._desenharConexao(
        ctx,
        input.x + 26,
        input.y,
        alvoHidden.x - 26,
        alvoHidden.y,
        input.peso
      );
    });

    hiddenPos.forEach((hidden) => {
      outputsPos.forEach((output, idx) => {
        const ganho = hidden.valor * (idx === 0 ? 1 : 0.8);
        this._desenharConexao(ctx, hidden.x + 26, hidden.y, output.x - 26, output.y, ganho);
      });
    });

    inputsPos.forEach((input) => {
      this._desenharNeuronio(ctx, {
        x: input.x,
        y: input.y,
        valor: input.valor,
        titulo: input.entrada.titulo,
        legenda: `s=${this._formatarNumero(input.valor)} | w=${this._formatarNumero(input.peso)}`,
        raio: 16,
        alinhamento: "left",
      });
    });

    hiddenPos.forEach((hidden) => {
      this._desenharNeuronio(ctx, {
        x: hidden.x,
        y: hidden.y,
        valor: hidden.valor,
        titulo: hidden.titulo,
        legenda: hidden.legenda,
        raio: 18,
        alinhamento: "center",
      });
    });

    outputsPos.forEach((output) => {
      this._desenharNeuronio(ctx, {
        x: output.x,
        y: output.y,
        valor: output.valor,
        titulo: output.saida.titulo,
        legenda: `out=${this._formatarNumero(output.valor)}`,
        raio: 20,
        alinhamento: "right",
      });
    });

    const chancePulo = this._formatarNumero(dados.chancePulo ?? 0);
    const resumoInferior = [
      `fitness=${this._formatarNumero(dados.fitness ?? 0)}`,
      `movBruto=${this._formatarNumero(dados.movimentoBruto ?? 0)}`,
      `evadiu=${dados.evadiu ? "sim" : "nao"}`,
      `pChance=${chancePulo}`,
    ].join(" | ");
    ctx.fillStyle = "rgba(16, 28, 46, 0.75)";
    ctx.fillRect(paddingX - 40, altura - 44, largura - (paddingX - 40) * 2, 30);
    ctx.fillStyle = "#9ad4ff";
    ctx.font = "12px 'Segoe UI'";
    ctx.textAlign = "center";
    ctx.fillText(resumoInferior, largura / 2, altura - 24);
  }

  _desenharGraficoFitness(area) {
    const ctx = this.ctxFitness;
    const { largura, altura } = area;
    ctx.clearRect(0, 0, largura, altura);

    const padding = 30;
    const larguraUtil = largura - padding * 2;
    const alturaUtil = altura - padding * 2;

    const maxFitness =
      this.historicoFitness.reduce((acc, ponto) => Math.max(acc, ponto.melhor, ponto.media), 1) || 1;

    ctx.strokeStyle = "rgba(80, 110, 170, 0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, altura - padding);
    ctx.lineTo(largura - padding, altura - padding);
    ctx.stroke();

    const desenharLinha = (cor, atributo) => {
      ctx.beginPath();
      ctx.strokeStyle = cor;
      ctx.lineWidth = 2;
      const total = this.historicoFitness.length;
      this.historicoFitness.forEach((ponto, indice) => {
        const x = padding + (larguraUtil * indice) / Math.max(1, total - 1);
        const valor = ponto[atributo];
        const y = altura - padding - (alturaUtil * valor) / maxFitness;
        if (indice === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    };

    desenharLinha("rgba(122, 183, 255, 0.95)", "melhor");
    desenharLinha("rgba(86, 255, 203, 0.9)", "media");

    ctx.font = "12px 'Segoe UI'";
    ctx.fillStyle = "#7ab7ff";
    ctx.textAlign = "left";
    ctx.fillText("Melhor", padding + 6, padding + 12);
    ctx.fillStyle = "#56ffc9";
    ctx.fillText("Media", padding + 6, padding + 28);
  }

  _calcularHiddenAtivacoes(dados) {
    const sensores = dados.sensores ?? {};
    const urgenciaProj =
      ((sensores.tempoImpactoProjetil ?? -1) + Math.max(0, sensores.densidadeProjetil ?? -1)) / 2;
    const pressaoInimigo =
      ((1 - Math.abs(sensores.distanciaInimigo ?? 0)) + Math.abs(sensores.alturaInimigo ?? 0)) / 2;
    const memoriaAtiva = (sensores.memoria ?? 0 + (dados.memoriaAtual ?? 0)) / 2;
    return [
      {
        titulo: "Urg proj",
        valor: this._limitar(urgenciaProj),
        legenda: "integra dist proj e densidade",
      },
      {
        titulo: "Press inimigo",
        valor: this._limitar(pressaoInimigo * 2 - 1),
        legenda: "proximidade vertical e lateral do inimigo",
      },
      {
        titulo: "Memoria ativa",
        valor: this._limitar(memoriaAtiva),
        legenda: "estado interno e persistencia",
      },
    ];
  }

  _desenharConexao(ctx, x1, y1, x2, y2, peso) {
    const intensidade = Math.min(1.8, Math.max(0.2, Math.abs(peso)));
    const gradiente = ctx.createLinearGradient(x1, y1, x2, y2);
    const cor = this._corPeso(peso);
    gradiente.addColorStop(0, cor);
    gradiente.addColorStop(1, "rgba(180, 200, 255, 0.15)");
    ctx.strokeStyle = gradiente;
    ctx.lineWidth = 1.5 + intensidade * 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2, y1 - 18, x2, y2);
    ctx.stroke();
  }

  _desenharNeuronio(ctx, { x, y, valor, titulo, legenda, raio = 16, alinhamento = "left" }) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "rgba(8, 14, 26, 0.85)";
    ctx.arc(x, y, raio + 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = this._corPorValor(valor);
    ctx.arc(x, y, raio, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#e8f1ff";
    ctx.font = "11px 'Segoe UI'";
    ctx.textAlign = "center";
    ctx.fillText(this._formatarNumero(valor), x, y + 4);

    ctx.fillStyle = "#9cb8ff";
    ctx.font = "11px 'Segoe UI'";
    ctx.textBaseline = "bottom";
    if (alinhamento === "left") {
      ctx.textAlign = "right";
      ctx.fillText(titulo, x - raio - 10, y - 6);
    } else if (alinhamento === "right") {
      ctx.textAlign = "left";
      ctx.fillText(titulo, x + raio + 10, y - 6);
    } else {
      ctx.textAlign = "center";
      ctx.fillText(titulo, x, y - raio - 10);
    }

    if (legenda) {
      ctx.fillStyle = "#7d91bd";
      ctx.font = "10px 'Segoe UI'";
      if (alinhamento === "left") {
        ctx.textAlign = "right";
        ctx.fillText(legenda, x - raio - 10, y + 16);
      } else if (alinhamento === "right") {
        ctx.textAlign = "left";
        ctx.fillText(legenda, x + raio + 10, y + 16);
      } else {
        ctx.textAlign = "center";
        ctx.fillText(legenda, x, y + raio + 14);
      }
    }
    ctx.restore();
  }

  _limitar(valor) {
    if (!Number.isFinite(valor)) {
      return 0;
    }
    return Math.max(-1, Math.min(1, valor));
  }

  _corPorValor(valor) {
    const v = Math.max(-1, Math.min(1, Number(valor) || 0));
    const intensidade = Math.round(Math.abs(v) * 255);
    if (v >= 0) {
      return `rgba(${70 + intensidade * 0.2}, ${120 + intensidade * 0.4}, 255, 0.9)`;
    }
    return `rgba(255, ${120 + intensidade * 0.2}, ${90 + intensidade * 0.1}, 0.9)`;
  }

  _corPeso(peso) {
    const v = Math.max(-3, Math.min(3, Number(peso) || 0));
    if (v >= 0) {
      return "rgba(104, 168, 255, 0.85)";
    }
    return "rgba(255, 151, 109, 0.85)";
  }

  _formatarNumero(valor) {
    const numero = Number(valor);
    if (!Number.isFinite(numero)) {
      return "0";
    }
    if (Math.abs(numero) >= 100) {
      return numero.toFixed(0);
    }
    if (Math.abs(numero) >= 10) {
      return numero.toFixed(1);
    }
    return numero.toFixed(2);
  }
}
