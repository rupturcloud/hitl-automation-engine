// lib/will-dados-robo.js
// Core global da extensão. Não usa ES modules para funcionar em content_scripts MV3.
(function () {
  'use strict';

  const COLOR_LABEL = { P: 'Azul / Player', B: 'Vermelho / Banker', T: 'Amarelo / Tie', SKIP: 'Aguardar' };

  const PADROES_OFICIAIS = [
    { id: 'WMSG-001', pattern: ['P','P','P','P','B'], acao: 'B', galeMax: 1, peso: 68, nome: '4 azuis + vermelho' },
    { id: 'WMSG-002', pattern: ['B','B','B','B','P'], acao: 'P', galeMax: 1, peso: 68, nome: '4 vermelhos + azul' },
    { id: 'WMSG-003', pattern: ['P','T','B'], acao: 'B', galeMax: 1, peso: 64, nome: 'azul, empate, vermelho' },
    { id: 'WMSG-004', pattern: ['B','T','P'], acao: 'P', galeMax: 1, peso: 64, nome: 'vermelho, empate, azul' },
    { id: 'WMSG-005', pattern: ['P','P','P','B','B'], acao: 'P', galeMax: 1, peso: 66, nome: '3 azuis + 2 vermelhos' },
    { id: 'WMSG-006', pattern: ['B','B','B','P','P'], acao: 'B', galeMax: 1, peso: 66, nome: '3 vermelhos + 2 azuis' },
    { id: 'WMSG-007', pattern: ['P','P','P','P','P','P','P'], acao: 'B', galeMax: 2, peso: 82, nome: 'streak 7 azuis contra' },
    { id: 'WMSG-008', pattern: ['B','B','B','B','B','B','B'], acao: 'P', galeMax: 2, peso: 82, nome: 'streak 7 vermelhos contra' },
    { id: 'WMSG-009', pattern: ['P','P','B','B','P','B','B'], acao: 'P', galeMax: 1, peso: 62, nome: 'blocos PP BB P BB' },
    { id: 'WMSG-010', pattern: ['B','B','P','P','B','P','P'], acao: 'B', galeMax: 1, peso: 62, nome: 'blocos BB PP B PP' },
    { id: 'WMSG-011', pattern: ['B','P','P','B','B'], acao: 'P', galeMax: 1, peso: 61, nome: 'B PP BB' },
    { id: 'WMSG-012', pattern: ['P','B','B','P','P'], acao: 'B', galeMax: 1, peso: 61, nome: 'P BB PP' },
    { id: 'WMSG-013', pattern: ['T','T','P'], acao: 'B', galeMax: 1, peso: 63, nome: '2 empates + azul' },
    { id: 'WMSG-014', pattern: ['T','T','B'], acao: 'P', galeMax: 1, peso: 63, nome: '2 empates + vermelho' },
    { id: 'WMSG-015', pattern: ['P','B','P','B','P'], acao: 'P', galeMax: 1, peso: 60, nome: 'xadrez azul oficial' },
    { id: 'WMSG-016', pattern: ['B','P','B','P','B'], acao: 'B', galeMax: 1, peso: 60, nome: 'xadrez vermelho oficial' },
    { id: 'WMSG-017', pattern: ['T','P','T','B'], acao: 'P', galeMax: 1, peso: 58, nome: 'T P T B' },
    { id: 'WMSG-018', pattern: ['T','B','T','P'], acao: 'B', galeMax: 1, peso: 58, nome: 'T B T P' }
  ];

  const DEFAULT_CONFIG = {
    bankrollInicial: 30000,
    bankrollAtual: 30000,
    stakeBase: 150,
    stakeMin: 5,
    stakeMax: 150,
    metaLucro: 4000,
    metaSaldoAlvo: 34000,
    stopLoss: 2000,
    stopLossSaldo: 30000,
    maxGales: 2,
    multiplicadorGale: 2,
    protecaoEmpate: true,
    valorProtecao: 10,
    valorProtecaoMax: 150,
    shadowMode: true,
    autoStart: false,
    showOverlay: false,
    minConfianca: 58,
    limiteStakePercentualBankroll: 10,
    padroesAtivos: {
      oficiais18: true,
      xadrez: true,
      quebraXadrez: true,
      casadinho: true,
      empateLado: true,
      linhaDevedora: true,
      posEmpate: true,
      surf: true,
      quatroCasas: true,
      trasParaFrente: true
    }
  };

  const estadoRobo = {
    roboAtivo: false,
    lucroSessao: 0,
    stakeAtual: DEFAULT_CONFIG.stakeBase,
    galeAtual: 0,
    ultimoPadraoId: null,
    ultimoPadraoTexto: '',
    ultimaAcao: 'Inicializado',
    ultimaAposta: null,
    ultimoHistoryHash: '',
    ultimoResultadoProcessadoHash: '',
    config: structuredCloneSafe(DEFAULT_CONFIG),
    logs: []
  };

  function structuredCloneSafe(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getBankrollAtual() {
    return Number(estadoRobo.config.bankrollAtual ?? estadoRobo.config.bankrollInicial ?? 0);
  }

  function setBankrollAtual(valor) {
    estadoRobo.config.bankrollAtual = Math.max(0, Number(valor) || 0);
  }

  function clampNumber(value, min, max, fallback) {
    const n = Number(value);
    const base = Number.isFinite(n) ? n : fallback;
    return Math.min(max, Math.max(min, base));
  }

  function normalizarConfiguracoes(config) {
    const normalized = {
      ...DEFAULT_CONFIG,
      ...config,
      padroesAtivos: {
        ...DEFAULT_CONFIG.padroesAtivos,
        ...(config.padroesAtivos || {})
      }
    };
    normalized.stakeMin = clampNumber(normalized.stakeMin, 1, 150, DEFAULT_CONFIG.stakeMin);
    normalized.stakeMax = clampNumber(normalized.stakeMax, normalized.stakeMin, 150, DEFAULT_CONFIG.stakeMax);
    normalized.stakeBase = clampNumber(normalized.stakeBase, normalized.stakeMin, normalized.stakeMax, DEFAULT_CONFIG.stakeBase);
    normalized.maxGales = Math.round(clampNumber(normalized.maxGales, 0, 9, DEFAULT_CONFIG.maxGales));
    normalized.valorProtecaoMax = clampNumber(normalized.valorProtecaoMax, 0, 150, DEFAULT_CONFIG.valorProtecaoMax);
    normalized.valorProtecao = clampNumber(normalized.valorProtecao, 0, normalized.valorProtecaoMax, DEFAULT_CONFIG.valorProtecao);
    normalized.limiteStakePercentualBankroll = clampNumber(normalized.limiteStakePercentualBankroll, 1, 100, DEFAULT_CONFIG.limiteStakePercentualBankroll);
    normalized.minConfianca = Math.round(clampNumber(normalized.minConfianca, 0, 100, DEFAULT_CONFIG.minConfianca));
    normalized.bankrollInicial = Math.max(0, Number(normalized.bankrollInicial) || DEFAULT_CONFIG.bankrollInicial);
    normalized.bankrollAtual = Math.max(0, Number(normalized.bankrollAtual ?? normalized.bankrollInicial) || normalized.bankrollInicial);
    normalized.metaLucro = Math.max(0, Number(normalized.metaLucro) || 0);
    normalized.metaSaldoAlvo = Math.max(0, Number(normalized.metaSaldoAlvo) || 0);
    normalized.stopLoss = Math.max(0, Number(normalized.stopLoss) || 0);
    normalized.stopLossSaldo = Math.max(0, Number(normalized.stopLossSaldo) || 0);
    return normalized;
  }

  function adicionarLog(tipo, mensagem, detalhes = {}) {
    const entry = {
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      iso: new Date().toISOString(),
      tipo,
      mensagem,
      detalhes,
      bankroll: Math.floor(getBankrollAtual()),
      lucro: Math.floor(estadoRobo.lucroSessao),
      gale: estadoRobo.galeAtual
    };
    estadoRobo.logs.unshift(entry);
    if (estadoRobo.logs.length > 150) estadoRobo.logs.pop();
    estadoRobo.ultimaAcao = mensagem;
    console.log(`[WillDados:${tipo}] ${mensagem}`, detalhes);
    return entry;
  }

  function atualizarConfiguracoes(novaConfig = {}) {
    const anterior = estadoRobo.config;
    const merged = {
      ...anterior,
      ...novaConfig,
      padroesAtivos: {
        ...anterior.padroesAtivos,
        ...(novaConfig.padroesAtivos || {})
      }
    };
    if (novaConfig.bankrollInicial !== undefined && novaConfig.bankrollAtual === undefined) {
      merged.bankrollAtual = Number(novaConfig.bankrollInicial);
    }
    estadoRobo.config = normalizarConfiguracoes(merged);
    estadoRobo.stakeAtual = estadoRobo.config.stakeBase;
    adicionarLog('INFO', 'Configurações atualizadas', { shadowMode: estadoRobo.config.shadowMode });
  }

  async function carregarConfiguracoes() {
    if (!globalThis.chrome?.storage?.local) return estadoRobo.config;
    return new Promise((resolve) => {
      chrome.storage.local.get(['willDadosConfig'], (result) => {
        if (result?.willDadosConfig) atualizarConfiguracoes(result.willDadosConfig);
        resolve(estadoRobo.config);
      });
    });
  }

  function salvarConfiguracoes() {
    if (!globalThis.chrome?.storage?.local) return;
    chrome.storage.local.set({ willDadosConfig: estadoRobo.config });
  }

  function endsWithPattern(seq, pattern) {
    if (!Array.isArray(seq) || seq.length < pattern.length) return false;
    const end = seq.slice(-pattern.length);
    return end.every((v, i) => v === pattern[i]);
  }

  function contarCor(arr, cor) { return arr.filter((v) => v === cor).length; }

  function contarStreakFinal(arr, cor) {
    let count = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === cor) count += 1;
      else break;
    }
    return count;
  }

  function maiorStreak(arr, cor) {
    let max = 0, atual = 0;
    for (const item of arr) {
      if (item === cor) atual += 1;
      else atual = 0;
      max = Math.max(max, atual);
    }
    return max;
  }

  function isXadrez(arr) {
    const clean = arr.filter((v) => v === 'P' || v === 'B');
    if (clean.length < 5) return false;
    return clean.every((v, i, a) => i === 0 || v !== a[i - 1]);
  }

  function isQuebraDeXadrez(arr) {
    const clean = arr.filter((v) => v === 'P' || v === 'B');
    if (clean.length < 5) return false;
    const before = clean.slice(-5, -1);
    const last = clean[clean.length - 1];
    return isXadrez(before) && last === before[before.length - 1];
  }

  function isCasadinho(arr) {
    if (arr.length < 2) return false;
    const a = arr[arr.length - 1];
    const b = arr[arr.length - 2];
    return a !== 'T' && a === b;
  }

  function temEmpateRecente(arr) {
    return arr.slice(-6).includes('T');
  }

  function isQuatroCasasAlternado(arr) {
    const clean = arr.filter((v) => v === 'P' || v === 'B').slice(-4);
    return clean.length === 4 && clean.every((v, i, a) => i === 0 || v !== a[i - 1]);
  }

  function detectarPadrao(history = []) {
    const p = estadoRobo.config.padroesAtivos || DEFAULT_CONFIG.padroesAtivos;
    const seq = history.filter((v) => ['P', 'B', 'T'].includes(v)).slice(-40);
    if (seq.length < 3) {
      return { acao: 'SKIP', motivo: 'Histórico insuficiente', confianca: 0, padraoId: null, galeMax: 0, scoreP: 0, scoreB: 0 };
    }

    const ultimos15 = seq.slice(-15);
    const ultimos8 = seq.slice(-8);
    const ultimos5 = seq.slice(-5);
    const ultimo = seq[seq.length - 1];

    const streakPFinal = contarStreakFinal(seq, 'P');
    const streakBFinal = contarStreakFinal(seq, 'B');

    // Padrões 7 e 8: devem vencer antes do filtro Surf, pois são oficiais de entrada contra.
    if (p.oficiais18) {
      if (streakPFinal >= 7) {
        return { acao: 'B', motivo: `WMSG-007: streak ${streakPFinal} azuis → vermelho`, confianca: 86, padraoId: 'WMSG-007', galeMax: 2, scoreP: 0, scoreB: 86 };
      }
      if (streakBFinal >= 7) {
        return { acao: 'P', motivo: `WMSG-008: streak ${streakBFinal} vermelhos → azul`, confianca: 86, padraoId: 'WMSG-008', galeMax: 2, scoreP: 86, scoreB: 0 };
      }
    }

    if (p.surf && (maiorStreak(ultimos15, 'P') >= 8 || maiorStreak(ultimos15, 'B') >= 8)) {
      return { acao: 'SKIP', motivo: 'SURF: mesa com streak extremo, aguardando', confianca: 92, padraoId: 'SURF', galeMax: 0, scoreP: 0, scoreB: 0 };
    }

    let scoreP = 0;
    let scoreB = 0;
    let galeMax = Number(estadoRobo.config.maxGales) || 1;
    const motivos = [];
    const matches = [];

    if (p.oficiais18) {
      for (const padrao of PADROES_OFICIAIS.filter((x) => !['WMSG-007','WMSG-008'].includes(x.id))) {
        if (endsWithPattern(seq, padrao.pattern)) {
          if (padrao.acao === 'P') scoreP += padrao.peso;
          if (padrao.acao === 'B') scoreB += padrao.peso;
          galeMax = Math.max(galeMax, padrao.galeMax);
          matches.push(padrao.id);
          motivos.push(`${padrao.id}: ${padrao.nome}`);
          // Match oficial exato é forte: pode retornar direto se não houver conflito.
          return {
            acao: padrao.acao,
            motivo: `${padrao.id}: ${padrao.nome} → ${COLOR_LABEL[padrao.acao]}`,
            confianca: Math.min(90, padrao.peso + 10),
            padraoId: padrao.id,
            galeMax: padrao.galeMax,
            scoreP,
            scoreB,
            matches
          };
        }
      }
    }

    if (p.xadrez && isXadrez(ultimos8)) {
      if (ultimo === 'P') scoreB += 45;
      if (ultimo === 'B') scoreP += 45;
      motivos.push('Xadrez');
      matches.push('ADV-XADREZ');
    }

    if (p.quebraXadrez && isQuebraDeXadrez(ultimos8)) {
      if (ultimo === 'P') scoreB += 40;
      if (ultimo === 'B') scoreP += 40;
      motivos.push('Quebra de xadrez');
      matches.push('ADV-QUEBRA-XADREZ');
    }

    if (p.casadinho && isCasadinho(ultimos5)) {
      if (ultimo === 'P') scoreB += 32;
      if (ultimo === 'B') scoreP += 32;
      motivos.push('Casadinho');
      matches.push('ADV-CASADINHO');
    }

    if (p.empateLado && temEmpateRecente(ultimos8)) {
      if (ultimo === 'P') scoreB += 26;
      if (ultimo === 'B') scoreP += 26;
      motivos.push('Empate ao lado/diagonal');
      matches.push('ADV-EMPATE-LADO');
    }

    if (p.linhaDevedora) {
      const diff = contarCor(ultimos15, 'P') - contarCor(ultimos15, 'B');
      if (Math.abs(diff) >= 4) {
        if (diff > 0) scoreB += 24;
        else scoreP += 24;
        motivos.push('Linha devedora');
        matches.push('ADV-LINHA-DEVEDORA');
      }
    }

    if (p.posEmpate && ultimos8[ultimos8.length - 2] === 'T') {
      // Pós-empate isolado é informação de contexto, não decide sozinho.
      scoreP += 10;
      scoreB += 10;
      motivos.push('Pós-empate');
      matches.push('ADV-POS-EMPATE');
    }

    if (p.quatroCasas && isQuatroCasasAlternado(ultimos8)) {
      if (ultimo === 'P') scoreB += 18;
      if (ultimo === 'B') scoreP += 18;
      motivos.push('4 casas alternadas');
      matches.push('ADV-4-CASAS');
    }

    if (p.trasParaFrente) {
      const rev = [...ultimos8].reverse();
      if (rev[0] === 'P' && rev[1] === 'B' && rev[2] === 'B') {
        scoreP += 18;
        motivos.push('Trás para frente P-B-B');
        matches.push('ADV-TRAS-FRENTE');
      } else if (rev[0] === 'B' && rev[1] === 'P' && rev[2] === 'P') {
        scoreB += 18;
        motivos.push('Trás para frente B-P-P');
        matches.push('ADV-TRAS-FRENTE');
      }
    }

    const minConfianca = Number(estadoRobo.config.minConfianca) || 58;
    const diff = Math.abs(scoreP - scoreB);
    const bestScore = Math.max(scoreP, scoreB);
    const confianca = Math.min(88, Math.floor(bestScore + diff * 0.5));

    if (scoreP > scoreB + 18 && confianca >= minConfianca) {
      return { acao: 'P', motivo: motivos.join(' + ') || 'Score Player', confianca, padraoId: matches[0] || 'ADV', galeMax, scoreP, scoreB, matches };
    }
    if (scoreB > scoreP + 18 && confianca >= minConfianca) {
      return { acao: 'B', motivo: motivos.join(' + ') || 'Score Banker', confianca, padraoId: matches[0] || 'ADV', galeMax, scoreP, scoreB, matches };
    }

    return { acao: 'SKIP', motivo: motivos.length ? `Sem consenso: ${motivos.join(' + ')}` : 'Sem padrão assertivo', confianca, padraoId: null, galeMax: 0, scoreP, scoreB, matches };
  }

  function resetarStake() {
    estadoRobo.galeAtual = 0;
    estadoRobo.stakeAtual = clampNumber(
      estadoRobo.config.stakeBase,
      Number(estadoRobo.config.stakeMin) || DEFAULT_CONFIG.stakeMin,
      Number(estadoRobo.config.stakeMax) || DEFAULT_CONFIG.stakeMax,
      DEFAULT_CONFIG.stakeBase
    );
  }

  function aplicarGale(galeMax = estadoRobo.config.maxGales) {
    if (estadoRobo.galeAtual >= galeMax) return false;
    estadoRobo.galeAtual += 1;
    const stakeBase = Number(estadoRobo.config.stakeBase) || DEFAULT_CONFIG.stakeBase;
    const multiplicador = Number(estadoRobo.config.multiplicadorGale) || 2;
    const stakeMax = Number(estadoRobo.config.stakeMax) || DEFAULT_CONFIG.stakeMax;
    estadoRobo.stakeAtual = Math.round(Math.min(stakeMax, stakeBase * Math.pow(multiplicador, estadoRobo.galeAtual)));
    return true;
  }

  function verificarStops() {
    const bankroll = getBankrollAtual();
    const metaLucro = Number(estadoRobo.config.metaLucro) || 0;
    const metaSaldoAlvo = Number(estadoRobo.config.metaSaldoAlvo) || 0;
    const stopLoss = Math.abs(Number(estadoRobo.config.stopLoss) || 0);
    const stopLossSaldo = Number(estadoRobo.config.stopLossSaldo) || 0;

    if (metaSaldoAlvo > 0 && bankroll >= metaSaldoAlvo) {
      estadoRobo.roboAtivo = false;
      adicionarLog('STOP', `Meta de saldo atingida: R$ ${Math.floor(bankroll)}`);
      return { parado: true, motivo: 'STOP_WIN_SALDO' };
    }
    if (metaLucro > 0 && estadoRobo.lucroSessao >= metaLucro) {
      estadoRobo.roboAtivo = false;
      adicionarLog('STOP', `Stop Win atingido: +R$ ${estadoRobo.lucroSessao}`);
      return { parado: true, motivo: 'STOP_WIN_LUCRO' };
    }
    if (stopLossSaldo > 0 && bankroll < stopLossSaldo) {
      estadoRobo.roboAtivo = false;
      adicionarLog('STOP', `Stop Loss por saldo atingido: R$ ${Math.floor(bankroll)}`);
      return { parado: true, motivo: 'STOP_LOSS_SALDO' };
    }
    if (stopLoss > 0 && estadoRobo.lucroSessao <= -stopLoss) {
      estadoRobo.roboAtivo = false;
      adicionarLog('STOP', `Stop Loss atingido: R$ ${estadoRobo.lucroSessao}`);
      return { parado: true, motivo: 'STOP_LOSS_LUCRO' };
    }
    return { parado: false };
  }

  function deveApostar(resultado) {
    if (!resultado || resultado.acao === 'SKIP') return false;
    if (verificarStops().parado) return false;

    if (resultado.padraoId && resultado.padraoId !== estadoRobo.ultimoPadraoId) {
      resetarStake();
      estadoRobo.ultimoPadraoId = resultado.padraoId;
    }

    const bankroll = getBankrollAtual();
    const limitePercentual = Number(estadoRobo.config.limiteStakePercentualBankroll) || 10;
    const limitePercentualStake = Math.max(1, bankroll * (limitePercentual / 100));
    const limiteConfigStake = Number(estadoRobo.config.stakeMax) || DEFAULT_CONFIG.stakeMax;
    const limiteStake = Math.min(limiteConfigStake, limitePercentualStake);
    estadoRobo.stakeAtual = Math.min(Number(estadoRobo.stakeAtual) || estadoRobo.config.stakeBase, limiteStake);

    if (estadoRobo.stakeAtual > bankroll) {
      estadoRobo.roboAtivo = false;
      adicionarLog('RISCO', 'Saldo insuficiente para stake atual', { stake: estadoRobo.stakeAtual, bankroll });
      return false;
    }

    if (resultado.confianca < (Number(estadoRobo.config.minConfianca) || 58)) {
      adicionarLog('SKIP', 'Confiança abaixo do mínimo', { resultado });
      return false;
    }

    return true;
  }

  function registrarAposta(resultado) {
    estadoRobo.ultimaAposta = {
      acao: resultado.acao,
      stake: Number(estadoRobo.stakeAtual),
      padraoId: resultado.padraoId,
      motivo: resultado.motivo,
      gale: estadoRobo.galeAtual,
      galeMax: resultado.galeMax,
      status: 'PENDENTE',
      timestamp: Date.now()
    };
    estadoRobo.ultimoPadraoTexto = resultado.motivo;
    adicionarLog(estadoRobo.config.shadowMode ? 'SIMULACAO' : 'APOSTA', `${estadoRobo.config.shadowMode ? 'Simulação' : 'Aposta'} em ${COLOR_LABEL[resultado.acao]} — R$ ${estadoRobo.stakeAtual}`, resultado);
  }

  function atualizarAposResultado(resultadoFinal) {
    const aposta = estadoRobo.ultimaAposta;
    if (!aposta || aposta.status !== 'PENDENTE') return null;

    const ganhou = resultadoFinal === aposta.acao;
    let delta = 0;
    if (ganhou) {
      delta = aposta.stake;
      resetarStake();
      aposta.status = 'GANHOU';
      adicionarLog('GANHO', `Ganhou R$ ${delta}`, { aposta, resultadoFinal });
    } else if (resultadoFinal === 'T') {
      // Regra do Bac Bo: Player/Banker retorna 90% da aposta em empate.
      const perdaEmpate = Math.round(aposta.stake * 0.10);
      delta = -perdaEmpate;
      resetarStake();
      aposta.status = 'EMPATE';
      adicionarLog('EMPATE', `Empate: perda estimada de 10% (R$ ${perdaEmpate})`, { aposta, resultadoFinal });
    } else {
      delta = -aposta.stake;
      aposta.status = 'PERDEU';
      const aplicou = aplicarGale(aposta.galeMax);
      adicionarLog('PERDA', `Perdeu R$ ${aposta.stake}${aplicou ? ` — Gale ${estadoRobo.galeAtual}` : ' — limite de gale atingido'}`, { aposta, resultadoFinal });
      if (!aplicou) resetarStake();
    }

    setBankrollAtual(getBankrollAtual() + delta);
    estadoRobo.lucroSessao += delta;
    aposta.delta = delta;
    verificarStops();
    salvarConfiguracoes();
    return { ganhou, delta, aposta };
  }

  function exportarLogsCsv() {
    const header = ['iso','timestamp','tipo','mensagem','bankroll','lucro','gale'];
    const rows = estadoRobo.logs.map((l) => header.map((k) => JSON.stringify(l[k] ?? '')).join(','));
    return [header.join(','), ...rows].join('\n');
  }

  globalThis.WillDadosRobo = {
    DEFAULT_CONFIG,
    PADROES_OFICIAIS,
    COLOR_LABEL,
    estadoRobo,
    adicionarLog,
    atualizarConfiguracoes,
    carregarConfiguracoes,
    salvarConfiguracoes,
    detectarPadrao,
    deveApostar,
    registrarAposta,
    atualizarAposResultado,
    resetarStake,
    aplicarGale,
    verificarStops,
    exportarLogsCsv,
    getBankrollAtual,
    setBankrollAtual
  };
})();
