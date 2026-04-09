/**
 * GH-300 Exam Simulator - 50 Questions with Mnemonics & Wrong Answer Analysis
 * Estrutura melhorada com analogias, explicações completas e análise de por que está errado
 */

const GH300_QUESTIONS = [
  {
    id: 1,
    difficulty: "easy",
    en: {
      question: "What is the difference between GitHub Copilot Business and GitHub Copilot Enterprise?",
      options: ["Enterprise has extra personalization using your own codebase", "Business is only for individuals", "No difference", "Enterprise is cheaper"],
      correct: 0,
      answer: "Enterprise allows organizations to use custom docsets and get suggestions tailored to their codebase",
      wrongReasons: ["Business tier has NO docsets feature - no organizational code customization capability at all", "Business provides basic suggestions only; Enterprise adds custom docsets so AI learns your organization's patterns", "Enterprise: custom docsets train AI on YOUR codebase. Business: generic AI suggestions only. MASSIVE difference."],
      explanation: "Enterprise lets you feed Copilot your organization's code patterns.",
      mnemonic: "🏢 Enterprise = Extra Training | 👤 Business = Basic Usage"
    },
    pt: {
      question: "Qual é a diferença entre GitHub Copilot Business e GitHub Copilot Enterprise?",
      answer: "Enterprise permite que organizações usem docsets customizados e obtenham sugestões adaptadas",
      wrongReasons: ["Business não tem recurso docsets - sem customização de código organizacional", "Business fornece sugestões básicas; Enterprise adiciona custom docsets para IA aprender padrões", "Enterprise: docsets treinam IA no SEU codebase. Business: sugestões genéricas. ENORME diferença."],
      explanation: "Enterprise permite alimentar Copilot com padrões de código da sua organização.",
      mnemonic: "🏢 Enterprise = Treino Extra | 👤 Business = Uso Básico"
    }
  },
  {
    id: 2,
    difficulty: "easy",
    en: {
      question: "After enforcing GitHub Copilot for Business, where do you enable it for all users?",
      options: ["Your organizations in profile dropdown", "GitHub Settings", "Repository Settings", "Copilot Dashboard"],
      correct: 0,
      answer: "Navigate to 'Your organizations' in the profile dropdown menu",
      wrongReasons: ["GitHub Settings are personal account-level only - cannot apply org-wide licensing policy", "Repository Settings affect single repos - must enable at ORGANIZATION level to cover all team members", "Copilot Dashboard provides analytics only - no admin controls or license management interface"],
      explanation: "Organizations dropdown = central hub for team-wide policies",
      mnemonic: "🧭 Profile → Organizations → Manage Team Tools"
    },
    pt: {
      question: "Após impor Copilot for Business, para onde você habilita para todos os usuários?",
      answer: "Navegue para 'Suas organizações' no menu suspenso de perfil",
      wrongReasons: ["Configurações de conta GitHub são nível pessoal apenas - não aplicam org-wide licensing", "Configurações de repo afetam repos individuais - deve habilitar no nível ORGANIZATION para todos", "Dashboard fornece analytics apenas - sem controles de admin ou interface de gerenciamento"],
      explanation: "Dropdown organizações = hub central para políticas da equipe",
      mnemonic: "🧭 Perfil → Organizações → Gerenciar Ferramentas da Equipe"
    }
  },
  {
    id: 3,
    difficulty: "medium",
    en: {
      question: "What do GitHub Copilot Enterprise PR summaries do?",
      options: ["Generate concise PR overviews", "Auto-merge all PRs", "Prevent PR creation", "Only for private repos"],
      correct: 0,
      answer: "Automatically generate concise overviews to help reviewers understand changes quickly",
      wrongReasons: ["Auto-merge removes human review - summaries HELP reviewers, not replace them", "PR summaries don't affect creation - they assist AFTER PR opened", "PR summaries work on public AND private repos per GitHub docs"],
      explanation: "Like an executive summary for code changes - faster reviews",
      mnemonic: "📋 TL;DR Code = Faster Reviews"
    },
    pt: {
      question: "O que os resumos de PR do GitHub Copilot Enterprise fazem?",
      answer: "Geram automaticamente visões gerais concisas para ajudar revisores a entender mudanças",
      wrongReasons: ["Auto-fusão remove review humana - resumos AJUDAM, não substituem", "Resumos de PR não afetam criação - assistem APÓS PR ser aberto", "Resumos funcionam public AND private per docs"],
      explanation: "Como um resumo executivo para alterações de código - revisões mais rápidas",
      mnemonic: "📋 TL;DR Código = Revisões Mais Rápidas"
    }
  },
  {
    id: 4,
    difficulty: "medium",
    en: {
      question: "How do organizations use docsets in Copilot Enterprise?",
      options: ["Create custom collections of internal code and docs", "Delete documentation", "Prevent doc access", "Not supported"],
      correct: 0,
      answer: "Create custom collections so Copilot learns your organization's patterns",
      wrongReasons: ["Deleting removes intelligence - destroys org's intellectual property investment", "Restricting ENABLES customization - docsets use restricted docs AS training data", "Docsets ARE the core Enterprise differentiator feature"],
      explanation: "Docsets = your organization's private knowledge base",
      mnemonic: "📚 Docsets = Your Code Library"
    },
    pt: {
      question: "Como as organizações usam docsets no Copilot Enterprise?",
      answer: "Criam coleções customizadas para que Copilot aprenda os padrões da organização",
      wrongReasons: ["Deletar remove inteligência - destrói investimento proprietário da org", "Restringir HABILITA customização - docsets usam docs restritos COMO dados", "Docsets SÃO diferenciador core Enterprise"],
      explanation: "Docsets = base de conhecimento privada da sua organização",
      mnemonic: "📚 Docsets = Sua Biblioteca de Código"
    }
  },
  {
    id: 5,
    difficulty: "medium",
    en: {
      question: "How does Copilot Chat improve class modularity?",
      options: ["Suggests refactoring based on context", "Deletes classes", "Prevents creation", "Cannot assist"],
      correct: 0,
      answer: "Suggests refactoring updates to improve separation of concerns",
      wrongReasons: ["Deleting destroys functionality - refactoring IMPROVES structure", "Preventing contradicts Chat purpose - enables better design", "Suggesting SRP IS Chat's core architectural feature"],
      explanation: "💡 ANALOGY: Like a trainer who breaks complex exercises into simple components. Chat breaks classes into focused pieces.",
      mnemonic: "🔨 Refactor = Break Big → Small"
    },
    pt: {
      question: "Como Copilot Chat melhora modularidade de classe?",
      answer: "Sugere refatoração para melhorar separação de responsabilidades",
      wrongReasons: ["Deletar destrói funcionalidade - refatoração MELHORA", "Prevenir contradiz propósito - habilita design melhor", "Sugerir SRP É feature core arquitetural"],
      explanation: "💡 ANALOGIA: Como um treinador que quebra exercícios complexos em componentes simples. Chat quebra classes em peças focadas.",
      mnemonic: "🔨 Refator = Quebrar Grande → Pequeno"
    }
  },
  {
    id: 6,
    difficulty: "easy",
    en: {
      question: "How does Copilot Chat propose bug fixes?",
      options: ["Suggests code snippets based on error", "Random generation", "Deletes buggy code", "Cannot fix"],
      correct: 0,
      answer: "Analyzes error context and provides relevant solutions",
      wrongReasons: ["Random suggestions CREATE new bugs - context essential", "Deletion removes problem but ZERO solution shown", "Chat's core feature: error analysis with solution guidance"],
      explanation: "Error input → Copilot analysis → Solution output",
      mnemonic: "🐛 Error → Analysis → Fix = Debug Faster"
    },
    pt: {
      question: "Como Copilot Chat propõe correções de bugs?",
      answer: "Analisa contexto de erro e fornece soluções relevantes",
      wrongReasons: ["Sugestões aleatórias CRIAM novos bugs - contexto essencial", "Deletar remove problema mas ZERO solução", "Feature core Chat: análise erro com guia solução"],
      explanation: "Entrada de erro → análise Copilot → saída de solução",
      mnemonic: "🐛 Erro → Análise → Correção = Debug Mais Rápido"
    }
  },
  {
    id: 7,
    difficulty: "easy",
    en: {
      question: "How does Copilot Chat explain unfamiliar code?",
      options: ["Generates natural language descriptions", "Refuses explanation", "Modifies code", "Cannot explain"],
      correct: 0,
      answer: "Analyzes and provides human-readable explanations of functionality",
      wrongReasons: ["Refusing removes knowledge transfer - developers lose learning", "Modification changes logic - explanation clarifies WITHOUT changing", "Chat core: paste legacy code + get human-readable breakdown"],
      explanation: "Paste legacy code → get clear breakdown → understand patterns",
      mnemonic: "📖 Unknown Code → Clear Explanation"
    },
    pt: {
      question: "Como Copilot Chat explica código desconhecido?",
      answer: "Analisa e fornece explicações legíveis de funcionalidade",
      wrongReasons: ["Recusar remove transferência - devs perdem aprendizado", "Modificação muda lógica - explicação clarifica SEM mudar", "Core Chat: cole código legado + obtenha breakdown claro"],
      explanation: "Cole código legado → obtenha breakdown claro → entenda padrões",
      mnemonic: "📖 Código Desconhecido → Explicação Clara"
    }
  },
  {
    id: 8,
    difficulty: "easy",
    en: {
      question: "How does Copilot Chat assist with code errors?",
      options: ["Explains cause and suggests fixes", "Ignores error", "Deletes file", "Cannot assist"],
      correct: 0,
      answer: "Analyzes error and provides explanations and fix suggestions",
      wrongReasons: ["Ignoring keeps developers BLOCKED - understanding WHY is essential", "File deletion destroys work AND removes solution opportunity", "Chat's error debugging workflow verified in millions of sessions"],
      explanation: "Stack overflow/null ref/type errors → Why + How to fix",
      mnemonic: "⚠️ Error → Why → How → Fixed"
    },
    pt: {
      question: "Como Copilot Chat ajuda com erros de código?",
      answer: "Analisa erro e fornece explicações e sugestões de correção",
      wrongReasons: ["Ignorar mantém devs BLOQUEADOS - entender POR QUE é essencial", "Deletar arquivo destrói trabalho E remove oportunidade solução", "Workflow debug erro Chat verificado em milhões de sessions"],
      explanation: "Stack overflow/ref nula/erro tipo → Por que + Como corrigir",
      mnemonic: "⚠️ Erro → Por que → Como → Corrigido"
    }
  },
  {
    id: 9,
    difficulty: "easy",
    en: {
      question: "How does Copilot Chat generate inline documentation?",
      options: ["Generates comments from natural language prompts", "Removes comments", "Prevents docs", "Cannot generate"],
      correct: 0,
      answer: "Analyzes code and generates comments based on natural prompts",
      wrongReasons: ["Removing comments leaves code unmaintainable - future devs can't understand intent", "Preventing docs creates tech debt - undocumented code is team nightmare", "Chat generates JSDoc, function explanations - try '/doc' command"],
      explanation: "'Add JSDoc' or 'Document this' → Professional documentation",
      mnemonic: "📝 Complex Code → Clear Comments"
    },
    pt: {
      question: "Como Copilot Chat gera documentação inline?",
      answer: "Analisa código e gera comentários baseados em prompts naturais",
      wrongReasons: ["Remover comentários deixa código unmaintainable - devs futuros não entendem", "Prevenir docs cria tech debt - código não documentado é pesadelo", "Chat gera JSDoc, explicações função - try '/doc'"],
      explanation: "'Adicione JSDoc' ou 'Documente isto' → Documentação profissional",
      mnemonic: "📝 Código Complexo → Comentários Claros"
    }
  },
  {
    id: 10,
    difficulty: "medium",
    en: {
      question: "What is ghost text in GitHub Copilot?",
      options: ["Options when typing", "Faded suggestions as you type", "Hidden uneditable code", "Deleted recoverable code"],
      correct: 1,
      answer: "Suggestions appearing as faded text that you can accept with Tab",
      wrongReasons: ["'Options when typing' is generic - ghost text IS the faded suggestion", "'Hidden uneditable' contradicts visibility - you CAN edit after accepting", "'Deleted' is wrong - ghost text is temporary preview, not permanent deletion"],
      explanation: "💡 ANALOGY: Like using a pencil instead of pen - Copilot writes its suggestion faintly (ghost text), and you can trace over it (Tab to accept) or erase it (Escape) without committing. It's there as a preview, not a permanent mark until YOU accept it.",
      mnemonic: "👻 Ghost Text = Pencil Preview (Tab = Pen Ink)"
    },
    pt: {
      question: "O que é ghost text no GitHub Copilot?",
      answer: "Sugestões aparecendo como texto esmaecido que você aceita com Tab",
      wrongReasons: ["'Opções ao digitar' é genérico - ghost text É sugestão esmaecida", "'Hidden' contradiz visibility - VOCÊ PODE editar após aceitar", "'Deletado' está errado - ghost text é prévia temporária, não permanent"],
      explanation: "💡 ANALOGIA: Como usar lápis em vez de caneta - Copilot escreve sua sugestão levemente (ghost text), e você pode passar por cima (Tab para aceitar) ou apagar (Escape) sem se comprometer. Está lá como prévia, não como marca permanente até VOCÊ o aceitar.",
      mnemonic: "👻 Ghost Text = Prévia em Lápis (Tab = Tinta Permanente)"
    }
  },
  {
    id: 11,
    difficulty: "easy",
    en: {
      question: "How do you access Copilot's inline chat?",
      options: ["Click chat icon in sidebar", "Ctrl+i (Windows) or Cmd+i (Mac)", "Ctrl+j", "Ctrl+k"],
      correct: 1,
      answer: "Use keyboard shortcut Ctrl+i (Windows) or Cmd+i (Mac)",
      wrongReasons: ["Sidebar chat icon (Ctrl+L) opens Chat panel - inline NEEDS Ctrl+I to edit ON code", "Ctrl+j opens terminal; Ctrl+k opens command palette - neither activates inline chat", "Inline chat overlays ON your editor - sidebar is modal window - completely different"],
      explanation: "💡 ANALOGY: Think of Ctrl+i like opening a sticky note RIGHT ON YOUR CODE - Copilot appears inline next to your editor where you're working. The sidebar chat is like a separate conversation window. Inline chat puts the conversation exactly where you need it!",
      mnemonic: "⌨️ Ctrl+i = Inline (i) = Right Where You're Typing"
    },
    pt: {
      question: "Como você acessa o chat inline do Copilot?",
      answer: "Use atalho Ctrl+i (Windows) ou Cmd+i (Mac)",
      wrongReasons: ["Ícone sidebar (Ctrl+L) abre painel - inline PRECISA Ctrl+I NO código", "Ctrl+j abre terminal; Ctrl+k abre palette - nenhum ativa inline", "Inline chat overlay NO editor - sidebar is modal - completamente diferentes"],
      explanation: "💡 ANALOGIA: Pense em Ctrl+i como abrir um sticky note DIRETAMENTE NO SEU CÓDIGO - Copilot aparece inline ao lado do seu editor onde você está trabalhando. O chat da sidebar é como uma janela de conversa separada. O inline chat coloca a conversa exatamente onde você precisa!",
      mnemonic: "⌨️ Ctrl+i = Inline (i) = Bem Onde Você Digita"
    }
  },
  {
    id: 12,
    difficulty: "medium",
    en: {
      question: "What do agents like '@terminal' or '@workspace' provide?",
      options: ["Questions within specific context", "Debugging only", "Prevent Copilot", "Not supported"],
      correct: 0,
      answer: "Help you ask questions in specific context for precise answers",
      wrongReasons: ["@terminal and @workspace are not debugging-only - they provide context for ANY question type", "Agents ENHANCE not prevent Copilot - they offer supplementary context awareness", "Agents are fully supported in VS Code Chat - documented feature"],
      explanation: "Context-aware assistance = better, smarter responses",
      mnemonic: "🎯 @workspace = Full Project Context"
    },
    pt: {
      question: "O que agentes como '@terminal' ou '@workspace' fornecem?",
      answer: "Ajudam você a fazer perguntas em contexto específico para respostas precisas",
      wrongReasons: ["@terminal e @workspace não são apenas debugging - fornecem contexto para QUALQUER pergunta", "Agentes MEJHORAM não previnem - oferecem context awareness", "Agentes são suportados no VS Code - feature documentada"],
      explanation: "Assistência ciente do contexto = respostas melhores e mais inteligentes",
      mnemonic: "🎯 @workspace = Contexto Completo do Projeto"
    }
  },
  {
    id: 13,
    difficulty: "medium",
    en: {
      question: "Benefits of implicit prompts with slash commands in inline chat?",
      options: ["Better responses without lengthy prompts", "Deprecated", "Makes harder", "No benefits"],
      correct: 0,
      answer: "Get better responses quickly without writing long explanations",
      wrongReasons: ["Slash commands like /fix and /explain are ACTIVE, not deprecated", "/fix and /explain make Chat more efficient - not harder", "Strong benefits exist: saves time and improves response quality"],
      explanation: "/fix or /explain does more than typing 3 sentences",
      mnemonic: "🚀 /fix = Smart Short Command"
    },
    pt: {
      question: "Benefícios de prompts implícitos com comandos /slash no chat inline?",
      answer: "Obtenha melhores respostas rapidamente sem escrever explicações longas",
      wrongReasons: ["Comandos slash como /fix e /explain são ATIVOS, não deprecated", "/fix e /explain tornam Chat mais eficiente - não mais difícil", "Benefícios fortes: economiza tempo e melhora qualidade"],
      explanation: "/fix ou /explain faz mais que digitar 3 frases",
      mnemonic: "🚀 /fix = Comando Curto Inteligente"
    }
  },
  {
    id: 14,
    difficulty: "easy",
    en: {
      question: "What functionality isn't supported in Copilot for Individuals?",
      options: ["VPN Proxy with self-signed certs", "Ghost text", "Chat", "Completion"],
      correct: 0,
      answer: "VPN Proxy support via self-signed certificates (Business only)",
      wrongReasons: ["Ghost text works in all Copilot tiers including Individuals", "Chat is available in Individuals tier", "Completion works across all tiers"],
      explanation: "Self-signed cert support = enterprise security feature",
      mnemonic: "🔐 Self-Signed Certs = Enterprise Only"
    },
    pt: {
      question: "Qual funcionalidade não é suportada no Copilot para Indivíduos?",
      answer: "Suporte a proxy VPN com certificados auto-assinados (apenas Business)",
      wrongReasons: ["Ghost text funciona em todos os tiers", "Chat está disponível em Individuals", "Completion funciona em todos os tiers"],
      explanation: "Suporte a cert auto-assinado = feature de segurança enterprise",
      mnemonic: "🔐 Certs Auto-Assinados = Enterprise Apenas"
    }
  },
  {
    id: 15,
    difficulty: "easy",
    en: {
      question: "How do you accept Copilot suggestions?",
      options: ["Press Tab key", "Press Enter", "Press Space", "Click suggestion"],
      correct: 0,
      answer: "Press the Tab key to accept Copilot's suggestions",
      wrongReasons: ["Enter confirms input but doesn't accept ghost text in the proper format", "Space continues typing and adds space character - doesn't accept suggestion", "Clicking works but Tab is the standard keyboard shortcut in all IDEs"],
      explanation: "Tab = fastest way to integrate AI suggestions",
      mnemonic: "⌨️ Tab = Accept Suggestion"
    },
    pt: {
      question: "Como você aceita sugestões do Copilot?",
      answer: "Pressione a tecla Tab para aceitar sugestões do Copilot",
      wrongReasons: ["Enter confirma input mas não aceita ghost text no format apropriado", "Space adiciona espaço - não aceita sugestão", "Click funciona mas Tab é atalho padrão em todos IDEs"],
      explanation: "Tab = forma mais rápida de integrar sugestões de IA",
      mnemonic: "⌨️ Tab = Aceitar Sugestão"
    }
  },
  {
    id: 16,
    difficulty: "easy",
    en: {
      question: "What is GitHub Copilot?",
      options: ["AI pair programmer for code suggestions", "Version control", "Planning tool", "Bug tracker"],
      correct: 0,
      answer: "AI pair programmer that provides code suggestions",
      wrongReasons: ["Git is version control", "Not a planning tool", "Not a bug tracker"],
      explanation: "Your 24/7 coding partner who never gets tired",
      mnemonic: "👥 AI Pair = Always-On Coding Partner"
    },
    pt: {
      question: "O que é GitHub Copilot?",
      answer: "Programador par de IA que fornece sugestões de código",
      wrongReasons: ["Git é controle de versão", "Não é ferramenta de planejamento", "Não é rastreador de bugs"],
      explanation: "Seu parceiro de codificação 24/7 que nunca fica cansado",
      mnemonic: "👥 Par de IA = Parceiro de Codificação Sempre Ativo"
    }
  },
  {
    id: 17,
    difficulty: "easy",
    en: {
      question: "How does Copilot determine code suggestions?",
      options: ["Code context in editor", "Random", "Last typed", "File size"],
      correct: 0,
      answer: "Based on context including surrounding code and comments",
      wrongReasons: ["Random would be unreliable", "Previous text isn't sufficient context", "File size irrelevant"],
      explanation: "Copilot reads the story your code tells",
      mnemonic: "📖 Context = Better Suggestions"
    },
    pt: {
      question: "Como Copilot determina sugestões de código?",
      answer: "Com base em contexto incluindo código ao redor e comentários",
      wrongReasons: ["Aleatório seria não confiável", "Texto anterior não é contexto suficiente", "Tamanho de arquivo irrelevante"],
      explanation: "Copilot lê a história que seu código conta",
      mnemonic: "📖 Contexto = Melhores Sugestões"
    }
  },
  {
    id: 18,
    difficulty: "medium",
    en: {
      question: "How does Copilot use org codebase for productivity?",
      options: ["Tailors to org standards and practices", "Ignores standards", "Only public code", "Cannot customize"],
      correct: 0,
      answer: "Tailors coding assistance aligned with org standards and practices",
      wrongReasons: ["Ignoring standards breaks consistency", "Enterprise includes private code", "Customization is core Enterprise"],
      explanation: "Your code patterns → Copilot learns → Org-aligned suggestions",
      mnemonic: "🏢 Org Codebase = Personalized Copilot"
    },
    pt: {
      question: "Como Copilot usa base de código da org para produtividade?",
      answer: "Personaliza assistência alinhada aos padrões e práticas da organização",
      wrongReasons: ["Ignorar padrões quebra consistência", "Enterprise inclui código privado", "Customização é core Enterprise"],
      explanation: "Padrões de seu código → Copilot aprende → Sugestões alinhadas",
      mnemonic: "🏢 Base de Código = Copilot Personalizado"
    }
  },
  {
    id: 19,
    difficulty: "medium",
    en: {
      question: "How does GitHub Copilot work?",
      options: ["Uses natural language prompts and code context", "Reads minds", "Only specific languages", "Always online"],
      correct: 0,
      answer: "Uses natural language prompts and context from your code",
      wrongReasons: ["Mind reading fantasy", "Works with many languages", "Some features work offline"],
      explanation: "Your prompt + your code = personalized AI response",
      mnemonic: "💭 Prompt + Context = Smart Suggestion"
    },
    pt: {
      question: "Como o GitHub Copilot funciona?",
      answer: "Usa prompts em linguagem natural e contexto de seu código",
      wrongReasons: ["Leitura de mente fantasia", "Funciona com muitas linguagens", "Alguns recursos funcionam offline"],
      explanation: "Seu prompt + seu código = resposta de IA personalizada",
      mnemonic: "💭 Prompt + Contexto = Sugestão Inteligente"
    }
  },
  {
    id: 20,
    difficulty: "medium",
    en: {
      question: "How does Copilot learn from prompts?",
      options: ["Zero-shot, one-shot, few-shot learning", "Stores all prompts", "Doesn't learn", "Needs manual training"],
      correct: 0,
      answer: "Uses zero-shot, one-shot, and few-shot learning approaches",
      wrongReasons: ["Prompts used for context not storage", "Learning is continuous", "No manual training needed"],
      explanation: "Different learning strategies for different situations",
      mnemonic: "📚 Zero/One/Few-Shot = Flexible Learning"
    },
    pt: {
      question: "Como Copilot aprende com prompts?",
      answer: "Usa abordagens zero-shot, one-shot e few-shot learning",
      wrongReasons: ["Prompts usados para contexto não armazenamento", "Aprendizado é contínuo", "Sem treinamento manual"],
      explanation: "Diferentes estratégias de aprendizado para diferentes situações",
      mnemonic: "📚 Zero/One/Few-Shot = Aprendizado Flexível"
    }
  },
  {
    id: 21,
    difficulty: "medium",
    en: {
      question: "What's NOT a step in Copilot's prompt processing?",
      options: ["Statistical analysis and pattern recognition", "Tokenization", "Embedding generation", "Decoding"],
      correct: 0,
      answer: "Copilot uses neural networks, not statistical analysis",
      wrongReasons: ["Tokenization is essential", "Embedding is core", "Decoding generates output"],
      explanation: "Modern LLMs ≠ old statistical methods",
      mnemonic: "🧠 Neural Nets > Statistics"
    },
    pt: {
      question: "O que NÃO é passo no processamento de prompt do Copilot?",
      answer: "Copilot usa redes neurais, não análise estatística",
      wrongReasons: ["Tokenização é essencial", "Embedding é core", "Decoding gera saída"],
      explanation: "LLMs modernos ≠ métodos estatísticos antigos",
      mnemonic: "🧠 Redes Neurais > Estatísticas"
    }
  },
  {
    id: 22,
    difficulty: "medium",
    en: {
      question: "How does Fill-in-the-Middle (FIM) enhance Copilot?",
      options: ["Considers wider code context around cursor", "Limits to current line", "Ignores surrounding", "Doesn't enhance"],
      correct: 0,
      answer: "Enables Copilot to consider code before AND after cursor",
      wrongReasons: ["Current line only reduces accuracy", "Surrounding code is important", "FIM significantly improves quality"],
      explanation: "Context before + after = better understanding",
      mnemonic: "🔍 FIM = Read Before & After"
    },
    pt: {
      question: "Como Fill-in-the-Middle (FIM) melhora Copilot?",
      answer: "Permite que Copilot considere código antes E depois do cursor",
      wrongReasons: ["Linha atual apenas reduz precisão", "Código ao redor é importante", "FIM melhora significativamente"],
      explanation: "Contexto antes + depois = melhor compreensão",
      mnemonic: "🔍 FIM = Leia Antes & Depois"
    }
  },
  {
    id: 23,
    difficulty: "medium",
    en: {
      question: "What happens after Copilot generates suggestion?",
      options: ["Presented to user for acceptance", "Auto-applied", "Deleted", "Stored permanently"],
      correct: 0,
      answer: "Suggestion presented to user for review and acceptance",
      wrongReasons: ["Auto-apply removes user control", "Suggestions aren't deleted", "Not permanently stored"],
      explanation: "Your choice = ultimate control",
      mnemonic: "✅ User Reviews = User Decides"
    },
    pt: {
      question: "O que acontece após Copilot gerar sugestão?",
      answer: "Sugestão apresentada ao usuário para revisão e aceitação",
      wrongReasons: ["Auto-aplicar remove controle do usuário", "Sugestões não são deletadas", "Não armazenadas permanentemente"],
      explanation: "Sua escolha = controle final",
      mnemonic: "✅ Usuário Revisa = Usuário Decide"
    }
  },
  {
    id: 24,
    difficulty: "easy",
    en: {
      question: "When Copilot generates multiple suggestions?",
      options: ["Review each using left/right arrows", "Auto-selects best", "All at once", "Only first shown"],
      correct: 0,
      answer: "Developers cycle through suggestions using arrow keys",
      wrongReasons: ["Auto-selection removes choice", "All at once clutters interface", "Only first limits options"],
      explanation: "Navigate suggestions like flipping through options",
      mnemonic: "⬅️➡️ Arrows = Cycle Suggestions"
    },
    pt: {
      question: "Quando Copilot gera múltiplas sugestões?",
      answer: "Desenvolvedores percorrem sugestões usando teclas de seta",
      wrongReasons: ["Auto-seleção remove escolha", "Todas de uma vez clutters", "Apenas primeira limita opções"],
      explanation: "Navegue sugestões como folhear opções",
      mnemonic: "⬅️➡️ Setas = Percorrer Sugestões"
    }
  },
  {
    id: 25,
    difficulty: "medium",
    en: {
      question: "Why review/correct Copilot Chat output?",
      options: ["Ensure accuracy and completeness", "Waste time", "Unnecessary", "Delete output"],
      correct: 0,
      answer: "Ensures explanations and documentation are accurate and complete",
      wrongReasons: ["Review is valuable", "Essential process", "Output should be kept"],
      explanation: "AI suggestions ≠ gospel truth - always verify",
      mnemonic: "🔍 Trust But Verify"
    },
    pt: {
      question: "Por que revisar/corrigir saída do Copilot Chat?",
      answer: "Garante que explicações e documentações sejam precisas e completas",
      wrongReasons: ["Revisão é valiosa", "Processo essencial", "Saída deve ser mantida"],
      explanation: "Sugestões de IA ≠ verdade absoluta - sempre verifique",
      mnemonic: "🔍 Confia mas Verifica"
    }
  },
  {
    id: 26,
    difficulty: "easy",
    en: {
      question: "What is a prompt?",
      options: ["Instructions guiding Copilot output", "Only for docs", "Doesn't affect output", "Auto-generated"],
      correct: 0,
      answer: "Collection of instructions telling Copilot what to generate",
      wrongReasons: ["Prompts guide all features", "Prompts heavily impact output", "User creates prompts"],
      explanation: "Good prompt = good output",
      mnemonic: "📝 Quality Prompt = Quality Output"
    },
    pt: {
      question: "O que é um prompt?",
      answer: "Coleção de instruções dizendo a Copilot o que gerar",
      wrongReasons: ["Prompts guiam todos recursos", "Prompts impactam output", "Usuário cria prompts"],
      explanation: "Bom prompt = bom output",
      mnemonic: "📝 Prompt de Qualidade = Output de Qualidade"
    }
  },
  {
    id: 27,
    difficulty: "easy",
    en: {
      question: "What does Copilot output quality depend on?",
      options: ["How well you crafted prompt", "Time of day", "Editor color", "Monitor size"],
      correct: 0,
      answer: "Clear and well-crafted prompts lead to better suggestions",
      wrongReasons: ["Time irrelevant", "Editor color irrelevant", "Monitor size irrelevant"],
      explanation: "Garbage in → garbage out | Gold in → gold out",
      mnemonic: "💎 Better Prompt = Better Output"
    },
    pt: {
      question: "De que depende a qualidade de output do Copilot?",
      answer: "Prompts claros e bem elaborados levam a melhores sugestões",
      wrongReasons: ["Hora irrelevante", "Cor editor irrelevante", "Tamanho monitor irrelevante"],
      explanation: "Lixo dentro → lixo fora | Ouro dentro → ouro fora",
      mnemonic: "💎 Melhor Prompt = Melhor Output"
    }
  },
  {
    id: 28,
    difficulty: "medium",
    en: {
      question: "What is the role of LLMs in Copilot?",
      options: ["Generate context-aware suggestions and respond", "Not used", "Only syntax", "Only translation"],
      correct: 0,
      answer: "Generate context-aware code suggestions and respond to prompts",
      wrongReasons: ["LLMs are core technology", "Syntax is small part", "Not translation-only"],
      explanation: "LLMs = the magic behind Copilot",
      mnemonic: "🤖 LLM = Copilot's Brain"
    },
    pt: {
      question: "Qual é o papel dos LLMs no Copilot?",
      answer: "Geram sugestões de código cientes do contexto e respondem prompts",
      wrongReasons: ["LLMs são tecnologia core", "Sintaxe é pequena parte", "Não apenas tradução"],
      explanation: "LLMs = a mágica por trás do Copilot",
      mnemonic: "🤖 LLM = Cérebro do Copilot"
    }
  },
  {
    id: 29,
    difficulty: "medium",
    en: {
      question: "Why are context and intent important for prompts?",
      options: ["Specify scope and goal", "Not important", "Only context", "Only intent"],
      correct: 0,
      answer: "They specify scope to examine and goal to achieve",
      wrongReasons: ["Both are essential", "Context alone insufficient", "Intent alone insufficient"],
      explanation: "Clear destination = better directions",
      mnemonic: "🎯 Scope + Goal = Great Response"
    },
    pt: {
      question: "Por que contexto e intenção são importantes para prompts?",
      answer: "Especificam escopo a examinar e objetivo a alcançar",
      wrongReasons: ["Ambos são essenciais", "Contexto sozinho insuficiente", "Intenção sozinha insuficiente"],
      explanation: "Destino claro = melhores direções",
      mnemonic: "🎯 Escopo + Objetivo = Ótima Resposta"
    }
  },
  {
    id: 30,
    difficulty: "medium",
    en: {
      question: "How to improve Copilot Chat performance?",
      options: ["Limit to coding questions/tasks", "Very long verbose prompts", "Multiple questions at once", "No context"],
      correct: 0,
      answer: "Focus prompts on specific coding questions or tasks",
      wrongReasons: ["Verbose prompts confuse", "Multiple questions dilute focus", "Context is essential"],
      explanation: "Focused questions = focused answers",
      mnemonic: "🎯 One Question = One Great Answer"
    },
    pt: {
      question: "Como melhorar desempenho do Copilot Chat?",
      answer: "Foque prompts em perguntas ou tarefas de codificação específicas",
      wrongReasons: ["Prompts verbosos confundem", "Múltiplas perguntas diluem foco", "Contexto é essencial"],
      explanation: "Perguntas focadas = respostas focadas",
      mnemonic: "🎯 Uma Pergunta = Uma Ótima Resposta"
    }
  },
  {
    id: 31,
    difficulty: "medium",
    en: {
      question: "Best way to provide context for suggestions?",
      options: ["Meaningful names, comments, open related files", "Keep files closed", "Generic names", "Avoid comments"],
      correct: 0,
      answer: "Meaningful function names, comments, and open related files",
      wrongReasons: ["Closed files limit context", "Generic names are unclear", "Comments document intent"],
      explanation: "Rich context = smarter suggestions",
      mnemonic: "📚 Good Names = Good Context"
    },
    pt: {
      question: "Melhor forma de fornecer contexto para sugestões?",
      answer: "Nomes de função significativos, comentários e arquivos relacionados abertos",
      wrongReasons: ["Arquivos fechados limitam contexto", "Nomes genéricos são pouco claros", "Comentários documentam intenção"],
      explanation: "Contexto rico = sugestões mais inteligentes",
      mnemonic: "📚 Bons Nomes = Bom Contexto"
    }
  },
  {
    id: 32,
    difficulty: "medium",
    en: {
      question: "How to optimize Copilot Chat interaction?",
      options: ["Use agents, slash commands, variables, be specific", "Type randomly", "No commands", "Vague prompts"],
      correct: 0,
      answer: "Use chat participants, slash commands, variables, and specificity",
      wrongReasons: ["These features enhance significantly", "Random typing ineffective", "Vague prompts produce vague output"],
      explanation: "Master the tools = master the results",
      mnemonic: "🎯 @agent + /command + Specificity = Gold"
    },
    pt: {
      question: "Como otimizar interação com Copilot Chat?",
      answer: "Use participantes de chat, comandos /slash, variáveis e especificidade",
      wrongReasons: ["Esses recursos melhoram significativamente", "Digitação aleatória ineficaz", "Prompts vagos produzem output vago"],
      explanation: "Dominar as ferramentas = dominar os resultados",
      mnemonic: "🎯 @agent + /command + Especificidade = Ouro"
    }
  },
  {
    id: 33,
    difficulty: "hard",
    en: {
      question: "What's NOT a principle of effective prompt engineering?",
      options: ["Surround - Use descriptive filenames", "Verbosity - Extensive detail", "Clarity - Be clear", "Context - Provide background"],
      correct: 1,
      answer: "Verbosity - Concise prompts work better than extremely detailed ones",
      wrongReasons: ["Surround principle is valid", "Clarity is essential", "Context is important"],
      explanation: "More words ≠ better results | Clear ≠ verbose",
      mnemonic: "📏 Concise > Verbose"
    },
    pt: {
      question: "O que NÃO é princípio de prompt engineering eficaz?",
      answer: "Verbosidade - Prompts concisos funcionam melhor que extremamente detalhados",
      wrongReasons: ["Princípio Surround é válido", "Clareza é essencial", "Contexto é importante"],
      explanation: "Mais palavras ≠ melhores resultados | Claro ≠ verboso",
      mnemonic: "📏 Conciso > Verboso"
    }
  },
  {
    id: 34,
    difficulty: "medium",
    en: {
      question: "What is the purpose of code refactoring?",
      options: ["Improve structure without changing behavior", "Add features", "Delete code", "Make slower"],
      correct: 0,
      answer: "Improve internal structure while maintaining same external behavior",
      wrongReasons: ["Refactoring ≠ adding features", "Refactoring ≠ deleting", "Refactoring optimizes"],
      explanation: "Same output, better code",
      mnemonic: "🔧 Refactor = Clean Structure"
    },
    pt: {
      question: "Qual é o propósito da refatoração de código?",
      answer: "Melhorar estrutura interna mantendo o mesmo comportamento externo",
      wrongReasons: ["Refatoração ≠ adicionar features", "Refatoração ≠ deletar", "Refatoração otimiza"],
      explanation: "Mesma saída, código melhor",
      mnemonic: "🔧 Refator = Estrutura Limpa"
    }
  },
  {
    id: 35,
    difficulty: "medium",
    en: {
      question: "Primary purpose of project documentation?",
      options: ["Provide info about scope and purpose", "Confuse", "Take space", "Not important"],
      correct: 0,
      answer: "Provide essential information about project scope and purpose",
      wrongReasons: ["Documentation clarifies", "Space concerns are irrelevant", "Documentation is vital"],
      explanation: "No docs = no collaboration",
      mnemonic: "📚 Docs = Project Understanding"
    },
    pt: {
      question: "Propósito principal da documentação do projeto?",
      answer: "Fornecer informações essenciais sobre escopo e propósito do projeto",
      wrongReasons: ["Documentação clarifica", "Preocupações de espaço irrelevantes", "Documentação é vital"],
      explanation: "Sem docs = sem colaboração",
      mnemonic: "📚 Docs = Compreensão do Projeto"
    }
  },
  {
    id: 36,
    difficulty: "easy",
    en: {
      question: "Purpose of inline code documentation?",
      options: ["Create readable maintainable codebase", "Confuse", "Make slower", "Harmful"],
      correct: 0,
      answer: "Create readable and maintainable code easier for developers",
      wrongReasons: ["Documentation clarifies", "Documentation improves speed", "Documentation is beneficial"],
      explanation: "Documented code = understood code",
      mnemonic: "📝 Comments = Clear Code"
    },
    pt: {
      question: "Propósito da documentação inline de código?",
      answer: "Criar código legível e mantível mais fácil para desenvolvedores",
      wrongReasons: ["Documentação clarifica", "Documentação melhora velocidade", "Documentação é benéfica"],
      explanation: "Código documentado = código compreendido",
      mnemonic: "📝 Comentários = Código Claro"
    }
  },
  {
    id: 37,
    difficulty: "medium",
    en: {
      question: "What code conversions can Copilot do?",
      options: ["Convert between programming languages", "To human language", "To images", "Docs to code"],
      correct: 0,
      answer: "Convert code file, function, or snippet to another programming language",
      wrongReasons: ["While possible, language explanation is secondary to code conversion", "Copilot doesn't generate images", "Copilot generates code from docs, not vice versa"],
      explanation: "💡 ANALOGY: Like a translator who speaks Python, JavaScript, TypeScript, Go, Rust - converts code between 'languages' seamlessly. You write Python → Copilot outputs TypeScript. Same logic, different syntax!",
      mnemonic: "🔄 Code = Universal Language Converter"
    },
    pt: {
      question: "Que conversões de código Copilot pode fazer?",
      answer: "Converter arquivo, função ou snippet para outra linguagem de programação",
      wrongReasons: ["Embora possível, explicação de linguagem é secundária", "Copilot não gera imagens", "Copilot gera código de docs, não ao contrário"],
      explanation: "💡 ANALOGIA: Como um tradutor que fala Python, JavaScript, TypeScript, Go, Rust - converte código entre 'idiomas' sem esforço. Você escreve Python → Copilot output TypeScript. Mesma lógica, sintaxe diferente!",
      mnemonic: "🔄 Código = Conversor Universal de Linguagens"
    }
  },
  {
    id: 38,
    difficulty: "medium",
    en: {
      question: "Role of Copilot Chat in generating unit tests?",
      options: ["Generate snippets, suggest inputs/outputs/assertions, find edge cases", "Cannot", "Only runs", "Deletes"],
      correct: 0,
      answer: "Generate test snippets, suggest inputs, outputs, assertions, and identify edge cases",
      wrongReasons: ["Testing is core Chat capability", "Test generation and running are different", "Never deletes"],
      explanation: "Full test suite generation from code",
      mnemonic: "🧪 Arrange → Act → Assert"
    },
    pt: {
      question: "Papel do Copilot Chat na geração de testes de unidade?",
      answer: "Gerar snippets de teste, sugerir entradas, saídas, asserções e identificar casos extremos",
      wrongReasons: ["Testes são capacidade core Chat", "Geração e execução são diferentes", "Nunca deleta"],
      explanation: "Geração de suite completa de testes a partir do código",
      mnemonic: "🧪 Arrange → Act → Assert"
    }
  },
  {
    id: 39,
    difficulty: "medium",
    en: {
      question: "Purpose of Test Explorer in VS Code?",
      options: ["Run, debug, manage unit tests", "File nav", "Git", "Extensions only"],
      correct: 0,
      answer: "Run and debug unit tests, view results, manage test cases",
      wrongReasons: ["File navigation is sidebar", "Git is separate", "Works beyond extensions"],
      explanation: "Central hub for all testing needs",
      mnemonic: "🧪 Test Explorer = Testing Hub"
    },
    pt: {
      question: "Propósito do Test Explorer no VS Code?",
      answer: "Executar e depurar testes, visualizar resultados, gerenciar casos",
      wrongReasons: ["Navegação de arquivo é sidebar", "Git é separado", "Funciona além de extensões"],
      explanation: "Hub central para todas necessidades de teste",
      mnemonic: "🧪 Test Explorer = Hub de Testes"
    }
  },
  {
    id: 40,
    difficulty: "medium",
    en: {
      question: "Significance of Arrange, Act, Assert in tests?",
      options: ["Structure into setup, execution, verification", "Random", "No significance", "Documentation only"],
      correct: 0,
      answer: "Structure tests into setup (Arrange), execution (Act), verification (Assert)",
      wrongReasons: ["Pattern is essential", "Has great significance", "More than documentation"],
      explanation: "AAA pattern = test best practice",
      mnemonic: "🎬 Setup → Execute → Verify"
    },
    pt: {
      question: "Significado de Arrange, Act, Assert em testes?",
      answer: "Estruturar testes em configuração, execução e verificação",
      wrongReasons: ["Padrão é essencial", "Tem grande significado", "Mais que documentação"],
      explanation: "Padrão AAA = best practice de teste",
      mnemonic: "🎬 Configurar → Executar → Verificar"
    }
  },
  {
    id: 41,
    difficulty: "medium",
    en: {
      question: "What does Copilot provide for unit tests?",
      options: ["Suggests and generates tests based on context", "Random", "Cannot", "Manual only"],
      correct: 0,
      answer: "Suggests and generates tests based on code context",
      wrongReasons: ["Generation not random", "Test generation is core capability", "Generation is automated"],
      explanation: "Tests emerge from your code",
      mnemonic: "🤖 Code → AI → Tests"
    },
    pt: {
      question: "O que Copilot fornece para testes de unidade?",
      answer: "Sugere e gera testes baseados no contexto do código",
      wrongReasons: ["Geração não aleatória", "Geração de teste é capacidade core", "Geração é automatizada"],
      explanation: "Testes emergem de seu código",
      mnemonic: "🤖 Código → IA → Testes"
    }
  },
  {
    id: 42,
    difficulty: "easy",
    en: {
      question: "Benefit of Copilot for generating unit tests?",
      options: ["Suggest relevant tests, save time", "Makes slower", "Cannot", "Not important"],
      correct: 0,
      answer: "Suggests relevant tests based on context, saving development time",
      wrongReasons: ["Speeds up development", "Test generation is a core feature", "Testing is important"],
      explanation: "Less time writing tests = more time coding",
      mnemonic: "⏱️ Less Writing = More Building"
    },
    pt: {
      question: "Benefício do Copilot para gerar testes de unidade?",
      answer: "Sugere testes relevantes baseado em contexto, economizando tempo",
      wrongReasons: ["Acelera desenvolvimento", "Geração de teste é feature core", "Testes são importantes"],
      explanation: "Menos escrita de testes = mais construção",
      mnemonic: "⏱️ Menos Escrita = Mais Construção"
    }
  },
  {
    id: 43,
    difficulty: "medium",
    en: {
      question: "Purpose of assertions for valid parameters?",
      options: ["Prevent invalid data processing", "Unnecessary", "Make faster", "Delete data"],
      correct: 0,
      answer: "Prevent invalid data from being processed by the function",
      wrongReasons: ["Assertions are essential", "Improve reliability", "Preserve data"],
      explanation: "Garbage in, garbage out → prevented",
      mnemonic: "🛡️ Validate = Prevent Errors"
    },
    pt: {
      question: "Propósito de asserções para parâmetros válidos?",
      answer: "Prevenir que dados inválidos sejam processados pela função",
      wrongReasons: ["Asserções são essenciais", "Melhoram confiabilidade", "Preservam dados"],
      explanation: "Lixo dentro, lixo fora → prevenido",
      mnemonic: "🛡️ Validar = Prevenir Erros"
    }
  },
  {
    id: 44,
    difficulty: "medium",
    en: {
      question: "Factors to consider for code quality?",
      options: ["Readability, modularity, performance, security, scalability", "Performance only", "Security only", "Cannot measure"],
      correct: 0,
      answer: "Readability, complexity, modularity, testability, performance, security, scalability",
      wrongReasons: ["All factors matter", "Multiple dimensions important", "Measurable"],
      explanation: "Quality = holistic evaluation",
      mnemonic: "📊 Multi-Factor Quality"
    },
    pt: {
      question: "Fatores a considerar para qualidade de código?",
      answer: "Legibilidade, modularidade, desempenho, segurança, escalabilidade",
      wrongReasons: ["Todos fatores importam", "Múltiplas dimensões importantes", "Mensurável"],
      explanation: "Qualidade = avaliação holística",
      mnemonic: "📊 Qualidade Multi-Fator"
    }
  },
  {
    id: 45,
    difficulty: "hard",
    en: {
      question: "What is code reliability?",
      options: ["Using modern CPU parallelization", "Software functions correctly under conditions consistently", "Only error handling", "Not important"],
      correct: 1,
      answer: "Likelihood software functions correctly under specified conditions",
      wrongReasons: ["Parallelization is optimization not reliability", "Error handling is part not whole", "Reliability is critical"],
      explanation: "💡 ANALOGY: Like a banking ATM - it MUST work correctly EVERY TIME in specified conditions (valid PIN, network available, funds present). Parallelization makes it FASTER, but reliability makes it TRUSTWORTHY. Users don't care about speed if it crashes! Reliable = predictable, consistent results under expected conditions.",
      mnemonic: "🎯 Reliable = Works EVERY Time in Expected Conditions"
    },
    pt: {
      question: "O que é confiabilidade de código?",
      answer: "Probabilidade de que software funcione corretamente sob condições especificadas",
      wrongReasons: ["Paralelização é otimização não confiabilidade", "Tratamento de erro é parte não todo", "Confiabilidade é crítica"],
      explanation: "💡 ANALOGIA: Como um ATM bancário - DEVE funcionar corretamente TODA VEZ em condições especificadas (PIN válido, rede disponível, fundos presentes). Paralelização o torna MAIS RÁPIDO, mas confiabilidade o torna CONFIÁVEL. Usuários não se importam com velocidade se ele travar! Confiável = resultados previsíveis e consistentes em condições esperadas.",
      mnemonic: "🎯 Confiável = Funciona SEMPRE em Condições Esperadas"
    }
  },
  {
    id: 46,
    difficulty: "medium",
    en: {
      question: "Way to improve code reliability?",
      options: ["Identify issues to prevent bugs", "Ignore bugs", "No testing", "Unavoidable"],
      correct: 0,
      answer: "Identify and address potential issues to prevent bugs and errors",
      wrongReasons: ["Issues must be addressed", "Testing essential", "Many are preventable"],
      explanation: "Prevention > firefighting",
      mnemonic: "🔍 Find Issues → Fix Proactively"
    },
    pt: {
      question: "Forma de melhorar confiabilidade de código?",
      answer: "Identificar e resolver possíveis problemas para prevenir bugs",
      wrongReasons: ["Problemas devem ser resolvidos", "Testes essenciais", "Muitos são evitáveis"],
      explanation: "Prevenção > combate ao fogo",
      mnemonic: "🔍 Encontrar Problemas → Corrigir Proativamente"
    }
  },
  {
    id: 47,
    difficulty: "medium",
    en: {
      question: "Effect of high code quality with Copilot?",
      options: ["Copilot learns patterns and replicates", "Ignores quality", "No effect", "Only for bad code"],
      correct: 0,
      answer: "Copilot learns patterns and generates suggestions following existing style",
      wrongReasons: ["Quality influences suggestions", "Quality has strong effect", "Works with good code better"],
      explanation: "Good code → good suggestions",
      mnemonic: "✨ Clean Code = Better AI"
    },
    pt: {
      question: "Efeito de código de alta qualidade com Copilot?",
      answer: "Copilot aprende padrões e gera sugestões seguindo estilo existente",
      wrongReasons: ["Qualidade influencia sugestões", "Qualidade tem efeito forte", "Funciona melhor com bom código"],
      explanation: "Código bom → sugestões boas",
      mnemonic: "✨ Código Limpo = IA Melhor"
    }
  },
  {
    id: 48,
    difficulty: "medium",
    en: {
      question: "Ways to improve exception handling security?",
      options: ["Catch specific exceptions, no sensitive info, don't swallow", "Catch all", "Share info", "Hide errors"],
      correct: 0,
      answer: "Catch specific exceptions, avoid sensitive info in errors, don't swallow",
      wrongReasons: ["Specific catching is better", "Sensitive data must be protected", "Errors must be logged"],
      explanation: "Secure exception handling = secure application",
      mnemonic: "🔒 Specific → Safe → Log"
    },
    pt: {
      question: "Formas de melhorar segurança de tratamento de exceções?",
      answer: "Pegar exceções específicas, evitar infos sensíveis, não silenciar",
      wrongReasons: ["Captura específica é melhor", "Dados sensíveis devem ser protegidos", "Erros devem ser registrados"],
      explanation: "Tratamento seguro = aplicação segura",
      mnemonic: "🔒 Específico → Seguro → Registrar"
    }
  },
  {
    id: 49,
    difficulty: "hard",
    en: {
      question: "Primary purpose of content filtering in Copilot?",
      options: ["Eliminate irrelevant info", "Prevent malicious code generation", "Speed suggestions", "Language filtering"],
      correct: 1,
      answer: "Prevent generation of malicious or harmful code",
      wrongReasons: ["Info relevance is secondary", "Speed isn't primary purpose", "Language filtering is separate"],
      explanation: "💡 ANALOGY: Like a security guard at a club - content filtering checks every suggestion before showing it to you. If something looks sketchy (malicious code, SQL injection, security vulnerabilities), it blocks it. Your code stays clean! 🛡️",
      mnemonic: "🛡️ Content Filter = Security Bouncer"
    },
    pt: {
      question: "Propósito principal da filtragem de conteúdo no Copilot?",
      answer: "Prevenir geração de código malicioso ou prejudicial",
      wrongReasons: ["Relevância de info é secundária", "Velocidade não é propósito principal", "Filtragem de linguagem é separada"],
      explanation: "💡 ANALOGIA: Como um segurança em um clube - a filtragem verifica cada sugestão antes de mostrá-la. Se algo parece suspeito (código malicioso, SQL injection, vulnerabilidades), bloqueia. Seu código fica limpo! 🛡️",
      mnemonic: "🛡️ Filtro = Segurança de Código"
    }
  },
  {
    id: 50,
    difficulty: "easy",
    en: {
      question: "Primary purpose of toxicity filter in Copilot?",
      options: ["Eliminate harmful offensive content", "Prevent compilation", "Slow suggestions", "No purpose"],
      correct: 0,
      answer: "Eliminate harmful or offensive content in code suggestions",
      wrongReasons: ["Filter has strong purpose", "Doesn't affect compilation", "Speeds up filtering"],
      explanation: "Clean code, clean suggestions",
      mnemonic: "✨ No Toxic Code"
    },
    pt: {
      question: "Propósito principal do filtro de toxicidade no Copilot?",
      answer: "Eliminar conteúdo prejudicial ou ofensivo nas sugestões",
      wrongReasons: ["Filtro tem propósito forte", "Não afeta compilação", "Acelera filtragem"],
      explanation: "Código limpo, sugestões limpas",
      mnemonic: "✨ Sem Código Tóxico"
    }
  }
];

window.GH300_QUESTIONS = GH300_QUESTIONS;
