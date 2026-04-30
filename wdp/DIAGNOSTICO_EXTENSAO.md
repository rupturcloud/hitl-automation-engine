# 🔧 Diagnóstico da Extensão 2

## Checklist de Verificação

### 1. Verificar instalação da extensão

```bash
# Verificar que os arquivos existem
ls -la "extensao 2"/*.js
ls -la "extensao 2"/lib/will-dados-robo.js
ls -la "extensao 2"/overlay.html
ls -la "extensao 2"/manifest.json
```

**Esperado**: Todos os arquivos devem existir e ter size > 0

---

### 2. Verificar sintaxe dos arquivos

```bash
cd "extensao 2"
node -c lib/will-dados-robo.js && echo "✓ will-dados-robo.js"
node -c realizarAposta.js && echo "✓ realizarAposta.js"
node -c content.js && echo "✓ content.js"
node -c manifest.json && echo "✓ manifest.json (JSON válido)"
```

**Esperado**: Todos devem retornar OK

---

### 3. Verificar ordem de carregamento simulada

```javascript
// Abrir DevTools → Console

// Teste rápido:
console.log({
  WillDadosRobo: typeof globalThis.WillDadosRobo,
  WillDadosAposta: typeof globalThis.WillDadosAposta,
  WDPChipCalibrator: typeof globalThis.WDPChipCalibrator,
  WDPSessionMonitor: typeof globalThis.WDPSessionMonitor
});
```

**Esperado**: Todos "object", nenhum "undefined"

---

### 4. Verificar erros no console

F12 → Console
- Procure por mensagens em **vermelho** (erros)
- Procure por mensagens em **laranja** (avisos)
- Procure por "não carregado", "undefined", "not a function"

---

### 5. Verificar background service worker

F12 → Application → Service Workers
- Verifique se "Will Dados Pro - Bac Bo" aparece
- Status deve ser "activated and running"

---

### 6. Verificar content scripts injetados

F12 → Sources → Threads (lado esquerdo)
- Procure por "extensao 2" ou "content.js"
- Se não aparecer, os scripts não foram injetados

---

## Passos para Solucionar

### Se WillDadosRobo for undefined:

**Opção 1: Recarregar extensão (mais comum)**
1. Abra chrome://extensions
2. Encontre "Will Dados Pro - Bac Bo"
3. Clique em "Reload" (ícone de seta circular)
4. Recarregue a página (F5)
5. Verifique novamente

**Opção 2: Remover e reinstalar**
1. Abra chrome://extensions
2. Clique em "Remove" (ícone de lixeira)
3. Aguarde 5 segundos
4. Abra chrome://extensions novamente
5. Clique em "Load unpacked"
6. Navegue até "extensao 2"
7. Selecione a pasta e abra
8. Verifique

**Opção 3: Limpar cache**
1. F12 → Application → Clear storage
2. Marque todas as opções
3. Clique em "Clear site data"
4. Recarregue a página

---

### Se houve mudanças no manifest.json:

```bash
# Verificar que manifest.json é JSON válido
node -c manifest.json
# ou
python3 -m json.tool manifest.json > /dev/null && echo "✓ JSON válido"
```

Se retornar erro, há um problema de sintaxe JSON.

---

### Se os content scripts não forem injetados:

1. **Verificar matches no manifest.json:**
   - URL atual: verifique na barra de endereço
   - Exemplo: `https://betboom.bet.br/game/...`
   - Procure no manifest por um pattern que bate: `"https://betboom.bet.br/*"`

2. **Testar um pattern específico:**
   ```json
   "matches": ["<all_urls>"]
   ```
   (Use temporariamente para testar em qualquer URL)

3. **Verificar run_at:**
   - `document_start`: muito cedo, pode não ter DOM ainda
   - `document_end`: melhor, DOM pronto mas não all_frames ainda
   - Ensure `"all_frames": true` para iframes também

---

### Se há erro "Core não carregado":

```javascript
// No console:
console.log('Tempo de carregamento:');
console.log('WillDadosRobo:', globalThis.WillDadosRobo ? '✓ carregado' : '✗ não carregado');
console.log('Arquivos da Entrada 3:', {
  'will-dados-robo.js': typeof globalThis.WillDadosRobo,
  'content.js': 'esperado depois de will-dados-robo.js'
});
```

Se WillDadosRobo não carregou, will-dados-robo.js teve um erro de execução.

---

## Logs para Copiar

Se tudo funcionar, os logs esperados são:

```
[CHIP-CALIBRATOR] Módulo carregado. Use WDPChipCalibrator.calibrar() para calibrar
[SESSION-MONITOR] Módulo carregado. Use WDPSessionMonitor.getStatus()
[SELENIUM-BRIDGE] Módulo carregado
[WILL-DADOS-ROBO] Módulo carregado
[CONTENT] Interface pronta, aguardando página Betboom
```

Se algum estiver faltando, o arquivo não foi injetado.

---

## Testes Rápidos

### Teste A: Módulo está presente?
```javascript
Object.keys(globalThis).filter(k => k.includes('Will') || k.includes('WDP'))
```

### Teste B: Métodos disponíveis?
```javascript
Object.keys(globalThis.WillDadosRobo || {})
```

### Teste C: Pode fazer uma aposta?
```javascript
typeof globalThis.WillDadosAposta?.realizarAposta
```

---

## Se Nada Funcionar

1. Abra a pasta `extensao 2` no editor
2. Verifique que todos os `.js` files existem
3. Verifique que manifest.json é válido JSON
4. Faça um `git status` e veja se houve mudanças acidentais
5. Se necessário, faça git restore para voltar a um estado conhecido

---

**Última verificação**: Rode TESTE_EXTENSAO.md após cada mudança.
