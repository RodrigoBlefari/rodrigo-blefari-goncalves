/**
 * GH-300 EXAM SIMULATOR - Complete Controller
 * 
 * Este é o coração do simulador. Ele gerencia:
 * - Renderização das questões
 * - Alternância de idioma (EN/PT)
 * - Navegação entre questões
 * - Cálculo de score
 * - Exibição de resposta e análise
 */

class GH300Simulator {
  constructor() {
    // Recuperar estado da prova em progresso OU criar novo
    const existingExamState = storageService.getCurrentExamState();
    
    if (existingExamState) {
      // Prova em progresso encontrada - carregar seu estado
      this.examId = existingExamState.examId;
      this.currentQuestionIndex = existingExamState.currentQuestion;
      this.answers = existingExamState.answers;
      this.startTime = existingExamState.startTime;
    } else {
      // Nenhuma prova em progresso - criar nova
      this.examId = storageService.generateExamId();
      this.currentQuestionIndex = 0;
      this.answers = {};
      this.startTime = Date.now();
      
      // Salvar novo estado
      storageService.saveExamState({
        examId: this.examId,
        currentQuestion: this.currentQuestionIndex,
        answers: this.answers,
        startTime: this.startTime,
      });
    }
    
    // Carregar preferências do usuário
    this.currentLang = storageService.getLanguage();
    const uiPrefs = storageService.getUIPreferences();
    this.showAnswers = uiPrefs.showAnswers;
    this.showTips = uiPrefs.showTips;
    this.showAnswerDots = uiPrefs.showDots;

    // Inicializar tema
    this.initializeTheme();
    // Inicializar idioma
    this.initializeLanguage();
    // Inicializar event listeners
    this.initializeEventListeners();
    // Carregar questão atual
    this.loadQuestion();
  }

  /**
   * FUNÇÃO: initializeLanguage()
   * Aplica o idioma salvo ao documento
   */
  initializeLanguage() {
    if (this.currentLang === 'pt') {
      document.body.classList.add('lang-pt');
    } else {
      document.body.classList.remove('lang-pt');
    }
  }

  /**
   * FUNÇÃO: initializeTheme()
   * Carrega o tema salvo e aplica ao documento
   */
  initializeTheme() {
    const theme = storageService.getTheme();
    this.applyTheme(theme);
    
    // Setup seletor de tema
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
      themeSelect.value = theme;
      themeSelect.addEventListener('change', (e) => {
        this.changeTheme(e.target.value);
      });
    }
  }

  /**
   * FUNÇÃO: applyTheme()
   * Aplica o tema ao documento HTML
   * @param {string} theme - 'light' ou 'dark'
   */
  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  /**
   * FUNÇÃO: changeTheme()
   * Muda o tema e salva no storage
   * @param {string} theme - 'light' ou 'dark'
   */
  changeTheme(theme) {
    storageService.setTheme(theme);
    this.applyTheme(theme);
  }

  /**
   * FUNÇÃO: initializeEventListeners()
   * DESCRIÇÃO: Conecta todos os botões e eventos aos seus handlers
   */
  initializeEventListeners() {
    // Botão de trocar idioma (EN ↔ PT)
    const langToggle = document.getElementById('langToggle');
    const viewHistoryTopBtn = document.getElementById('viewHistoryTopBtn');
    if (langToggle) {
      langToggle.addEventListener('click', () => this.toggleLanguage());
    }

    if (viewHistoryTopBtn) {
      viewHistoryTopBtn.addEventListener('click', () => this.showExamHistory());
    }

    // Botão de modo revisão
    // Botões de navegação
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');

    if (prevBtn) prevBtn.addEventListener('click', () => this.previousQuestion());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
    if (finishBtn) finishBtn.addEventListener('click', () => this.submitExam());

    // Botão para mostrar resposta
    const showAnswerBtn = document.getElementById('showAnswerBtn');
    if (showAnswerBtn) {
      showAnswerBtn.addEventListener('click', () => this.toggleAnswer());
    }

    // Botão para mostrar dicas/tips
    const showTipsBtn = document.getElementById('showTipsBtn');
    if (showTipsBtn) {
      showTipsBtn.addEventListener('click', () => this.toggleTips());
    }

    // Botão de filtro
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
      filterBtn.addEventListener('click', () => this.toggleFilter());
    }

    // Buttons no modal de resultados
    const closeResultsBtn = document.getElementById('closeResultsBtn');
    const reviewAgainBtn = document.getElementById('reviewAgainBtn');
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const backHomeBtn = document.getElementById('backHomeBtn');

    if (closeResultsBtn) {
      closeResultsBtn.addEventListener('click', () => {
        const resultsModal = document.getElementById('resultsModal');
        if (resultsModal) resultsModal.style.display = 'none';
      });
    }

    if (reviewAgainBtn) {
      reviewAgainBtn.addEventListener('click', () => this.openReview());
    }

    if (viewHistoryBtn) {
      viewHistoryBtn.addEventListener('click', () => this.showExamHistory());
    }

    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => this.retakeExam());
    }

    if (backHomeBtn) {
      backHomeBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }

    // Buttons do modal de histórico
    const closeHistoryBtn = document.getElementById('closeHistoryBtn');
    const closeReloadBtn = document.getElementById('closeReloadBtn');
    const cancelReloadBtn = document.getElementById('cancelReloadBtn');
    const confirmReloadBtn = document.getElementById('confirmReloadBtn');

    if (closeHistoryBtn) {
      closeHistoryBtn.addEventListener('click', () => {
        const historyModal = document.getElementById('historyModal');
        if (historyModal) historyModal.style.display = 'none';
      });
    }

    if (closeReloadBtn) {
      closeReloadBtn.addEventListener('click', () => {
        const reloadModal = document.getElementById('reloadExamModal');
        if (reloadModal) reloadModal.style.display = 'none';
      });
    }

    if (cancelReloadBtn) {
      cancelReloadBtn.addEventListener('click', () => {
        const reloadModal = document.getElementById('reloadExamModal');
        if (reloadModal) reloadModal.style.display = 'none';
      });
    }

    if (confirmReloadBtn) {
      confirmReloadBtn.addEventListener('click', () => this.confirmReloadExam());
    }

    // Atualizar mini dots (50 bolinhas das questões)
    this.updateMiniDots();
  }

  /**
   * FUNÇÃO: toggleLanguage()
   * DESCRIÇÃO: Alterna entre Inglês (EN) e Português (PT)
   * - Muda a classe do body para 'lang-pt' (CSS cuida de mostrar/esconder tradução)
   * - Re-renderiza questão com novo idioma
   * - Atualiza todos os textos dos botões
   */
  toggleLanguage() {
    // Alterna: EN → PT ou PT → EN
    this.currentLang = this.currentLang === 'en' ? 'pt' : 'en';
    storageService.setLanguage(this.currentLang);
    
    // CSS ativa/desativa .text-translation baseado na classe lang-pt do body
    if (this.currentLang === 'pt') {
      document.body.classList.add('lang-pt');
    } else {
      document.body.classList.remove('lang-pt');
    }

    // Atualizar labels dos botões para o idioma selecionado
    this.updateUILabels();

    // Re-renderizar opções (agora com overlay model)
    const question = GH300_QUESTIONS[this.currentQuestionIndex];
    if (question) {
      this.loadOptions(question);
    }

    // Se estava mostrando resposta, re-renderiza em novo idioma
    if (this.showAnswers) {
      setTimeout(() => {
        this.renderAnswer();
        this.renderWrongOptions();
      }, 50);
    }
  }

  /**
   * FUNÇÃO: loadQuestion()
   * DESCRIÇÃO: Carrega e exibe a questão atual
   * - Renderiza o texto da questão
   * - Carrega as opções de resposta
   * - Carrega o "Tip to Remember" (dica/mnemônico) - MOSTRA POR PADRÃO
   * - Atualiza navegação (disabled prev/next)
   */
  loadQuestion() {
    if (!GH300_QUESTIONS || GH300_QUESTIONS.length === 0) {
      console.error('Questions not loaded');
      return;
    }

    const question = GH300_QUESTIONS[this.currentQuestionIndex];
    if (!question) return;

    // Atualizar número da questão (1/50)
    const questionNumberEl = document.getElementById('questionNumber');
    if (questionNumberEl) {
      questionNumberEl.textContent = this.currentQuestionIndex + 1;
    }

    // Atualizar dificuldade (EASY/MEDIUM/HARD com cores diferentes)
    const difficultyEl = document.getElementById('difficultyBadge');
    if (difficultyEl) {
      difficultyEl.textContent = question.difficulty.toUpperCase();
      difficultyEl.className = `difficulty-badge difficulty-${question.difficulty}`;
    }

    // Carregar texto da questão (EN + PT embaixo em verde)
    const questionTextENEl = document.getElementById('questionTextEN');
    const questionTextPTEl = document.getElementById('questionTextPT');
    
    if (questionTextENEl && question.en && question.en.question) {
      questionTextENEl.innerHTML = this.escapeHtml(question.en.question);
    }
    if (questionTextPTEl && question.pt && question.pt.question) {
      questionTextPTEl.innerHTML = this.escapeHtml(question.pt.question);
    }

    // Carregar as opções de resposta
    this.loadOptions(question);

    // Carregar o "Tip to Remember" (mnemônico para memorizar) - ESCONDIDO POR PADRÃO
    this.loadMemoryAid(question);
    const tipsSection = document.querySelector('.tips-section');
    if (tipsSection) tipsSection.style.display = this.showTips ? 'block' : 'none';

    // Limpar seção de resposta (esconde até usuário clicar "Show Answer")
    this.showAnswers = false;
    const answerSection = document.getElementById('answerSection');
    if (answerSection) answerSection.style.display = 'none';
    
    this.updateUILabels();

    // Atualizar botões navegação (prev desabilitado na Q1, next desabilitado na Q50)
    this.updateNavigationButtons();
    this.updateMiniDots();
    
    // Salvar estado da prova após carregar questão
    this.saveExamState();
  }

  /**
   * FUNÇÃO: saveExamState()
   * DESCRIÇÃO: Salva o estado atual da prova em localStorage
   * - Chamada frequentemente enquanto usuário faz prova
   * - Persiste: questão atual, respostas, tempo de início
   * - Permite recuperação se página for recarregada
   */
  saveExamState() {
    storageService.saveExamState({
      examId: this.examId,
      currentQuestion: this.currentQuestionIndex,
      answers: { ...this.answers },
      startTime: this.startTime,
    });
  }

  /**
   * FUNÇÃO: loadOptions()
   * DESCRIÇÃO: Renderiza as 4 opções de resposta
   * - Renderiza SEMPRE com modelo overlay: EN visível + PT embaixo (lang-pt)
   * - Cria radio buttons clicáveis
   * - Permite clicar em toda a linha (não só no radio)
   * - Marca opção anterior se usuário já respondeu
   */
  loadOptions(question) {
    const optionsContainer = document.getElementById('optionsContainer');
    if (!optionsContainer) return;
    
    optionsContainer.innerHTML = '';

    const engOptions = question.en.options;
    const ptOptions = OPTION_TRANSLATIONS[question.id] || [];
    const savedAnswer = this.answers[question.id]; // Se já respondeu, recover resposta

    // Uma label para cada opção
    engOptions.forEach((engOption, index) => {
      const label = document.createElement('label');
      label.className = 'option';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = index;
      input.checked = savedAnswer === index; // Marca se é a resposta salva

      // Container com EN e PT
      const optionWrapper = document.createElement('div');
      optionWrapper.className = 'option-content';

      // Text principal (EN)
      const textMain = document.createElement('div');
      textMain.className = 'text-main';
      textMain.innerHTML = this.escapeHtml(engOption);

      // Text tradução (PT)
      const textTranslation = document.createElement('div');
      textTranslation.className = 'text-translation';
      textTranslation.innerHTML = this.escapeHtml(ptOptions[index] || engOption);

      optionWrapper.appendChild(textMain);
      optionWrapper.appendChild(textTranslation);

      label.appendChild(input);
      label.appendChild(optionWrapper);
      optionsContainer.appendChild(label);

      // Permite clicar em qualquer lugar da label, não só no radio
      label.addEventListener('click', (e) => {
        if (e.target !== input) {
          e.preventDefault();
        }
        input.checked = true;
        this.answers[question.id] = index; // Salvar resposta em memória
        storageService.setAnswer(question.id, index); // Salvar no localStorage
        this.saveExamState(); // Salvar estado completo da prova
      });
    });
  }

  /**
   * FUNÇÃO: loadMemoryAid()
   * DESCRIÇÃO: Carrega o "Tip to Remember" (mnemônico)
   * - Exibe dica/analogia para memorizar a questão
   * - Exemplo: "Enterprise = Extra Training | Business = Basic Usage"
   * - Aparece em EN, com tradução em verde embaixo se selecionado PT
   */
  loadMemoryAid(question) {
    // Carregar mnemônico em inglês
    const memoryTextEl = document.getElementById('memoryText');
    if (memoryTextEl && question.en) {
      memoryTextEl.textContent = question.en.mnemonic || '';
    }

    // Carregar mnemônico em português (aparece embaixo com CSS)
    const memoryTextPTEl = document.getElementById('memoryTextPT');
    if (memoryTextPTEl && question.pt) {
      memoryTextPTEl.textContent = question.pt.mnemonic || '';
    }
  }

  /**
   * FUNÇÃO: toggleAnswer()
   * DESCRIÇÃO: Mostra ou esconde a resposta correta + análise
   */
  toggleAnswer() {
    this.showAnswers = !this.showAnswers;
    storageService.setUIPreference('showAnswers', this.showAnswers);
    const answerSection = document.getElementById('answerSection');
    
    if (this.showAnswers) {
      if (answerSection) answerSection.style.display = 'block';
      this.renderAnswer();
      this.renderWrongOptions();
    } else {
      if (answerSection) answerSection.style.display = 'none';
    }

    this.updateUILabels();
  }

  /**
   * FUNÇÃO: toggleTips()
   * DESCRIÇÃO: Mostra ou esconde a seção de dicas/tips
   */
  toggleTips() {
    this.showTips = !this.showTips;
    storageService.setUIPreference('showTips', this.showTips);
    const tipsSection = document.querySelector('.tips-section');
    
    if (tipsSection) {
      if (this.showTips) {
        tipsSection.style.display = 'block';
      } else {
        tipsSection.style.display = 'none';
      }
    }

    this.updateUILabels();
  }

  /**
   * FUNÇÃO: toggleFilter()
   * DESCRIÇÃO: Toggle simples - mostrar/esconder dots das respostas
   */
  toggleFilter() {
    this.showAnswerDots = !this.showAnswerDots;
    storageService.setUIPreference('showDots', this.showAnswerDots);
    this.updateFilterLabel();
    this.updateMiniDots();
  }

  /**
   * FUNÇÃO: updateFilterLabel()
   * DESCRIÇÃO: Atualiza o rótulo do botão de filtro (Show/Hide Answer Dots)
   */
  updateFilterLabel() {
    const filterBtn = document.getElementById('filterBtn');
    const filterLabel = document.getElementById('filterLabel');
    
    if (!filterBtn || !filterLabel) return;

    if (this.showAnswerDots) {
      filterLabel.textContent = '👁️ Show Dots';
      filterBtn.classList.add('active');
    } else {
      filterLabel.textContent = '🙈 Hide Dots';
      filterBtn.classList.remove('active');
    }
  }

  /**
   * FUNÇÃO: renderAnswer()
   * DESCRIÇÃO: Renderiza a resposta correta e sua explicação
   * - Marca a opção correta com verde
   * - Mostra texto da resposta completa
   * - Mostra explicação detalhada
   * - Tudo aparece em EN + PT embaixo em verde
   */
  renderAnswer() {
    const question = GH300_QUESTIONS[this.currentQuestionIndex];
    if (!question || !question.en) return;

    const correctIndex = question.en.correct; // Qual é a resposta correta (índice)

    // Destacar opção correta com verde
    document.querySelectorAll('.option').forEach((opt, idx) => {
      if (idx === correctIndex) {
        opt.classList.add('correct-option');
      } else {
        opt.classList.remove('correct-option');
      }
    });

    // Mostrar resposta completa (EN)
    const answerTextENEl = document.getElementById('correctAnswerEN');
    if (answerTextENEl && question.en.answer) {
      answerTextENEl.innerHTML = this.escapeHtml(question.en.answer);
    }

    // Mostrar resposta em PT (aparece embaixo em verde com CSS)
    const answerTextPTEl = document.getElementById('correctAnswerPT');
    if (answerTextPTEl && question.pt && question.pt.answer) {
      answerTextPTEl.innerHTML = this.escapeHtml(question.pt.answer);
    }

    // Mostrar explicação (por quê está correta)
    const explanationSection = document.getElementById('explanationSection');
    if (explanationSection) {
      explanationSection.style.display = 'block';
    }

    const explanationENEl = document.getElementById('explanationEN');
    if (explanationENEl && question.en.explanation) {
      explanationENEl.innerHTML = this.escapeHtml(question.en.explanation);
    }

    const explanationPTEl = document.getElementById('explanationPT');
    if (explanationPTEl && question.pt && question.pt.explanation) {
      explanationPTEl.innerHTML = this.escapeHtml(question.pt.explanation);
    }
  }

  /**
   * FUNÇÃO: renderWrongOptions()
   * DESCRIÇÃO: Renderiza análise das opções ERRADAS com modelo overlay EN + PT
   * - Para cada opção que NÃO é a correta:
   *   • Mostra o texto da opção (EN + PT embaixo)
   *   • Explica POR QUÊ está errada (EN + PT embaixo)
   * - Tudo sempre com ambos idiomas visíveis = overlay model
   */
  renderWrongOptions() {
    const question = GH300_QUESTIONS[this.currentQuestionIndex];
    if (!question || !question.en) return;

    const correctIndex = question.en.correct;
    const engOptions = question.en.options;
    const ptOptions = OPTION_TRANSLATIONS[question.id] || [];
    const engWrongReasons = question.en.wrongReasons || [];
    const ptWrongReasons = question.pt?.wrongReasons || [];

    const container = document.getElementById('wrongOptionsAnalysis');
    if (!container) return;

    container.innerHTML = '';

    // Para cada opção, se não for correta, mostra motivo dela estar errada
    engOptions.forEach((engOption, idx) => {
      if (idx !== correctIndex) {
        const wrongDiv = document.createElement('div');
        wrongDiv.className = 'wrong-option';

        const engReason = engWrongReasons && engWrongReasons[idx] ? engWrongReasons[idx] : 'This option is incorrect.';
        const ptReason = ptWrongReasons && ptWrongReasons[idx] ? ptWrongReasons[idx] : engReason;
        const ptOption = ptOptions[idx] || engOption;

        // Título com overlay
        const titleDiv = document.createElement('div');
        titleDiv.className = 'wrong-option-title';
        
        const titleMain = document.createElement('span');
        titleMain.className = 'text-main';
        titleMain.textContent = `📌 Option ${idx + 1} - Why not?`;
        
        const titleTrans = document.createElement('span');
        titleTrans.className = 'text-translation';
        titleTrans.textContent = `📌 Opção ${idx + 1} - Por quê não?`;
        
        titleDiv.appendChild(titleMain);
        titleDiv.appendChild(titleTrans);

        // Conteúdo da opção (EN + PT overlay)
        const contentDiv = document.createElement('div');
        contentDiv.className = 'wrong-option-content';
        
        const optionTextDiv = document.createElement('div');
        optionTextDiv.style.marginBottom = '12px';
        
        const optionLabelDiv = document.createElement('div');
        optionLabelDiv.style.marginBottom = '8px';
        optionLabelDiv.style.fontWeight = 'bold';
        optionLabelDiv.innerHTML = 'Option: <span class="text-translation" style="font-weight: normal; margin-left: 8px;">Opção:</span>';
        optionTextDiv.appendChild(optionLabelDiv);
        
        const optionMainWrapper = document.createElement('div');
        optionMainWrapper.style.margin = '5px 0';
        optionMainWrapper.style.padding = '8px';
        optionMainWrapper.style.background = 'rgba(255,255,255,0.05)';
        optionMainWrapper.style.borderLeft = '3px solid #ef4444';
        optionMainWrapper.style.borderRadius = '4px';
        
        const optionMain = document.createElement('div');
        optionMain.className = 'text-main';
        optionMain.innerHTML = this.escapeHtml(engOption);
        
        const optionTrans = document.createElement('div');
        optionTrans.className = 'text-translation';
        optionTrans.innerHTML = this.escapeHtml(ptOption);
        
        optionMainWrapper.appendChild(optionMain);
        optionMainWrapper.appendChild(optionTrans);
        optionTextDiv.appendChild(optionMainWrapper);
        contentDiv.appendChild(optionTextDiv);

        // Por quê está errada (EN + PT overlay)
        const reasonDiv = document.createElement('div');
        reasonDiv.className = 'wrong-option-why';
        
        const reasonLabelDiv = document.createElement('div');
        reasonLabelDiv.style.marginBottom = '8px';
        reasonLabelDiv.style.fontWeight = 'bold';
        reasonLabelDiv.innerHTML = '❌ Why wrong: <span class="text-translation" style="font-weight: normal; margin-left: 8px; color: #06b6d4;">Por quê errada:</span>';
        reasonDiv.appendChild(reasonLabelDiv);
        
        const reasonMainWrapper = document.createElement('div');
        reasonMainWrapper.style.margin = '5px 0';
        reasonMainWrapper.style.padding = '8px';
        reasonMainWrapper.style.background = 'rgba(239,68,68,0.15)';
        reasonMainWrapper.style.borderLeft = '3px solid #ef4444';
        reasonMainWrapper.style.borderRadius = '4px';
        
        const reasonMain = document.createElement('div');
        reasonMain.className = 'text-main';
        // Use theme-aware error color for readability in light and dark modes
        reasonMain.style.color = 'var(--error)';
        reasonMain.innerHTML = this.escapeHtml(engReason);
        
        const reasonTrans = document.createElement('div');
        reasonTrans.className = 'text-translation';
        reasonTrans.style.color = '#06b6d4';
        reasonTrans.innerHTML = this.escapeHtml(ptReason);
        
        reasonMainWrapper.appendChild(reasonMain);
        reasonMainWrapper.appendChild(reasonTrans);
        reasonDiv.appendChild(reasonMainWrapper);

        wrongDiv.appendChild(titleDiv);
        wrongDiv.appendChild(contentDiv);
        wrongDiv.appendChild(reasonDiv);
        container.appendChild(wrongDiv);
      }
    });
  }

  /**
   * FUNÇÃO: previousQuestion()
   * DESCRIÇÃO: Vai para questão anterior
   * - Desabilitada na Q1
   * - Suaviza scroll para o topo
   */
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.loadQuestion();
      this.scrollToTop();
    }
  }

  /**
   * FUNÇÃO: nextQuestion()
   * DESCRIÇÃO: Vai para próxima questão
   * - Desabilitada na Q50
   * - Suaviza scroll para o topo
   */
  nextQuestion() {
    if (this.currentQuestionIndex < GH300_QUESTIONS.length - 1) {
      this.currentQuestionIndex++;
      storageService.setCurrentQuestion(this.currentQuestionIndex);
      this.loadQuestion();
      this.scrollToTop();
    }
  }

  /**
   * FUNÇÃO: previousQuestion()
   * DESCRIÇÃO: Vai para questão anterior
   */
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      storageService.setCurrentQuestion(this.currentQuestionIndex);
      this.loadQuestion();
      this.scrollToTop();
    }
  }

  /**
   * FUNÇÃO: updateNavigationButtons()
   * DESCRIÇÃO: Atualiza estado dos botões de navegação
   * - Desabilita "Previous" na primeira questão
   * - Desabilita "Next" na última questão
   * - Mostra botão "Finish" na última questão
   */
  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');

    const isFirst = this.currentQuestionIndex === 0;
    const isLast = this.currentQuestionIndex === GH300_QUESTIONS.length - 1;

    if (prevBtn) prevBtn.disabled = isFirst;
    if (nextBtn) nextBtn.disabled = isLast;

    // Mostrar finish button apenas na última questão
    if (finishBtn) {
      finishBtn.style.display = isLast ? 'inline-flex' : 'none';
    }
  }

  /**
   * FUNÇÃO: updateMiniDots()
   * DESCRIÇÃO: Renderiza os 50 bolinhas (1 por questão)
   * - Mostra qual questão está ativa (blue)
   * - Se showAnswerDots=true: Mostra cores (verde=correto, vermelho=errado)
   * - Se showAnswerDots=false: Sem cores
   * - Permite pular para qualquer questão clicando
   */
  updateMiniDots() {
    const dotsContainer = document.getElementById('miniDots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';

    GH300_QUESTIONS.forEach((q, idx) => {
      const dot = document.createElement('button');
      dot.className = 'mini-dot';
      dot.textContent = idx + 1;
      
      if (idx === this.currentQuestionIndex) dot.classList.add('active');
      
      // Adicionar cores APENAS se showAnswerDots for true
      if (this.showAnswerDots && this.answers[q.id] !== undefined) {
        if (this.answers[q.id] === q.en.correct) {
          dot.classList.add('answered-correct');    // GREEN
        } else {
          dot.classList.add('answered-wrong');      // RED
        }
      }

      dot.setAttribute('data-question', idx);
      dot.title = `Question ${idx + 1}`;

      dot.addEventListener('click', () => {
        this.currentQuestionIndex = idx;
        this.loadQuestion();
        this.scrollToTop();
      });

      dotsContainer.appendChild(dot);
    });
  }

  /**
   * FUNÇÃO: submitExam()
   * DESCRIÇÃO: Termina o exame e mostra resultados
   * - Calcula score (quantas acertou)
   * - Calcula percentual
   * - Calcula tempo total gasto
   * - Salva prova no histórico
   * - Exibe modal com resultados e feedback
   */
  submitExam() {
    const score = this.calculateScore();
    const percentage = Math.round((score / GH300_QUESTIONS.length) * 100);
    const totalTime = Math.floor((Date.now() - this.startTime) / 1000);

    // Salvar prova como completada no histórico
    storageService.completeExam({
      examId: this.examId,
      answers: { ...this.answers },
      score: score,
      percentage: percentage,
      totalTime: totalTime,
    });

    // Limpar estado da prova em progresso
    storageService.clearCurrentExamState();

    this.showResults(score, percentage, totalTime);
  }

  /**
   * FUNÇÃO: calculateScore()
   * DESCRIÇÃO: Conta quantas questões o usuário acertou
   * - Compara resposta salva com resposta correta
   * - Retorna número de acertos (0-50)
   */
  calculateScore() {
    let score = 0;
    GH300_QUESTIONS.forEach(q => {
      // A resposta correta é definida em en.correct
      const correctIndex = q.en.correct;
      // Compara a resposta salva com o índice correto
      if (this.answers[q.id] === correctIndex) {
        score++;
      }
    });
    return score;
  }

  /**
   * FUNÇÃO: showResults()
   * DESCRIÇÃO: Exibe modal com os resultados finais
   * - Score em grande
   * - Número de corretas/erradas
   * - Tempo gasto
   * - Mensagem motivacional com base no score
   * - Botões para retomar/voltar
   */
  showResults(score, percentage, totalTime) {
    const resultsModal = document.getElementById('resultsModal');
    if (!resultsModal) {
      console.warn('Results modal not found');
      return;
    }

    const correct = score;
    const wrong = GH300_QUESTIONS.length - score;

    // Atualizar título
    const resultsTitle = document.getElementById('resultsTitle');
    if (resultsTitle) {
      resultsTitle.textContent = this.currentLang === 'en' ? 'Exam Complete!' : 'Prova Concluída!';
    }

    // Atualizar score grande no topo (ex: 85%)
    const finalScore = document.getElementById('finalScore');
    if (finalScore) {
      finalScore.textContent = percentage;
    }

    // Estatísticas (corretas/erradas/tempo)
    const correctCount = document.getElementById('correctCount');
    const wrongCount = document.getElementById('wrongCount');
    const timeSpent = document.getElementById('timeSpent');

    if (correctCount) correctCount.textContent = correct;
    if (wrongCount) wrongCount.textContent = wrong;
    if (timeSpent) timeSpent.textContent = this.formatTime(totalTime);

    // Atualizar labels conforme idioma
    const correctLabel = document.getElementById('correctLabel');
    const wrongLabel = document.getElementById('wrongLabel');
    const timeLabel = document.getElementById('timeLabel');

    if (correctLabel) correctLabel.textContent = this.currentLang === 'en' ? 'Correct' : 'Corretas';
    if (wrongLabel) wrongLabel.textContent = this.currentLang === 'en' ? 'Wrong' : 'Erradas';
    if (timeLabel) timeLabel.textContent = this.currentLang === 'en' ? 'Time' : 'Tempo';

    // Mensagem motivacional (varia com o score)
    const resultsFeedback = document.getElementById('resultsFeedback');
    if (resultsFeedback) {
      resultsFeedback.textContent = this.getResultMessage(percentage, this.currentLang);
    // Mostrar botão View History no modal final se houver provas anteriores
    const history = storageService.getExamHistory();
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');

    if (viewHistoryBtn) {
      viewHistoryBtn.style.display = history.length > 0 ? 'inline-flex' : 'none';
    }
    }

    // Mostrar modal
    resultsModal.style.display = 'flex';
  }

  /**
   * FUNÇÃO: getResultMessage()
   * DESCRIÇÃO: Retorna mensagem motivacional baseada no score
   * - 90+% = Excelente
   * - 75-89% = Bom
   * - 60-74% = Regular
   * - <60% = Precisa estudar mais
   */
  getResultMessage(percentage, lang) {
    const messages = {
      en: {
        excellent: '🎉 Excellent! You\'ve mastered the GitHub Copilot material! Ready for certification! 🚀',
        good: '👍 Great job! Keep practicing to reach excellence! A few more attempts and you\'ll be ready!',
        fair: '📚 Good effort! Review the material where you struggled and try again!',
        needs: '💪 Keep studying! Review key concepts and retake the exam. You\'ve got this!'
      },
      pt: {
        excellent: '🎉 Excelente! Você dominou o material do GitHub Copilot! Pronto para certificação! 🚀',
        good: '👍 Ótimo! Continue praticando para alcançar excelência! Mais algumas tentativas e estará pronto!',
        fair: '📚 Bom esforço! Revise o material onde teve dificuldade e tente novamente!',
        needs: '💪 Continue estudando! Revise conceitos-chave e refaça a prova. Você consegue!'
      }
    };

    const msgs = messages[lang];
    if (percentage >= 90) return msgs.excellent;
    if (percentage >= 75) return msgs.good;
    if (percentage >= 60) return msgs.fair;
    return msgs.needs;
  }

  /**
   * FUNÇÃO: retakeExam()
   * DESCRIÇÃO: Reseta tudo e permite fazer o exame novamente
   * - Limpa todas as respostas
   * - Volta para Q1
   * - Reinicia cronômetro
   * - Cria novo ID para essa tentativa
   * - Esconde modal de resultados
   */
  retakeExam() {
    this.examId = storageService.generateExamId();
    this.answers = {};
    this.currentQuestionIndex = 0;
    this.startTime = Date.now();
    this.showAnswers = false;

    // Salvar novo estado de prova
    storageService.saveExamState({
      examId: this.examId,
      currentQuestion: this.currentQuestionIndex,
      answers: this.answers,
      startTime: this.startTime,
    });

    const resultsModal = document.getElementById('resultsModal');
    if (resultsModal) resultsModal.style.display = 'none';

    this.loadQuestion();
  }

  /**
   * FUNÇÃO: updateUILabels()
   * DESCRIÇÃO: Atualiza todos os textos dos botões conforme idioma
   * - "EN / PT" → "PT / EN"
   * - "Show Answer" → "Mostrar Resposta"
   * - "Show Tips" → "Mostrar Dicas"
   * - etc
   */
  updateUILabels() {
    const labels = {
      en: {
        prev: '← Previous',
        next: 'Next →',
        showAnswer: 'Show Answer',
        hideAnswer: 'Hide Answer',
        showTips: 'Show Tips',
        hideTips: 'Hide Tips',
        finish: 'Finish Exam',
        langDisplay: 'EN',
        langOther: 'PT'
      },
      pt: {
        prev: '← Anterior',
        next: 'Próximo →',
        showAnswer: 'Mostrar Resposta',
        hideAnswer: 'Ocultar Resposta',
        showTips: 'Mostrar Dicas',
        hideTips: 'Ocultar Dicas',
        finish: 'Finalizar Prova',
        langDisplay: 'PT',
        langOther: 'EN'
      }
    };

    const lang = labels[this.currentLang];

    const prevBtn = document.getElementById('prevLabel');
    const nextBtn = document.getElementById('nextLabel');
    const finishLabel = document.getElementById('finishLabel');
    const showAnswerBtn = document.getElementById('showAnswerLabel');
    const showTipsBtn = document.getElementById('showTipsLabel');

    if (prevBtn) prevBtn.textContent = lang.prev;
    if (nextBtn) nextBtn.textContent = lang.next;
    if (finishLabel) finishLabel.textContent = lang.finish;
    if (showAnswerBtn) showAnswerBtn.textContent = this.showAnswers ? lang.hideAnswer : lang.showAnswer;
    if (showTipsBtn) showTipsBtn.textContent = this.showTips ? lang.hideTips : lang.showTips;

    // Atualizar rótulo do filtro de dots
    this.updateFilterLabel();
  }

  /**
   * FUNÇÃO: formatTime()
   * DESCRIÇÃO: Converte segundos para formato legível (ex: "12m 45s")
   */
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  }

  /**
   * FUNÇÃO: scrollToTop()
   * DESCRIÇÃO: Suaviza scroll para o topo da página
   * - Usado ao navegar para nova questão
   */
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * FUNÇÃO: generateReviewDocument()
   * DESCRIÇÃO: Gera um documento HTML lindo para revisão completa
   */
  generateReviewDocument() {
    const score = this.calculateScore();
    const percentage = Math.round((score / GH300_QUESTIONS.length) * 100);
    const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
    const wrong = GH300_QUESTIONS.length - score;

    // Build the review document HTML
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GH-300 Exam Review - ${percentage}%</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      line-height: 1.6;
      padding: 20px;
    }
    .container { max-width: 1000px; margin: 0 auto; }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      padding: 40px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 30px;
      color: white;
    }
    .score-display { font-size: 72px; font-weight: bold; margin: 20px 0; }
    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }
    .stat-box {
      background: rgba(255,255,255,0.1);
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-label { font-size: 12px; opacity: 0.8; text-transform: uppercase; }
    .stat-value { font-size: 28px; font-weight: bold; }
    .question-review {
      background: #1e293b;
      border-left: 4px solid #2563eb;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 8px;
    }
    .question-review.correct { border-left-color: #10b981; }
    .question-review.incorrect { border-left-color: #ef4444; }
    .question-num { font-size: 12px; opacity: 0.6; margin-bottom: 10px; text-transform: uppercase; }
    .question-text { font-weight: 600; margin-bottom: 15px; font-size: 16px; }
    .answer-item {
      margin: 12px 0;
      padding: 12px;
      background: rgba(255,255,255,0.05);
      border-radius: 6px;
      border-left: 3px solid #666;
    }
    .answer-label { font-size: 12px; opacity: 0.7; text-transform: uppercase; margin-bottom: 4px; }
    .answer-text { margin: 6px 0; }
    .user-answer { border-left-color: #f59e0b; }
    .correct-answer { border-left-color: #10b981; }
    .wrong-analysis { background: rgba(239,68,68,0.1); border-left-color: #ef4444; color: #ef4444; }
    .explanation { background: rgba(37,99,235,0.1); border-left-color: #2563eb; color: #bfdbfe; }
    .status-icon { font-size: 20px; margin-right: 10px; }
    .question-header { display: flex; align-items: center; margin-bottom: 15px; }
    .summary-end {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      margin-top: 40px;
      color: white;
    }
    .footer-message { font-size: 18px; margin-bottom: 15px; }
    .tips {
      background: rgba(255,255,255,0.05);
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
      border-left: 4px solid #06b6d4;
    }
    .tips h4 { margin-bottom: 10px; color: #06b6d4; }
    .tips li { margin-left: 20px; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 GH-300 Exam Review</h1>
      <div class="score-display">${percentage}%</div>
      <div class="summary-stats">
        <div class="stat-box">
          <div class="stat-label">✅ Correct</div>
          <div class="stat-value">${score}/50</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">❌ Wrong</div>
          <div class="stat-value">${wrong}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">⏱️ Time</div>
          <div class="stat-value">${this.formatTime(totalTime)}</div>
        </div>
      </div>
    </div>
    <div id="review-questions"></div>
    <div class="summary-end">
      <div class="footer-message">${this.getDetailedFeedback(percentage)}</div>
      <div class="tips">
        <h4>💡 Tips for Next Time:</h4>
        <ul>
          <li>Review the questions you got wrong above</li>
          <li>Focus on understanding the "Why wrong" explanations</li>
          <li>Practice with context-based learning</li>
          <li>Use the mnemonics to remember key points</li>
        </ul>
      </div>
    </div>
  </div>
  <script>
    const container = document.getElementById('review-questions');
    const questions = ${JSON.stringify(GH300_QUESTIONS)};
    const answers = ${JSON.stringify(this.answers)};
    
    questions.forEach((q, idx) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.en.correct;
      const userOption = q.en.options[userAnswer];
      const correctOption = q.en.options[q.en.correct];
      
      const div = document.createElement('div');
      div.className = 'question-review ' + (isCorrect ? 'correct' : 'incorrect');
      
      let reviewHtml = '<div class="question-header"><span class="status-icon">' + (isCorrect ? '✅' : '❌') + '</span><div><div class="question-num">Question ' + (idx + 1) + ' of 50 - ' + (isCorrect ? 'CORRECT ✓' : 'INCORRECT ✗') + '</div></div></div>';
      reviewHtml += '<div class="question-text">' + q.en.question + '</div>';
      reviewHtml += '<div class="answer-item user-answer"><div class="answer-label">Your Answer:</div><div class="answer-text">📌 ' + (userOption || 'Not answered') + '</div></div>';
      reviewHtml += '<div class="answer-item correct-answer"><div class="answer-label">Correct Answer:</div><div class="answer-text">✅ ' + correctOption + '</div></div>';
      reviewHtml += '<div class="answer-item explanation"><div class="answer-label">Explanation:</div><div class="answer-text">' + q.en.explanation + '</div></div>';
      reviewHtml += '<div class="answer-item explanation"><div class="answer-label">Detailed Answer:</div><div class="answer-text">' + q.en.answer + '</div></div>';
      
      if (!isCorrect && q.en.wrongReasons && q.en.wrongReasons[userAnswer]) {
        reviewHtml += '<div class="answer-item wrong-analysis"><div class="answer-label">Why Your Answer Is Wrong:</div><div class="answer-text">' + q.en.wrongReasons[userAnswer] + '</div></div>';
      }
      
      div.innerHTML = reviewHtml;
      container.appendChild(div);
    });
  </script>
</body>
</html>`;

    return html;
  }

  /**
   * FUNÇÃO: getDetailedFeedback()
   * DESCRIÇÃO: Retorna mensagem motivacional detalhada baseada no score
   */
  getDetailedFeedback(percentage) {
    if (percentage >= 90) {
      return '🎉 Outstanding! You\'ve mastered GitHub Copilot! Ready for certification!';
    } else if (percentage >= 75) {
      return '👍 Great job! Continue practicing to reach perfection!';
    } else if (percentage >= 60) {
      return '📚 Good effort! Review the material and focus on weak areas!';
    } else {
      return '💪 Keep studying! Review the explanations and try again!';
    }
  }

  /**
   * FUNÇÃO: openReview()
   * DESCRIÇÃO: Abre documento de revisão detalhado em nova janela
   * - Gera HTML com todas as questões, respostas e explicações
   * - Inclui botão "Back" para voltar ao modal
   * - Ideal para revisão completa
   */
  openReview() {
    const doc = this.generateReviewDocument();
    const win = window.open();
    
    // Adicionar botão Back no topo
    const backButtonHtml = `
      <div style="position: sticky; top: 0; background: var(--card-bg); padding: 16px; border-bottom: 1px solid var(--border); z-index: 100;">
        <button onclick="window.close()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-arrow-left" style="font-size: 16px;"></i> Back to Results
        </button>
      </div>
    `;
    
    win.document.write(backButtonHtml + doc);
    win.document.close();
  }

  /**
   * FUNÇÃO: showExamHistory()
   * DESCRIÇÃO: Mostra lista de provas anteriores do usuário
   * - Recupera histórico do storageService
   * - Renderiza lista com score, data e hora
   * - Permite clicar para reabrir prova
   */
  showExamHistory() {
    const history = storageService.getExamHistory();
    const historyList = document.getElementById('examHistoryList');
    
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    if (history.length === 0) {
      historyList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <p style="font-size: 18px; margin-bottom: 10px;">No previous exams found</p>
          <p style="font-size: 14px;">Complete an exam to see it here</p>
        </div>
      `;
      const historyModal = document.getElementById('historyModal');
      if (historyModal) historyModal.style.display = 'flex';
      return;
    }
    
    // Renderizar cada prova no histórico
    history.forEach((exam, index) => {
      const date = new Date(exam.completedAt);
      const dateStr = date.toLocaleDateString(this.currentLang === 'en' ? 'en-US' : 'pt-BR');
      const timeStr = date.toLocaleTimeString(this.currentLang === 'en' ? 'en-US' : 'pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      const examItem = document.createElement('div');
      examItem.style.cssText = `
        background: var(--card-bg); 
        border: 1px solid var(--border); 
        border-radius: 8px; 
        padding: 16px; 
        margin-bottom: 12px; 
        cursor: pointer; 
        transition: all 0.2s;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
      
      examItem.onmouseover = () => {
        examItem.style.borderColor = '#2563eb';
        examItem.style.background = 'rgba(37, 99, 235, 0.05)';
      };
      
      examItem.onmouseout = () => {
        examItem.style.borderColor = 'var(--border)';
        examItem.style.background = 'var(--card-bg)';
      };
      
      const info = document.createElement('div');
      info.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px; width: 100%;">
          <div style="font-size: 28px; font-weight: 700; color: #2563eb; min-width: 60px;">${exam.percentage}%</div>
          <div>
            <div style="font-weight: 600; color: var(--text); margin-bottom: 4px;">Exam ${index + 1}</div>
            <div style="font-size: 13px; color: var(--text-muted);">${dateStr} at ${timeStr}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${exam.score}/${GH300_QUESTIONS.length} correct • ${this.formatTime(exam.totalTime)}</div>
          </div>
        </div>
      `;
      
      const actionBtn = document.createElement('button');
      actionBtn.className = 'btn btn-primary';
      actionBtn.style.cssText = 'margin-left: 16px; white-space: nowrap;';
      actionBtn.innerHTML = '<i class="fas fa-redo"></i> Reopen';
      actionBtn.onclick = (e) => {
        e.stopPropagation();
        this.promptReloadExam(exam.examId, exam.percentage, exam.score);
      };
      
      examItem.appendChild(info);
      examItem.appendChild(actionBtn);
      historyList.appendChild(examItem);
    });
    
    const historyModal = document.getElementById('historyModal');
    if (historyModal) historyModal.style.display = 'flex';
  }

  /**
   * FUNÇÃO: promptReloadExam()
   * DESCRIÇÃO: Mostra modal de confirmação antes de recarregar prova antiga
   * @param {string} examId - ID da prova
   * @param {number} percentage - Percentual que tirou
   * @param {number} score - Score que tirou
   */
  promptReloadExam(examId, percentage, score) {
    this.selectedExamIdToReload = examId;
    
    const message = this.currentLang === 'en' 
      ? `You are about to reload Exam with ${percentage}% (${score}/${GH300_QUESTIONS.length} questions correct). Your previous answers will be loaded and you can review or retake this exam.`
      : `Você vai recarregar a Prova com ${percentage}% (${score}/${GH300_QUESTIONS.length} questões corretas). Suas respostas anteriores serão carregadas e você pode revisar ou refazer esta prova.`;
    
    const reloadMessage = document.getElementById('reloadMessage');
    if (reloadMessage) {
      reloadMessage.textContent = message;
    }
    
    // Atualizar labels conforme idioma
    const reloadTitle = document.getElementById('reloadTitle');
    const confirmLabel = document.getElementById('confirmLabel');
    const cancelLabel = document.getElementById('cancelLabel');
    
    if (reloadTitle) reloadTitle.textContent = this.currentLang === 'en' ? 'Reload Exam?' : 'Recarregar Prova?';
    if (confirmLabel) confirmLabel.textContent = this.currentLang === 'en' ? 'Reload Exam' : 'Recarregar Prova';
    if (cancelLabel) cancelLabel.textContent = this.currentLang === 'en' ? 'Cancel' : 'Cancelar';
    
    const reloadModal = document.getElementById('reloadExamModal');
    if (reloadModal) reloadModal.style.display = 'flex';
  }

  /**
   * FUNÇÃO: confirmReloadExam()
   * DESCRIÇÃO: Confirma e carrega a prova selecionada
   */
  confirmReloadExam() {
    if (!this.selectedExamIdToReload) return;
    
    const oldAnswers = storageService.loadExamAnswers(this.selectedExamIdToReload);
    if (!oldAnswers) {
      console.warn('Could not load exam answers');
      return;
    }
    
    // Criar novo examId para essa sessão
    this.examId = storageService.generateExamId();
    this.answers = { ...oldAnswers };
    this.currentQuestionIndex = 0;
    this.startTime = Date.now();
    this.showAnswers = false;
    
    // Salvar novo estado
    storageService.saveExamState({
      examId: this.examId,
      currentQuestion: this.currentQuestionIndex,
      answers: this.answers,
      startTime: this.startTime,
    });
    
    // Fechar modais
    const reloadModal = document.getElementById('reloadExamModal');
    const historyModal = document.getElementById('historyModal');
    const resultsModal = document.getElementById('resultsModal');
    
    if (reloadModal) reloadModal.style.display = 'none';
    if (historyModal) historyModal.style.display = 'none';
    if (resultsModal) resultsModal.style.display = 'none';
    
    this.loadQuestion();
  }

  /**
   * FUNÇÃO: escapeHtml()
   * DESCRIÇÃO: Escapa caracteres especiais HTML
   * - Previne XSS (segurança)
   * - Exemplo: <script> vira &lt;script&gt; (inofensivo)
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return typeof text === 'string' ? text.replace(/[&<>"']/g, m => map[m]) : '';
  }
}

/**
 * INICIALIZAÇÃO
 * Quando a página termina de carregar, cria uma instância do simulador
 * Este é o ponto de entrada: tudo começa aqui!
 */
document.addEventListener('DOMContentLoaded', () => {
  new GH300Simulator();
});
