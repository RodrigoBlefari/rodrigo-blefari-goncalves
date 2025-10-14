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
const barraPresets = document.getElementById("barra-presets");
const comandosJogo = document.getElementById("comandos-jogo");

// Reposiciona o painel-inferior (footer) para dentro do HUD e ajusta o grid
try {
  const painelInferiorAntigo = document.getElementById("painel-inferior");
  const hudContainer = document.getElementById("hud");
  if (painelInferiorAntigo && hudContainer) {
    const novoPainelInferior = document.createElement("div");
    novoPainelInferior.id = "painel-inferior";
    novoPainelInferior.className = "painel-controle";
    // Move as seções internas para o novo container dentro do HUD
    Array.from(painelInferiorAntigo.children).forEach((child) => {
      novoPainelInferior.appendChild(child);
    });
    hudContainer.appendChild(novoPainelInferior);
    painelInferiorAntigo.remove();
    // Ajusta o grid para remover a linha 'inferior'
    const interfaceEl = document.getElementById("interface");
    if (interfaceEl) {
      interfaceEl.style.gridTemplateAreas = '"esquerda jogo direita"';
      interfaceEl.style.gridTemplateRows = 'auto';
    }
  }
} catch {}

const PERFORMANCE_SESSION_KEY = "redeNeuralRogue_visuals";
const AGENTES_SESSION_KEY = "redeNeuralRogue_agentes_visiveis";
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
let botaoVisibilidadeAgentes = null;
let avisoDesempenho = null;

const lerPersistenciaAgentes = () => {
  try {
    return sessionStorage.getItem(AGENTES_SESSION_KEY);
  } catch {
    return null;
  }
};

let agentesVisiveis = lerPersistenciaAgentes() !== "hidden";

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

const atualizarBotaoAgentes = () => {
  if (!botaoVisibilidadeAgentes) {
    return;
  }
  botaoVisibilidadeAgentes.textContent = agentesVisiveis
    ? "Esconder jogador e inimigos"
    : "Mostrar jogador e inimigos";
  botaoVisibilidadeAgentes.setAttribute("aria-pressed", agentesVisiveis ? "true" : "false");
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
contexto.armazenarDado("mostrarAgentes", agentesVisiveis);

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

const cenaPrincipal = new CenaPrincipal(contexto);

/**
 * Ativa modo IA (observação) ao iniciar para as sombras aparecerem
 * e insere a barra global de presets no topo (inicia com Equilibrado)
 */
try { sistemaJogador.jogador.definirModoObservacao(true); } catch {}
try { sistemaIA.definirModoObservacao(true); } catch {}
painelControles.registrarEventoRelatorio("Modo IA ativado no início");

/**
 * Delegação global para colapsar sublistas dos blocos NOVOS (sem data-collapsible).
 * Evita conflito com o script legado (bloco-controle.js), que já controla elementos com [data-collapsible].
 * Robusta: funciona mesmo se o ID do conteúdo não estiver presente ou se elementos forem realocados.
 */
document.addEventListener("click", (ev) => {
  const botao = ev.target?.closest?.(".collapsible__toggle");
  if (!botao) return;

  // Se o botão pertence ao cabeçalho legado (inserido por bloco-controle.js), deixa o script antigo cuidar
  if (botao.closest?.(".collapsible__header")) {
    return;
  }

  // Evita que outro handler (legado) também processe apenas para BLOCOS NOVOS
  ev.preventDefault();
  ev.stopPropagation();

  // Obtém alvo pelo aria-controls; fallback: procura conteúdo dentro do bloco
  const alvoId = botao.getAttribute("aria-controls");
  let conteudo = alvoId ? document.getElementById(alvoId) : null;
  const bloco = botao.closest(".bloco-controle");
  if (!conteudo && bloco) {
    conteudo = bloco.querySelector(".collapsible__content");
  }
  if (!conteudo) return;

  const expanded = botao.getAttribute("aria-expanded") === "true";
  const proximo = !expanded;

  botao.setAttribute("aria-expanded", String(proximo));

  // Aplica múltiplas formas de ocultação para robustez
  conteudo.hidden = !proximo;
  conteudo.setAttribute("aria-hidden", proximo ? "false" : "true");
  conteudo.style.display = proximo ? "block" : "none";

  // Alterna classe visual no bloco pai, se existir (CSS reage a is-open/is-closed)
  if (bloco) {
    bloco.classList.toggle("is-open", proximo);
    bloco.classList.toggle("is-closed", !proximo);
  }
});

// Barra de presets no topo (inicia com Equilibrado)
if (barraPresets) {
  const label = document.createElement("label");
  label.htmlFor = "global-preset-select";
  label.textContent = "Preset de performance:";
  label.className = "lbl-preset-topo";
  const selectTop = document.createElement("select");
  selectTop.id = "global-preset-select";
  selectTop.innerHTML = `
    <option value="equilibrado">Equilibrado</option>
    <option value="agressivo">Agressivo</option>
    <option value="defensivo">Defensivo</option>
    <option value="explorador">Explorador</option>
    <option value="sobrevivente">Sobrevivente</option>
  `;
  selectTop.addEventListener("change", () => {
    painelControles._ajustarConfiguracaoAutomatica(selectTop.value);
    const lateral = document.getElementById("tipo-performance");
    if (lateral) lateral.value = selectTop.value;
  });
  barraPresets.appendChild(label);
  barraPresets.appendChild(selectTop);
  // Inicia com equilibrado
  selectTop.value = "equilibrado";
  painelControles._ajustarConfiguracaoAutomatica("equilibrado");
}

// O botão do modo IA
const botaoModoIA = document.createElement("button");
botaoModoIA.type = "button";
botaoModoIA.className = "btn btn-primary";
const jogador = sistemaJogador.jogador;
botaoModoIA.textContent = jogador.estado === ESTADO_JOGADOR.OBSERVANDO ? "Desativar modo IA" : "Ativar modo IA";
botaoModoIA.addEventListener("click", () => {
  const jogador = sistemaJogador.jogador;
  const ativo = jogador.estado === ESTADO_JOGADOR.OBSERVANDO;
  jogador.definirModoObservacao(!ativo);
  botaoModoIA.textContent = ativo ? "Ativar modo IA" : "Desativar modo IA";
  painelControles.registrarEventoRelatorio(ativo ? "Modo IA desativado" : "Modo IA ativado");
});
(comandosJogo || containerControlesIA)?.appendChild(botaoModoIA);

const botaoGeracao = document.createElement("button");
botaoGeracao.type = "button";
botaoGeracao.className = "btn btn-danger";
botaoGeracao.textContent = "Forcar nova geracao";
botaoGeracao.addEventListener("click", () => {
  sistemaIA.forcarGeracao();
});
(comandosJogo || containerControlesIA)?.appendChild(botaoGeracao);

const botaoPerspectiva = document.createElement("button");
botaoPerspectiva.type = "button";
botaoPerspectiva.className = "btn btn-secondary";
botaoPerspectiva.textContent = "Visualizar sensores IA";
botaoPerspectiva.addEventListener("click", () => {
  const indice = sistemaIA.alternarPerspectiva();
  botaoPerspectiva.textContent =
    indice === -1 ? "Visualizar sensores IA" : `Sensores IA #${indice + 1}`;
});
(comandosJogo || containerControlesIA)?.appendChild(botaoPerspectiva);

botaoVisibilidadeAgentes = document.createElement("button");
botaoVisibilidadeAgentes.type = "button";
botaoVisibilidadeAgentes.className = "btn btn-toggle";
botaoVisibilidadeAgentes.title = "Oculta o jogador e os inimigos para focar nas sombras da IA";
botaoVisibilidadeAgentes.addEventListener("click", () => {
  agentesVisiveis = !agentesVisiveis;
  contexto.armazenarDado("mostrarAgentes", agentesVisiveis);
  try {
    sessionStorage.setItem(AGENTES_SESSION_KEY, agentesVisiveis ? "visible" : "hidden");
  } catch {
    // Sessão pode não estar disponível; ignorar.
  }
  atualizarBotaoAgentes();
  painelControles.registrarEventoRelatorio(
    agentesVisiveis ? "Jogador e inimigos visiveis novamente" : "Visualizando apenas a IA (jogador e inimigos ocultos)"
  );
  if (efeitosVisuaisAtivos) {
    cenaPrincipal.desenhar();
  }
});
(comandosJogo || containerControlesIA)?.appendChild(botaoVisibilidadeAgentes);

const hud = new HudVida(hudElemento);
const telaDerrota = new TelaDerrota(telaDerrotaElemento, () => reiniciarPartida());

// Declara o loop antes de usar em outras funções
let loop = null;

const aplicarModoDesempenho = (ativo) => {
  efeitosVisuaisAtivos = !!ativo;
  contexto.armazenarDado("efeitosVisuaisAtivos", efeitosVisuaisAtivos);
  
  if (!efeitosVisuaisAtivos) {
    // Limpa canvas e otimiza para performance
    const ctx = contexto.contexto;
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Define configurações de performance extrema
      ctx.imageSmoothingEnabled = false;
      ctx.globalCompositeOperation = 'source-over';
    }
    
    // Ajusta taxa de quadros para ultra performance
    if (loop) {
      loop.definirTaxaQuadros(15); // Reduz FPS drasticamente em modo performance
    }
  } else {
    // Restaura configurações visuais normais
    const ctx = contexto.contexto;
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
    }
    
    // Restaura taxa de quadros normal
    if (loop) {
      loop.definirTaxaQuadros(configuracaoAtual.jogo.taxaQuadros);
    }
  }
  
  document.body.classList.toggle(BODY_CLASS_MODO_DESEMPENHO, !efeitosVisuaisAtivos);
  
  if (avisoDesempenho) {
    avisoDesempenho.hidden = efeitosVisuaisAtivos;
    avisoDesempenho.textContent = efeitosVisuaisAtivos 
      ? "Modo desempenho ativo: simulacao continua em segundo plano."
      : "⚡ ULTRA PERFORMANCE: Animações desabilitadas, FPS reduzido para máxima eficiência";
  }
  
  try {
    sessionStorage.setItem(PERFORMANCE_SESSION_KEY, efeitosVisuaisAtivos ? "on" : "off");
  } catch {
    // Ignorado: navegadores podem bloquear sessionStorage em alguns contextos.
  }
  
  // Configura sistemas para modo performance
  visualizacaoIA?.definirAnimacoesAtivas(efeitosVisuaisAtivos);
  sistemaIA?.definirModoPerformance?.(!efeitosVisuaisAtivos);
  gerenciadorInimigos?.definirModoPerformance?.(!efeitosVisuaisAtivos);
  gerenciadorProjeteis?.definirModoPerformance?.(!efeitosVisuaisAtivos);
  
  if (efeitosVisuaisAtivos) {
    atualizarHud();
    cenaPrincipal.desenhar();
  }
  atualizarBotaoEfeitos();
  
  console.log(efeitosVisuaisAtivos ? "Modo visual normal ativado" : "⚡ ULTRA PERFORMANCE ativado - FPS reduzido para máxima eficiência");
};

botaoEfeitosVisuais = document.createElement("button");
botaoEfeitosVisuais.type = "button";
botaoEfeitosVisuais.className = "btn btn-toggle botao-efeitos-visuais";
botaoEfeitosVisuais.title = "Alternar renderizacao e modo desempenho";
botaoEfeitosVisuais.addEventListener("click", () => {
  const proximo = !efeitosVisuaisAtivos;
  aplicarModoDesempenho(proximo);
  painelControles.registrarEventoRelatorio(
    proximo ? "Efeitos visuais ligados" : "Efeitos visuais desligados (modo desempenho)"
  );
});
(comandosJogo || containerControlesIA)?.appendChild(botaoEfeitosVisuais);

atualizarBotaoAgentes();
aplicarModoDesempenho(efeitosVisuaisAtivos);

let partidaAtiva = true;

loop = new LoopJogo({
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

reiniciarPartida();

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
  if (efeitosVisuaisAtivos) {
    atualizarHud();
  }
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
  sistemaIA.resetarTudo();
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
  if (cenaPrincipal?.fundo) {
    cenaPrincipal.fundo.configuracao = configuracaoAtual.efeitos;
  }
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
