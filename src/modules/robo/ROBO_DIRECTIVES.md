# BET IA | ROBOT_DIRECTIVES (HARD PROTOCOL)

ESTA É UMA DIRETRIZ DE EXECUÇÃO MANDATÓRIA. O NÃO CUMPRIMENTO RESULTA EM SUSPENSÃO IMEDIATA DO AGENTE.

## 1. PROTOCOLO DE SEGURANÇA (TESLA MODE)
- O robô deve operar como um assistente de direção (Autodrive Tesla).
- O humano tem prioridade total e absoluta. Qualquer interação manual na interface (clique, scroll, digitação) deve disparar o `MANUAL_OVERRIDE`.
- Em modo `SEMI_AUTO`, o robô deve aguardar a confirmação explícita ou o fim do countdown para prosseguir.
- Em caso de divergência de dados entre a visão computacional e o estado do sistema, o robô deve entrar em modo `FAIL-SAFE` (parada total).

## 2. SINCRONIZAÇÃO DE DADOS VIVOS (LIVE SYNC)
- O robô nunca deve tomar decisões com base em dados em cache.
- O `useCountdown` é a única fonte de verdade temporal para entradas.
- O `GAME_STATE_UPDATE` deve ser verificado a cada 100ms.
- Se a conexão com a banca cair ou o delay for > 500ms, o robô deve cancelar qualquer aposta pendente.

## 3. CICLO DE EXECUÇÃO (AUTO-RELOAD)
- O robô deve entrar em loop infinito de análise: `Análise -> Decisão -> Execução -> Sync`.
- Após cada rodada (Ganhando ou Perdendo), o robô deve reiniciar o ciclo imediatamente para a próxima oportunidade.
- A gestão de banca (`useWallet`) deve ser consultada antes de cada entrada para garantir que os limites de Stop-Loss e Stop-Win sejam respeitados.

## 4. INTERFACE E FEEDBACK
- Todo log deve ser transparente. O usuário deve saber exatamente *por que* o robô está entrando ou por que cancelou.
- O painel de controle deve permitir a troca de modos (`MANUAL`, `SEMI_AUTO`, `FULL_AUTO`) instantaneamente.

---
**ASSINATURA DE PROTOCOLO:** AGENTE_BET_IA_V2_PRO
**STATUS:** ACTIVE & ENFORCED
