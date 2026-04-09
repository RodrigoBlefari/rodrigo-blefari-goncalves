/**
 * GH-300 EXAM SIMULATOR - Complete Controller
 * 
 * Este Ã© o coraÃ§Ã£o do simulador. Ele gerencia:
 * - RenderizaÃ§Ã£o das questÃµes
 * - AlternÃ¢ncia de idioma (EN/PT)
 * - NavegaÃ§Ã£o entre questÃµes
 * - CÃ¡lculo de score
 * - ExibiÃ§Ã£o de resposta e anÃ¡lise
 */

async function fetchJson(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

function getExamIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('exam') || 'gh300';
}

async function loadExamData() {
  const examId = getExamIdFromUrl();
  const base = window.location.href;

  try {
    const indexUrl = new URL('data/exams/index.json', base).href;
    const index = await fetchJson(indexUrl);
    const exams = Array.isArray(index?.exams) ? index.exams : [];
    const entry = exams.find(e => e.id === examId) || exams[0];
    const file = entry?.file || `${examId}.json`;
    const examUrl = new URL(`data/exams/${file}`, base).href;
    const exam = await fetchJson(examUrl);

    if (!exam.id) exam.id = entry?.id || examId;
    if (!exam.label && entry?.label) exam.label = entry.label;
    if (!exam.title && entry?.title) exam.title = entry.title;
    if (!exam.subtitle && entry?.subtitle) exam.subtitle = entry.subtitle;

    return exam;
  } catch (err) {
    console.warn('Failed to load exam index, trying direct exam file:', err);
    try {
      const examUrl = new URL(`data/exams/${examId}.json`, base).href;
      const exam = await fetchJson(examUrl);
      if (!exam.id) exam.id = examId;
      return exam;
    } catch (innerErr) {
      console.error('Failed to load exam data:', innerErr);
      return null;
    }
  }
}

function hashExamData(exam) {
  try {
    const raw = JSON.stringify(exam?.questions || []);
    let hash = 5381;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) + hash) + raw.charCodeAt(i);
      hash = hash & 0xffffffff;
    }
    return `q${exam?.questions?.length || 0}-${hash >>> 0}`;
  } catch {
    return `q${exam?.questions?.length || 0}-0`;
  }
}

class GH300Simulator {
  constructor(exam) {
    this.exam = exam || { id: 'gh300', title: 'Exam Simulator', questions: [] };
    this.questions = Array.isArray(this.exam.questions) ? this.exam.questions : [];
    this.totalQuestions = this.questions.length;

    this.applyExamMeta();
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
    
    // Carregar preferÃªncias do usuÃ¡rio
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
    // Carregar questÃ£o atual
    this.loadQuestion();
  }

  /**
   * FUNÃƒâ€¡ÃƒÆ’O: applyExamMeta()
   * Aplica tÃƒÂ­tulo e subtÃƒÂ­tulo da prova na UI
   */
  applyExamMeta() {
    const title = this.exam?.title || 'Exam Simulator';
    const subtitle = this.exam?.subtitle || '';

    const h1 = document.querySelector('.header-title h1');
    const p = document.querySelector('.header-title p');

    if (h1) h1.textContent = title;
    if (p) {
      p.textContent = subtitle;
      p.style.display = subtitle ? '' : 'none';
    }

    if (title) {
      document.title = `${title} | Exam Practice`;
    }
  }

  /**
   * FUNÃ‡ÃƒO: initializeLanguage()
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
   * FUNÃ‡ÃƒO: initializeTheme()
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
   * FUNÃ‡ÃƒO: applyTheme()
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
   * FUNÃ‡ÃƒO: changeTheme()
   * Muda o tema e salva no storage
   * @param {string} theme - 'light' ou 'dark'
   */
  changeTheme(theme) {
    storageService.setTheme(theme);
    this.applyTheme(theme);
  }

  /**
   * FUNÃ‡ÃƒO: initializeEventListeners()
   * DESCRIÃ‡ÃƒO: Conecta todos os botÃµes e eventos aos seus handlers
   */
  initializeEventListeners() {
    // BotÃ£o de trocar idioma (EN â†” PT)
    const langToggle = document.getElementById('langToggle');
    const viewHistoryTopBtn = document.getElementById('viewHistoryTopBtn');
    if (langToggle) {
      langToggle.addEventListener('click', () => this.toggleLanguage());
    }

    if (viewHistoryTopBtn) {
      viewHistoryTopBtn.addEventListener('click', () => this.showExamHistory());
    }

    // BotÃ£o de modo revisÃ£o
    // BotÃµes de navegaÃ§Ã£o
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');

    if (prevBtn) prevBtn.addEventListener('click', () => this.previousQuestion());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
    if (finishBtn) finishBtn.addEventListener('click', () => this.submitExam());

    // BotÃ£o para mostrar resposta
    const showAnswerBtn = document.getElementById('showAnswerBtn');
    if (showAnswerBtn) {
      showAnswerBtn.addEventListener('click', () => this.toggleAnswer());
    }

    // BotÃ£o para mostrar dicas/tips
    const showTipsBtn = document.getElementById('showTipsBtn');
    if (showTipsBtn) {
      showTipsBtn.addEventListener('click', () => this.toggleTips());
    }

    // BotÃ£o de filtro
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

    // Buttons do modal de histÃ³rico
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

    // Atualizar mini dots (50 bolinhas das questÃµes)
    this.updateMiniDots();
  }

  /**
   * FUNÃ‡ÃƒO: toggleLanguage()
   * DESCRIÃ‡ÃƒO: Alterna entre InglÃªs (EN) e PortuguÃªs (PT)
   * - Muda a classe do body para 'lang-pt' (CSS cuida de mostrar/esconder traduÃ§Ã£o)
   * - Re-renderiza questÃ£o com novo idioma
   * - Atualiza todos os textos dos botÃµes
   */
  toggleLanguage() {
    // Alterna: EN â†’ PT ou PT â†’ EN
    this.currentLang = this.currentLang === 'en' ? 'pt' : 'en';
    storageService.setLanguage(this.currentLang);
    
    // CSS ativa/desativa .text-translation baseado na classe lang-pt do body
    if (this.currentLang === 'pt') {
      document.body.classList.add('lang-pt');
    } else {
      document.body.classList.remove('lang-pt');
    }

    // Atualizar labels dos botÃµes para o idioma selecionado
    this.updateUILabels();

    // Re-renderizar opÃ§Ãµes (agora com overlay model)
    const question = this.questions[this.currentQuestionIndex];
    if (question) {
      this.loadOptions(question);
    }

    // Se estava mostrando resposta, re-renderiza em novo idioma
    if (this.showAnswers) {
      setTimeout(() => {
        this.renderAnswer();
      }, 50);
    }
  }

  /**
   * FUNÃ‡ÃƒO: loadQuestion()
   * DESCRIÃ‡ÃƒO: Carrega e exibe a questÃ£o atual
   * - Renderiza o texto da questÃ£o
   * - Carrega as opÃ§Ãµes de resposta
   * - Carrega o "Tip to Remember" (dica/mnemÃ´nico) - MOSTRA POR PADRÃƒO
   * - Atualiza navegaÃ§Ã£o (disabled prev/next)
   */
  loadQuestion() {
    if (!this.questions || this.questions.length === 0) {
      console.error('Questions not loaded');
      return;
    }

    const question = this.questions[this.currentQuestionIndex];
    if (!question) return;

    // Atualizar nÃºmero da questÃ£o (1/50)
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

    // Carregar texto da questÃ£o (EN + PT embaixo em verde)
    const questionTextENEl = document.getElementById('questionTextEN');
    const questionTextPTEl = document.getElementById('questionTextPT');
    
    if (questionTextENEl && question.question) {
      questionTextENEl.innerHTML = this.escapeHtml(this.getText(question.question, 'en'));
    }
    if (questionTextPTEl && question.question) {
      questionTextPTEl.innerHTML = this.escapeHtml(this.getText(question.question, 'pt'));
    }

    // Carregar as opÃ§Ãµes de resposta
    this.loadOptions(question);

    // Carregar o "Tip to Remember" (mnemÃ´nico para memorizar) - ESCONDIDO POR PADRÃƒO
    this.loadMemoryAid(question);
    const tipsSection = document.querySelector('.tips-section');
    if (tipsSection) tipsSection.style.display = this.showTips ? 'block' : 'none';

    // Limpar seÃ§Ã£o de resposta (esconde atÃ© usuÃ¡rio clicar "Show Answer")
    this.showAnswers = false;
    const answerSection = document.getElementById('answerSection');
    if (answerSection) answerSection.style.display = 'none';
    
    this.updateUILabels();

    // Atualizar botÃµes navegaÃ§Ã£o (prev desabilitado na Q1, next desabilitado na Q50)
    this.updateNavigationButtons();
    this.updateMiniDots();
    this.updateProgress();

    // Salvar estado da prova apÃ³s carregar questÃ£o
    this.saveExamState();
  }

  /**
   * FUNÃ‡ÃƒO: saveExamState()
   * DESCRIÃ‡ÃƒO: Salva o estado atual da prova em localStorage
   * - Chamada frequentemente enquanto usuÃ¡rio faz prova
   * - Persiste: questÃ£o atual, respostas, tempo de inÃ­cio
   * - Permite recuperaÃ§Ã£o se pÃ¡gina for recarregada
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
   * FUNÃ‡ÃƒO: loadOptions()
   * DESCRIÃ‡ÃƒO: Renderiza as 4 opÃ§Ãµes de resposta
   * - Renderiza SEMPRE com modelo overlay: EN visÃ­vel + PT embaixo (lang-pt)
   * - Cria radio buttons clicÃ¡veis
   * - Permite clicar em toda a linha (nÃ£o sÃ³ no radio)
   * - Marca opÃ§Ã£o anterior se usuÃ¡rio jÃ¡ respondeu
   */
  getText(block, lang) {
    if (!block || typeof block !== 'object') return '';
    return block[lang] || '';
  }

  getOptionText(option, lang) {
    if (!option || typeof option !== 'object') return '';
    return option[lang] || '';
  }

  loadOptions(question) {
    const optionsContainer = document.getElementById('optionsContainer');
    if (!optionsContainer) return;
    
    optionsContainer.innerHTML = '';

    const engOptions = Array.isArray(question.options) ? question.options : [];
    const savedAnswer = this.answers[question.id]; // Se jÃ¡ respondeu, recover resposta

    // Uma label para cada opÃ§Ã£o
    engOptions.forEach((opt, index) => {
      const label = document.createElement('label');
      label.className = 'option';
      label.dataset.optionIndex = String(index);

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = index;
      input.checked = savedAnswer === index; // Marca se Ã© a resposta salva

      // Container com EN e PT
      const optionWrapper = document.createElement('div');
      optionWrapper.className = 'option-content';

      // Text principal (EN)
      const textMain = document.createElement('div');
      textMain.className = 'text-main';
      textMain.innerHTML = this.escapeHtml(this.getOptionText(opt, 'en'));

      // Text traduÃ§Ã£o (PT)
      const textTranslation = document.createElement('div');
      textTranslation.className = 'text-translation';
      textTranslation.innerHTML = this.escapeHtml(this.getOptionText(opt, 'pt') || this.getOptionText(opt, 'en'));

      optionWrapper.appendChild(textMain);
      optionWrapper.appendChild(textTranslation);

      // Feedback inline (resposta/erro) - preenchido quando Show Answer estiver ativo
      const feedback = document.createElement('div');
      feedback.className = 'option-feedback';
      feedback.style.display = 'none';

      label.appendChild(input);
      label.appendChild(optionWrapper);
      label.appendChild(feedback);
      optionsContainer.appendChild(label);

      // Permite clicar em qualquer lugar da label, nÃ£o sÃ³ no radio
      label.addEventListener('click', (e) => {
        if (e.target !== input) {
          e.preventDefault();
        }
        input.checked = true;
        this.answers[question.id] = index; // Salvar resposta em memÃ³ria
        storageService.setAnswer(question.id, index); // Salvar no localStorage
        this.saveExamState(); // Salvar estado completo da prova
      });
    });

    // Se Show Answer ativo, aplica feedback imediatamente
    if (this.showAnswers) {
      this.applyAnswerFeedback();
    }
  }

  /**
   * FUNÃ‡ÃƒO: loadMemoryAid()
   * DESCRIÃ‡ÃƒO: Carrega o "Tip to Remember" (mnemÃ´nico)
   * - Exibe dica/analogia para memorizar a questÃ£o
   * - Exemplo: "Enterprise = Extra Training | Business = Basic Usage"
   * - Aparece em EN, com traduÃ§Ã£o em verde embaixo se selecionado PT
   */
  loadMemoryAid(question) {
    // Carregar mnemÃ´nico em inglÃªs
    const memoryTextEl = document.getElementById('memoryText');
    if (memoryTextEl && question.mnemonic) {
      memoryTextEl.textContent = this.getText(question.mnemonic, 'en') || '';
    }

    // Carregar mnemÃ´nico em portuguÃªs (aparece embaixo com CSS)
    const memoryTextPTEl = document.getElementById('memoryTextPT');
    if (memoryTextPTEl && question.mnemonic) {
      memoryTextPTEl.textContent = this.getText(question.mnemonic, 'pt') || '';
    }
  }

  /**
   * FUNÃ‡ÃƒO: toggleAnswer()
   * DESCRIÃ‡ÃƒO: Mostra ou esconde a resposta correta + anÃ¡lise
   */
  toggleAnswer() {
    this.showAnswers = !this.showAnswers;
    storageService.setUIPreference('showAnswers', this.showAnswers);
    // Novo UX: feedback aparece nas próprias opções
    if (this.showAnswers) {
      this.renderAnswer();
    } else {
      this.clearAnswerFeedback();
    }

    this.updateUILabels();
  }

  /**
   * FUNÃ‡ÃƒO: toggleTips()
   * DESCRIÃ‡ÃƒO: Mostra ou esconde a seÃ§Ã£o de dicas/tips
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
   * FUNÃ‡ÃƒO: toggleFilter()
   * DESCRIÃ‡ÃƒO: Toggle simples - mostrar/esconder dots das respostas
   */
  toggleFilter() {
    this.showAnswerDots = !this.showAnswerDots;
    storageService.setUIPreference('showDots', this.showAnswerDots);
    this.updateFilterLabel();
    this.updateMiniDots();
  }

  /**
   * FUNÃ‡ÃƒO: updateFilterLabel()
   * DESCRIÃ‡ÃƒO: Atualiza o rÃ³tulo do botÃ£o de filtro (Show/Hide Answer Dots)
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
   * FUNÃ‡ÃƒO: renderAnswer()
   * DESCRIÃ‡ÃƒO: Renderiza a resposta correta e sua explicaÃ§Ã£o
   * - Marca a opÃ§Ã£o correta com verde
   * - Mostra texto da resposta completa
   * - Mostra explicaÃ§Ã£o detalhada
   * - Tudo aparece em EN + PT embaixo em verde
   */
  renderAnswer() {
    const question = this.questions[this.currentQuestionIndex];
    if (!question) return;

    const correctIndex = question.correct; // Qual Ã© a resposta correta (Ã­ndice)

    this.applyAnswerFeedback();
  }

  applyAnswerFeedback() {
    const question = this.questions[this.currentQuestionIndex];
    if (!question) return;

    const correctIndex = question.correct;
    const wrongReasons = Array.isArray(question.wrongReasons) ? question.wrongReasons : [];
    const userAnswer = this.answers[question.id];

    document.querySelectorAll('.option').forEach((optEl) => {
      const idx = Number(optEl.dataset.optionIndex || -1);
      const feedbackEl = optEl.querySelector('.option-feedback');
      if (!feedbackEl || idx < 0) return;

      optEl.classList.remove('option-correct', 'option-wrong', 'option-neutral', 'option-selected');
      feedbackEl.innerHTML = '';
      feedbackEl.style.display = 'none';

      if (!this.showAnswers) return;

      const isCorrect = idx === correctIndex;
      const isSelected = userAnswer === idx;
      if (isSelected) optEl.classList.add('option-selected');

      if (isCorrect) {
        optEl.classList.add('option-correct');
        feedbackEl.innerHTML =
          `<div class="feedback-title">${isSelected ? '✔ Correct' : '✔ Correct Answer'}</div>` +
          `<div class="feedback-text">${this.escapeHtml(this.getText(question.answer, 'en'))}</div>` +
          `<div class="text-translation">${this.escapeHtml(this.getText(question.answer, 'pt'))}</div>`;
        feedbackEl.style.display = 'block';
      } else {
        optEl.classList.add('option-wrong');
        const reason = wrongReasons[idx]?.en || 'This option is incorrect.';
        const reasonPt = wrongReasons[idx]?.pt || reason;
        feedbackEl.innerHTML =
          `<div class="feedback-title">${isSelected ? '✖ Your Answer' : 'Why not'}</div>` +
          `<div class="feedback-text">${this.escapeHtml(reason)}</div>` +
          `<div class="text-translation">${this.escapeHtml(reasonPt)}</div>`;
        feedbackEl.style.display = 'block';
      }
    });
  }

  clearAnswerFeedback() {
    document.querySelectorAll('.option').forEach((optEl) => {
      const feedbackEl = optEl.querySelector('.option-feedback');
      optEl.classList.remove('option-correct', 'option-wrong', 'option-neutral', 'option-selected');
      if (feedbackEl) {
        feedbackEl.innerHTML = '';
        feedbackEl.style.display = 'none';
      }
    });
  }

  /**
   * FUNÃ‡ÃƒO: previousQuestion()
   * DESCRIÃ‡ÃƒO: Vai para questÃ£o anterior
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
   * FUNÃ‡ÃƒO: nextQuestion()
   * DESCRIÃ‡ÃƒO: Vai para prÃ³xima questÃ£o
   * - Desabilitada na Q50
   * - Suaviza scroll para o topo
   */
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      storageService.setCurrentQuestion(this.currentQuestionIndex);
      this.loadQuestion();
      this.scrollToTop();
    }
  }

  /**
   * FUNÃ‡ÃƒO: previousQuestion()
   * DESCRIÃ‡ÃƒO: Vai para questÃ£o anterior
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
   * FUNÃ‡ÃƒO: updateNavigationButtons()
   * DESCRIÃ‡ÃƒO: Atualiza estado dos botÃµes de navegaÃ§Ã£o
   * - Desabilita "Previous" na primeira questÃ£o
   * - Desabilita "Next" na Ãºltima questÃ£o
   * - Mostra botÃ£o "Finish" na Ãºltima questÃ£o
   */
  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');

    const isFirst = this.currentQuestionIndex === 0;
    const isLast = this.currentQuestionIndex === this.questions.length - 1;

    if (prevBtn) prevBtn.disabled = isFirst;
    if (nextBtn) nextBtn.disabled = isLast;

    // Mostrar finish button apenas na Ãºltima questÃ£o
    if (finishBtn) {
      finishBtn.style.display = isLast ? 'inline-flex' : 'none';
    }
  }

  /**
   * FUNÃ‡ÃƒO: updateMiniDots()
   * DESCRIÃ‡ÃƒO: Renderiza os 50 bolinhas (1 por questÃ£o)
   * - Mostra qual questÃ£o estÃ¡ ativa (blue)
   * - Se showAnswerDots=true: Mostra cores (verde=correto, vermelho=errado)
   * - Se showAnswerDots=false: Sem cores
   * - Permite pular para qualquer questÃ£o clicando
   */
  updateMiniDots() {
    const dotsContainer = document.getElementById('miniDots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';

    this.questions.forEach((q, idx) => {
      const dot = document.createElement('button');
      dot.className = 'mini-dot';
      dot.textContent = idx + 1;
      
      if (idx === this.currentQuestionIndex) dot.classList.add('active');
      
      const hasAnswer = this.answers[q.id] !== undefined;
      if (hasAnswer) {
        dot.classList.add('answered'); // BLUE default for answered
      }

      // Adicionar cores APENAS se showAnswerDots for true
      if (this.showAnswerDots && hasAnswer) {
        dot.classList.remove('answered');
        if (this.answers[q.id] === q.correct) {
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
   * FUNÃ‡ÃƒO: updateProgress()
   * DESCRIÃ‡ÃƒO: Atualiza barra de progresso e texto
   */
  updateProgress() {
    const total = this.questions.length || 1;
    const current = Math.min(this.currentQuestionIndex + 1, total);
    const progress = Math.round((current / total) * 100);

    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = `${progress}%`;

    const progressText = document.getElementById('progressText');
    if (progressText) progressText.textContent = `Question ${current} of ${total}`;

    const scoreText = document.getElementById('scoreText');
    if (scoreText) {
      const score = this.calculateScore();
      const scorePct = Math.round((score / total) * 100);
      scoreText.textContent = `Score: ${scorePct}%`;
    }
  }

  /**
   * FUNÃ‡ÃƒO: submitExam()
   * DESCRIÃ‡ÃƒO: Termina o exame e mostra resultados
   * - Calcula score (quantas acertou)
   * - Calcula percentual
   * - Calcula tempo total gasto
   * - Salva prova no histÃ³rico
   * - Exibe modal com resultados e feedback
   */
  submitExam() {
    const score = this.calculateScore();
    const totalQuestions = this.questions.length || 1;
    const percentage = Math.round((score / totalQuestions) * 100);
    const totalTime = Math.floor((Date.now() - this.startTime) / 1000);

    // Salvar prova como completada no histÃ³rico
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
   * FUNÃ‡ÃƒO: calculateScore()
   * DESCRIÃ‡ÃƒO: Conta quantas questÃµes o usuÃ¡rio acertou
   * - Compara resposta salva com resposta correta
   * - Retorna nÃºmero de acertos (0-50)
   */
  calculateScore() {
    let score = 0;
    this.questions.forEach(q => {
      // A resposta correta Ã© definida em en.correct
      const correctIndex = q.correct;
      // Compara a resposta salva com o Ã­ndice correto
      if (this.answers[q.id] === correctIndex) {
        score++;
      }
    });
    return score;
  }

  /**
   * FUNÃ‡ÃƒO: showResults()
   * DESCRIÃ‡ÃƒO: Exibe modal com os resultados finais
   * - Score em grande
   * - NÃºmero de corretas/erradas
   * - Tempo gasto
   * - Mensagem motivacional com base no score
   * - BotÃµes para retomar/voltar
   */
  showResults(score, percentage, totalTime) {
    const resultsModal = document.getElementById('resultsModal');
    if (!resultsModal) {
      console.warn('Results modal not found');
      return;
    }

    const correct = score;
    const wrong = this.questions.length - score;

    // Atualizar tÃ­tulo
    const resultsTitle = document.getElementById('resultsTitle');
    if (resultsTitle) {
      resultsTitle.textContent = this.currentLang === 'en' ? 'Exam Complete!' : 'Prova Concluída!';
    }

    // Atualizar score grande no topo (ex: 85%)
    const finalScore = document.getElementById('finalScore');
    if (finalScore) {
      finalScore.textContent = percentage;
    }

    // EstatÃ­sticas (corretas/erradas/tempo)
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
    // Mostrar botÃ£o View History no modal final se houver provas anteriores
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
   * FUNÃ‡ÃƒO: getResultMessage()
   * DESCRIÃ‡ÃƒO: Retorna mensagem motivacional baseada no score
   * - 90+% = Excelente
   * - 75-89% = Bom
   * - 60-74% = Regular
   * - <60% = Precisa estudar mais
   */
  getResultMessage(percentage, lang) {
    const messages = {
      en: {
        excellent: 'Excellent! You\'ve mastered the GitHub Copilot material! Ready for certification!',
        good: 'Great job! Keep practicing to reach excellence! A few more attempts and you\'ll be ready!',
        fair: 'Good effort! Review the material where you struggled and try again!',
        needs: 'Keep studying! Review key concepts and retake the exam. You\'ve got this!'
      },
      pt: {
        excellent: 'Excelente! Você dominou o material do GitHub Copilot! Pronto para certificação!',
        good: 'Ótimo! Continue praticando para alcançar excelência! Mais algumas tentativas e estará pronto!',
        fair: 'Bom esforço! Revise o material onde teve dificuldade e tente novamente!',
        needs: 'Continue estudando! Revise conceitos-chave e refaça a prova. Você consegue!'
      }
    };

    const msgs = messages[lang];
    if (percentage >= 90) return msgs.excellent;
    if (percentage >= 75) return msgs.good;
    if (percentage >= 60) return msgs.fair;
    return msgs.needs;
  }

  /**
   * FUNÃ‡ÃƒO: retakeExam()
   * DESCRIÃ‡ÃƒO: Reseta tudo e permite fazer o exame novamente
   * - Limpa todas as respostas
   * - Volta para Q1
   * - Reinicia cronÃ´metro
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
   * FUNÃ‡ÃƒO: updateUILabels()
   * DESCRIÃ‡ÃƒO: Atualiza todos os textos dos botÃµes conforme idioma
   * - "EN / PT" â†’ "PT / EN"
   * - "Show Answer" â†’ "Mostrar Resposta"
   * - "Show Tips" â†’ "Mostrar Dicas"
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

    // Atualizar rÃ³tulo do filtro de dots
    this.updateFilterLabel();
  }

  /**
   * FUNÃ‡ÃƒO: formatTime()
   * DESCRIÃ‡ÃƒO: Converte segundos para formato legÃ­vel (ex: "12m 45s")
   */
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  }

  /**
   * FUNÃ‡ÃƒO: scrollToTop()
   * DESCRIÃ‡ÃƒO: Suaviza scroll para o topo da pÃ¡gina
   * - Usado ao navegar para nova questÃ£o
   */
  scrollToTop() {
    const target = document.querySelector('.question-card') || document.querySelector('.question-container');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * FUNÃ‡ÃƒO: generateReviewDocument()
   * DESCRIÃ‡ÃƒO: Gera um documento HTML lindo para revisÃ£o completa
   */
  generateReviewDocument() {
    const score = this.calculateScore();
    const totalQuestions = this.questions.length || 1;
    const percentage = Math.round((score / totalQuestions) * 100);
    const examTitle = this.exam?.title || 'Exam';
    const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
    const wrong = this.questions.length - score;

    const langForReview = this.currentLang;
    const isPT = langForReview === 'pt';

    // Build the review document HTML
    let html = `<!DOCTYPE html>
<html lang="${langForReview}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${examTitle} Review - ${percentage}%</title>
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
    .answer-translation { color: #06b6d4; font-style: italic; margin-top: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${examTitle} Review</h1>
      <div class="score-display">${percentage}%</div>
      <div class="summary-stats">
        <div class="stat-box">
          <div class="stat-label">âœ… Correct</div>
          <div class="stat-value">${score}/${totalQuestions}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">âŒ Wrong</div>
          <div class="stat-value">${wrong}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">â±ï¸ Time</div>
          <div class="stat-value">${this.formatTime(totalTime)}</div>
        </div>
      </div>
    </div>
    <div id="review-questions"></div>
    <div class="summary-end">
      <div class="footer-message">${this.getDetailedFeedback(percentage)}</div>
      <div class="tips">
        <h4>Tips for Next Time:</h4>
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
    const questions = ${JSON.stringify(this.questions)};
    const answers = ${JSON.stringify(this.answers)};
    const totalQuestions = questions.length;
    const currentLang = '${langForReview}';
    const isPT = currentLang === 'pt';

    questions.forEach((q, idx) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correct;
      const option = (i, lang) => (q.options && q.options[i]) ? (q.options[i][lang] || q.options[i].en || '') : '';
      const userOption = option(userAnswer, 'en');
      const correctOption = option(q.correct, 'en');
      const ptUserOption = option(userAnswer, 'pt');
      const ptCorrectOption = option(q.correct, 'pt');

      let reviewHtml = '<div class="question-header"><span class="status-icon">' + (isCorrect ? 'OK' : 'X') + '</span><div><div class="question-num">Question ' + (idx + 1) + ' of ' + totalQuestions + ' - ' + (isCorrect ? 'CORRECT' : 'INCORRECT') + '</div></div></div>';
      reviewHtml += '<div class="question-text">' + (q.question?.en || '') + '</div>';
      if (isPT && q.question?.pt) {
        reviewHtml += '<div class="answer-translation">' + q.question.pt + '</div>';
      }

      reviewHtml += '<div class="answer-item user-answer"><div class="answer-label">Your Answer:</div><div class="answer-text">* ' + (userOption || 'Not answered') + '</div>';
      if (isPT && ptUserOption) {
        reviewHtml += '<div class="answer-translation">* ' + ptUserOption + '</div>';
      }
      reviewHtml += '</div>';

      reviewHtml += '<div class="answer-item correct-answer"><div class="answer-label">Correct Answer:</div><div class="answer-text">+ ' + correctOption + '</div>';
      if (isPT && ptCorrectOption) {
        reviewHtml += '<div class="answer-translation">+ ' + ptCorrectOption + '</div>';
      }
      reviewHtml += '</div>';

      reviewHtml += '<div class="answer-item explanation"><div class="answer-label">Explanation:</div><div class="answer-text">' + (q.explanation?.en || '') + '</div>';
      if (isPT && q.explanation?.pt) {
        reviewHtml += '<div class="answer-translation">' + q.explanation.pt + '</div>';
      }
      reviewHtml += '</div>';

      reviewHtml += '<div class="answer-item explanation"><div class="answer-label">Detailed Answer:</div><div class="answer-text">' + (q.answer?.en || '') + '</div>';
      if (isPT && q.answer?.pt) {
        reviewHtml += '<div class="answer-translation">' + q.answer.pt + '</div>';
      }
      reviewHtml += '</div>';

      if (!isCorrect && q.wrongReasons && q.wrongReasons[userAnswer] && q.wrongReasons[userAnswer].en) {
        reviewHtml += '<div class="answer-item wrong-analysis"><div class="answer-label">Why Your Answer Is Wrong:</div><div class="answer-text">' + q.wrongReasons[userAnswer].en + '</div>';
        if (isPT && q.wrongReasons[userAnswer].pt) {
          reviewHtml += '<div class="answer-translation">' + q.wrongReasons[userAnswer].pt + '</div>';
        }
        reviewHtml += '</div>';
      }

      const div = document.createElement('div');
      div.className = 'question-review ' + (isCorrect ? 'correct' : 'incorrect');
      div.innerHTML = reviewHtml;
      container.appendChild(div);
    });
  </script>
</body>
</html>`;

    return html;
  }

  /**
   * FUNÃ‡ÃƒO: getDetailedFeedback()
   * DESCRIÃ‡ÃƒO: Retorna mensagem motivacional detalhada baseada no score
   */
  getDetailedFeedback(percentage) {
    if (percentage >= 90) {
      return 'Outstanding! You\'ve mastered GitHub Copilot! Ready for certification!';
    } else if (percentage >= 75) {
      return 'Great job! Continue practicing to reach perfection!';
    } else if (percentage >= 60) {
      return 'Good effort! Review the material and focus on weak areas!';
    } else {
      return 'Keep studying! Review the explanations and try again!';
    }
  }

  /**
   * FUNÃ‡ÃƒO: openReview()
   * DESCRIÃ‡ÃƒO: Abre documento de revisÃ£o detalhado em nova janela
   * - Gera HTML com todas as questÃµes, respostas e explicaÃ§Ãµes
   * - Inclui botÃ£o "Back" para voltar ao modal
   * - Ideal para revisÃ£o completa
   */
  openReview() {
    const doc = this.generateReviewDocument();
    const win = window.open();
    
    // Adicionar botÃ£o Back no topo
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
   * FUNÃ‡ÃƒO: showExamHistory()
   * DESCRIÃ‡ÃƒO: Mostra lista de provas anteriores do usuÃ¡rio
   * - Recupera histÃ³rico do storageService
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
    
    // Renderizar cada prova no histÃ³rico
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
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${exam.score}/${this.questions.length} correct • ${this.formatTime(exam.totalTime)}</div>
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
   * FUNÃ‡ÃƒO: promptReloadExam()
   * DESCRIÃ‡ÃƒO: Mostra modal de confirmaÃ§Ã£o antes de recarregar prova antiga
   * @param {string} examId - ID da prova
   * @param {number} percentage - Percentual que tirou
   * @param {number} score - Score que tirou
   */
  promptReloadExam(examId, percentage, score) {
    this.selectedExamIdToReload = examId;
    
    const message = this.currentLang === 'en' 
      ? `You are about to reload Exam with ${percentage}% (${score}/${this.questions.length} questions correct). Your previous answers will be loaded and you can review or retake this exam.`
      : `Você vai recarregar a Prova com ${percentage}% (${score}/${this.questions.length} questões corretas). Suas respostas anteriores serão carregadas e você pode revisar ou refazer esta prova.`;
    
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
   * FUNÃ‡ÃƒO: confirmReloadExam()
   * DESCRIÃ‡ÃƒO: Confirma e carrega a prova selecionada
   */
  confirmReloadExam() {
    if (!this.selectedExamIdToReload) return;
    
    const oldAnswers = storageService.loadExamAnswers(this.selectedExamIdToReload);
    if (!oldAnswers) {
      console.warn('Could not load exam answers');
      return;
    }
    
    // Criar novo examId para essa sessÃ£o
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
   * FUNÃ‡ÃƒO: escapeHtml()
   * DESCRIÃ‡ÃƒO: Escapa caracteres especiais HTML
   * - Previne XSS (seguranÃ§a)
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
 * INICIALIZAÃ‡ÃƒO
 * Quando a pÃ¡gina termina de carregar, cria uma instÃ¢ncia do simulador
 * Este Ã© o ponto de entrada: tudo comeÃ§a aqui!
 */
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const examParam = params.get('exam') || 'gh300';
  const standalone = params.get('standalone') === '1';

  // Se abrir direto no simulador, redireciona para o hub com navbar
  if (window.top === window.self && !standalone) {
    window.location.href = `index.html?exam=${encodeURIComponent(examParam)}`;
    return;
  }

  const exam = await loadExamData();
  if (!exam) return;

  if (window.storageService && exam.id) {
    storageService.setNamespace(exam.id);
  }

  // Invalidar sessão se a prova mudou
  if (window.storageService) {
    const version = exam.version || hashExamData(exam);
    const stored = storageService.getExamVersion();
    if (stored && stored !== version) {
      storageService.resetExamData();
    }
    storageService.setExamVersion(version);
  }

  new GH300Simulator(exam);
});


























