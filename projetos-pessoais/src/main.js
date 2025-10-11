import { configuracaoInicial } from "./core/configuracao.js";
import { ContextoJogo } from "./core/contextoJogo.js";
import { LoopJogo } from "./core/loopJogo.js";
import { SistemaJogador } from "./sistemas/sistemaJogador.js";
import { ControleTeclado } from "./sistemas/controleTeclado.js";
import { GerenciadorInimigos } from "./sistemas/gerenciadorInimigos.js";
import { GerenciadorProjeteis } from "./sistemas/gerenciadorProjeteis.js";
import { PainelControles } from "./ui/painelControles.js";
import { HudVida } from "./ui/hudVida.js";
import { TelaDerrota } from "./ui/telaDerrota.js";
import { CenaPrincipal } from "./cenas/cenaPrincipal.js";
import { SistemaIA } from "./ia/sistemaIA.js";
import { ESTADO_JOGADOR } from "./entidades/jogador.js";
import { VisualizacaoIA } from "./ui/visualizacaoIA.js";
import { IndicadorQualidade } from "./ui/indicadorQualidade.js";
import { HistoricoIA } from "./ui/historicoIA.js";
import { SistemaAudio } from "./sistemas/sistemaAudio.js";

function clonarConfiguracao(base) {
  return JSON.parse(JSON.stringify(base));
}

const canvas = document.getElementById("tela-jogo");
const hudElemento = document.getElementById("hud");
const telaDerrotaElemento = document.getElementById("tela-derrota");
const containerControlesJogo = document.getElementById("controles-jogo");
const containerControlesIA = document.getElementById("controles-ia");
const containerRelatorios = document.getElementById("painel-relatorios");
const canvasAtivacoes = document.getElementById("canvas-ativacoes");
const canvasFitness = document.getElementById("canvas-fitness");
const indicadorQualidadeElemento = document.getElementById("indicador-qualidade");
const indicadorQualidade = new IndicadorQualidade(indicadorQualidadeElemento);
const historicoIA = new HistoricoIA(document.getElementById("historico-ia"));

const configuracaoAtual = clonarConfiguracao(configuracaoInicial);
canvas.width = configuracaoAtual.jogo.largura;
canvas.height = configuracaoAtual.jogo.altura;

const contexto = new ContextoJogo({
  canvas,
  configuracao: configuracaoAtual,
});

const controleTeclado = new ControleTeclado();
controleTeclado.iniciar();

// Inicializa o sistema de áudio
const sistemaAudio = contexto.registrarSistema("audio", new SistemaAudio());

const sistemaJogador = contexto.registrarSistema("jogador", new SistemaJogador(configuracaoAtual.jogador));
sistemaJogador.definirEntrada(controleTeclado);

const gerenciadorProjeteis = contexto.registrarSistema("projeteis", new GerenciadorProjeteis());
const gerenciadorInimigos = contexto.registrarSistema("inimigos", new GerenciadorInimigos(configuracaoAtual.inimigos));

let sistemaIA = null;
const painelControles = new PainelControles({
  containerJogo: containerControlesJogo,
  containerIA: containerControlesIA,
  containerRelatorios,
  configuracao: configuracaoAtual,
  aoAlterar: () => sincronizarConfiguracao(),
});

sistemaIA = contexto.registrarSistema("ia", new SistemaIA(configuracaoAtual.ia, painelControles));
sistemaIA.definirConfiguracaoJogador(configuracaoAtual.jogador, configuracaoAtual.plataforma);
const visualizacaoIA = new VisualizacaoIA({ canvasAtivacoes, canvasFitness });
sistemaIA.definirVisualizacao(visualizacaoIA);
sistemaIA.monitor.definirIndicadorQualidade(indicadorQualidade);
sistemaIA.monitor.definirHistoricoIA(historicoIA);
sistemaJogador.jogador.definirControladorIA(sistemaIA);

// O botão do modo IA já está implementado corretamente
const botaoModoIA = document.createElement("button");
botaoModoIA.type = "button";
botaoModoIA.textContent = "Ativar modo IA";
botaoModoIA.addEventListener("click", () => {
  const jogador = sistemaJogador.jogador;
  const ativo = jogador.estado === ESTADO_JOGADOR.OBSERVANDO;
  jogador.definirModoObservacao(!ativo);
  botaoModoIA.textContent = ativo ? "Ativar modo IA" : "Desativar modo IA";
  painelControles.registrarEventoRelatorio(ativo ? "Modo IA desativado" : "Modo IA ativado");
});
containerControlesIA.appendChild(botaoModoIA);

const botaoGeracao = document.createElement("button");
botaoGeracao.type = "button";
botaoGeracao.textContent = "Forcar nova geracao";
botaoGeracao.addEventListener("click", () => {
  sistemaIA.forcarGeracao();
});
containerControlesIA.appendChild(botaoGeracao);

const botaoPerspectiva = document.createElement("button");
botaoPerspectiva.type = "button";
botaoPerspectiva.textContent = "Visualizar sensores IA";
botaoPerspectiva.addEventListener("click", () => {
  const indice = sistemaIA.alternarPerspectiva();
  botaoPerspectiva.textContent =
    indice === -1 ? "Visualizar sensores IA" : `Sensores IA #${indice + 1}`;
});
containerControlesIA.appendChild(botaoPerspectiva);

const hud = new HudVida(hudElemento);
const telaDerrota = new TelaDerrota(telaDerrotaElemento, () => reiniciarPartida());
const cenaPrincipal = new CenaPrincipal(contexto);

let partidaAtiva = true;

const loop = new LoopJogo({
  atualizar: (delta) => {
    atualizarJogo(delta);
  },
  desenhar: () => {
    cenaPrincipal.desenhar();
  },
  taxaQuadros: configuracaoAtual.jogo.taxaQuadros,
});

loop.iniciar();

window.addEventListener("focus", () => {
  if (partidaAtiva && !loop.rodando) {
    loop.iniciar();
  }
});

window.addEventListener("blur", () => {
  const jogador = sistemaJogador.jogador;
  const iaAtiva = jogador?.estado === ESTADO_JOGADOR.OBSERVANDO;
  if (!iaAtiva && loop.rodando) {
    loop.parar();
  }
});

window.addEventListener("resize", () => {
  ajustarEscalaCanvas();
});

ajustarEscalaCanvas();
atualizarHud();

function atualizarJogo(delta) {
  if (!partidaAtiva) {
    if (controleTeclado.foiDisparado("reiniciar")) {
      reiniciarPartida();
    }
    return;
  }
  contexto.configuracao = configuracaoAtual;
  cenaPrincipal.atualizar(delta);
  atualizarHud();
  verificarEstadoJogador();
  if (controleTeclado.foiDisparado("reiniciar")) {
    reiniciarPartida();
  }
}

function verificarEstadoJogador() {
  if (sistemaJogador.estaDerrotado()) {
    partidaAtiva = false;
    telaDerrota.exibir();
    loop.parar();
    painelControles.registrarEventoRelatorio("Jogador derrotado");
  }
}

function reiniciarPartida() {
  gerenciadorInimigos.limpar();
  gerenciadorProjeteis.limpar();
  sistemaJogador.reiniciar();
  partidaAtiva = true;
  telaDerrota.ocultar();
  atualizarHud();
  if (!loop.rodando) {
    loop.iniciar();
  }
  painelControles.registrarEventoRelatorio("Partida reiniciada");
}

function atualizarHud() {
  const jogador = sistemaJogador.jogador;
  if (!jogador) {
    return;
  }
  const modoIA = jogador.estado === ESTADO_JOGADOR.OBSERVANDO;
  hud.atualizar(jogador.vidas, jogador.configuracao.vidasMaximas, modoIA);
}

function ajustarEscalaCanvas() {
  const proporcao = configuracaoAtual.jogo.largura / configuracaoAtual.jogo.altura;
  const areaPainel = document.getElementById("painel-jogo").getBoundingClientRect();
  const margem = 48;
  let largura = Math.min(areaPainel.width - margem, configuracaoAtual.jogo.largura);
  let altura = largura / proporcao;
  if (altura > areaPainel.height - margem) {
    altura = areaPainel.height - margem;
    largura = altura * proporcao;
  }
  canvas.style.width = `${Math.max(320, largura)}px`;
  canvas.style.height = `${Math.max(180, altura)}px`;
}

function sincronizarConfiguracao() {
  contexto.configuracao = configuracaoAtual;
  sistemaJogador.aplicarConfiguracao(configuracaoAtual.jogador);
  gerenciadorInimigos.ajustarConfiguracao(configuracaoAtual.inimigos);
  sistemaIA.aplicarConfiguracao(configuracaoAtual.ia);
  sistemaIA.definirConfiguracaoJogador(configuracaoAtual.jogador, configuracaoAtual.plataforma);
  cenaPrincipal.fundo.configuracao = configuracaoAtual.efeitos;
}
