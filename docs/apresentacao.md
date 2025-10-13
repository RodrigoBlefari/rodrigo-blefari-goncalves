# Apresentação do Projeto

## Objetivo (em linguagem simples)
Criar um currículo online bonito, rápido e fácil de entender, que funcione em vários idiomas, tenha diferentes temas visuais, permita leitura confortável e impressão em PDF, além de mostrar projetos pessoais interativos.

- Para quem é: recrutadores, colegas e qualquer pessoa que queira conhecer meu trabalho.
- O que você consegue fazer no site:
  - Ler meu perfil e experiências de forma clara
  - Trocar o idioma
  - Mudar o tema visual
  - Ativar um modo de leitura
  - Imprimir/Salvar como PDF
  - Explorar demos de projetos pessoais

---

## Explicação simples (o que foi feito e como funciona)
- Este site é uma página estática (sem precisar de servidores complexos).
- Os textos e dados (como experiências, habilidades e projetos) estão organizados em arquivos JSON, o que facilita manutenção e tradução.
- A interface é montada com JavaScript “puro” (sem framework), separando o código em “componentes” para cada seção do currículo.
- Há dois modelos visuais (templates) para apresentar o conteúdo: Tech e Moderno.
- Você pode escolher o idioma (ex.: português, inglês, espanhol) e o sistema atualiza os textos automaticamente.
- Existe um modo de leitura que deixa a visualização mais confortável e um recurso para imprimir o currículo (ou salvar em PDF).
- Além do currículo, há uma área com demos de projetos pessoais, como um jogo gerativo (roguelike) feito em JavaScript e HTML Canvas.

---

## Tecnologias usadas
- Base do site:
  - HTML5
  - CSS3
  - JavaScript (ES Modules)
- Organização de conteúdo e internacionalização:
  - JSON para textos e dados (i18n/ e cms.json)
  - Módulo de i18n próprio (src/core/i18n.js)
- Temas/estilo:
  - CSS modular
  - Templates prontos (templates/template-tech e templates/template-moderno)
- Experimentos e Demos (projetos pessoais):
  - HTML Canvas + JavaScript para simulações e jogos
- Hospedagem/execução:
  - Site estático (pode rodar localmente no navegador ou via servidor estático, ex.: GitHub Pages)

---

## Visão técnica resumida (para quem é da área)
- Arquitetura:
  - Sem framework: organização por módulos ES6.
  - “Componentes” de UI em `src/components/` geram e inserem HTML no DOM para cada seção (ex.: summary, skills, experience).
  - “Core” em `src/core/` concentra utilidades transversais: i18n, paleta de tecnologias (techColors), fontes, plano de fundo e destaques.
  - “Features” em `src/features/` implementa capacidades específicas: modo de leitura, impressão.
  - “Templates” guardam HTML/CSS base e variações visuais.
  - “Assets” traz imagens e fundos temáticos.
- Dados:
  - `i18n/*.json` contém traduções por idioma.
  - `cms.json` centraliza informações do currículo (ou referências para elas).
- Renderização:
  - `index.html` carrega módulos JS que:
    1) Inicializam i18n conforme idioma selecionado.
    2) Montam seções do currículo com os componentes.
    3) Aplicam tema/estilo e utilidades (ex.: destaque de tecnologias).
    4) Habilitam recursos de UX (modo leitura, impressão).
- Projetos pessoais:
  - Em `projetos-pessoais/` há um conjunto de demos e um mini-“engine” para simulações e um roguelike generativo.
  - Uso de Canvas e loop de jogo (`src/core/loopJogo.js` nos projetos pessoais), IA básica/evolutiva e sistemas de entidades.

---

## Como usar (passo a passo rápido)
- Abrir: clique duas vezes em `index.html` para abrir o currículo no navegador.
- Trocar idioma: use as opções do site; os textos mudam automaticamente (base i18n).
- Mudar tema: escolha entre os templates disponíveis (Tech/Moderno).
- Modo leitura: ative/desative para uma experiência mais confortável.
- Imprimir: use o botão de impressão do site (ou Ctrl/Cmd + P) para gerar PDF.

Observação técnica: alguns navegadores exigem servir arquivos com módulos ES6 via HTTP. Se abrir direto pelo arquivo (`file://`) não funcionar, sirva a pasta com um servidor estático (ex.: “Live Server” do VSCode).

---

## Onde estão as coisas (mapa do projeto)
- Raiz do site:
  - `index.html`: ponto de entrada do currículo.
  - `cms.json`: dados organizados do currículo (ou ponte para eles).
  - `i18n/`: traduções por idioma (pt, en, es, etc.).
  - `assets/`: fundos e imagens (ex.: assets/backgrounds/).
- Código do currículo:
  - `src/components/`: seções do currículo (companies, education, experience, header, objective, projects, skills, summary).
  - `src/core/`: utilidades (background, fonts, highlight, i18n, techColors).
  - `src/features/`: recursos adicionais (print, readingMode).
  - `styles/`: estilos base e específicos (ex.: styles/base.css, styles/tech.css).
  - `templates/`: modelos visuais (template-tech e template-moderno).
- Projetos pessoais (demos/jogos):
  - `projetos-pessoais/`: demos interativas.
  - Roguelike: `projetos-pessoais/generative-game-rogue-like/` (abra `index.html` ou os arquivos `demo-*.html` para ver comportamentos específicos).
  - Engine/IA: `projetos-pessoais/src/` (cenas, entidades, IA, sistemas, UI).

---

## Como editar conteúdo
- Textos/traduções: edite os arquivos em `i18n/` (ex.: `i18n/pt.json`, `i18n/en.json`).
- Dados do currículo: ajuste `cms.json` e/ou os componentes conforme necessário.
- Estilos/tema: altere os CSS em `styles/` e nos diretórios de `templates/`.
- Fundos e imagens: troque/adicione arquivos em `assets/`.

Dica: Sempre teste após mudanças abrindo o `index.html` (ou rodando um servidor estático) para validar layout e textos.

---

## Executar localmente (opções)
- Mais simples: abrir `index.html` no navegador.
- Se seu navegador bloquear módulos:
  - Use a extensão “Live Server” no VSCode, ou
  - Rode um servidor estático (ex.: `npx serve .` na raiz do projeto).
- Hospedagem:
  - Pode ser publicado como site estático (ex.: GitHub Pages, Netlify, Vercel).

---

## Sobre os projetos pessoais (demos)
- Roguelike generativo:
  - Demos em `projetos-pessoais/generative-game-rogue-like/` (arquivos `demo-*.html`).
  - Mostra sistemas de controle, inimigos, rastreamento e temas de UI.
- Mini-engine/IA:
  - Código em `projetos-pessoais/src/` dividido em:
    - `core/`: configuração, loop de jogo, utilitários.
    - `entidades/`: jogador, inimigos, projéteis, etc.
    - `ia/`: componentes de IA (evolutivo, monitoramento).
    - `sistemas/`: entrada, áudio, projéteis, inimigos.
    - `ui/`: HUD, painéis, visualização da IA.
  - Objetivo: experimentar mecânicas e IA em JS/Canvas.

---

## Destaques técnicos
- Modularização com ES Modules (sem dependência de frameworks).
- Internacionalização baseada em JSON e módulo i18n dedicado.
- Tematização por templates e estilos segmentados.
- Recursos de UX: modo leitura e impressão amigável.
- Demos interativas para validar ideias de gameplay e IA.

---

## Próximos passos (opcional)
- Centralizar ainda mais o conteúdo em `cms.json` para reduzir ajustes em código.
- Adicionar testes básicos de renderização (Smoke Tests) dos componentes.
- Expandir acessibilidade (navegação por teclado, ARIA mais completa).
- Otimizar impressão com layouts específicos por template.
