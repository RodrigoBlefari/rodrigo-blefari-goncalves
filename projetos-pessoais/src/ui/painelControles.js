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
];

const CAMPOS_IA = [
  { 
    chave: "tamanhoPopulacao", 
    min: 1, 
    max: 320, 
    passo: 1, 
    titulo: "Tamanho populacao",
    descricao: "Número de agentes na população a cada geração. Valores maiores aumentam diversidade genética mas exigem mais processamento."
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
];

export class PainelControles {
  constructor({ containerJogo, containerIA, containerRelatorios, configuracao, aoAlterar }) {
    this.containerJogo = containerJogo;
    this.containerIA = containerIA;
    this.containerRelatorios = containerRelatorios;
    this.areaResumo = null;
    this.areaLog = null;
    this.configuracao = configuracao;
    this.aoAlterar = aoAlterar;
    this.visualizacao = null;
    this.animacoesAtivas = true;
    this.botaoAnimacoes = null;
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
      const controleAdicional = document.createElement("div");
      controleAdicional.className = "bloco-controle";
      
      const cabecalho = document.createElement("h2");
      cabecalho.textContent = "Controles Avançados";
      controleAdicional.appendChild(cabecalho);
      
      // Seletor de performance
      const seletorPerformance = document.createElement("div");
      seletorPerformance.className = "entrada-controle";
      
      const labelPerformance = document.createElement("label");
      labelPerformance.textContent = "Tipo de Performance";
      seletorPerformance.appendChild(labelPerformance);
      
      const select = document.createElement("select");
      select.id = "tipo-performance";
      select.innerHTML = `
        <option value="equilibrado">Equilibrado</option>
        <option value="agressivo">Agressivo</option>
        <option value="defensivo">Defensivo</option>
        <option value="explorador">Explorador</option>
        <option value="sobrevivente">Sobrevivente</option>
      `;
      seletorPerformance.appendChild(select);
      
      controleAdicional.appendChild(seletorPerformance);
      
      // Botão de ajuste automático
      const botaoAjuste = document.createElement("button");
      botaoAjuste.type = "button";
      botaoAjuste.textContent = "Ajustar Automaticamente";
      botaoAjuste.addEventListener("click", () => {
        this._ajustarConfiguracaoAutomatica(select.value);
      });
      
      controleAdicional.appendChild(botaoAjuste);
      
      // Botão de ajuste automático da IA (liga/desliga)
      const botaoAjusteIA = document.createElement("button");
      botaoAjusteIA.type = "button";
      botaoAjusteIA.textContent = "Ajuste Automático da IA: Desligado";
      botaoAjusteIA.className = "botao-toggle";
      botaoAjusteIA.addEventListener("click", () => {
        this._alternarAjusteAutomaticoIA(botaoAjusteIA);
      });
      
      controleAdicional.appendChild(botaoAjusteIA);

      const botaoAnimacoes = document.createElement("button");
      botaoAnimacoes.type = "button";
      botaoAnimacoes.className = "botao-toggle";
      botaoAnimacoes.addEventListener("click", () => {
        this._alternarAnimacoesIA();
      });
      this.botaoAnimacoes = botaoAnimacoes;
      this._sincronizarBotaoAnimacoes();
      controleAdicional.appendChild(botaoAnimacoes);

      this.containerIA.appendChild(controleAdicional);
    }
  }

  _alternarAjusteAutomaticoIA(botao) {
    // Alternar estado do ajuste automático da IA
    this.ajusteAutomaticoIaAtivo = !this.ajusteAutomaticoIaAtivo;
    
    // Atualizar o texto do botão
    botao.textContent = this.ajusteAutomaticoIaAtivo 
      ? "Ajuste Automático da IA: Ligado" 
      : "Ajuste Automático da IA: Desligado";
    
    // Se estiver ativando, iniciar o intervalo de ajuste
    if (this.ajusteAutomaticoIaAtivo) {
      this.intervaloAjuste = setInterval(() => {
        this._ajustarPesosIaComBaseEmRelatorios();
      }, 1000); // Ajustar a cada 1 segundo
      
      this.registrarEventoRelatorio("Ajuste automático da IA ativado");
    } else {
      // Se estiver desativando, limpar o intervalo
      clearInterval(this.intervaloAjuste);
      this.registrarEventoRelatorio("Ajuste automático da IA desativado");
    }
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
    
    switch (tipoPerformance) {
      case "agressivo":
        novaConfiguracao = {
          ...this.configuracao.ia,
          taxaMutacao: 0.15,
          pesoDesvio: 0.8,
          pesoSobrevivencia: 1.0,
          pesoExploracao: 1.5,
        };
        break;
      case "defensivo":
        novaConfiguracao = {
          ...this.configuracao.ia,
          taxaMutacao: 0.08,
          pesoDesvio: 2.5,
          pesoSobrevivencia: 2.5,
          pesoExploracao: 0.3,
        };
        break;
      case "explorador":
        novaConfiguracao = {
          ...this.configuracao.ia,
          taxaMutacao: 0.25,
          pesoDesvio: 1.0,
          pesoSobrevivencia: 1.0,
          pesoExploracao: 3.0,
        };
        break;
      case "sobrevivente":
        novaConfiguracao = {
          ...this.configuracao.ia,
          taxaMutacao: 0.05,
          pesoDesvio: 2.0,
          pesoSobrevivencia: 3.0,
          pesoExploracao: 0.2,
        };
        break;
      case "equilibrado":
      default:
        novaConfiguracao = {
          ...this.configuracao.ia,
          taxaMutacao: 0.1,
          pesoDesvio: 1.5,
          pesoSobrevivencia: 2.0,
          pesoExploracao: 0.5,
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
    for (const campo of CAMPOS_IA) {
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
      this._renderizarSecao(this.containerJogo, "Parametros jogo", CAMPOS_JOGO, this.configuracao);
    }
    if (this.containerIA) {
      this._renderizarSecao(this.containerIA, "Parametros IA", CAMPOS_IA, this.configuracao);
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
    container.innerHTML = "";
    const bloco = document.createElement("div");
    bloco.className = "bloco-controle";
    const cabecalho = document.createElement("h2");
    cabecalho.textContent = titulo;
    bloco.appendChild(cabecalho);

    for (const campo of campos) {
      const entrada = document.createElement("div");
      entrada.className = "entrada-controle";
      const rotulo = document.createElement("label");
      rotulo.textContent = campo.titulo;
      rotulo.setAttribute("for", campo.chave);
      
      // Adiciona a descrição como um elemento filho do rótulo
      if (campo.descricao) {
        const descricao = document.createElement("div");
        descricao.className = "descricao-parametro";
        descricao.textContent = campo.descricao;
        rotulo.appendChild(descricao);
      }
      
      const input = document.createElement("input");
      input.type = "range";
      input.id = campo.chave;
      input.min = campo.min;
      input.max = campo.max;
      input.step = campo.passo;
      input.value = this._obterValor(configuracao, campo.chave);
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
        const novoValor = Math.min(campo.max, Number(input.value) + Number(campo.passo));
        input.value = novoValor;
        this._atualizarConfiguracao(campo.chave, novoValor);
        valorAtual.textContent = this._formatarValor(novoValor, campo.passo);
      });
      
      containerValor.appendChild(botaoMenos);
      containerValor.appendChild(valorAtual);
      containerValor.appendChild(botaoMais);
      
      const limite = document.createElement("span");
      limite.className = "valor-limite";
      limite.textContent = `${campo.min} / ${campo.max}`;
      
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
      bloco.appendChild(entrada);
    }
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
    this.areaResumo.textContent = texto;
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
