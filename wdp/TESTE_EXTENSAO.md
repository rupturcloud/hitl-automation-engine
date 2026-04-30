# 🧪 Script de Teste - Extensão 2

## Passo 1: Recarregar Extensão

1. Abra `chrome://extensions`
2. Encontre "Will Dados Pro - Bac Bo"
3. Clique no botão **Reload** (ícone de seta circular)

## Passo 2: Recarregar Página

1. Vá para o Betboom (https://betboom.bet.br ou https://betboom.com)
2. Pressione **F5** ou **Ctrl+R** para recarregar

## Passo 3: Executar Testes no Console

Abra o console (F12 ou Cmd+Option+J) e execute cada comando abaixo:

### Teste 1: Verificar se WillDadosRobo carregou
```javascript
console.log('Teste 1: WillDadosRobo');
console.log('typeof WillDadosRobo:', typeof globalThis.WillDadosRobo);
console.log('WillDadosRobo:', globalThis.WillDadosRobo);
```

**Esperado**: `typeof WillDadosRobo: object` (não "undefined")

---

### Teste 2: Verificar se WillDadosAposta carregou
```javascript
console.log('\nTeste 2: WillDadosAposta');
console.log('typeof WillDadosAposta:', typeof globalThis.WillDadosAposta);
console.log('WillDadosAposta.realizarAposta:', typeof globalThis.WillDadosAposta?.realizarAposta);
```

**Esperado**: `typeof WillDadosAposta: object`

---

### Teste 3: Verificar módulos auxiliares
```javascript
console.log('\nTeste 3: Módulos Auxiliares');
console.log('WDPChipCalibrator:', typeof globalThis.WDPChipCalibrator);
console.log('WDPSessionMonitor:', typeof globalThis.WDPSessionMonitor);
console.log('WDPChipCalibrator.obterStatusCalibração():', globalThis.WDPChipCalibrator?.obterStatusCalibração());
```

**Esperado**: Todos "object" (não "undefined")

---

### Teste 4: Verificar status da sessão
```javascript
console.log('\nTeste 4: Status da Sessão');
const status = globalThis.WDPSessionMonitor?.getStatus();
console.log('Status da sessão:', status);
```

**Esperado**: Um objeto com `isAlive: true`, `canBet: true`

---

### Teste 5: Testar clique em chip (manual)
1. No console, execute:
```javascript
console.log('\nTeste 5: Pronto para testar clicks');
console.log('Clique em um chip no painel. Vamos tentar registrar o evento...');

// Escutar cliques de chips
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-value], [data-amount]')) {
    console.log('✓ Clique em chip detectado:', e.target.closest('[data-value], [data-amount]'));
  }
}, true);
```

2. Clique em um chip no painel
3. Verifique se aparece "✓ Clique em chip detectado" no console

---

### Teste 6: Testar clique em área de aposta
```javascript
console.log('\nTeste 6: Testar clique em área de aposta');

// Buscar elementos de aposta
const betAreas = document.querySelectorAll('[class*="player"], [class*="banker"], [class*="tie"], [role="button"]');
console.log('Elementos encontrados:', betAreas.length);
Array.from(betAreas).forEach((el, i) => {
  console.log(`${i}: ${el.className || el.getAttribute('role')} - ${el.textContent?.substring(0, 20)}`);
});
```

**Esperado**: Encontra elementos de aposta (Player, Banker, Tie)

---

### Teste 7: Testar função de aposta
```javascript
console.log('\nTeste 7: Testar função de aposta');
if (globalThis.WillDadosAposta?.realizarAposta) {
  console.log('Testando aposta de 100 em PLAYER...');
  // AVISO: Isso pode fazer uma aposta real! Use com cuidado
  // globalThis.WillDadosAposta.realizarAposta('PLAYER', 100);
  console.log('Comentado - descomente apenas se quiser fazer aposta real');
} else {
  console.log('❌ WillDadosAposta.realizarAposta não encontrado');
}
```

---

## 📊 Resultado Esperado Completo

Se tudo funcionar, você verá:
```
Teste 1: WillDadosRobo
  typeof WillDadosRobo: object
  WillDadosRobo: {...} (com muitas propriedades)

Teste 2: WillDadosAposta
  typeof WillDadosAposta: object
  WillDadosAposta.realizarAposta: function

Teste 3: Módulos Auxiliares
  WDPChipCalibrator: object
  WDPSessionMonitor: object
  WDPChipCalibrator.obterStatusCalibração(): {...}

Teste 4: Status da Sessão
  Status da sessão: {isAlive: true, canBet: true, ...}

Teste 5: ✓ Clique em chip detectado
Teste 6: Elementos encontrados: X
Teste 7: Função de aposta disponível
```

---

## ⚠️ Se Falhar

**Se WillDadosRobo for undefined:**
1. Verifique se não há erros de sintaxe no console (aba Errors)
2. Verifique se `manifest.json` está correto
3. Verifique se `lib/will-dados-robo.js` existe
4. Recarregue a extensão novamente (chrome://extensions → Reload)

**Se cliques não funcionarem:**
1. Verifique se os elementos estão sendo encontrados (Teste 6)
2. Verifique se há erros no console ao clicar
3. Verifique se `realizarAposta.js` carregou corretamente

---

## 🎯 Próximas Ações

1. Execute todos os 7 testes
2. Copie toda a saída do console
3. Me avise quais testes passaram e quais falharam
4. Se falhar, use F12 → Console para ver se há erros em vermelho

**Use este script para testar depois de cada mudança na extensão.**
