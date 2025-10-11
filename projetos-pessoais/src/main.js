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
const areaCanvas = document.getElementById("area-canvas");

const PERFORMANCE_SESSION_KEY = "redeNeuralRogue_visuals";
const BODY_CLASS_MODO_DESEMPENHO = "modo-desempenho";

const lerPersistenciaModoVisual = () => {
  try {
    return sessionStorage.getItem(PERFORMANCE_SESSION_KEY);
  } catch (erro) {
    console.warn("Falha ao ler estado salvo do modo visual:", erro);
    return null;
  }
};

let efeitosVisuaisAtivos = lerPersistenciaModoVisual() !== "off";
let botaoEfeitosVisuais = null;
let avisoDesempenho = null;

if (areaCanvas) {
  avisoDesempenho = document.createElement("div");
  avisoDesempenho.id = "aviso-desempenho";
  avisoDesempenho.textContent = "Modo desempenho ativo: simulacao continua em segundo plano.";
  avisoDesempenho.setAttribute("role", "status");
  avisoDesempenho.setAttribute("aria-live", "polite");
  avisoDesempenho.hidden = true;
  areaCanvas.appendChild(avisoDesempenho);
}

const atualizarBotaoEfeitos = () => {
  if (!botaoEfeitosVisuais) {
    return;
  }
  const texto = efeitosVisuaisAtivos ? "Desligar efeitos visuais" : "Ligar efeitos visuais";
  botaoEfeitosVisuais.textContent = texto;
  botaoEfeitosVisuais.setAttribute("aria-pressed", efeitosVisuaisAtivos ? "false" : "true");
  botaoEfeitosVisuais.dataset.estadoVisual = efeitosVisuaisAtivos ? "on" : "off";
};

const INTRO_MODAL_KEY = "redeNeuralRogue_intro_modal_until";
const SEMANA_MS = 7 * 24 * 60 * 60 * 1000;

const configuracaoAtual = clonarConfiguracao(configuracaoInicial);
canvas.width = configuracaoAtual.jogo.largura;
canvas.height = configuracaoAtual.jogo.altura;

const contexto = new ContextoJogo({
  canvas,
  configuracao: configuracaoAtual,
});
contexto.armazenarDado("efeitosVisuaisAtivos", efeitosVisuaisAtivos);

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
painelControles.definirVisualizacao(visualizacaoIA);
sistemaIA.monitor.definirIndicadorQualidade(indicadorQualidade);
sistemaIA.monitor.definirHistoricoIA(historicoIA);
sistemaJogador.jogador.definirControladorIA(sistemaIA);
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

const aplicarModoDesempenho = (ativo) => {
  efeitosVisuaisAtivos = !!ativo;
  contexto.armazenarDado("efeitosVisuaisAtivos", efeitosVisuaisAtivos);
  if (!efeitosVisuaisAtivos) {
    const ctx = contexto.contexto;
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  document.body.classList.toggle(BODY_CLASS_MODO_DESEMPENHO, !efeitosVisuaisAtivos);
  if (avisoDesempenho) {
    avisoDesempenho.hidden = efeitosVisuaisAtivos;
  }
  try {
    sessionStorage.setItem(PERFORMANCE_SESSION_KEY, efeitosVisuaisAtivos ? "on" : "off");
  } catch {
    // Ignorado: navegadores podem bloquear sessionStorage em alguns contextos.
  }
  visualizacaoIA?.definirAnimacoesAtivas(efeitosVisuaisAtivos);
  if (efeitosVisuaisAtivos) {
    cenaPrincipal.desenhar();
  }
  atualizarBotaoEfeitos();
};

botaoEfeitosVisuais = document.createElement("button");
botaoEfeitosVisuais.type = "button";
botaoEfeitosVisuais.className = "botao-efeitos-visuais";
botaoEfeitosVisuais.title = "Alternar renderizacao e modo desempenho";
botaoEfeitosVisuais.addEventListener("click", () => {
  const proximo = !efeitosVisuaisAtivos;
  aplicarModoDesempenho(proximo);
  painelControles.registrarEventoRelatorio(
    proximo ? "Efeitos visuais ligados" : "Efeitos visuais desligados (modo desempenho)"
  );
});
containerControlesIA.appendChild(botaoEfeitosVisuais);

aplicarModoDesempenho(efeitosVisuaisAtivos);

let partidaAtiva = true;

const loop = new LoopJogo({
  atualizar: (delta) => {
    atualizarJogo(delta);
  },
  desenhar: () => {
    if (!efeitosVisuaisAtivos) {
      return;
    }
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
inicializarModalApresentacao();

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
  const painel = document.getElementById("painel-jogo");
  if (!painel) {
    return;
  }
  const areaPainel = painel.getBoundingClientRect();
  const margem = window.innerWidth <= 600 ? 24 : 48;
  const larguraMaxima = Math.max(120, areaPainel.width - margem);
  let largura = Math.min(larguraMaxima, configuracaoAtual.jogo.largura);
  let altura = largura / proporcao;
  const alturaDisponivel = Math.max(120, areaPainel.height - margem);
  if (altura > alturaDisponivel) {
    altura = alturaDisponivel;
    largura = altura * proporcao;
  }
  const larguraMinima = window.innerWidth <= 600 ? 220 : 320;
  const alturaMinima = window.innerWidth <= 600 ? 140 : 180;
  canvas.style.width = `${Math.max(larguraMinima, Math.round(largura))}px`;
  canvas.style.height = `${Math.max(alturaMinima, Math.round(altura))}px`;
}

function sincronizarConfiguracao() {
  contexto.configuracao = configuracaoAtual;
  sistemaJogador.aplicarConfiguracao(configuracaoAtual.jogador);
  gerenciadorInimigos.ajustarConfiguracao(configuracaoAtual.inimigos);
  sistemaIA.aplicarConfiguracao(configuracaoAtual.ia);
  sistemaIA.definirConfiguracaoJogador(configuracaoAtual.jogador, configuracaoAtual.plataforma);
  cenaPrincipal.fundo.configuracao = configuracaoAtual.efeitos;
}

function inicializarModalApresentacao() {
  const modal = document.getElementById("gameIntroModal");
  if (!modal) {
    return;
  }

  const ateQuando = Number(localStorage.getItem(INTRO_MODAL_KEY) || 0);
  if (ateQuando && Date.now() < ateQuando) {
    return;
  }

  const backdrop = modal.querySelector("[data-modal-backdrop]");
  const botaoFechar = modal.querySelector("[data-modal-close]");
  const botaoOk = modal.querySelector("[data-modal-accept]");
  const lembrarCheckbox = document.getElementById("gameIntroModalRemember");

  const abrir = () => {
    modal.hidden = false;
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    (botaoOk || botaoFechar)?.focus({ preventScroll: true });
  };

  const fechar = (lembrar) => {
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    if (lembrar) {
      localStorage.setItem(INTRO_MODAL_KEY, String(Date.now() + SEMANA_MS));
    } else {
      localStorage.removeItem(INTRO_MODAL_KEY);
    }
    window.setTimeout(() => {
      modal.hidden = true;
    }, 200);
  };

  const tratarFechamento = (persistir) => {
    const lembrar = persistir && !!lembrarCheckbox?.checked;
    fechar(lembrar);
  };

  botaoOk?.addEventListener("click", () => tratarFechamento(true));
  botaoFechar?.addEventListener("click", () => tratarFechamento(false));
  backdrop?.addEventListener("click", () => tratarFechamento(false));
  modal.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      evento.preventDefault();
      tratarFechamento(false);
    }
  });

  abrir();
}
