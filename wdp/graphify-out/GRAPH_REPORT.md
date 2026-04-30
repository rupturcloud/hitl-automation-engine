# Graph Report - extensao 4  (2026-04-30)

## Corpus Check
- Corpus is ~18,725 words - fits in a single context window. You may not need a graph.

## Summary
- 190 nodes · 340 edges · 16 communities detected
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Robot Lifecycle & Main Loop|Robot Lifecycle & Main Loop]]
- [[_COMMUNITY_Betting Click Automation|Betting Click Automation]]
- [[_COMMUNITY_Pattern Detection Engine|Pattern Detection Engine]]
- [[_COMMUNITY_WebSocket & Data Bridge|WebSocket & Data Bridge]]
- [[_COMMUNITY_UI Components & Messaging|UI Components & Messaging]]
- [[_COMMUNITY_Configuration & Options|Configuration & Options]]
- [[_COMMUNITY_Session & Frame Management|Session & Frame Management]]
- [[_COMMUNITY_Utility Functions|Utility Functions]]
- [[_COMMUNITY_Error Handling|Error Handling]]
- [[_COMMUNITY_DOM Selectors|DOM Selectors]]
- [[_COMMUNITY_Status Updates|Status Updates]]
- [[_COMMUNITY_Manual Operations|Manual Operations]]
- [[_COMMUNITY_Chip Selection|Chip Selection]]
- [[_COMMUNITY_Betting Pipeline|Betting Pipeline]]
- [[_COMMUNITY_Arena Detection|Arena Detection]]
- [[_COMMUNITY_Bridge Interfaces|Bridge Interfaces]]

## God Nodes (most connected - your core abstractions)
1. `init()` - 10 edges
2. `detectarPadrao()` - 10 edges
3. `cicloPrincipal()` - 9 edges
4. `atualizarAposResultado()` - 8 edges
5. `humanClick()` - 7 edges
6. `selecionarChip()` - 7 edges
7. `clicarNaArea()` - 7 edges
8. `processWebSocketEnvelope()` - 7 edges
9. `adicionarLog()` - 7 edges
10. `Betting Automation Engine` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Selenium Bridge (Disabled)` --semantically_similar_to--> `Betting Automation Engine`  [INFERRED] [semantically similar]
  extensao 4/seleniumBridge.js → extensao 4/realizarAposta.js
- `Pattern Detection Engine` --calls--> `Betting Automation Engine`  [INFERRED]
  extensao 4/lib/will-dados-robo.js → extensao 4/realizarAposta.js
- `Chip Calibration` --shares_data_with--> `Betting Automation Engine`  [INFERRED]
  extensao 4/chipCalibrator.js → extensao 4/realizarAposta.js
- `iFrame Bridge System` --calls--> `Betting Automation Engine`  [INFERRED]
  extensao 4/content.js → extensao 4/realizarAposta.js
- `Product Requirements Document` --rationale_for--> `Shadow Mode (Dry Run)`  [EXTRACTED]
  extensao 4/docs/PRD_EXTENSAO_WILL_DADOS_BACBO.md → extensao 4/content.js

## Hyperedges (group relationships)
- **Betting Execution Workflow** — pattern_detection, hitl_confirmation, realizarAposta_js, shadow_mode [EXTRACTED 0.95]
- **UI State Synchronization** — popup_js, sidepanel_js, background_js, message_routing [EXTRACTED 1.00]
- **Game Data Acquisition Pipeline** — wsbridge_js, bead_road_extraction, sessionMonitor_js, willrobo_js [EXTRACTED 0.90]
- **iFrame Bridge & Multi-Frame Detection** — frame_bridge, content_js, bead_road_extraction, realizarAposta_js [EXTRACTED 0.85]

## Communities

### Community 0 - "Robot Lifecycle & Main Loop"
Cohesion: 0.16
Nodes (23): adicionarLog(), aplicarGale(), atualizarAposResultado(), atualizarConfiguracoes(), clampNumber(), contarCor(), contarStreakFinal(), detectarPadrao() (+15 more)

### Community 1 - "Betting Click Automation"
Cohesion: 0.18
Nodes (17): calcularChipProtecao(), candidatosArea(), clicarNaArea(), criarRastro(), decomporStake(), efeitoClique(), encontrarComRetry(), encontrarPontoNeutro() (+9 more)

### Community 2 - "Pattern Detection Engine"
Cohesion: 0.18
Nodes (13): agendarReconexaoWs(), conectarWebSocketExterno(), obterWsUrlConfigurada(), abrirOverlay(), abrirSidePanel(), atualizar(), calcularTela(), exportarCsv() (+5 more)

### Community 3 - "WebSocket & Data Bridge"
Cohesion: 0.24
Nodes (15): abrirOverlayFlutuante(), activeTab(), atualizar(), carregarConfigPainel(), coletarConfigPainel(), el(), exportarCsv(), inicializarConfigPainel() (+7 more)

### Community 4 - "UI Components & Messaging"
Cohesion: 0.16
Nodes (11): alternarAncoragemOverlay(), aplicarAncoragemOverlay(), cancelarEntradaHitl(), criarHitlOverlay(), criarOverlay(), lerBancaDaTela(), monitorarBancaTela(), onHitlKeyDown() (+3 more)

### Community 5 - "Configuration & Options"
Cohesion: 0.21
Nodes (11): calibrar(), carregarCalibracaoSalva(), detectPlatform(), detectPlatformByWS(), encontrarBetspot(), encontrarBetspots(), encontrarChipsDisponiveis(), encontrarElemento() (+3 more)

### Community 6 - "Session & Frame Management"
Cohesion: 0.27
Nodes (6): detectBalance(), detectBettingStatus(), detectSessionExpiry(), startMonitoring(), updateSessionState(), validateSessionConsistency()

### Community 7 - "Utility Functions"
Cohesion: 0.2
Nodes (10): Bead Road DOM Extraction, Chip Calibration, iFrame Bridge System, Human-in-the-Loop Confirmation, Manual Betting Interface, Pattern Detection Engine, Product Requirements Document, Betting Automation Engine (+2 more)

### Community 8 - "Error Handling"
Cohesion: 0.29
Nodes (8): atualizarOverlay(), calcularUiState(), iniciarBridgeTop(), iniciarObserver(), iniciarWebSocketListener(), init(), instalarCommandListenerNoFrame(), toggleRobo()

### Community 9 - "DOM Selectors"
Cohesion: 0.39
Nodes (8): extractBalanceFromPayload(), extractBettingOpenFromPayload(), extractLatestResultFromPayload(), extractRoadFromPayload(), extractRoundIdFromPayload(), parseWsData(), processWebSocketEnvelope(), walkJson()

### Community 10 - "Status Updates"
Cohesion: 0.33
Nodes (6): cicloPrincipal(), enviarComandoParaFrame(), estaEmFaseDeAposta(), executarApostaNoMelhorFrame(), inferirResultadoMaisRecente(), limparSnapshotsVelhos()

### Community 11 - "Manual Operations"
Cohesion: 0.6
Nodes (3): broadcast(), input_loop(), main()

### Community 12 - "Chip Selection"
Cohesion: 0.7
Nodes (4): aguardarWebSocket(), enviarParaSelenium(), inicializar(), realizarApostaComSelenium()

### Community 13 - "Betting Pipeline"
Cohesion: 0.4
Nodes (5): atualizarIndicacoesDeEntrada(), cellKey(), extrairBeadRoad(), getBestHistory(), publicarSnapshotDoFrame()

### Community 14 - "Arena Detection"
Cohesion: 0.4
Nodes (5): calcularJanelaEntrada(), extrairCountdownApostaDaTela(), getStatus(), isLikelyBacBoPage(), publicarStatusWsExterno()

### Community 15 - "Bridge Interfaces"
Cohesion: 0.4
Nodes (2): Core Robot Logic, WebSocket Interceptor

## Knowledge Gaps
- **4 isolated node(s):** `Session Health Monitor`, `Chip Calibration`, `Selenium Bridge (Disabled)`, `Manual Betting Interface`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Bridge Interfaces`** (5 nodes): `setChk()`, `setVal()`, `options.js`, `Core Robot Logic`, `WebSocket Interceptor`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Betting Automation Engine` connect `Utility Functions` to `UI Components & Messaging`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `Core Robot Logic` connect `Bridge Interfaces` to `UI Components & Messaging`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `Chrome Message Routing` connect `Pattern Detection Engine` to `WebSocket & Data Bridge`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `Session Health Monitor`, `Chip Calibration`, `Selenium Bridge (Disabled)` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._