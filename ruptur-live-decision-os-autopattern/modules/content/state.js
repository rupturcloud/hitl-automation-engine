// modules/content/state.js
// Estado global compartilhado entre todos os módulos de content.
// Nenhum módulo define lógica aqui — só lê e escreve dados.

window.__BETIA = window.__BETIA || {};

window.__BETIA.state = {
  // Overlay
  overlay: null,
  overlayVisible: false,

  // Estado do robô (recebido do Side Panel via background)
  robotState: 'IDLE',
  phase: 'WAIT',
  countdown: 0,
  confidence: 0,

  // Dados por fonte (preenchidos pelos módulos respectivos)
  // Prioridade operacional: viewer/DOM -> vision -> WebSocket complementar.
  wsData: null,
  wsEndpoints: [],
  domData: null,   // Fonte 2: DOM
  visionData: null,// Fonte 3: Vision (screenshot)

  // Dado final fundido (resultado da data-fusion)
  fusedData: null,
  lastFusedAt: 0,

  // Calibração de hotspots de clique
  calibration: {
    active: false,
    stepIndex: 0,
    stepOrder: ['PLAYER', 'TIE', 'BANKER'],
    currentTarget: 'PLAYER',
    points: {},
    profile: null,
    message: null,
    updatedAt: 0,
  },
};

window.__BETIA.getSyncPayload = null;
