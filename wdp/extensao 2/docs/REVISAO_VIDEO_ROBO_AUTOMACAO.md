# Revisão — Vídeo do robô automático Bac Bo

## Ordem correta da jornada visual

1. **Lobby / Aguardando mesa**
   - Mostra o título `Painel de Configuração (Bac Bo)`.
   - Mostra logo e botão único `Ligar` / `Desligar`.
   - Mostra status `Aguardando Padrões do Will...`.
   - Não mostra banca, stake, lucro, meta, stop, logs ou configurações operacionais.

2. **Mesa detectada**
   - A extensão detectou página/iframe provável do Bac Bo.
   - Ainda não libera métricas enquanto o histórico/Bead Road não estiver confiável.

3. **Histórico conectado**
   - A extensão já lê o Caminho de Contas/Bead Road.
   - Só a partir daqui aparecem banca, lucro, stake/gale, meta/stop, logs e configurações.

4. **Analisando padrões**
   - Robô ativo, aguardando os 18 padrões oficiais e heurísticas da transcrição.

5. **Entrada encontrada / simulada / apostada**
   - Em `shadowMode=true`, registra simulação sem clicar.
   - Em `shadowMode=false`, tenta executar clique usando os seletores validados.

6. **Resultado processado**
   - Atualiza lucro, bankroll, gale e status da aposta pendente.

7. **Stop atingido**
   - Para o robô por meta de saldo, meta de lucro, stop loss por saldo ou stop loss por lucro.

## Itens incorporados do vídeo/transcrição

- Stake inicial com faixa operacional **5–150**.
- Gale configurável de **0 até 9**.
- Proteção de empate configurável de **0–150**.
- Meta por saldo alvo, exemplo do vídeo: banca 30k → meta 34k.
- Stop loss por saldo mínimo, exemplo do vídeo: 30k.
- Preservados os 18 padrões oficiais `WMSG-001` a `WMSG-018`.
- Preservadas heurísticas avançadas: xadrez, quebra de xadrez, casadinho, empate ao lado/diagonal, linha devedora, pós-empate, 4 casas, trás para frente e surf.

## Regra de preservação

As funções existentes foram mantidas. As novas regras entram como camadas adicionais de UI/risco/configuração, sem remover o fluxo anterior de detecção, bridge entre iframes, shadow mode, overlay e exportação de logs.
