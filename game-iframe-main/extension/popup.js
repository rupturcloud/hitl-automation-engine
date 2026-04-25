/**
 * J.A.R.V.I.S. Extension - Popup Controller
 * Gerencia comunicação com daemon via WebSocket e atualização de UI
 */

class PopupController {
    constructor() {
        this.ws = null;
        this.daemonUrl = 'ws://localhost:8765';
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 2000;
        this.countdownInterval = null;
        this.lastCountdown = 0;

        this.initializeElements();
        this.attachEventListeners();
        this.loadConfiguration();
        this.attemptConnection();
    }

    initializeElements() {
        // Status
        this.elements = {
            connectionStatus: document.getElementById('connectionStatus'),
            statusDot: document.getElementById('statusDot'),
            statusText: document.getElementById('statusText'),
            stateValue: document.getElementById('stateValue'),
            modeValue: document.getElementById('modeValue'),
            bankrollValue: document.getElementById('bankrollValue'),
            roundValue: document.getElementById('roundValue'),

            // Countdown
            countdownText: document.getElementById('countdownText'),
            countdownProgress: document.getElementById('countdownProgress'),

            // Alertas
            alertsList: document.getElementById('alertsList'),

            // Botões de controle daemon
            btnStart: document.getElementById('btnStart'),
            btnPause: document.getElementById('btnPause'),
            btnResume: document.getElementById('btnResume'),
            btnStop: document.getElementById('btnStop'),
            btnSaveConfig: document.getElementById('btnSaveConfig'),

            // Controle remoto - Chips
            chips: {
                5: document.getElementById('chip5'),
                10: document.getElementById('chip10'),
                25: document.getElementById('chip25'),
                50: document.getElementById('chip50'),
                100: document.getElementById('chip100'),
                500: document.getElementById('chip500'),
            },

            // Controle remoto - Controles
            btnReduce: document.getElementById('btnReduce'),
            btnDouble: document.getElementById('btnDouble'),
            betDisplay: document.getElementById('betDisplay'),

            // Controle remoto - Seleção de lado
            sideBlue: document.getElementById('sideBlue'),
            sideRed: document.getElementById('sideRed'),
            sideTie: document.getElementById('sideTie'),

            // Controle remoto - Confirmar/Limpar
            btnConfirmBet: document.getElementById('btnConfirmBet'),
            btnClearBet: document.getElementById('btnClearBet'),

            // Modal (mantido para compatibilidade)
            modal: document.getElementById('manualModal'),
            modalClose: document.getElementById('modalClose'),
            modalCancel: document.getElementById('modalCancel'),
            modalSubmit: document.getElementById('modalSubmit'),
            manualSide: document.getElementById('manualSide'),
            manualStake: document.getElementById('manualStake'),

            // Configuração
            daemonUrl: document.getElementById('daemonUrl'),
        };

        // Estado do controle remoto
        this.remoteState = {
            selectedChip: null,
            selectedSide: null,
            betAmount: 0,
        };

        // Histórico de rodadas (para probabilidades)
        this.roundHistory = {
            blue: 0,
            red: 0,
            tie: 0,
            total: 0,
        };

        // Histórico de bolinhas (visualização)
        this.ballsHistory = [];
        this.currentRound = {
            bet: null,
            side: null,
            amount: null,
            result: null,
        };

        // Probability para borda dourada
        this.currentProbabilities = { blue: 0, red: 0, tie: 0 };
    }

    attachEventListeners() {
        // Botões de controle daemon
        this.elements.btnStart.addEventListener('click', () => this.sendCommand('start'));
        this.elements.btnPause.addEventListener('click', () => this.sendCommand('pause'));
        this.elements.btnResume.addEventListener('click', () => this.sendCommand('resume'));
        this.elements.btnStop.addEventListener('click', () => this.sendCommand('stop'));

        // CONTROLE REMOTO - CHIPS
        Object.entries(this.elements.chips).forEach(([value, element]) => {
            element.addEventListener('click', () => this.selectChip(parseInt(value), element));
        });

        // CONTROLE REMOTO - REDUZIR / DOBRAR
        this.elements.btnReduce.addEventListener('click', () => this.reduceBet());
        this.elements.btnDouble.addEventListener('click', () => this.doubleBet());

        // CONTROLE REMOTO - SELEÇÃO DE LADO
        this.elements.sideBlue.addEventListener('click', () => this.selectSide('BLUE'));
        this.elements.sideRed.addEventListener('click', () => this.selectSide('RED'));
        this.elements.sideTie.addEventListener('click', () => this.selectSide('TIE'));

        // CONTROLE REMOTO - CONFIRMAR / LIMPAR
        this.elements.btnConfirmBet.addEventListener('click', () => this.confirmBet());
        this.elements.btnClearBet.addEventListener('click', () => this.clearBet());

        // Configuração
        this.elements.btnSaveConfig.addEventListener('click', () => this.saveConfiguration());

        // Modal (mantido para compatibilidade)
        if (this.elements.modal) {
            this.elements.modalClose.addEventListener('click', () => this.closeManualModal());
            this.elements.modalCancel.addEventListener('click', () => this.closeManualModal());
            this.elements.modalSubmit.addEventListener('click', () => this.submitManualEntry());

            // Fechar modal ao clicar fora
            this.elements.modal.addEventListener('click', (e) => {
                if (e.target === this.elements.modal) {
                    this.closeManualModal();
                }
            });
        }
    }

    loadConfiguration() {
        chrome.storage.local.get(['daemonUrl'], (result) => {
            if (result.daemonUrl) {
                this.daemonUrl = result.daemonUrl;
                this.elements.daemonUrl.value = this.daemonUrl;
            }
        });
    }

    saveConfiguration() {
        this.daemonUrl = this.elements.daemonUrl.value.trim();
        if (!this.daemonUrl) {
            this.daemonUrl = 'ws://localhost:8765';
        }

        chrome.storage.local.set({ daemonUrl: this.daemonUrl }, () => {
            this.showAlert('Configuração salva!', 'info');
            // Reconectar com nova URL
            this.reconnect();
        });
    }

    attemptConnection() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.setStatus('disconnected', 'Conexão falhou');
            return;
        }

        this.setStatus('connecting', 'Conectando...');

        try {
            this.ws = new WebSocket(this.daemonUrl);

            this.ws.onopen = () => {
                this.resetReconnectAttempts();
                this.setStatus('connected', 'Conectado');
                this.requestStatus();
            };

            this.ws.onmessage = (event) => {
                this.handleMessage(JSON.parse(event.data));
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.setStatus('error', 'Erro na conexão');
            };

            this.ws.onclose = () => {
                this.setStatus('disconnected', 'Desconectado');
                this.scheduleReconnect();
            };
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.setStatus('error', 'Erro: URL inválida?');
            this.scheduleReconnect();
        }
    }

    scheduleReconnect() {
        this.reconnectAttempts++;
        setTimeout(() => this.attemptConnection(), this.reconnectDelay);
    }

    reconnect() {
        if (this.ws) {
            this.ws.close();
        }
        this.reconnectAttempts = 0;
        this.attemptConnection();
    }

    resetReconnectAttempts() {
        this.reconnectAttempts = 0;
    }

    setStatus(status, text) {
        this.elements.statusDot.className = 'status-dot';
        this.elements.statusText.textContent = text;

        switch (status) {
            case 'connected':
                this.elements.statusDot.classList.add('connected');
                break;
            case 'error':
                this.elements.statusDot.classList.add('error');
                break;
            case 'connecting':
                // Pulsing (default)
                break;
            default:
                // Desconectado (default)
                break;
        }
    }

    sendCommand(command) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.showAlert('Não conectado ao daemon', 'critical');
            return;
        }

        const msg = {
            type: 'COMMAND',
            command,
            timestamp: new Date().toISOString()
        };

        this.ws.send(JSON.stringify(msg));
    }

    requestStatus() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const msg = {
            type: 'REQUEST_STATUS',
            timestamp: new Date().toISOString()
        };

        this.ws.send(JSON.stringify(msg));
    }

    handleMessage(message) {
        console.log('Received:', message);

        switch (message.type) {
            case 'STATUS_UPDATE':
                this.updateStatus(message.data);
                break;

            case 'ALERT':
                this.handleAlert(message.data);
                break;

            case 'SNAPSHOT_CAPTURED':
                this.updateSnapshot(message.data);
                break;

            case 'ROUND_OPENED':
                this.updateRound(message.round_id);
                break;

            case 'ROUND_CLOSED':
                this.clearRound();
                break;

            case 'COUNTDOWN_UPDATE':
                this.updateCountdown(message.countdown_ms, message.total_ms);
                break;

            case 'EXECUTION_RESULT':
                this.handleExecutionResult(message.data);
                break;

            default:
                console.warn('Unknown message type:', message.type);
        }
    }

    updateStatus(data) {
        // Estado
        if (data.state) {
            this.elements.stateValue.textContent = data.state;
            this.updateButtonStates(data.state);
        }

        // Modo
        if (data.mode) {
            this.elements.modeValue.textContent = data.mode;
        }

        // Saldo
        if (data.bankroll !== undefined) {
            this.elements.bankrollValue.textContent = `R$ ${parseFloat(data.bankroll).toFixed(2)}`;
        }
    }

    updateButtonStates(state) {
        const isRunning = state === 'RUNNING';
        const isPaused = state === 'PAUSED';
        const isIdle = state === 'IDLE';

        this.elements.btnStart.disabled = isRunning || isPaused;
        this.elements.btnPause.disabled = !isRunning;
        this.elements.btnResume.disabled = !isPaused;
        this.elements.btnStop.disabled = isIdle;

        // Atualizar controle remoto - habilitado apenas quando RUNNING
        Object.values(this.elements.chips).forEach(chip => {
            chip.disabled = !isRunning;
        });

        this.elements.btnReduce.disabled = !isRunning || this.remoteState.betAmount === 0;
        this.elements.btnDouble.disabled = !isRunning || this.remoteState.betAmount === 0;

        this.elements.sideBlue.disabled = !isRunning;
        this.elements.sideRed.disabled = !isRunning;
        this.elements.sideTie.disabled = !isRunning;

        this.elements.btnConfirmBet.disabled = !isRunning || this.remoteState.betAmount === 0 || this.remoteState.selectedSide === null;
        this.elements.btnClearBet.disabled = this.remoteState.betAmount === 0;
    }

    handleAlert(alertData) {
        const { code, message, severity, technical_details } = alertData;

        const alertItem = document.createElement('div');
        alertItem.className = `alert-item alert-${this.getSeverityClass(severity)}`;
        alertItem.title = technical_details || '';

        const dot = document.createElement('span');
        dot.className = 'alert-dot';

        const text = document.createElement('span');
        text.textContent = `[${code}] ${message}`;

        alertItem.appendChild(dot);
        alertItem.appendChild(text);

        // Adicionar ao topo da lista
        const alertsList = this.elements.alertsList;
        if (alertsList.firstChild) {
            alertsList.insertBefore(alertItem, alertsList.firstChild);
        } else {
            alertsList.appendChild(alertItem);
        }

        // Manter apenas últimos 5 alertas
        while (alertsList.children.length > 5) {
            alertsList.removeChild(alertsList.lastChild);
        }

        // Auto-remover após 10s se não for crítico
        if (severity !== 'CRITICAL') {
            setTimeout(() => {
                if (alertItem.parentNode) {
                    alertItem.parentNode.removeChild(alertItem);
                }
            }, 10000);
        }

        this.showAlert(`${code}: ${message}`, this.getSeverityClass(severity));
    }

    getSeverityClass(severity) {
        switch (severity) {
            case 'CRITICAL': return 'critical';
            case 'WARNING': return 'warning';
            case 'INFO':
            default: return 'info';
        }
    }

    updateSnapshot(data) {
        // Pode ser usada para atualizar indicadores visuais
        console.log('Snapshot:', data);
    }

    updateRound(roundId) {
        this.elements.roundValue.textContent = roundId;
    }

    clearRound() {
        this.elements.roundValue.textContent = '--';
    }

    updateCountdown(current, total) {
        this.lastCountdown = current;

        // Atualizar texto
        const seconds = Math.ceil(current / 1000);
        this.elements.countdownText.textContent = seconds;

        // Atualizar progresso circular
        const percentage = 1 - (current / total);
        const circumference = 282.7; // 2 * π * 45
        const offset = circumference * (1 - percentage);
        this.elements.countdownProgress.style.strokeDashoffset = offset;
    }

    handleExecutionResult(data) {
        if (data.status === 'SUCCESS') {
            this.showAlert(`Execução confirmada: ${data.side} R$${data.stake}`, 'info');
        } else {
            this.showAlert(`Execução falhou: ${data.error_message}`, 'critical');
        }
    }

    openManualModal() {
        this.elements.modal.classList.add('active');
        this.elements.manualSide.focus();
    }

    closeManualModal() {
        this.elements.modal.classList.remove('active');
        this.elements.manualSide.value = '';
        this.elements.manualStake.value = '';
    }

    submitManualEntry() {
        const side = this.elements.manualSide.value.trim();
        const stake = parseFloat(this.elements.manualStake.value);

        // Validação
        if (!side) {
            this.showAlert('Selecione um lado (BLUE/RED/TIE)', 'warning');
            return;
        }

        if (!stake || stake <= 0) {
            this.showAlert('Valor deve ser maior que 0', 'warning');
            return;
        }

        if (stake % 5 !== 0) {
            this.showAlert('Use múltiplos de 5 (5, 10, 15, ...)', 'warning');
            return;
        }

        if (stake > 10000) {
            this.showAlert('Máximo R$ 10.000 por aposta', 'critical');
            return;
        }

        // Enviar comando
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.showAlert('Não conectado ao daemon', 'critical');
            return;
        }

        const msg = {
            type: 'MANUAL_COMMAND',
            side,
            stake,
            timestamp: new Date().toISOString()
        };

        this.ws.send(JSON.stringify(msg));
        this.closeManualModal();
        this.showAlert(`Aposta ${side} R$${stake} enviada!`, 'info');
    }

    // ========== CONTROLE REMOTO - MÉTODOS ==========

    selectChip(value, element) {
        if (element.disabled) return;

        // Remover seleção anterior
        Object.values(this.elements.chips).forEach(chip => {
            chip.classList.remove('selected');
        });

        // Selecionar novo chip
        element.classList.add('selected');
        this.remoteState.selectedChip = value;
        this.remoteState.betAmount = value;
        this.updateBetDisplay();
        this.updateCurrentRound();
    }

    reduceBet() {
        if (this.remoteState.betAmount <= 0) return;

        const halfValue = Math.max(5, Math.floor(this.remoteState.betAmount / 2));
        if (halfValue % 5 !== 0) {
            this.remoteState.betAmount = Math.floor(halfValue / 5) * 5;
        } else {
            this.remoteState.betAmount = halfValue;
        }

        if (this.remoteState.betAmount < 5) {
            this.remoteState.betAmount = 5;
        }

        this.updateBetDisplay();
        this.updateCurrentRound();
    }

    doubleBet() {
        if (this.remoteState.betAmount <= 0) return;

        this.remoteState.betAmount *= 2;

        if (this.remoteState.betAmount > 10000) {
            this.remoteState.betAmount = 10000;
        }

        this.updateBetDisplay();
        this.updateCurrentRound();
    }

    selectSide(side) {
        const buttons = {
            'BLUE': this.elements.sideBlue,
            'RED': this.elements.sideRed,
            'TIE': this.elements.sideTie,
        };

        if (buttons[side].disabled) return;

        // Remover seleção anterior
        Object.values(buttons).forEach(btn => btn.classList.remove('selected'));

        // Selecionar novo lado
        buttons[side].classList.add('selected');
        this.remoteState.selectedSide = side;

        // Atualizar bolinha da rodada atual
        this.updateCurrentRound();

        // Atualizar botão de confirmar
        this.updateConfirmButton();
    }

    updateBetDisplay() {
        this.elements.betDisplay.textContent = `R$ ${this.remoteState.betAmount}`;
        this.updateConfirmButton();
    }

    updateConfirmButton() {
        const canConfirm = this.remoteState.betAmount > 0 && this.remoteState.selectedSide !== null;
        this.elements.btnConfirmBet.disabled = !canConfirm;
        this.elements.btnClearBet.disabled = this.remoteState.betAmount === 0;
    }

    confirmBet() {
        const { selectedSide, betAmount } = this.remoteState;

        if (!selectedSide || betAmount <= 0) {
            this.showAlert('Selecione lado e valor', 'warning');
            return;
        }

        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.showAlert('Sem conexão com daemon', 'critical');
            return;
        }

        const msg = {
            type: 'MANUAL_COMMAND',
            side: selectedSide,
            stake: betAmount,
            timestamp: new Date().toISOString()
        };

        this.ws.send(JSON.stringify(msg));
        this.showAlert(`✅ ${selectedSide} R$${betAmount} enviado!`, 'info');
        this.clearBet();
    }

    clearBet() {
        // Limpar estado
        this.remoteState.selectedChip = null;
        this.remoteState.selectedSide = null;
        this.remoteState.betAmount = 0;

        // Remover seleções visuais
        Object.values(this.elements.chips).forEach(chip => {
            chip.classList.remove('selected');
        });
        Object.values([this.elements.sideBlue, this.elements.sideRed, this.elements.sideTie]).forEach(btn => {
            btn.classList.remove('selected');
        });

        // Atualizar display
        this.elements.betDisplay.textContent = 'R$ 0';
        this.updateCurrentRound();
        this.updateConfirmButton();
    }

    // ========== FIM CONTROLE REMOTO ==========

    // ========== PROBABILIDADES (HISTÓRICO) ==========

    updateProbabilities(blueCount, redCount, tieCount) {
        // Atualizar histórico
        this.roundHistory = {
            blue: blueCount,
            red: redCount,
            tie: tieCount,
            total: blueCount + redCount + tieCount,
        };

        // Salvar para usar na borda da bolinha
        this.currentProbabilities = {
            blue: blueCount,
            red: redCount,
            tie: tieCount,
        };

        // Calcular percentuais
        const total = this.roundHistory.total || 1;
        const bluePercent = Math.round((blueCount / total) * 100);
        const redPercent = Math.round((redCount / total) * 100);
        const tiePercent = Math.round((tieCount / total) * 100);

        // Atualizar barra
        const probBlue = document.getElementById('probBlue');
        const probRed = document.getElementById('probRed');
        const probTie = document.getElementById('probTie');

        if (probBlue) {
            probBlue.style.width = `${bluePercent}%`;
            const percBlue = probBlue.querySelector('.prob-percentage');
            const labelBlue = probBlue.querySelector('.prob-label');
            if (percBlue) percBlue.textContent = `${bluePercent}%`;
            if (labelBlue) labelBlue.textContent = 'JOGADOR';
        }

        if (probRed) {
            probRed.style.width = `${redPercent}%`;
            const percRed = probRed.querySelector('.prob-percentage');
            const labelRed = probRed.querySelector('.prob-label');
            if (percRed) percRed.textContent = `${redPercent}%`;
            if (labelRed) labelRed.textContent = 'BANCA';
        }

        if (probTie) {
            probTie.style.width = `${tiePercent}%`;
            const percTie = probTie.querySelector('.prob-percentage');
            const labelTie = probTie.querySelector('.prob-label');
            if (percTie) percTie.textContent = `${tiePercent}%`;
            if (labelTie) labelTie.textContent = 'EMPATE';
        }

        // Atualizar stats (abaixo da barra)
        const statBlue = document.getElementById('statBlue');
        const statRed = document.getElementById('statRed');
        const statTie = document.getElementById('statTie');

        if (statBlue) statBlue.textContent = `${bluePercent}%`;
        if (statRed) statRed.textContent = `${redPercent}%`;
        if (statTie) statTie.textContent = `${tiePercent}%`;

        console.log(`[Probabilidade] JOGADOR: ${bluePercent}% | BANCA: ${redPercent}% | EMPATE: ${tiePercent}%`);
    }

    // ========== FIM PROBABILIDADES ==========

    // ========== HISTÓRICO DE BOLINHAS ==========

    initializeRoundsBalls() {
        // Inicializar histórico vazio
        this.ballsHistory = [];
        this.updateRoundsBalls();
        this.attachScrollButtons();
    }

    addHistoryBall(result, userBet = null, userAmount = null) {
        // Adicionar bolinha ao histórico
        const ball = {
            result: result, // 'BLUE', 'RED', 'TIE'
            userBet: userBet, // se apostou
            userAmount: userAmount, // quanto apostou
            won: userBet === result, // se ganhou
        };
        this.ballsHistory.push(ball);
        this.updateRoundsBalls();
        this.scrollToLatest();
    }

    updateRoundsBalls() {
        const container = document.getElementById('roundsHistory');
        if (!container) return;

        container.innerHTML = '';

        // Renderizar histórico
        this.ballsHistory.forEach((ball, index) => {
            const ballEl = this.createHistoryBall(ball);
            container.appendChild(ballEl);
        });
    }

    createHistoryBall(ball) {
        const div = document.createElement('div');
        div.className = 'round-ball';

        // Determinar classe CSS
        if (ball.userBet) {
            // Apostou
            const resultColor = this.getColorClass(ball.result);
            div.classList.add(resultColor);

            if (ball.won) {
                div.classList.add('won');
                div.innerHTML = '⭐';
            } else {
                div.classList.add('lost');
                div.innerHTML = `${ball.userAmount}`;
            }
        } else {
            // Não apostou
            const resultColor = this.getColorClass(ball.result);
            div.classList.add(resultColor);
            div.style.opacity = '0.6';
            div.innerHTML = '';
        }

        return div;
    }

    getColorClass(result) {
        switch (result) {
            case 'BLUE': return 'filled-blue';
            case 'RED': return 'filled-red';
            case 'TIE': return 'filled-tie';
            default: return 'filled-blue';
        }
    }

    updateCurrentRound() {
        const ballEl = document.getElementById('currentRoundBall');
        if (!ballEl) return;

        ballEl.innerHTML = '';
        const ball = document.createElement('div');
        ball.className = 'round-ball';

        if (this.remoteState.selectedSide && this.remoteState.betAmount > 0) {
            // Selecionou aposta
            const sideColor = this.getColorClass(this.remoteState.selectedSide);
            ball.classList.add(sideColor, 'selected');
            ball.innerHTML = `${this.remoteState.betAmount}`;
        } else {
            // Aguardando aposta
            const maxProb = Math.max(
                this.currentProbabilities.blue,
                this.currentProbabilities.red,
                this.currentProbabilities.tie
            );

            let mainColor = 'filled-blue';
            if (this.currentProbabilities.red === maxProb) mainColor = 'filled-red';
            else if (this.currentProbabilities.tie === maxProb) mainColor = 'filled-tie';

            ball.classList.add(mainColor, 'empty');
            ball.style.background = 'transparent';
            ball.innerHTML = '◯';
        }

        ballEl.innerHTML = '';
        ballEl.appendChild(ball);
    }

    scrollToLatest() {
        const scroll = document.getElementById('roundsScroll');
        if (scroll) {
            setTimeout(() => {
                scroll.scrollLeft = scroll.scrollWidth;
            }, 0);
        }
    }

    attachScrollButtons() {
        const scrollLeft = document.getElementById('scrollLeft');
        const scrollRight = document.getElementById('scrollRight');
        const scroll = document.getElementById('roundsScroll');

        if (scrollLeft && scroll) {
            scrollLeft.onclick = () => {
                scroll.scrollBy({ left: -100, behavior: 'smooth' });
            };
        }

        if (scrollRight && scroll) {
            scrollRight.onclick = () => {
                scroll.scrollBy({ left: 100, behavior: 'smooth' });
            };
        }
    }

    // ========== FIM HISTÓRICO DE BOLINHAS ==========

    showAlert(message, severity = 'info') {
        // Feedback visual simples (pode ser expandido)
        console.log(`[${severity.toUpperCase()}] ${message}`);
    }
}

// Listener para mensagens do content.js (via background.js)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[Popup] Mensagem recebida:', request.type, request);

    if (window.popupController) {
        switch (request.type) {
            case 'UPDATE_BANKROLL':
                // Atualizar saldo com dados reais da página
                if (request.bankroll) {
                    const bankrollValue = parseFloat(request.bankroll).toFixed(2);
                    window.popupController.elements.bankrollValue.textContent = `R$ ${bankrollValue}`;
                    console.log(`[Popup] ✅ Saldo atualizado: R$ ${bankrollValue}`);
                }

                // Atualizar roundId se fornecido
                if (request.roundId && request.roundId !== 'round-unknown') {
                    window.popupController.elements.roundValue.textContent = request.roundId;
                }

                // Atualizar probabilidades se histórico foi enviado
                if (request.history && request.history.blue !== undefined) {
                    const { blue, red, tie } = request.history;
                    window.popupController.updateProbabilities(blue, red, tie);
                    console.log(`[Popup] ✅ Histórico atualizado: BLUE=${blue}, RED=${red}, TIE=${tie}`);
                }

                sendResponse({ success: true });
                break;

            default:
                sendResponse({ success: false, error: 'Unknown message type' });
        }
    } else {
        sendResponse({ success: false, error: 'PopupController not initialized' });
    }
});

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.popupController = new PopupController();

    // Inicializar histórico de bolinhas
    setTimeout(() => {
        window.popupController.initializeRoundsBalls();
        window.popupController.updateCurrentRound();
    }, 100);
});
