// modules/background/state.js
// Estado compartilhado entre os módulos do background.
// Não tem lógica — só dados. Atualizado pelos outros módulos.

export const bgState = {
  activeBancaTabId: null,
  activeBancaFrameId: null,
  activeBancaFrameScore: 0,
  activeBancaFrameUrl: '',
  activeBrowserTabId: null,
  activeBrowserWindowId: null,
  sidePanelIsOpen: false,
  robotState: 'IDLE', // 'IDLE' | 'ANALYZING' | 'PROPOSING' | 'EXECUTING' | 'WAITING'
  lastSyncPayload: null,
  lastHeartbeatAt: 0,
  lastHeartbeatPlatform: null,
  executionLocked: false,
  isDesynced: false,
  manualOverride: false,
  failSafeReason: null,

  // Plataforma detectada na aba ativa
  // Preenchido pelo relay quando o content script avisa que está pronto
  platform: null, // { id, name, url }
  tabGroupId: null,
  lastPlatformLogKey: null,
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
