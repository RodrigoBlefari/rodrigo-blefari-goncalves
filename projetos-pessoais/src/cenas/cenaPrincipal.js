import { FundoParalaxe } from "../efeitos/fundoParalaxe.js";
import { limparCanvas } from "../core/utilitarios.js";

export class CenaPrincipal {
  constructor(contexto) {
    this.contexto = contexto;
    const { largura, altura } = contexto.configuracao.jogo;
    this.fundo = new FundoParalaxe(contexto.configuracao.efeitos, largura, altura);
    this.sistemaJogador = contexto.obterSistema("jogador");
    this.sistemaInimigos = contexto.obterSistema("inimigos");
    this.sistemaProjeteis = contexto.obterSistema("projeteis");
    this.sistemaIA = contexto.obterSistema("ia");
  }

  atualizar(delta) {
    const baseMultiplicador = this.contexto.configuracao.jogo.multiplicadorVelocidade ?? 1;
    const multiplicadorIA = this.sistemaIA?.obterMultiplicadorVelocidade?.() ?? 1;
    let deltaAjustado = delta * baseMultiplicador * multiplicadorIA;
    const renderAtivo = this.contexto.obterDado("efeitosVisuaisAtivos") !== false;
    const passoMaximo = renderAtivo ? 1 / 90 : 1 / 55;
    while (deltaAjustado > 0) {
      const passo = Math.min(passoMaximo, deltaAjustado);
      this._atualizarSistemas(passo);
      deltaAjustado -= passo;
    }
  }

  desenhar() {
    const renderAtivo = this.contexto.obterDado("efeitosVisuaisAtivos") !== false;
    if (!renderAtivo) {
      return;
    }
    const { contexto, canvas } = this.contexto;
    limparCanvas(contexto, canvas.width, canvas.height);
    this.fundo.desenhar(contexto);
    this._desenharPlataforma(contexto, canvas);
    this.sistemaIA?.desenharSombras?.(contexto);
    const mostrarAgentes = this.contexto.obterDado("mostrarAgentes") !== false;
    if (mostrarAgentes) {
      this.sistemaProjeteis?.desenhar(contexto);
      this.sistemaInimigos?.desenhar(contexto);
      this.sistemaJogador?.desenhar(contexto);
    }
  }

  redimensionar(largura, altura) {
    this.contexto.canvas.width = largura;
    this.contexto.canvas.height = altura;
    this.fundo.redimensionar(largura, altura);
  }

  _desenharPlataforma(contextoCanvas, canvas) {
    const configuracao = this.contexto.configuracao.plataforma ?? {};
    const altura = configuracao.altura ?? 0;
    if (altura <= 0) {
      return;
    }
    const topo = canvas.height - altura;
    const corTopo = configuracao.corTopo ?? "#2c3049";
    const corFace = configuracao.corFace ?? "#1a1e30";
    const corBrilho = configuracao.corBrilho ?? "#515d8a";

    contextoCanvas.save();
    const gradienteTopo = contextoCanvas.createLinearGradient(0, topo - 12, 0, topo + altura * 0.3);
    gradienteTopo.addColorStop(0, corBrilho);
    gradienteTopo.addColorStop(0.3, corTopo);
    gradienteTopo.addColorStop(1, corFace);
    contextoCanvas.fillStyle = gradienteTopo;
    contextoCanvas.fillRect(0, topo, canvas.width, altura * 0.6);

    const gradienteFace = contextoCanvas.createLinearGradient(0, topo + altura * 0.4, 0, canvas.height);
    gradienteFace.addColorStop(0, corFace);
    gradienteFace.addColorStop(1, "#0b0d18");
    contextoCanvas.fillStyle = gradienteFace;
    contextoCanvas.fillRect(0, topo + altura * 0.4, canvas.width, altura * 0.6);

    contextoCanvas.fillStyle = "rgba(255, 255, 255, 0.08)";
    contextoCanvas.fillRect(0, topo - 6, canvas.width, 6);

    contextoCanvas.restore();
  }

  _atualizarSistemas(delta) {
    if (this.contexto.obterDado("efeitosVisuaisAtivos") !== false) {
      this.fundo.atualizar(delta);
    }
    if (!this.sistemaJogador) {
      this.sistemaJogador = this.contexto.obterSistema("jogador");
    }
    if (!this.sistemaInimigos) {
      this.sistemaInimigos = this.contexto.obterSistema("inimigos");
    }
    if (!this.sistemaProjeteis) {
      this.sistemaProjeteis = this.contexto.obterSistema("projeteis");
    }
    if (!this.sistemaIA) {
      this.sistemaIA = this.contexto.obterSistema("ia");
    }
    this.sistemaJogador?.atualizar(delta);
    this.sistemaInimigos?.atualizar(delta);
    this.sistemaProjeteis?.atualizar(delta);
    this.sistemaIA?.atualizarSombras?.(delta);
  }
}
