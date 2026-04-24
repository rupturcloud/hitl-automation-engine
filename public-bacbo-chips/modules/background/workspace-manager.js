// modules/background/workspace-manager.js
// Responsabilidade: Organizar as abas da banca e da extensão em grupos nomeados.
// Estilo "Modo Computador" (inspirado no Claude/Agentic UX).

import { bgState } from './state.js';

export const WORKSPACE_GROUP_TITLE = 'BET IA';
export const WORKSPACE_GROUP_COLOR = 'purple';

const MAX_WORKSPACE_ATTEMPTS = 6;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientTabEditError(error) {
  const message = String(error?.message || error || '');
  return /tabs cannot be edited right now|dragging a tab|user may be dragging/i.test(message);
}

async function groupAndNameTab(tabId) {
  // 1. Cria ou obtém o grupo para a aba da banca.
  const groupId = await chrome.tabs.group({ tabIds: [tabId] });
  bgState.tabGroupId = groupId;

  // 2. Mantém o nome operacional do grupo sem renomear a banca/tela.
  await chrome.tabGroups.update(groupId, {
    title: WORKSPACE_GROUP_TITLE,
    color: WORKSPACE_GROUP_COLOR,
  });

  return groupId;
}

export async function organizeWorkspace(tabId) {
  if (!tabId) return null;

  for (let attempt = 1; attempt <= MAX_WORKSPACE_ATTEMPTS; attempt += 1) {
    try {
      const groupId = await groupAndNameTab(tabId);

      console.log(
        `[Bet IA Workspace] Aba ${tabId} organizada no grupo "${WORKSPACE_GROUP_TITLE}" (ID: ${groupId})`,
      );

      return groupId;
    } catch (error) {
      if (isTransientTabEditError(error) && attempt < MAX_WORKSPACE_ATTEMPTS) {
        const delayMs = 160 * attempt;
        console.warn(
          `[Bet IA Workspace] Chrome ainda está editando/arrastando abas; nova tentativa em ${delayMs}ms ` +
            `(${attempt}/${MAX_WORKSPACE_ATTEMPTS}).`,
        );
        await sleep(delayMs);
        continue;
      }

      if (isTransientTabEditError(error)) {
        console.warn(
          '[Bet IA Workspace] Organização adiada: o Chrome ainda não liberou edição de abas. ' +
            'A próxima ativação da guia tentará novamente.',
        );
        return null;
      }

      console.error('[Bet IA Workspace] Erro ao organizar workspace:', error);
      return null;
    }
  }

  return null;
}

export async function cleanupWorkspace() {
  // Se quisermos remover o grupo ao fechar a extensão, podemos implementar aqui.
  // Mas geralmente é melhor manter o grupo se a banca ainda estiver aberta.
}
