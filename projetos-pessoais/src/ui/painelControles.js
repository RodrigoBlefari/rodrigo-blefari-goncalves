// Campos de configuração do jogo agrupados por categoria
const CAMPOS_JOGO = [
  { 
    chave: "gravidade", 
    min: 500, 
    max: 40000, 
    passo: 50, 
    titulo: "Gravidade",
    descricao: "Força de atração vertical que afeta todos os objetos em queda. Valores mais altos fazem personagens caírem mais rapidamente."
  },
  { 
    chave: "multiplicadorVelocidade", 
    min: 0.25, 
    max: 10, 
    passo: 0.05, 
    titulo: "Velocidade jogo",
    descricao: "Multiplicador global que afeta a velocidade de todos os elementos do jogo. Útil para ajustar dificuldade ou ritmo."
  },
  { 
    chave: "velocidadeHorizontal", 
    min: 100, 
    max: 4000, 
    passo: 10, 
    titulo: "Velocidade jogador",
    descricao: "Velocidade de movimentação horizontal do jogador. Afeta sensação de controle e fluidez dos movimentos."
  },
  { 
    chave: "impulsoPulo", 
    min: 400, 
    max: 12000, 
    passo: 20, 
    titulo: "Impulso pulo",
    descricao: "Força vertical aplicada ao jogador ao pular. Valores mais altos permitem saltos mais altos e longos."
  },
  { 
    chave: "vidasMaximas", 
    min: 1, 
    max: 100, 
    passo: 1, 
    titulo: "Vidas",
    descricao: "Número máximo de vidas que o jogador possui. Quando chega a zero, o jogo termina."
  },
];

// Campos de configuração dos inimigos agrupados por categoria
const CAMPOS_INIMIGOS = [
  { 
    chave: "tempoEntreSpawns", 
    min: 0.5, 
    max: 60, 
    passo: 0.5, 
    titulo: "Tempo spawn inimigo",
    descricao: "Intervalo de tempo entre o surgimento de novos inimigos. Valores menores aumentam dificuldade."
  },
  { 
    chave: "agressividade", 
    min: 0.5, 
    max: 30, 
    passo: 0.1, 
    titulo: "Agressividade inimigo",
    descricao: "Determina quão ativamente os inimigos perseguem o jogador. Valores mais altos resultam em inimigos mais agressivos."
  },
 { 
    chave: "alturaBase", 
    min: 30, 
    max: 150, 
    passo: 5, 
    titulo: "Altura inimigos",
    descricao: "Altura padrão dos inimigos no jogo. Afeta colisões e posicionamento visual."
  },
  { 
    chave: "distanciaAtaqueJogador", 
    min: 100, 
    max: 500, 
    passo: 10, 
    titulo: "Distancia ataque inimigo",
    descricao: "Distância máxima na qual os inimigos começam a atacar o jogador. Influencia tática de combate."
  },
  { 
    chave: "podeAtirar", 
    min: 0, 
    max: 1, 
    passo: 1, 
    titulo: "Inimigos podem atirar",
    descricao: "Define se os inimigos podem atirar projéteis contra o jogador. 0 = Não, 1 = Sim."
  },
  { 
    chave: "rangeAtaque", 
    min: 1, 
    max: 5000, 
    passo: 10, 
    titulo: "Range de ataque inimigo",
    descricao: "Distância máxima que os inimigos podem atacar. Valores maiores aumentam o alcance do ataque."
  },
];

// Campos de configuração da IA agrupados por categoria
const CAMPOS_IA_GERAL = [
 { 
    chave: "tamanhoPopulacao", 
    min: 1, 
    max: 2000, 
    passo: 1, 
    titulo: "Tamanho populacao",
    descricao: "Número de agentes na população a cada geração. Valores maiores aumentam diversidade genética mas exigem mais processamento."
  },
  { 
    chave: "quantidadeIAsTreinando", 
    min: 1, 
    max: 1000, 
    passo: 1, 
    titulo: "Quantidade de IA",
    descricao: "Número de IAs treinando simultaneamente na tela. Controla quantos agentes são visíveis e ativos na simulação (máx 1000; será limitado à população)."
  },
  { 
    chave: "numeroMaximoInimigos", 
    min: 1, 
    max: 450, 
    passo: 1, 
    titulo: "Número máximo de inimigos",
    descricao: "Número máximo de inimigos que a IA pode controlar simultaneamente. Valores maiores aumentam complexidade."
  },
  { 
    chave: "taxaMutacao", 
    min: 0, 
    max: 1, 
    passo: 0.01, 
    titulo: "Taxa mutacao",
    descricao: "Probabilidade de alteração aleatória nos genes durante reprodução. Valores mais altos aumentam exploração do espaço de soluções mas podem prejudicar convergência."
  },
  { 
    chave: "velocidadeSimulacao", 
    min: 0.1, 
    max: 50, 
    passo: 0.1, 
    titulo: "Velocidade simulacao",
    descricao: "Multiplicador de velocidade para simulações da IA. Valores mais altos aceleram aprendizado mas podem reduzir precisão."
  },
  { 
    chave: "elitePercentual", 
    min: 0.05, 
    max: 0.8, 
    passo: 0.01, 
    titulo: "Elite (%)",
    descricao: "Percentual de elite preservada por geração. Valores maiores mantêm mais indivíduos de melhor desempenho (0.05 a 0.8)."
  },
];

const CAMPOS_IA_PESOS = [
  { 
    chave: "pesoDesvio", 
    min: 0, 
    max: 50, 
    passo: 0.1, 
    titulo: "Peso desvio",
    descricao: "Importância dada à habilidade de desviar de projéteis. Valores mais altos incentivam comportamentos defensivos e evasivos."
  },
  { 
    chave: "pesoSobrevivencia", 
    min: 0, 
    max: 50, 
    passo: 0.1, 
    titulo: "Peso sobrevivencia",
    descricao: "Importância dada à capacidade de sobreviver. Valores mais altos incentivam comportamentos conservadores e focados em longevidade."
  },
  { 
    chave: "pesoExploracao", 
    min: 0, 
    max: 50, 
    passo: 0.1, 
    titulo: "Peso exploracao",
    descricao: "Importância dada à exploração de novas estratégias. Valores mais altos incentivam comportamentos ousados e experimentação de ações incomuns."
  },
  { 
    chave: "pesoAtaque", 
    min: 0, 
    max: 50, 
    passo: 0.1, 
    titulo: "Peso do ataque",
    descricao: "Peso dado à habilidade de atacar. Valores mais altos incentivam comportamentos ofensivos e agressivos (0.0 a 50.0)."
  },
  { 
    chave: "pesoDefesa", 
    min: 0, 
    max: 50, 
    passo: 0.1, 
    titulo: "Peso da defesa",
    descricao: "Peso dado à habilidade de defender. Valores mais altos incentivam comportamentos defensivos e cautelosos (0.0 a 50.0)."
  },
  { 
    chave: "pesoCooperacao", 
    min: 0, 
    max: 50, 
    passo: 0.1, 
    titulo: "Peso da cooperação",
    descricao: "Peso dado à cooperação entre inimigos. Valores mais altos incentivam comportamentos colaborativos (0.0 a 50.0)."
  },
];

const CAMPOS_IA_APRENDIZADO = [
  { 
    chave: "pesoSucesso", 
    min: 0, 
    max: 5, 
    passo: 0.1, 
    titulo: "Peso do sucesso",
    descricao: "Controla o quanto a IA valoriza exemplos de sucesso. Valores mais altos fazem a IA seguir mais fortemente estratégias vencedoras."
  },
  { 
    chave: "pesoFalha", 
    min: 0, 
    max: 5, 
    passo: 0.1, 
    titulo: "Peso da falha",
    descricao: "Controla o quanto a IA aprende com exemplos de falha. Valores mais altos fazem a IA evitar estratégias que levam à derrota."
  },
  { 
    chave: "focoSucesso", 
    min: 0, 
    max: 1, 
    passo: 0.01, 
    titulo: "Foco em sucesso",
    descricao: "Quanto a IA foca em exemplos de sucesso. Valores mais altos fazem a IA seguir mais fortemente estratégias vencedoras (0.0 a 1.0)."
  },
  { 
    chave: "focoFalha", 
    min: 0, 
    max: 1, 
    passo: 0.01, 
    titulo: "Foco em falha",
    descricao: "Quanto a IA foca em exemplos de falha. Valores mais altos fazem a IA evitar estratégias que levam à derrota (0.0 a 1.0)."
  },
  { 
    chave: "taxaAprendizado", 
    min: 0.01, 
    max: 1, 
    passo: 0.01, 
    titulo: "Taxa de aprendizado",
    descricao: "Taxa de aprendizado da IA. Valores mais altos aceleram o aprendizado mas podem reduzir a precisão (0.01 a 1.0)."
  },
  { 
    chave: "taxaAprendizadoSucesso", 
    min: 0.01, 
    max: 1, 
    passo: 0.01, 
    titulo: "Taxa aprendizado sucesso",
    descricao: "Taxa de aprendizado com exemplos de sucesso. Valores mais altos aceleram o aprendizado com estratégias vencedoras (0.01 a 1.0)."
  },
  { 
    chave: "taxaAprendizadoFalha", 
    min: 0.01, 
    max: 1, 
    passo: 0.01, 
    titulo: "Taxa aprendizado falha",
    descricao: "Taxa de aprendizado com exemplos de falha. Valores mais altos aceleram o aprendizado com estratégias fracassadas (0.01 a 1.0)."
  },
  { 
    chave: "pesoExemplosSucesso", 
    min: 0, 
    max: 5, 
    passo: 0.1, 
    titulo: "Peso exemplos de sucesso",
    descricao: "Peso dado aos exemplos de sucesso na evolução. Valores mais altos fazem a IA seguir mais fortemente estratégias vencedoras (0.0 a 5.0)."
  },
  { 
    chave: "pesoExemplosFalha", 
    min: 0, 
    max: 5, 
    passo: 0.1, 
    titulo: "Peso exemplos de falha",
    descricao: "Peso dado aos exemplos de falha na evolução. Valores mais altos fazem a IA evitar estratégias que levam à derrota (0.0 a 5.0)."
  },
];

const CAMPOS_IA_CONTROLE = [
  { 
    chave: "controleMultiInimigos", 
    min: 0, 
    max: 1, 
    passo: 1, 
    titulo: "Controle multi-inimigos",
    descricao: "Se a IA pode controlar múltiplos inimigos simultaneamente. 0 = Não, 1 = Sim."
  },
  { 
    chave: "adaptabilidade", 
    min: 0, 
    max: 5, 
    passo: 0.1, 
    titulo: "Adaptabilidade",
    descricao: "Quanto a IA adapta seu comportamento. Valores mais altos aumentam a flexibilidade da IA (0.0 a 5.0)."
  },
  { 
    chave: "memoriaCurtoPrazo", 
    min: 1, 
    max: 100, 
    passo: 1, 
    titulo: "Memória de curto prazo",
    descricao: "Número de gerações mantidas na memória de curto prazo. Valores maiores aumentam a memória recente (1 a 100)."
  },
  { 
    chave: "memoriaLongoPrazo", 
    min: 10, 
    max: 1000, 
    passo: 10, 
    titulo: "Memória de longo prazo",
    descricao: "Número de gerações mantidas na memória de longo prazo. Valores maiores aumentam a memória histórica (10 a 100)."
  },
];

// Combinar todos os campos de IA em uma única constante
const CAMPOS_IA = [
  ...CAMPOS_IA_GERAL,
  ...CAMPOS_IA_PESOS,
  ...CAMPOS_IA_APRENDIZADO,
  ...CAMPOS_IA_CONTROLE
];

export class PainelControles {
  constructor({ containerJogo, containerIA, containerRelatorios, configuracao, aoAlterar }) {
    this.containerJogo = containerJogo;
    this.containerIA = containerIA;
    this.containerRelatorios = containerRelatorios;
    this.areaResumo = null;
    this.areaLog = null;
    this.areaStatus = null;
    this.configuracao = configuracao;
    this.aoAlterar = aoAlterar;
    this.visualizacao = null;
    this.animacoesAtivas = true;
    this.botaoAnimacoes = null;
    // Sequenciador para IDs únicos de submenus colapsáveis
    this._seqCollapsiveis = 0;
    this._renderizar();
    this._adicionarControlesAdicionais();
  }

  definirVisualizacao(visualizacao) {
    this.visualizacao = visualizacao;
    this._sincronizarBotaoAnimacoes();
  }

  _adicionarControlesAdicionais() {
    // Adiciona o seletor de performance e botão de ajuste automático ao painel da IA
    if (this.containerIA) {
      // Secção IA Avançado (melhor distribuído, com colapsável)
      const secAvancado = document.createElement("section");
      secAvancado.className = "bloco-controle";

      // Grupo: Presets de Performance
      const blocoPerf = document.createElement("div");
      blocoPerf.className = "entrada-controle";
      const lblPerf = document.createElement("label");
      lblPerf.textContent = "Preset de performance";
      lblPerf.title = "Ajusta automaticamente alguns pesos e taxa de mutação";
      blocoPerf.appendChild(lblPerf);

      const select = document.createElement("select");
      select.id = "tipo-performance";
      select.innerHTML = `
        <option value="equilibrado">Equilibrado</option>
        <option value="agressivo">Agressivo</option>
        <option value="defensivo">Defensivo</option>
        <option value="explorador">Explorador</option>
        <option value="sobrevivente">Sobrevivente</option>
      `;
      blocoPerf.appendChild(select);

      const btnPreset = document.createElement("button");
      btnPreset.type = "button";
      btnPreset.textContent = "Aplicar preset";
      btnPreset.addEventListener("click", () => {
        this._ajustarConfiguracaoAutomatica(select.value);
      });
      blocoPerf.appendChild(btnPreset);

      // Grupo: Ajuste Automático em tempo real
      const blocoAuto = document.createElement("div");
      blocoAuto.className = "entrada-controle";
      const lblAuto = document.createElement("label");
      lblAuto.textContent = "Ajuste automático em tempo real";
      lblAuto.title = "Liga/desliga auto-tuning de pesos com base nos relatórios";
      blocoAuto.appendChild(lblAuto);

      const botaoAjusteIA = document.createElement("button");
      botaoAjusteIA.type = "button";
      botaoAjusteIA.textContent = "Ajuste Automático da IA: Desligado";
      botaoAjusteIA.className = "botao-toggle";
      botaoAjusteIA.addEventListener("click", () => {
        this._alternarAjusteAutomaticoIA(botaoAjusteIA);
      });
      blocoAuto.appendChild(botaoAjusteIA);

      // Grupo: Visualização / Modo Desempenho
      const blocoVisu = document.createElement("div");
      blocoVisu.className = "entrada-controle";
      const lblVisu = document.createElement("label");
      lblVisu.textContent = "Visualizações & Desempenho";
      lblVisu.title = "Alterna animações e efeitos (melhor FPS em populações grandes)";
      blocoVisu.appendChild(lblVisu);

      const botaoAnimacoes = document.createElement("button");
      botaoAnimacoes.type = "button";
      botaoAnimacoes.className = "botao-toggle";
      botaoAnimacoes.addEventListener("click", () => {
        this._alternarAnimacoesIA();
      });
      this.botaoAnimacoes = botaoAnimacoes;
      this._sincronizarBotaoAnimacoes();
      blocoVisu.appendChild(botaoAnimacoes);

      // Grupo: Tema e Cores (fun!)
      const blocoTema = document.createElement("div");
      blocoTema.className = "entrada-controle";
      const lblTema = document.createElement("label");
      lblTema.textContent = "Tema de Cores";
      lblTema.title = "Colorir a interface com as cores dos agentes";
      blocoTema.appendChild(lblTema);

      const temaSelect = document.createElement("select");
      temaSelect.id = "tema-cor";
      temaSelect.innerHTML = `
        <option value="auto">Automático (melhor agente)</option>
        <option value="#5be9ff">Azul ciano</option>
        <option value="#68ff9a">Verde</option>
        <option value="#ffef5b">Amarelo</option>
        <option value="#ff9e5b">Laranja</option>
        <option value="#ff5bd9">Rosa</option>
        <option value="arco-iris">Arco-íris</option>
      `;
      blocoTema.appendChild(temaSelect);

      const aplicarTema = (nome) => {
        // Guarda override global para o SistemaIA respeitar "auto" quando vazio
        if (nome === "auto") {
          window.redeNeuralTemaOverride = null;
          document.body.classList.remove("tema-arcoiris");
          document.documentElement.style.removeProperty("--accent-1");
          document.documentElement.style.removeProperty("--accent-2");
          return;
        }
        if (nome === "arco-iris") {
          window.redeNeuralTemaOverride = "arco-iris";
          document.body.classList.add("tema-arcoiris");
          return;
        }
        // Cor fixa
        window.redeNeuralTemaOverride = nome;
        document.body.classList.remove("tema-arcoiris");
        document.documentElement.style.setProperty("--accent-1", nome);
        document.documentElement.style.setProperty("--accent-2", nome);
      };

      temaSelect.addEventListener("change", (e) => {
        aplicarTema(e.target.value);
      });

      // Montagem da seção IA Avançado (colapsável)
      // Cabeçalho colapsável acessível (IA Avançado)
      const idAvancado = "ia-avancado-conteudo";
      const cabecalhoAvancado = document.createElement("button");
      cabecalhoAvancado.type = "button";
      cabecalhoAvancado.className = "collapsible__toggle";
      cabecalhoAvancado.setAttribute("aria-controls", idAvancado);
      cabecalhoAvancado.setAttribute("aria-expanded", "true");
      cabecalhoAvancado.innerHTML = `<span>IA Avançado</span><span class="collapsible__icon" aria-hidden="true"></span>`;
      secAvancado.appendChild(cabecalhoAvancado);

      const conteudoAvancado = document.createElement("div");
      conteudoAvancado.className = "collapsible__content";
      conteudoAvancado.id = idAvancado;
      conteudoAvancado.hidden = false;
      secAvancado.classList.add("is-open");

      conteudoAvancado.appendChild(blocoPerf);
      conteudoAvancado.appendChild(blocoAuto);
      conteudoAvancado.appendChild(blocoVisu);
      conteudoAvancado.appendChild(blocoTema);
      secAvancado.appendChild(conteudoAvancado);

      this.containerIA.appendChild(secAvancado);
    }
    
    // Adiciona o seletor de refresh ao painel de relatórios
    if (this.containerRelatorios) {
      const controleRefresh = document.createElement("div");
      controleRefresh.className = "bloco-controle";
      
      const idRefresh = "controles-atualizacao-conteudo";
      const cabecalho = document.createElement("button");
      cabecalho.type = "button";
      cabecalho.className = "collapsible__toggle";
      cabecalho.setAttribute("aria-controls", idRefresh);
      cabecalho.setAttribute("aria-expanded", "true");
      cabecalho.innerHTML = `<span>Controles de Atualização</span><span class="collapsible__icon" aria-hidden="true"></span>`;
      controleRefresh.appendChild(cabecalho);

      const conteudoRefresh = document.createElement("div");
      conteudoRefresh.className = "collapsible__content";
      conteudoRefresh.id = idRefresh;
      conteudoRefresh.hidden = false;
      controleRefresh.classList.add("is-open");

      // Seletor de intervalo de atualização
      const seletorRefresh = document.createElement("div");
      seletorRefresh.className = "entrada-controle";
      
      const labelRefresh = document.createElement("label");
      labelRefresh.textContent = "Intervalo de atualização dos relatórios (segundos)";
      seletorRefresh.appendChild(labelRefresh);
      
      const selectRefresh = document.createElement("select");
      selectRefresh.id = "intervalo-refresh";
      selectRefresh.innerHTML = `
        <option value="0.5">0.5 segundos</option>
        <option value="1" selected>1 segundo</option>
        <option value="2">2 segundos</option>
        <option value="3">3 segundos</option>
        <option value="5">5 segundos</option>
        <option value="10">10 segundos</option>
      `;
      seletorRefresh.appendChild(selectRefresh);

      conteudoRefresh.appendChild(seletorRefresh);

      // Adiciona evento para alterar o intervalo de atualização
      selectRefresh.addEventListener("change", (evento) => {
        const novoIntervalo = parseFloat(evento.target.value);
        // Intervalo é apenas para o FRONT (throttle de render no MonitorAprendizado)
        try {
          if (this.configuracao?.ia?.monitor) {
            this.configuracao.ia.monitor.intervaloFront = novoIntervalo;
          }
        } catch {}
        this.registrarEventoRelatorio(`Intervalo (front) alterado para ${novoIntervalo}s`);
      });
      
      controleRefresh.appendChild(conteudoRefresh);

      this.containerRelatorios.appendChild(controleRefresh);
      
      // Adiciona área para mostrar o melhor e pior resultado (prioriza topo do jogo)
      const topoStatus = document.getElementById("status-relatorios-top");
      const markupStatus = `
        <h3>Evolução Histórica</h3>
        <div class="status-item">
          <span class="status-label">Melhor Fitness:</span>
          <span id="melhor-fitness" class="status-valor">0</span>
        </div>
        <div class="status-item">
          <span class="status-label">Pior Fitness:</span>
          <span id="pior-fitness" class="status-valor">0</span>
        </div>
        <div class="status-item">
          <span class="status-label">Geração do Melhor:</span>
          <span id="geracao-melhor" class="status-valor">0</span>
        </div>
      `;
      if (topoStatus) {
        topoStatus.innerHTML = markupStatus;
        this.areaStatus = topoStatus;
      } else {
        this.areaStatus = document.createElement("div");
        this.areaStatus.className = "status-relatorios";
        this.areaStatus.innerHTML = markupStatus;
        this.containerRelatorios.appendChild(this.areaStatus);
      }
    }
  }

  _alternarAjusteAutomaticoIA(botao) {
    // Alterna apenas o preset automaticamente; ranges sincronizam via preset
    this.ajusteAutomaticoIaAtivo = !this.ajusteAutomaticoIaAtivo;

    botao.textContent = this.ajusteAutomaticoIaAtivo
      ? "Ajuste Automático da IA: Ligado"
      : "Ajuste Automático da IA: Desligado";

    // Limpa ciclo anterior
    clearInterval(this.intervaloAjuste);

    if (!this.ajusteAutomaticoIaAtivo) {
      this.registrarEventoRelatorio("Ajuste automático da IA desativado");
      return;
    }

    this.registrarEventoRelatorio("Ajuste automático da IA ativado");
    this._ultimoPresetAuto = null;

    const aplicarPreset = (preset) => {
      if (!preset || preset === this._ultimoPresetAuto) {
        return;
      }
      // Sincroniza selects topo e lateral
      const selectTopo = document.getElementById("global-preset-select");
      const selectLateral = document.getElementById("tipo-performance");
      if (selectTopo) selectTopo.value = preset;
      if (selectLateral) selectLateral.value = preset;

      this._ajustarConfiguracaoAutomatica(preset);
      this._ultimoPresetAuto = preset;
    };

    const escolherPreset = () => {
      const monitor = this.configuracao.ia.monitor;
      const estado = monitor?.estadoAtual ?? "homeostase controlada";
      let preset = "equilibrado";
      switch (estado) {
        case "regressivo":
          preset = "defensivo";
          break;
        case "estagnado":
          preset = "explorador";
          break;
        case "homeostase controlada":
          preset = "equilibrado";
          break;
        case "melhora gradual":
          preset = "equilibrado";
          break;
        case "plasticidade acelerada":
          preset = "agressivo";
          break;
        case "hiperplastico (ganho explosivo)":
          preset = "sobrevivente";
          break;
        default:
          preset = "equilibrado";
      }
      aplicarPreset(preset);
    };

    // Aplica já e respeita o intervalo de relatórios para checagens seguintes
    escolherPreset();
    // Agendamento do auto-preset (independente do intervalo de UI do front)
    this.intervaloAjuste = setInterval(escolherPreset, 1000);
  }

  _alternarAnimacoesIA() {
    this.animacoesAtivas = !this.animacoesAtivas;
    this.visualizacao?.definirAnimacoesAtivas(this.animacoesAtivas);
    this._sincronizarBotaoAnimacoes();
    this.registrarEventoRelatorio(
      this.animacoesAtivas ? "Animações da IA ativadas" : "Animações da IA desativadas"
    );
  }

  _sincronizarBotaoAnimacoes() {
    if (!this.botaoAnimacoes) {
      return;
    }
    const texto = this.animacoesAtivas
      ? "Animações da IA: Ligadas"
      : "Animações da IA: Desligadas";
    this.botaoAnimacoes.textContent = texto;
    this.botaoAnimacoes.classList.toggle("is-off", !this.animacoesAtivas);
    this.botaoAnimacoes.setAttribute("aria-pressed", this.animacoesAtivas ? "true" : "false");
  }

  _ajustarPesosIaComBaseEmRelatorios() {
    // Esta função será chamada a cada segundo quando o ajuste automático estiver ativo
    // Ela analisa os últimos relatórios e ajusta os pesos da IA com base em regras mais sofisticadas
    
    const configuracaoAtual = this.configuracao.ia;
    let novaConfiguracao = { ...configuracaoAtual };
    
    // Obter informações do monitor de aprendizado
    const monitor = this.configuracao.ia.monitor;
    if (!monitor) {
      return;
    }
    
    // Analisar o estado atual da IA
    const estadoAtual = monitor.estadoAtual;
    const deltaMelhor = monitor.deltaMelhor;
    const deltaMedia = monitor.deltaMedia;
    const ciclosSemMelhoria = monitor.ciclosSemMelhoria;
    
    // Ajustar pesos com base no estado da IA
    switch (estadoAtual) {
      case "hiperplastico (ganho explosivo)":
        // Reduzir taxa de mutação para estabilizar
        novaConfiguracao.taxaMutacao = Math.max(0.01, configuracaoAtual.taxaMutacao * 0.95);
        // Aumentar peso de sobrevivência para manter estabilidade
        novaConfiguracao.pesoSobrevivencia = Math.min(50, configuracaoAtual.pesoSobrevivencia * 1.05);
        break;
        
      case "plasticidade acelerada":
        // Manter taxa de mutação e ajustar pesos sutis
        novaConfiguracao.pesoDesvio = Math.max(0, configuracaoAtual.pesoDesvio * 0.98);
        novaConfiguracao.pesoExploracao = Math.min(50, configuracaoAtual.pesoExploracao * 1.02);
        break;
        
      case "melhora gradual":
        // Ajustar pesos para manter o progresso
        novaConfiguracao.pesoDesvio = Math.max(0, configuracaoAtual.pesoDesvio * 1.01);
        novaConfiguracao.pesoSobrevivencia = Math.min(50, configuracaoAtual.pesoSobrevivencia * 0.99);
        break;
        
      case "estagnado":
        // Aumentar taxa de mutação para romper estagnação
        novaConfiguracao.taxaMutacao = Math.min(1, configuracaoAtual.taxaMutacao * 1.1);
        // Aumentar peso de exploração para buscar novas estratégias
        novaConfiguracao.pesoExploracao = Math.min(50, configuracaoAtual.pesoExploracao * 1.1);
        break;
        
      case "regressivo":
        // Reduzir taxa de mutação drasticamente
        novaConfiguracao.taxaMutacao = Math.max(0.01, configuracaoAtual.taxaMutacao * 0.8);
        // Aumentar peso de sobrevivência para recuperar desempenho
        novaConfiguracao.pesoSobrevivencia = Math.min(50, configuracaoAtual.pesoSobrevivencia * 1.2);
        break;
        
      case "homeostase controlada":
      default:
        // Ajustes sutis para manter equilíbrio
        if (deltaMelhor > 0) {
          // Pequeno aumento nos pesos de desvio e exploração
          novaConfiguracao.pesoDesvio = Math.min(50, configuracaoAtual.pesoDesvio * 1.005);
          novaConfiguracao.pesoExploracao = Math.min(50, configuracaoAtual.pesoExploracao * 1.005);
        } else if (deltaMelhor < 0) {
          // Pequena redução nos pesos de desvio e exploração
          novaConfiguracao.pesoDesvio = Math.max(0, configuracaoAtual.pesoDesvio * 0.995);
          novaConfiguracao.pesoExploracao = Math.max(0, configuracaoAtual.pesoExploracao * 0.995);
        }
        break;
    }
    
    // Se há muitos ciclos sem melhoria, forçar mudanças mais drásticas
    if (ciclosSemMelhoria > 10) {
      novaConfiguracao.taxaMutacao = Math.min(1, configuracaoAtual.taxaMutacao * 1.2);
      novaConfiguracao.pesoExploracao = Math.min(50, configuracaoAtual.pesoExploracao * 1.15);
    }
    
    // Garantir que os valores estejam dentro dos limites
    novaConfiguracao.taxaMutacao = Math.max(0, Math.min(1, novaConfiguracao.taxaMutacao));
    novaConfiguracao.pesoDesvio = Math.max(0, Math.min(50, novaConfiguracao.pesoDesvio));
    novaConfiguracao.pesoSobrevivencia = Math.max(0, Math.min(50, novaConfiguracao.pesoSobrevivencia));
    novaConfiguracao.pesoExploracao = Math.max(0, Math.min(50, novaConfiguracao.pesoExploracao));
    
    // Atualizar a configuração
    this.configuracao.ia = novaConfiguracao;
    
    // Atualizar os controles visuais
    this._atualizarControlesVisuais();
    
    // Registrar o ajuste
    this.registrarEventoRelatorio(`Ajuste automático da IA aplicado - Estado: ${estadoAtual}`);
    
    // Notificar a alteração
    if (this.aoAlterar) {
      this.aoAlterar(this.configuracao);
    }
  }

  _ajustarConfiguracaoAutomatica(tipoPerformance) {
    let novaConfiguracao = { ...this.configuracao.ia };

    // Perfis abrangentes (inclui novos parâmetros)
    const clampQty = (v) => Math.max(1, Math.min(1000, Math.round(v)));

    switch (tipoPerformance) {
      case "agressivo":
        novaConfiguracao = {
          ...this.configuracao.ia,
          taxaMutacao: 0.2,
          velocidadeSimulacao: 2.5,
          elitePercentual: 0.15,
          quantidadeIAsTreinando: clampQty(64),
          numeroMaximoInimigos: 8,
          pesoDesvio: 0.8,
          pesoSobrevivencia: 0.8,
          pesoExploracao: 2.5,
          pesoAtaque: 2.0,
          pesoDefesa: 0.7,
          pesoCooperacao: 0.6,
          adaptabilidade: 1.2,
        };
        break;
      case "defensivo":
        novaConfiguracao = {
          ...this.configuracao.ia,
          taxaMutacao: 0.08,
          velocidadeSimulacao: 1.5,
          elitePercentual: 0.25,
          quantidadeIAsTreinando: clampQty(32),
          numeroMaximoInimigos: 5,
          pesoDesvio: 2.5,
          pesoSobrevivencia: 3.2,
          pesoExploracao: 0.3,
          pesoAtaque: 0.6,
          pesoDefesa: 2.0,
          pesoCooperacao: 1.0,
          adaptabilidade: 0.9,
        };
        break;
      case "explorador":
        novaConfiguracao = {
          ...this.configuracao.ia,
          taxaMutacao: 0.28,
          velocidadeSimulacao: 3.0,
          elitePercentual: 0.1,
          quantidadeIAsTreinando: clampQty(96),
          numeroMaximoInimigos: 6,
          pesoDesvio: 1.0,
          pesoSobrevivencia: 1.0,
          pesoExploracao: 3.5,
          pesoAtaque: 1.2,
          pesoDefesa: 0.8,
          pesoCooperacao: 0.8,
          adaptabilidade: 1.4,
        };
        break;
      case "sobrevivente":
        novaConfiguracao = {
          ...this.configuracao.ia,
          taxaMutacao: 0.05,
          velocidadeSimulacao: 1.2,
          elitePercentual: 0.3,
          quantidadeIAsTreinando: clampQty(24),
          numeroMaximoInimigos: 4,
          pesoDesvio: 2.2,
          pesoSobrevivencia: 3.8,
          pesoExploracao: 0.2,
          pesoAtaque: 0.5,
          pesoDefesa: 2.2,
          pesoCooperacao: 1.2,
          adaptabilidade: 0.8,
        };
        break;
      case "equilibrado":
      default:
        novaConfiguracao = {
          ...this.configuracao.ia,
          taxaMutacao: 0.1,
          velocidadeSimulacao: 2.0,
          elitePercentual: 0.2,
          quantidadeIAsTreinando: clampQty(48),
          numeroMaximoInimigos: 5,
          pesoDesvio: 1.5,
          pesoSobrevivencia: 2.0,
          pesoExploracao: 0.8,
          pesoAtaque: 1.2,
          pesoDefesa: 1.2,
          pesoCooperacao: 1.0,
          adaptabilidade: 1.0,
        };
        break;
    }

    // Atualiza a configuração
    this.configuracao.ia = novaConfiguracao;

    // Notifica a alteração
    if (this.aoAlterar) {
      this.aoAlterar(this.configuracao);
    }

    // Atualiza os controles visuais para refletir as mudanças
    this._atualizarControlesVisuais();

    // Registra o evento
    this.registrarEventoRelatorio(`Configuração ajustada para modo: ${tipoPerformance}`);
  }
  
  // Método para atualizar os controles visuais quando os valores mudam
  _atualizarControlesVisuais() {
    // Atualiza os controles da IA
    for (const campo of CAMPOS_IA_GERAL) {
      const input = document.querySelector(`#${campo.chave}`);
      if (input) {
        // Garante limite visual de 1000 para quantidadeIAsTreinando
        if (campo.chave === "quantidadeIAsTreinando") {
          input.max = 1000;
        }
        input.value = this.configuracao.ia[campo.chave];

        // Atualiza o valor exibido
        const valorAtual = input.parentElement.parentElement.querySelector('.valor-atual');
        if (valorAtual) {
          valorAtual.textContent = this._formatarValor(input.value, campo.passo);
        }
      }
    }
    
    // Atualiza os controles de pesos da IA
    for (const campo of CAMPOS_IA_PESOS) {
      const input = document.querySelector(`#${campo.chave}`);
      if (input) {
        input.value = this.configuracao.ia[campo.chave];
        
        // Atualiza o valor exibido
        const valorAtual = input.parentElement.parentElement.querySelector('.valor-atual');
        if (valorAtual) {
          valorAtual.textContent = this._formatarValor(input.value, campo.passo);
        }
      }
    }
    
    // Atualiza os controles de aprendizado da IA
    for (const campo of CAMPOS_IA_APRENDIZADO) {
      const input = document.querySelector(`#${campo.chave}`);
      if (input) {
        input.value = this.configuracao.ia[campo.chave];
        
        // Atualiza o valor exibido
        const valorAtual = input.parentElement.parentElement.querySelector('.valor-atual');
        if (valorAtual) {
          valorAtual.textContent = this._formatarValor(input.value, campo.passo);
        }
      }
    }
    
    // Atualiza os controles de controle da IA
    for (const campo of CAMPOS_IA_CONTROLE) {
      const input = document.querySelector(`#${campo.chave}`);
      if (input) {
        input.value = this.configuracao.ia[campo.chave];
        
        // Atualiza o valor exibido
        const valorAtual = input.parentElement.parentElement.querySelector('.valor-atual');
        if (valorAtual) {
          valorAtual.textContent = this._formatarValor(input.value, campo.passo);
        }
      }
    }
  }

  _renderizar() {
    if (this.containerJogo) {
      // Lado esquerdo: parâmetros de jogo + IA (Treinamento subdividido)
      this._renderizarSecao(this.containerJogo, "Parametros jogo", CAMPOS_JOGO, this.configuracao);
      this._renderizarSecao(this.containerJogo, "IA - Treinamento • Geral", CAMPOS_IA_GERAL, this.configuracao);
      this._renderizarSecao(this.containerJogo, "IA - Treinamento • Aprendizado", CAMPOS_IA_APRENDIZADO, this.configuracao);
    }
    if (this.containerIA) {
      // Lado direito: IA (Comportamento subdividido) + Inimigos
      this._renderizarSecao(this.containerIA, "IA - Comportamento • Pesos", CAMPOS_IA_PESOS, this.configuracao);
      this._renderizarSecao(this.containerIA, "IA - Comportamento • Controle", CAMPOS_IA_CONTROLE, this.configuracao);
      this._renderizarSecao(this.containerIA, "Parametros Inimigos", CAMPOS_INIMIGOS, this.configuracao);
    }
    if (this.containerRelatorios) {
      this.containerRelatorios.innerHTML = "";
      this.areaResumo = document.createElement("div");
      this.areaResumo.className = "resumo-relatorios";
      this.areaLog = document.createElement("div");
      this.areaLog.className = "log-relatorios";
      this.containerRelatorios.appendChild(this.areaResumo);
      this.containerRelatorios.appendChild(this.areaLog);
    }
  }

   _renderizarSecao(container, titulo, campos, configuracao) {
    const bloco = document.createElement("div");
    bloco.className = "bloco-controle";

    // Gera ID único e acessível para o conteúdo colapsável deste bloco
    const slug = String(titulo || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const contentId = `${slug}-${++this._seqCollapsiveis}-conteudo`;

    // Botão acessível para controlar apenas este conteúdo (scoped)
    const cabecalho = document.createElement("button");
    cabecalho.type = "button";
    cabecalho.className = "collapsible__toggle";
    cabecalho.setAttribute("aria-controls", contentId);
    cabecalho.setAttribute("aria-expanded", "true");
    cabecalho.innerHTML = `<span>${titulo}</span><span class="collapsible__icon" aria-hidden="true"></span>`;
    bloco.appendChild(cabecalho);

    const conteudo = document.createElement("div");
    conteudo.className = "collapsible__content";
    conteudo.id = contentId;
    conteudo.hidden = false;
    bloco.classList.add("is-open");

    for (const campo of campos) {
      const entrada = document.createElement("div");
      entrada.className = "entrada-controle";
      const rotulo = document.createElement("label");
      rotulo.textContent = campo.titulo;
      rotulo.setAttribute("for", campo.chave);
      
      // Dica via hover (title nativo do navegador)
      if (campo.descricao) {
        rotulo.title = campo.descricao;
      }
      
      const input = document.createElement("input");
      input.type = "range";
      input.id = campo.chave;
      input.min = campo.min;
      // Ajuste dinâmico: o máximo de 'quantidadeIAsTreinando' acompanha 'tamanhoPopulacao'
      const maximoInicial =
        campo.chave === "quantidadeIAsTreinando"
          ? 1000
          : campo.max;
      input.max = maximoInicial;
      input.step = campo.passo;
      // Garante que o valor inicial não ultrapasse o máximo dinâmico
      const valorInicial = Math.min(
        Number(this._obterValor(configuracao, campo.chave)),
        Number(maximoInicial)
      );
      input.value = valorInicial;
      const valor = document.createElement("div");
      valor.className = "valor-range";
      
      // Container para o valor atual com botões de ajuste fino
      const containerValor = document.createElement("div");
      containerValor.className = "controle-valor";
      
      const botaoMenos = document.createElement("button");
      botaoMenos.textContent = "−";
      botaoMenos.addEventListener("click", () => {
        const novoValor = Math.max(campo.min, Number(input.value) - Number(campo.passo));
        input.value = novoValor;
        this._atualizarConfiguracao(campo.chave, novoValor);
        valorAtual.textContent = this._formatarValor(novoValor, campo.passo);
      });
      
      const valorAtual = document.createElement("span");
      valorAtual.className = "valor-atual";
      valorAtual.textContent = this._formatarValor(input.value, campo.passo);
      
      const botaoMais = document.createElement("button");
      botaoMais.textContent = "+";
      botaoMais.addEventListener("click", () => {
        const limiteMax =
          campo.chave === "quantidadeIAsTreinando"
            ? 1000
            : Number(campo.max);
        const novoValor = Math.min(limiteMax, Number(input.value) + Number(campo.passo));
        this._atualizarConfiguracao(campo.chave, novoValor);
        // Re-sincroniza o input e o texto com a configuração efetiva (após clamp)
        const valorEfetivo = this._obterValor(this.configuracao, campo.chave);
        input.value = valorEfetivo;
        valorAtual.textContent = this._formatarValor(valorEfetivo, campo.passo);
      });
      
      containerValor.appendChild(botaoMenos);
      containerValor.appendChild(valorAtual);
      containerValor.appendChild(botaoMais);
      
      const limite = document.createElement("span");
      limite.className = "valor-limite";
      const maxExibido =
        campo.chave === "quantidadeIAsTreinando" ? String(maximoInicial) : String(campo.max);
      limite.textContent = `${campo.min} / ${maxExibido}`;
      
      input.addEventListener("input", (evento) => {
        valorAtual.textContent = this._formatarValor(evento.target.value, campo.passo);
      });
      input.addEventListener("change", (evento) => {
        this._atualizarConfiguracao(campo.chave, Number(evento.target.value));
        valorAtual.textContent = this._formatarValor(evento.target.value, campo.passo);
      });
      
      entrada.appendChild(rotulo);
      entrada.appendChild(input);
      valor.appendChild(containerValor);
      valor.appendChild(limite);
      entrada.appendChild(valor);
      conteudo.appendChild(entrada);
    }
    bloco.appendChild(conteudo);
    container.appendChild(bloco);
  }

  _obterValor(configuracao, chave) {
    if (chave in configuracao.jogo) {
      return configuracao.jogo[chave];
    }
    if (chave in configuracao.jogador) {
      return configuracao.jogador[chave];
    }
    if (chave in configuracao.inimigos) {
      return configuracao.inimigos[chave];
    }
    if (chave in configuracao.ia) {
      return configuracao.ia[chave];
    }
    return 0;
  }

  _atualizarConfiguracao(chave, valor) {
    if (chave in this.configuracao.jogo) {
      this.configuracao.jogo[chave] = valor;
    } else if (chave in this.configuracao.jogador) {
      this.configuracao.jogador[chave] = valor;
    } else if (chave in this.configuracao.inimigos) {
      this.configuracao.inimigos[chave] = valor;
    } else if (chave in this.configuracao.ia) {
      this.configuracao.ia[chave] = valor;
    }
    if (this.aoAlterar) {
      this.aoAlterar(this.configuracao);
    }
  }

  registrarEventoRelatorio(texto) {
    if (!this.areaLog) {
      return;
    }
    const linha = document.createElement("div");
    linha.className = "linha-relatorio";
    linha.textContent = `[${new Date().toLocaleTimeString()}] ${texto}`;
    this.areaLog.prepend(linha);
    const maximo = 60;
    while (this.areaLog.childElementCount > maximo) {
      this.areaLog.removeChild(this.areaLog.lastChild);
    }
  }

  atualizarResumo(texto) {
    if (!this.areaResumo) {
      return;
    }
    const linhas = Array.isArray(texto) ? texto : String(texto || "").split("\n");
    const escapar = (valor) =>
      valor
        .replace(/&/g, "&")
        .replace(/</g, "<")
        .replace(/>/g, ">");
    this.areaResumo.innerHTML = linhas
      .filter((linha) => linha && linha.trim().length)
      .map((linha) => `<p>${escapar(linha.trim())}</p>`)
      .join("");
  }

  _formatarValor(valor, passo) {
    const numero = Number(valor);
    if (!Number.isFinite(numero)) {
      return valor;
    }
    if (passo >= 1) {
      return Math.round(numero).toString();
    }
    return numero.toFixed(String(passo).split(".")[1]?.length ?? 2);
  }
}
