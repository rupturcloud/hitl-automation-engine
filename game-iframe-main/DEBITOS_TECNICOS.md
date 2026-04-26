# Débitos Técnicos — game-iframe-main

Este documento rastreia e prioriza os débitos técnicos conhecidos no projeto. A lista é dividida em categorias de criticidade e impacto, cada item com um score para orientar a correção.

---

## Críticos (Bloqueiam funcionalidade principal)

**1. StrategyEngine é um stub vazio**
- **Local:** `src/strategy_engine.py:20-24`
- **Problema:** A lógica de decisão é um placeholder que sempre retorna o primeiro padrão encontrado, sem qualquer análise.
- **Impacto:** O núcleo de decisão do sistema é inexistente. Nenhuma estratégia real é aplicada.
- **Priorização:**
  - **Impacto: 5/5 (Crítico)** - Bloqueia completamente a funcionalidade principal de tomada de decisão.
  - **Esforço: 4/5 (Alto)** - Requer a implementação da lógica de negócio central, que é complexa.
  - **Score: Crítico**

**2. Patterns Incompletos**
- **Local:** `src/patterns.py:7-11`
- **Problema:** Apenas 3 de 18 padrões documentados foram definidos, e a confiança é sempre 1.0.
- **Impacto:** A base de conhecimento para a tomada de decisão é insuficiente e irrealista.
- **Priorização:**
  - **Impacto: 5/5 (Crítico)** - Sem padrões, a `StrategyEngine` (mesmo que implementada) não tem o que processar.
  - **Esforço: 3/5 (Médio)** - Requer pesquisa e definição dos padrões, mas a implementação é repetitiva.
  - **Score: Crítico**

**3. Seletor CSS Inválido na Extração de Saldo**
- **Local:** `extension/content.js:132`
- **Problema:** `document.querySelectorAll('[data-*]')` é uma sintaxe de seletor CSS inválida.
- **Impacto:** A "Estratégia 4" de extração de saldo nunca executa, falhando silenciosamente.
- **Priorização:**
  - **Impacto: 4/5 (Alto)** - Impede a captura do saldo em certos cenários, corrompendo um dado de entrada vital.
  - **Esforço: 1/5 (Trivial)** - A correção é uma única linha de código para usar um seletor válido.
  - **Score: Crítico**

**4. Saldo do Daemon é Fixo (Hardcoded)**
- **Local:** `daemon_simplified.py` (e lógica implícita)
- **Problema:** O daemon opera com um saldo fixo, ignorando o valor real extraído pela extensão.
- **Impacto:** O daemon opera com dados falsos, tornando suas decisões e logs desalinhados com a realidade.
- **Priorização:**
  - **Impacto: 5/5 (Crítico)** - O cérebro do sistema está cego para o estado financeiro real, invalidando qualquer gestão de banca.
  - **Esforço: 3/5 (Médio)** - Requer adicionar uma nova mensagem no WebSocket e lógica em ambos, backend e extensão.
  - **Score: Crítico**

**5. Deserialização de `RoundRecord` Quebrada**
- **Local:** `src/schemas.py:208`
- **Problema:** A função `round_record_from_json` falha porque os campos aninhados chegam como `dict` em vez de `dataclasses`.
- **Impacto:** A funcionalidade de replay de sessões, crucial para depuração e análise, não funciona.
- **Priorização:**
  - **Impacto: 4/5 (Alto)** - Bloqueia uma ferramenta de desenvolvimento e análise de alta importância.
  - **Esforço: 2/5 (Baixo)** - Requer a implementação de uma função de "hidratação" recursiva, um problema bem definido.
  - **Score: Alto**

---

## Arquiteturais (Degradam a confiabilidade e manutenibilidade)

**6. Arquitetura de "Dois Browsers"**
- **Local:** `src/core_loop.py:134-138`
- **Problema:** O daemon usa um browser Playwright separado do Chrome do usuário, resultando em estados potencialmente dessincronizados.
- **Impacto:** A reconciliação de dados é fundamentalmente não confiável, minando a integridade de todo o sistema.
- **Priorização:**
  - **Impacto: 5/5 (Crítico)** - A premissa de observar o jogo real é quebrada.
  - **Esforço: 5/5 (Muito Alto)** - Requer uma refatoração arquitetural massiva para controlar o browser do usuário.
  - **Score: Alto** (Apesar do impacto crítico, o esforço gigante o torna um item de longo prazo).

**7. Validação Pós-Aposta Inútil**
- **Local:** `src/bet_executor.py:213-217`
- **Problema:** A verificação pós-aposta é um teste trivial que não confirma se a aposta foi realmente registrada.
- **Impacto:** Risco de perda financeira, pois o sistema pode acreditar que uma aposta foi feita quando na verdade falhou.
- **Priorização:**
  - **Impacto: 5/5 (Crítico)** - Potencial de impacto financeiro direto.
  - **Esforço: 3/5 (Médio)** - Requer a implementação de uma lógica de verificação visual/DOM mais robusta.
  - **Score: Alto**

**8. Comando "start" é Ignorado (No-Op)**
- **Local:** `src/websocket_server.py:123`
- **Problema:** O comando "start" enviado pela UI é ignorado pelo backend.
- **Impacto:** Quebra a experiência do usuário e a funcionalidade básica de controle.
- **Priorização:**
  - **Impacto: 3/5 (Médio)** - Frustrante para o usuário, mas não corrompe dados.
  - **Esforço: 1/5 (Trivial)** - Adicionar a chamada de função correspondente no handler.
  - **Score: Médio**

**9. Supressão Silenciosa de Erros Críticos**
- **Local:** `src/bet_executor.py:193`
- **Problema:** Um bloco `except: pass` genérico mascara qualquer erro durante a confirmação da aposta.
- **Impacto:** Falhas críticas na execução da aposta são invisíveis, dificultando a depuração de problemas graves.
- **Priorização:**
  - **Impacto: 4/5 (Alto)** - Impede a detecção de falhas que podem ter impacto financeiro.
  - **Esforço: 1/5 (Trivial)** - Substituir o `pass` por um log de erro adequado e tratamento.
  - **Score: Alto**

**10. Múltiplos Daemons Concorrentes**
- **Local:** `daemon_simplified.py` (raiz) e `src/daemon.py`
- **Problema:** Dois pontos de entrada de daemon com responsabilidades sobrepostas criam ambiguidade.
- **Impacto:** Dificulta a manutenção, depuração e o entendimento do fluxo de execução canônico.
- **Priorização:**
  - **Impacto: 3/5 (Médio)** - Confusão de desenvolvimento, risco de executar o processo errado.
  - **Esforço: 2/5 (Baixo)** - Decidir qual é o principal e remover ou refatorar o outro.
  - **Score: Médio**

**11. ROIs Fixos e Sem Validação**
- **Local:** `src/config.py:11-17`
- **Problema:** As coordenadas para extração visual são fixas, falhando silenciosamente em diferentes resoluções de tela.
- **Impacto:** A extração visual, uma fonte primária de dados, é completamente não confiável para a maioria dos usuários.
- **Priorização:**
  - **Impacto: 4/5 (Alto)** - Quebra a funcionalidade principal para qualquer pessoa que não use a resolução exata.
  - **Esforço: 3/5 (Médio)** - Requer integrar o script de calibração existente ao fluxo principal do daemon.
  - **Score: Alto**

---

## Qualidade de Código e Boas Práticas

**12. Regex Frágil para Extração de Saldo**
- **Local:** `extension/content.js` (Estratégia 2)
- **Problema:** A regex é muito permissiva e pode capturar qualquer número na página como sendo o saldo.
- **Impacto:** Alta probabilidade de extrair um "saldo" incorreto, corrompendo dados de entrada.
- **Priorização:**
  - **Impacto: 3/5 (Médio)** - Pode levar a decisões erradas se um valor incorreto for capturado.
  - **Esforço: 2/5 (Baixo)** - Requer aprimorar a expressão regular para ser mais específica.
  - **Score: Médio**

**13. `extractRoundId()` Ineficaz**
- **Local:** `extension/content.js:160-165`
- **Problema:** A regex raramente encontra um ID de rodada, tornando o campo `roundId` quase sempre inútil.
- **Impacto:** Dificulta o rastreamento e a reconciliação de dados para depuração e análise.
- **Priorização:**
  - **Impacto: 3/5 (Médio)** - Perda de uma importante capacidade de auditoria.
  - **Esforço: 2/5 (Baixo)** - Requer encontrar um método mais confiável (seletor, outra fonte) para extrair o ID.
  - **Score: Médio**

**14. Sem Persistência no Popup da Extensão**
- **Local:** `extension/popup.js`
- **Problema:** O estado da extensão é perdido sempre que o popup é fechado.
- **Impacto:** Experiência de usuário ruim, exigindo que o usuário reconfigure ou perca o contexto a cada interação.
- **Priorização:**
  - **Impacto: 2/5 (Baixo)** - É um incômodo de usabilidade, mas não afeta a lógica principal.
  - **Esforço: 2/5 (Baixo)** - Implementar o uso da API `chrome.storage` é relativamente simples.
  - **Score: Baixo**

**15. Cobertura de Testes Insuficiente**
- **Local:** `tests/`
- **Problema:** Os fluxos críticos de negócio não possuem testes automatizados.
- **Impacto:** Alto risco de regressões. Mudanças se tornam perigosas e lentas devido à necessidade de testes manuais.
- **Priorização:**
  - **Impacto: 4/5 (Alto)** - Afeta a velocidade e a segurança do desenvolvimento a longo prazo.
  - **Esforço: 5/5 (Muito Alto)** - Escrever um conjunto de testes abrangente é um esforço contínuo e significativo.
  - **Score: Médio** (Deve ser abordado de forma incremental).

---

## Débitos Sutis (Invisíveis)

**16. Risco de Race Condition no `StateReconciler`**
- **Local:** `src/state_reconciler.py`
- **Problema:** O estado interno é modificado sem locks, o que pode causar problemas em futuras arquiteturas multi-threaded.
- **Impacto:** Risco de estado corrompido e comportamento errático sob carga.
- **Priorização:**
  - **Impacto: 2/5 (Baixo)** - Não é um problema na arquitetura atual (asyncio single-thread), mas é uma armadilha para o futuro.
  - **Esforço: 2/5 (Baixo)** - Adicionar locks quando/se a arquitetura mudar.
  - **Score: Baixo**

**17. Risco de Processo "Zumbi" do Browser**
- **Local:** `src/core_loop.py`
- **Problema:** A falta de tratamento para sinais de terminação do sistema (ex: `SIGTERM`) pode deixar processos do browser órfãos.
- **Impacto:** Vazamento de recursos (memória, CPU) que pode degradar a performance do sistema ao longo do tempo.
- **Priorização:**
  - **Impacto: 3/5 (Médio)** - Problema de estabilidade a longo prazo em ambientes de produção.
  - **Esforço: 2/5 (Baixo)** - Adicionar handlers de sinal para garantir o `cleanup`.
  - **Score: Médio**

**18. Ausência de Heartbeat no WebSocket**
- **Local:** `src/websocket_server.py`
- **Problema:** O servidor não detecta proativamente conexões mortas.
- **Impacto:** Vazamento de recursos no servidor e envio de mensagens para clientes que não estão mais ouvindo.
- **Priorização:**
  - **Impacto: 3/5 (Médio)** - Afeta a robustez e a eficiência da comunicação em tempo real.
  - **Esforço: 3/5 (Médio)** - Requer implementação da lógica de ping/pong no cliente e no servidor.
  - **Score: Médio**

**19. Deserialização de Dados Excessivamente Confiante**
- **Local:** `src/schemas.py`
- **Problema:** A deserialização de JSON não valida a estrutura ou os tipos dos dados recebidos.
- **Impacto:** Uma mensagem malformada pode travar o daemon, resultando em uma vulnerabilidade de negação de serviço (DoS).
- **Priorização:**
  - **Impacto: 4/5 (Alto)** - Risco de segurança e estabilidade.
  - **Esforço: 3/5 (Médio)** - Requer a integração de uma biblioteca de validação como Pydantic.
  - **Score: Alto**

**20. `MutationObserver` Ineficiente e de Alto Custo**
- **Local:** `extension/content.js`
- **Problema:** O observador monitora a página inteira, causando alto consumo de CPU no navegador do usuário.
- **Impacto:** Experiência de usuário degradada, com potencial para causar lentidão na página do cassino.
- **Priorização:**
  - **Impacto: 3/5 (Médio)** - Afeta diretamente a performance sentida pelo usuário.
  - **Esforço: 2/5 (Baixo)** - Requer a identificação de um elemento pai mais específico para monitorar.
  - **Score: Médio**

**21. Falta de Tratamento para Sinais de Encerramento (Graceful Shutdown)**
- **Local:** `src/core_loop.py`
- **Problema:** O processo não lida com `SIGTERM`, impedindo um encerramento limpo.
- **Impacto:** Risco de perda de dados (último round não salvo) e vazamento de recursos (browser não fechado).
- **Priorização:**
  - **Impacto: 4/5 (Alto)** - Essencial para a estabilidade e integridade dos dados em ambientes de produção/automatizados.
  - **Esforço: 2/5 (Baixo)** - Adicionar handlers de sinal é uma tarefa bem documentada em Python.
  - **Score: Alto**
