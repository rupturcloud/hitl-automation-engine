# 🚬 Smoke Tests — Extensão 5 v1.5

**Data**: 2026-04-30  
**Status**: Pronto para teste em produção

---

## ✅ Checklist de Testes

### 1️⃣ Carregamento da Extensão
- [ ] Arrastar pasta `extensao 5` para `chrome://extensions`
- [ ] Verificar que não há erros de manifest
- [ ] Verificar que o ícone aparece na barra
- [ ] Clicar no ícone e abrir popup

### 2️⃣ Configurações Iniciais
- [ ] Abrir Options (clique direito → Opções)
- [ ] Verificar que proxy está **desativado por padrão**
- [ ] Campos de proxy devem estar vazios
- [ ] Clicar "SALVAR CONFIGURAÇÕES" (deve funcionar sem proxy)

### 3️⃣ Configurar Proxy (com credenciais de teste)
- [ ] Marcar ✓ "Ativar Proxy Mobile BR"
- [ ] Preencher:
  ```
  Host: proxy-us.proxy-cheap.com
  Porta: 9595
  Usuário: seu_usuario_aqui
  Senha: sua_senha_aqui
  ```
- [ ] Clicar SALVAR
- [ ] Deve mostrar ⏳ "Testando proxy..."
- [ ] Deve voltar a "SALVAR CONFIGURAÇÕES" após teste

### 4️⃣ Validação de Entrada
- [ ] Tentar salvar com proxy ativado mas **sem host**: deve alertar
- [ ] Tentar salvar com **porta 99999** (inválida): deve alertar
- [ ] Tentar salvar com **caracteres inválidos no host**: deve alertar
- [ ] Tentar salvar com **credenciais incompletas**: deve alertar

### 5️⃣ WebSocket — Retry Limit
- [ ] Abrir Bac Bo (Evolution/Betboom)
- [ ] Abrir DevTools → Console
- [ ] Parar o servidor WebSocket (ou configurar URL inválida)
- [ ] Observar logs:
  ```
  [Will Dados Robô] WebSocket indisponível; reconexão em 3s
  [Will Dados Robô] WebSocket indisponível; reconexão em 5s
  [Will Dados Robô] WebSocket indisponível; reconexão em 8s
  ...
  [Will Dados Robô] ✗ WebSocket: máximo de 10 tentativas atingido
  ```
- [ ] Após 10 tentativas: deve **PARAR de reconectar** (não infinito)
- [ ] Side panel deve mostrar status "❌ Desconectado (máximo atingido)"

### 6️⃣ Proxy Fallback Automático
- [ ] Ativar proxy com credenciais válidas em Options
- [ ] Simular 3 falhas consecutivas de proxy
- [ ] Deve notificar: "⚠️ Proxy desativado automaticamente"
- [ ] DevTools deve mostrar erro de proxy (3x)
- [ ] Extensão deve voltar para conexão direta

### 7️⃣ Segurança — Credenciais Não Expostas
- [ ] DevTools → Application → Local Storage
- [ ] Verificar `willDadosProxyConfig` salvo
- [ ] **Senha NÃO deve estar em plain text** no código
- [ ] Verificar que `background.js` não tem credenciais hardcoded

### 8️⃣ Reconexão Manual WebSocket
- [ ] Na side panel: procurar botão "Reconectar" ou similar
- [ ] Clicar em "Reconectar"
- [ ] Deve resetar contador de tentativas (voltar a 0)
- [ ] Deve tentar novamente (primeiras tentativas com 3s de delay)

### 9️⃣ Operação Normal
- [ ] Ligar servidor WebSocket (em `ws://localhost:8765`)
- [ ] Extensão deve conectar automaticamente
- [ ] Overlay/painel deve mostrar status "🟢 Conectado"
- [ ] Dados de banca/histórico devem aparecer
- [ ] Nenhum erro no console

### 🔟 Cleanup
- [ ] Remover extensão (chrome://extensions → remover)
- [ ] Verificar que nenhum arquivo `willDadosProxyConfig` fica em storage
- [ ] Verificar que pasta extensão não tem credenciais visíveis

---

## 📊 Resultados Esperados

### ✅ Passou (Green)
- Sem credenciais hardcoded no código
- Proxy desativado por padrão
- Validação de entrada funciona
- WebSocket para após 10 tentativas (não infinito)
- Fallback automático funciona
- Segurança: credenciais em storage.local isolado

### ❌ Falhou (Red)
- Credenciais encontradas em background.js
- Proxy ativado por padrão
- WebSocket reconecta infinitamente
- Fallback não funciona
- Credenciais expostas em plain text

---

## 🔧 Troubleshooting

### Problema: "ERR_PAC_SCRIPT_FAILED"
- PAC script mal formatado
- **Solução**: Verificar sintaxe em `background.js` linha 58

### Problema: WebSocket não reconecta
- URL inválida em `options.js`
- **Solução**: Verificar se `wsUrl` está correto

### Problema: Proxy não funciona
- Credenciais inválidas
- Host não é acessível
- **Solução**: Testar credenciais em navegador manual + proxy

### Problema: "Nenhuma credencial hardcoded encontrada" mas credenciais expostas
- Credenciais podem estar em arquivo config ou variáveis
- **Solução**: Procurar por `username:`, `password:` em todo o código

---

## 📝 Notas

- Teste em máquina local (localhost) antes de compartilhar
- Não compartilhar credenciais reais — usar credenciais de teste
- Cleanup após teste: limpar `chrome://extensions` e localStorage

---

**Próximo passo**: Após todos os testes passarem, criar changelog v1.5.
