// background.js — Entry point (ES Module)
// Cada módulo é independente e pode ser atualizado sem tocar nos outros.

import { setupTabTracker } from './modules/background/tab-tracker.js';
import { setupPanelControl } from './modules/background/panel-control.js';
import { setupRelay } from './modules/background/relay.js';
import './modules/background/will-server.js'; // V7 Integration

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Bet IA Background] v3.1.1 instalado.');
});

setupTabTracker();
setupPanelControl();
setupRelay();
