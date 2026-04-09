#!/usr/bin/env python3
"""
Script para adicionar traduções das opções nas questões.
Atualiza data/exams/gh300.json para manter tudo em um único lugar.
"""

import json

# Dicionário de traduções de opções (PT)
translations = {
    1: ["Enterprise permite customização usando sua própria base de código", "Business é apenas para indivíduos", "Sem diferença", "Enterprise é mais barato"],
    2: ["Suas organizações no menu suspenso de perfil", "Configurações do GitHub", "Configurações do Repositório", "Dashboard do Copilot"],
    3: ["Geram resumos concisos de PR", "Auto-mesclam todos os PRs", "Impedem criação de PR", "Apenas para repos privados"],
    4: ["Criar coleções customizadas de código e docs internos", "Deletar documentação", "Impedir acesso doc", "Não suportado"],
    5: ["Sugere refatoração baseada em contexto", "Deleta classes", "Previne criação", "Não consegue assistir"],
    6: ["Sugere snippets de código baseado em erro", "Geração aleatória", "Deleta código bugado", "Não consegue corrigir"],
    7: ["Gera descrições em linguagem natural", "Recusa explicação", "Modifica código", "Não consegue explicar"],
    8: ["Explica causa e sugere correções", "Ignora erro", "Deleta arquivo", "Não consegue assistir"],
    9: ["Gera comentários de prompts naturais", "Remove comentários", "Previne docs", "Não consegue gerar"],
    10: ["Opções ao digitar", "Sugestões esmaecidas enquanto digita", "Código oculto não-editável", "Código deletado recuperável"],
    11: ["Clique ícone chat na sidebar", "Ctrl+i (Windows) ou Cmd+i (Mac)", "Ctrl+j", "Ctrl+k"],
    12: ["Perguntas em contexto específico", "Apenas debugging", "Impedir Copilot", "Não suportado"],
    13: ["Melhores respostas sem prompts longos", "Deprecado", "Faz mais difícil", "Sem benefícios"],
    14: ["Suporte proxy VPN com certs auto-assinados", "Ghost text", "Chat", "Completion"],
    15: ["Pressione tecla Tab", "Pressione Enter", "Pressione Espaço", "Clique sugestão"],
    16: ["Programador par de IA para sugestões código", "Controle de versão", "Ferramenta de planejamento", "Rastreador de bugs"],
    17: ["Contexto de código no editor", "Aleatório", "Último digitado", "Tamanho arquivo"],
    18: ["Personaliza para padrões e práticas de org", "Ignora padrões", "Apenas código público", "Não consegue customizar"],
    19: ["Usa prompts naturais e contexto código", "Lê mentes", "Apenas linguagens específicas", "Sempre online"],
    20: ["Aprendizado zero-shot, one-shot, few-shot", "Armazena todos prompts", "Não aprende", "Precisa treinamento manual"],
    21: ["Análise estatística e reconhecimento padrão", "Tokenização", "Geração embedding", "Decoding"],
    22: ["Considera contexto código mais amplo", "Limita linha atual", "Ignora surroundings", "Não melhora"],
    23: ["Apresentada ao usuário para aceitação", "Auto-aplicada", "Deletada", "Armazenada permanentemente"],
    24: ["Revise cada uma usando setas esq/dir", "Auto-seleciona melhor", "Todas de uma vez", "Apenas primeira mostrada"],
    25: ["Garante precisão e completude", "Perda de tempo", "Desnecessário", "Deletar output"],
    26: ["Armazena feedback de rejeição", "Ignora dados", "Não aprende", "Sem impacto"],
    27: ["Segurança aprimorada e conformidade", "Sem diferença", "Apenas desenvolvimento", "Não é necessário"],
    28: ["Linguagens de programação específicas", "Todas as linguagens igualmente", "Apenas Python", "Sem preferência"],
    29: ["Privacidade e segurança de dados", "Velocidade apenas", "Custo reduzido", "Sem limites"],
    30: ["Usar múltiplos agentes em chat", "Uma ferramenta", "Agentes são iguais", "Sem combinação"],
    31: ["Inicialize agentes para context", "Ignore agentes", "Sempre use tudo", "Uma abordagem"],
    32: ["Escreva prompts claros e específicos", "Aleatório funciona", "Sempre complexo", "Sem importância"],
    33: ["READMEs e documentação", "Sem documentação", "Apenas código", "Desnecessário"],
    34: ["Teste toda saída gerada", "Confie cegamente", "Nunca teste", "Sem necessidade"],
    35: ["Evite sensíveis info nos prompts", "Compartilhe tudo", "Sem risco", "A informação"],
    36: ["Use contexto para resultados melhor", "Ignore contexto", "Contexto prejudica", "Sem efeito"],
    37: ["Personalize com @workspace", "Confie em defaults", "Um tamanho fit all", "Sem customização"],
    38: ["Combine chat + suggestions", "Use separadamente", "Ferramentas diferentes", "Sem integração"],
    39: ["Refaça com feedback iterativo", "Uma solução", "Não repita", "Sem melhorias"],
    40: ["Adquira familiaridade com features", "Ignore documentação", "Saiba tudo imediatamente", "Sem aprendizado"],
    41: ["Engenharia de prompt dedicada", "Sem plano necessário", "Uma solução", "Sem estratégia"],
    42: ["Analise resultados regularmente", "Ignore análise", "Sem necessidade", "Uma vez"],
    43: ["Melhore com feedback cont", "Ignore feedback", "Sem melhoria", "Uma vez"],
    44: ["Compart conhecimento com team", "Sem compartilhamento", "Mantenha segredo", "Sem  benefício"],
    45: ["Prompt bem escrito > respostas melhores", "Prompts não importam", "Sempre iguais", "Sem relação"],
    46: ["Instruções claras e exemplos", "Confusão OK", "Ambiguidade fine", "Sem importância"],
    47: ["LLM pode errar - verifique", "LLM sempre certo", "Confie cegamente", "Sem verificação"],
    48: ["Iteração melhora qualidade", "Uma tentativa suficiente", "Sem melhoria possível", "Sem refinamento"],
    49: ["Revisor humano + Copilot", "Apenas Copilot", "Sem supervisão", "Sem controle"],
    50: ["Eliminar conteúdo prejudicial/ofensivo", "Filtro sem efeito", "Não afeta compilação", "Sem impacto"],
}

path = 'data/exams/gh300.json'

with open(path, 'r', encoding='utf-8') as f:
    exam = json.load(f)

questions = exam.get('questions', [])
updated = 0
for q in questions:
    qid = q.get('id')
    if qid in translations:
        options = q.get('options', [])
        for idx, pt_text in enumerate(translations[qid]):
            if idx >= len(options):
                options.append({'en': '', 'pt': pt_text})
            else:
                options[idx].setdefault('en', '')
                options[idx]['pt'] = pt_text
        q['options'] = options
        updated += 1

with open(path, 'w', encoding='utf-8') as f:
    json.dump(exam, f, ensure_ascii=False, indent=2)

print(f"✅ Traduções de opções adicionadas/atualizadas: {updated} questões")
