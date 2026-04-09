#!/usr/bin/env python3
"""
Improve wrongReasons in data/exams/gh300.json with fact-based arguments.
(Atualmente apenas imprime sugestões para edição manual.)
"""

import json

# Load the questions file
with open('data/exams/gh300.json', 'r', encoding='utf-8') as f:
    exam = json.load(f)

questions = exam.get('questions', [])

# My improvements mapping - Q_ID -> (EN_improvements, PT_improvements)
improvements = {
    3: (
        ["Auto-merge removes human code review - summaries HELP reviewers, not replace them", 
         "PR summaries don't affect PR creation process - assist AFTER PR opened",
         "PR summaries work public AND private repos per GitHub documentation"],
        ["Auto-merge remove revisão humana - resumos AJUDAM, não substituem",
         "Resumos de PR não afetam criação - assistem APÓS PR ser aberto", 
         "Resumos funcionam public E private repos per docs GitHub"]
    ),
    4: (
        ["Deleting docs removes proprietary patterns - destroys organizational intellectual property",
         "Restricting doc access ENABLES private customization - docsets use restricted docs AS TRAINING DATA",
         "Docsets ARE the core Enterprise differentiator - enable AI to learn org-specific frameworks and APIs"],
        ["Deletar docs remove padrões proprietários - destrói propriedade intelectual organizacional",
         "Restringir acesso PERMITE customização privada - docsets usam docs restritos COMO DADOS",
         "Docsets SÃO diferenciador core Enterprise - habilitam IA aprender frameworks específicos org"]
    ),
    5: (
        ["Deleting classes destroys functionality - refactoring IMPROVES structure, not eliminates",
         "Preventing class creation contradicts Chat purpose - Chat ENABLES better architectural design",
         "Suggesting single-responsibility principle IS Chat's core architectural guidance feature"],
        ["Deletar classes destroys funcionalidade - refatoração MELHORA, não elimina",
         "Prevenir criação contradiz propósito Chat - Chat HABILITA melhor design",
         "Sugerir princípio SRP É feature core arquitetural do Chat"]
    ),
    6: (
        ["Random suggestions without error context CREATE NEW BUGS - context analysis is critical",
         "Deletion removes problem but provides ZERO solution path - no learning or proper debugging",
         "Chat's core feature: understand error stack trace and provide targeted fix suggestions"],
        ["Sugestões aleatórias sem contexto CRIAM NOVOS bugs - análise de contexto crítica",
         "Deletar remove problema mas ZERO solução - sem aprendizado",
         "Feature core Chat: entender stack trace e fornecer sugestões de correção"]
    ),
    7: (
        ["Refusing explanation removes knowledge transfer - developers lose learning opportunity entirely",
         "Code modification changes WHAT code does - explanation clarifies logic WITHOUT changing behavior",
         "Chat core feature: paste legacy code + get human-readable breakdown of every function"],
        ["Recusar explicação remove transferência de conhecimento - devs perdem oportunidade",
         "Modificação muda O QUE código faz - explicação clarifica SEM mudar",
         "Feature core Chat: cole código legado + obtenha breakdown de cada função"]
    ),
    8: (
        ["Ignoring errors keeps developers BLOCKED - understanding NullPointerException, TypeError,StackOverflow is essential for any fix",
         "Deleting files destroys ALL work AND removes debugging opportunity - counterproductive approach",
         "Chat's error analysis workflow verified across millions of debugging sessions daily"],
        ["Ignorar erros mantém devs BLOQUEADOS - entender NullPointerException, TypeError é essencial",
         "Deletar arquivos destrói TUDO - remove oportunidade debug",
         "Workflow análise de erros Chat verificado em milhões de sessions"]
    ),
    9: (
        ["Removing comments leaves code unmaintainable - future developers cannot understand intent or logic",
         "Preventing documentation creates technical debt - undocumented code is nightmare for teams",
         "Chat generates JSDoc, function explanations, parameter docs - try '/doc' command"],
        ["Remover comentários deixa código unmaintainable - devs futuros não entendem intenção",
         "Prevenir docs cria tech debt - código não documentado é pesadelo para times",
         "Chat gera JSDoc, explicações de função, docs de parâmetros - try '/doc'"]
    ),
    10: (
        ["'Options when typing' is too generic - ghost text is SPECIFICALLY the faded suggestion",
         "'Hidden uneditable code' contradicts ghost text visibility - you CAN edit after accepting with Tab",
         "'Deleted recoverable' is wrong - ghost text is temporary preview, deleted code is permanent loss"],
        ["'Opções ao digitar' é genérico - ghost text é ESPECIFICAMENTE sugestão esmaecida",
         "'Código hidden' contradiz visibility - VOCÊ PODE editar após aceitar com Tab",
         "'Deletado recuperável' está errado - ghost text é prévia temporária"]
    ),
    11: (
        ["Sidebar chat icon (Ctrl+L in VS Code) opens Chat panel - inline needs Ctrl+I to edit ON code",
         "Ctrl+j opens terminal; Ctrl+k opens command palette in VS Code - neither activates inline chat",
         "Inline chat overlays ON your editor where you're typing - sidebar is modal window - completely different"],
        ["Ícone chat sidebar (Ctrl+L) abre painel Chat - inline precisa Ctrl+I NO código",
         "Ctrl+j abre terminal; Ctrl+k abre palette - nenhum ativa inline chat",
         "Inline chat overlay NO seu editor - sidebar é modal - features completamente diferentes"]
    ),
}

print(f"Loaded {len(questions)} questions")
print(f"Improvements planned for {len(improvements)} questions")
print("Implementation note: Use file editor to apply one question at a time\n")

for q_id in sorted(improvements.keys()):
    en_fixes, pt_fixes = improvements[q_id]
    print(f"Q{q_id} EN wrongReasons:")
    for i, fix in enumerate(en_fixes):
        print(f"  [{i}] {fix}")
    print(f"Q{q_id} PT wrongReasons:")
    for i, fix in enumerate(pt_fixes):
        print(f"  [{i}] {fix}")
    print()
