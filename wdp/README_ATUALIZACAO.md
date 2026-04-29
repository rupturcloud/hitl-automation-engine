# Atualização de Interface - Controle Manual e Semáforo

Diego, adicionei a área de **Operação Manual** e o **Semáforo** diretamente no painel de controle da extensão.

### O que foi implementado:

1. **Semáforo de Força do Sinal:**
   - Adicionado logo acima dos controles, ele atualiza em tempo real conforme o robô lê o histórico (`history`) e calcula as intenções (`scoreP`, `scoreB`, `confianca`).
   - Ele indica **AGUARDANDO** (não há histórico ou jogo fechado), **NÃO INDICADO** (sem consenso forte), **ATENÇÃO** (tem tendência, mas com confiança menor), e **INDICADO** (tendência clara e forte).
   - Mostra a porcentagem exata de confiança e o rateio numérico de pontuação de Azul vs Vermelho.

2. **Operação Manual:**
   - Agora você tem os botões de controle (`AZUL`, `EMPATE`, `VERMELHO`) e valores de ficha (`5`, `10`, `25`, `125`, `500`).
   - Ao selecionar, você arma o ataque.
   - Ao clicar em **APOSTAR**, ele inicia um countdown de proteção de 5 segundos. Durante esse tempo, o botão muda para **CANCELAR** para você abortar, similar ao seu design original do HITL.
   - Assim que o contador zera, o painel despacha o comando direto pro `content.js`, que localiza o **melhor frame** da mesa da Evolution e utiliza as exatas mesmas funções do robô autônomo (Jitter Humano, Move e Click), ou seja, é **100% humanizado e invisível para o Anti-Cheat**, mesmo no controle manual!
   - A aposta passa a ser registrada na base de status e será validada como ganho ou perda de acordo com a API local!

A arquitetura que montamos (Bridge WebSocket + Injeção de JS MV3 + RealizarAposta Humanizado) permitiu plugar esse controle manual reciclando todo o mecanismo de segurança que implementamos nos últimos dias.

**Por favor, vá em `chrome://extensions`, recarregue a extensão e atualize a página da Betboom (F5) para testar os novos controles!**
