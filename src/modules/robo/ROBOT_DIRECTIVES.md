# Diretrizes Operacionais do Agente Bet IA

Este documento estabelece as regras fundamentais e invariáveis para o comportamento do robô dentro do ecossistema Bet IA. Qualquer alteração no código do módulo `robo` deve respeitar estes princípios.

## 1. Soberania Visual (Visual-First)
O robô opera primariamente através do `VisualIdService`. A detecção de contexto (Login, Bac Bo, Aviator) deve ser baseada em padrões visuais e elementos do DOM, agindo como uma camada de observação humana.

## 2. Execução Humana (No-API Policy)
**Toda aposta é manual.** O robô não deve se comunicar diretamente com APIs de backend de jogos. A execução de ações ocorre através da simulação de cliques e interações na interface (`BancaView` ou página externa), garantindo que o robô se comporte exatamente como um operador humano.

## 3. Protocolo Tesla (Manual Override)
A segurança do usuário é a prioridade máxima. Qualquer interação manual detectada (cliques do usuário em áreas sensíveis de jogo) deve:
- Interromper imediatamente qualquer `ProposedAction` em curso.
- Colocar o robô em estado `INTERRUPTED` (Stand-by) por um período de segurança (mínimo 10s).
- Registrar a interrupção nos logs neurais para auditoria.

## 4. Governança de Dados
- **Credenciais**: Devem ser consumidas exclusivamente via `AuthContext`. O robô nunca deve armazenar senhas localmente fora do Vault.
- **Gestão de Risco**: O robô deve consultar o `WalletContext` antes de propor qualquer aposta, respeitando limites de saldo e stop-loss configurados pelo usuário.

## 5. Ciclo de Atualização da Extensão
O Dashboard é a fonte da verdade para a distribuição da extensão. 
- O link de download na `HomeView` deve apontar sempre para o arquivo estável mais recente (`/extension/latest.zip`).
- Mudanças críticas no `bridge` ou no `VisualIdService` exigem um incremento de versão e atualização obrigatória do binário disponível para download.

---
*Assinado: Núcleo de Governança Bet IA Studio*
