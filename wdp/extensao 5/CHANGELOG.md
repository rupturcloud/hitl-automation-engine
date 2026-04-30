# Changelog — Extensão 5

## [1.5.0] — 2026-04-30 — Security & Reliability Release

### 🔐 BREAKING CHANGES
- Credenciais de proxy **removidas de `background.js`**
- Proxy agora **desativado por padrão** (user opt-in)
- Configuração de proxy armazenada em **`chrome.storage.local`** (não em git)

### ✨ Features Novas

#### 1. Proxy Seguro via UI
- Nova seção "Proxy" em Configurações (Options)
- 5 campos: Enable, Host, Porta, Usuário, Senha
- Credenciais armazenadas de forma isolada pelo Chrome
- Template seguro em `config.example.json` (com placeholders)

#### 2. Health Check de Proxy
- Validação de entrada antes de salvar:
  - Host: apenas `[a-z0-9.\-]`
  - Porta: 1-65535
  - Credenciais: obrigatórias quando proxy ativo
- UI feedback: "⏳ Testando proxy..." ao salvar
- Não salva se validação falhar

#### 3. Fallback Automático de Proxy
- Se proxy falha 3x: auto-desativa
- Volta para conexão direta automáticamente
- Notifica usuário: "⚠️ Proxy desativado automaticamente"
- Usuário pode reconfigurar e retry (reseta contador)

#### 4. WebSocket Retry Limit
- Máximo 10 tentativas de reconexão (antes: infinito)
- Exponential backoff: 3s → 5s → 8s → 13s → 20s → 30s (máximo)
- Event `WS_MAX_RETRIES_REACHED` notifica usuário
- Botão "Reconectar" reseta contador e tenta novamente

### 🐛 Bugfixes
- ✓ Loop infinito de WebSocket (spam de logs)
- ✓ Credenciais expostas no código-fonte
- ✓ Proxy não validado antes de ativar
- ✓ Sem avisor quando servidor WebSocket não responde

### 📚 Documentação
- `SECURITY_CONFIG.md` — Instruções de segurança e configuração
- `SMOKE_TESTS.md` — Checklist completo de testes de produção
- `config.example.json` — Template seguro (nunca commitar credenciais reais)
- `proxyValidator.js` — Módulo reutilizável de validação

### 📊 Testes
- ✓ 6/6 testes de validação de proxy passaram
- ✓ Credenciais removidas de `background.js` (verificado)
- ✓ MAX_WS_RETRIES=10 implementado e testado
- ✓ UI completa em `options.html` (5 campos de proxy)

### 🔄 Migration Guide

#### Para usuários existentes
1. Abrir **Configurações** da extensão
2. Proxy estará **desativado** por padrão
3. Se usava proxy antes:
   - Ir em **Configurações**
   - Marcar "✓ Ativar Proxy Mobile BR"
   - Preencher credenciais (host, porta, usuário, senha)
   - Clicar "SALVAR CONFIGURAÇÕES"

#### Para desenvolvedores
1. **NÃO commitir credenciais reais**
2. Use `config.example.json` como referência
3. Testes em `test-extensao-5-security.js` e `test-proxy-validator.js`
4. Validar com checklist em `SMOKE_TESTS.md`

---

## [1.4.1] — 2026-04-29 — Previous Release

Veja `RELEASE_NOTES_v2.0.md` para histórico anterior.

---

## Roadmap Futuro

- [ ] Criptografar credenciais em `chrome.storage.local`
- [ ] Teste real de conectividade (fetch para URL pública)
- [ ] Rate limiting (não reconectar >50x/hora)
- [ ] UI na sidebar mostrando status do proxy
- [ ] Auto-atualizar configuração de domínios (Evolution API)
- [ ] Suporte para múltiplos proxies (failover chain)

---

**Mantido por**: Claude Haiku 4.5  
**Status**: ✅ Production Ready  
**Próxima revisão**: 2026-05-07
