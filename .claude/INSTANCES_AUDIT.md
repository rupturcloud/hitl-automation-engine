# 🔍 AUDITORIA: UI/UX para Gerenciamento de Instâncias

**Data**: 2026-05-07  
**Status**: ❌ BROKEN — Falta implementação de rotas de backend

---

## 📊 RESUMO EXECUTIVO

**O QUE FUNCIONA**:
- ✅ Frontend (Instances.jsx) — componente visual completo e funcional
- ✅ Serviço de API (api.js) — métodos cliente prontos
- ✅ Layout responsivo com stats, formulário e lista de instâncias
- ✅ Integração com Supabase Auth e JWT

**O QUE ESTÁ QUEBRADO**:
- ❌ **Rotas de backend não implementadas** — não há `/api/instances/*` no gateway.mjs
- ❌ **Nenhum módulo de serviço de instâncias** — sem lógica de negócio
- ❌ **QR code scanning não implementado** — apenas exibição de imagem
- ❌ **Conexão com UazAPI não existe** — hardcoded em Instances.jsx mas sem backend

**FLUXO ESPERADO vs REAL**:

```
ESPERADO (no código frontend):
1. Usuário clica "Criar e conectar"
2. POST /api/instances → cria instância no tenant
3. POST /api/instances/{key}/connect → solicita QR code/paircode
4. Frontend exibe QR code gerado
5. Usuário escaneia com WhatsApp
6. GET /api/instances/{key}/status → verifica conexão

REALIDADE (hoje):
1. Usuário clica "Criar e conectar"
2. POST /api/instances → ❌ ERRO 404 (rota não existe)
3. Nunca chega no resto do fluxo
```

---

## 🏗️ ESTADO ATUAL DO CÓDIGO

### Frontend ✅ Completo

**Arquivo**: `/saas/web/client-area/src/pages/Instances.jsx`

```javascript
// Componente totalmente pronto com:
- Criação de instância (form)
- Conexão com QR code/paircode
- Atualização de status
- Lista de instâncias com estados (conectada/conectando/desconectada)
- Cards de stats (online, conectando, total)
- Responsivo para mobile/desktop
```

**Dependências do Frontend**:
- `lucide-react` — ícones (QrCode, Wifi, etc)
- `framer-motion` — animações
- Supabase Auth — JWT automático
- Nenhuma biblioteca de QR scanning (❌ FALTA)

### API Service ✅ Completo

**Arquivo**: `/saas/web/client-area/src/services/api.js`

```javascript
// Métodos prontos:
apiService.getInstances()              // GET /api/instances
apiService.createInstance(payload)     // POST /api/instances
apiService.connectInstance(key, {})    // POST /api/instances/{key}/connect
apiService.getInstanceStatus(key)      // GET /api/instances/{key}/status
```

Todos os métodos estão prontos, mas apontam para rotas que **não existem no backend**.

### Backend ❌ NÃO IMPLEMENTADO

**Arquivo**: `/saas/api/gateway.mjs`

**Achados**:
- ✅ Há rotas `/api/admin/instances` (admin only)
- ✅ Há referências a `instance_registry` table no Supabase
- ❌ **FALTA**: Rotas para usuário comum (`/api/instances`)
- ❌ **FALTA**: Módulo `routes-instances.mjs`
- ❌ **FALTA**: Service para lógica de instâncias
- ❌ **FALTA**: Rate limiting/validação

**O que deveria existir**:
```javascript
// Necessário em gateway.mjs ou routes-instances.mjs:

GET /api/instances
  → Listar instâncias do tenant logado
  
POST /api/instances
  → Criar nova instância
  → Parametros: { name, systemName }
  
POST /api/instances/{key}/connect
  → Solicitar QR code ou paircode
  → Parametros: { phone? }
  
GET /api/instances/{key}/status
  → Verificar status de conexão
  
DELETE /api/instances/{key}
  → Remover instância (soft-delete)
  
PATCH /api/instances/{key}
  → Atualizar (nome, etc)
```

---

## 🎯 MATRIZ DE FUNCIONALIDADES

### Tier 1: CRIAÇÃO & LISTAGEM

| Funcionalidade | Frontend | API Service | Backend | Status |
|---|:---:|:---:|:---:|---|
| Listar instâncias | ✅ | ✅ | ❌ | 🔴 BROKEN |
| Criar instância (form) | ✅ | ✅ | ❌ | 🔴 BROKEN |
| Mostrar form com validação | ✅ | ✅ | ❌ | 🔴 BROKEN |
| Salvar nome da instância | ✅ | ✅ | ❌ | 🔴 BROKEN |

### Tier 2: CONEXÃO COM QR CODE

| Funcionalidade | Frontend | API Service | Backend | Status |
|---|:---:|:---:|:---:|---|
| Solicitar QR code | ✅ | ✅ | ❌ | 🔴 BROKEN |
| Exibir QR code como imagem | ✅ | ✅ | ❌ | 🔴 BROKEN |
| **Escanear QR code** | ❌ | ❌ | ❌ | 🔴 MISSING |
| Detector de webcam | ❌ | ❌ | ❌ | 🔴 MISSING |
| Processamento de leitura | ❌ | ❌ | ❌ | 🔴 MISSING |

### Tier 3: CONEXÃO COM CÓDIGO/PAIRCODE

| Funcionalidade | Frontend | API Service | Backend | Status |
|---|:---:|:---:|:---:|---|
| Input de telefone (paircode) | ✅ | ✅ | ❌ | 🔴 BROKEN |
| Exibir código gerado | ✅ | ✅ | ❌ | 🔴 BROKEN |
| Validação de telefone | ✅ | ✅ | ❌ | 🔴 BROKEN |
| User insere paircode no chat | ⚠️ | ⚠️ | ⚠️ | 🟡 UX UNCLEAR |

### Tier 4: STATUS & GERENCIAMENTO

| Funcionalidade | Frontend | API Service | Backend | Status |
|---|:---:|:---:|:---:|---|
| Verificar status de conexão | ✅ | ✅ | ❌ | 🔴 BROKEN |
| Orbe de status (verde/amarelo/cinza) | ✅ | ✅ | ❌ | 🔴 BROKEN |
| Botões de ações (Conectar, Status) | ✅ | ✅ | ❌ | 🔴 BROKEN |
| Remover instância | ❌ | ❌ | ❌ | 🔴 MISSING |
| Renomear instância | ❌ | ❌ | ❌ | 🔴 MISSING |
| Editar telefone do instância | ❌ | ❌ | ❌ | 🔴 MISSING |

### Tier 5: AVANÇADO (Não Implementado)

| Funcionalidade | Status |
|---|---|
| Importar instância via código JSON | 🔴 |
| Exportar instância para QR | 🔴 |
| Histórico de tentativas de conexão | 🔴 |
| Auto-reconexão com backoff exponencial | 🔴 |
| Notificações de desconexão | 🔴 |
| Webhook para mudanças de status | 🔴 |

---

## 🚨 PROBLEMAS CRÍTICOS

### 1. Rotas de Backend Inexistentes

A página tenta chamar:
```javascript
await apiService.getInstances()
// GET /api/instances
// → Retorna 404 (rota não existe)
```

**Onde deveria estar**: `/saas/api/gateway.mjs` ou `/saas/api/routes-instances.mjs`

### 2. Sem Integração com UazAPI

O código referencia:
```javascript
const result = await apiService.createInstance({ name, systemName: 'ruptur-dashboard' });
```

Mas não há:
- Wrapper para UazAPI client
- Chamadas `POST /instance/create` da UazAPI
- Salvamento de `remote_instance_id` na `instance_registry`
- Tenant isolamento por `tenant_id`

### 3. QR Code: Apenas Exibição

```javascript
const qrCode = connectionPayload?.instance?.qrcode;
// Isso é uma STRING (URL ou data:image)
// Não há SCANNER para o usuário ler QR code

// O fluxo é:
// 1. Backend gera QR code
// 2. Frontend exibe em <img> tag
// 3. Usuário escaneia manualmente no WhatsApp
// 4. Usuário volta ao dashboard

// O QUE ESTÁ FALTANDO:
// - Detector de webcam/câmera
// - Biblioteca para ler QR (jsQR, html5-qrcode, etc)
// - Callback quando QR é detectado
// - Auto-submit do código escaneado
```

### 4. Sem Retenção de Contexto

Quando usuário fecha a página:
- QR code desaparece
- Não há forma de recuperar
- Precisa clicar "Conectar" novamente

**Solução necessária**:
- WebSocket real-time para notificações
- Supabase Realtime listeners
- Persistência do payload

---

## 🔧 O QUE PRECISA SER CONSTRUÍDO

### Prioridade 1: Backend Routes (BLOCKER)

**Arquivo**: `/saas/api/routes-instances.mjs` (novo)

```javascript
// Endpoint: POST /api/instances
export async function createInstance(req, res, json) {
  // Valida: req.user.id, req.body.name, req.user.tenantId
  // Chama: uazapiClient.createInstance()
  // Salva: instance_registry (tenant_id, remote_instance_id, status, instance_name)
  // Retorna: { instance: { id, name, token, status } }
}

// Endpoint: GET /api/instances
export async function getInstances(req, res, json) {
  // Filtra: WHERE tenant_id = req.user.tenantId
  // Retorna: [{ id, name, phone, status, connected, qrcode? }]
}

// Endpoint: POST /api/instances/{key}/connect
export async function connectInstance(req, res, json) {
  // Parametros: { phone? }
  // Chama: uazapiClient.getQRCode(instanceKey) ou getQRCode({phone})
  // Retorna: { qrcode, paircode?, instance }
}

// Endpoint: GET /api/instances/{key}/status
export async function getInstanceStatus(req, res, json) {
  // Chama: uazapiClient.getInstanceStatus(key)
  // Retorna: { status, connected, phone, profileName, qrcode? }
}
```

### Prioridade 2: Service Layer

**Arquivo**: `/saas/modules/instances/instances.service.js` (novo)

```javascript
export class InstancesService {
  constructor(supabase, uazapiClient) {}
  
  async createInstance(tenantId, userId, { name, systemName }) {}
  async getInstances(tenantId) {}
  async getInstanceStatus(instanceKey) {}
  async connectInstance(instanceKey, { phone }) {}
  async deleteInstance(tenantId, instanceKey) {}
  async updateInstance(tenantId, instanceKey, updates) {}
}
```

### Prioridade 3: QR Code Scanner (Frontend)

**Arquivo**: `/saas/web/client-area/src/components/QRScanner.jsx` (novo)

```javascript
// Requer: npm install html5-qrcode
// Features:
// - Detecta câmera/webcam
// - Lê código QR em tempo real
// - Callback quando código é escaneado
// - Fallback para input manual

export default function QRScanner({ onScanned, onError }) {
  // useEffect: inicializa Html5Qrcode
  // useEffect: cleanup ao desmontar
  // return: <div id="qr-reader" /> + estado
}
```

### Prioridade 4: Tela de Confirmação de Conexão

**Melhorias em Instances.jsx**:

```javascript
// Adicionar modal/overlay quando conexão é bem-sucedida:
// ✅ Instância "Suporte 01" conectada
// 📱 Número: +55 11 99999-9999
// [Ir para Inbox] [Voltar]

// Adicionar retry automático:
// - Verificar status a cada 3s enquanto aguarda
// - Timeout após 5 minutos
// - Mostrar mensagem "Escaneie o QR code no seu WhatsApp"
```

---

## 📐 ARQUITETURA: Bubble vs Solução Atual

### Bubble (Referência)

**Conceito**:
- SaaS no-code com editor visual integrado
- Editor + runtime + multi-tenant tudo bundled
- Usuários criam workflows sem código
- Publicação automática = deployment

**Vantagens para Ruptur**:
- Usuários não-técnicos criam campanhas/automações
- Workflows visuais (canvas)
- Billing integrado por uso
- Escalabilidade automática

**Desvantagens**:
- Lock-in propriatário
- Limitações de customização
- Custo alto de licensing
- Complexidade de integrações custom

### Solução Atual (Recomendada)

**Camada 1: Plataforma Core (onde estamos)**
- Gerenciamento de multi-tenant
- Billings e créditos
- Instâncias WhatsApp
- Inbox & Campanhas

**Camada 2: Automação (similar a Bubble, mas open)**
- Editor visual de workflows
- Acionadores (webhooks, cronogramas, mensagens)
- Ações (enviar mensagem, sincronizar dados, chamar API)
- Condições lógicas

**Camada 3: Integrações**
- Google Sheets
- Zapier/Make
- CRMs (HubSpot, Salesforce)
- Banco de dados interno (Supabase)

**Implementação**:
```
Romper com Bubble ❌
Construir similar em React ✅
- YML ou JSON-based workflow definitions
- Visual editor (similar a Retool, Budibase)
- Interpreter/engine que executa workflows
- Real-time preview & debugging
```

---

## 🎯 ROADMAP PROPOSTO

### Phase 1: UNBLOCK (1-2 dias)

- [ ] Criar `routes-instances.mjs` com endpoints básicos
- [ ] Criar `instances.service.js` com lógica
- [ ] Conectar com UazAPI (via proxy ou SDK)
- [ ] Testar fluxo: criar → QR code → verificar status

**Resultado**: UI funcional em produção

### Phase 2: SCANNER (1 dia)

- [ ] `npm install html5-qrcode`
- [ ] Criar `QRScanner.jsx` component
- [ ] Integrar em modal quando clica "Conectar"
- [ ] Testar scanner com QR code real

**Resultado**: Usuário pode escanear QR code direto no dashboard

### Phase 3: POLISH (1-2 dias)

- [ ] Real-time status via Supabase Realtime
- [ ] Toast notifications para mudanças de status
- [ ] Tela de confirmação pós-conexão
- [ ] Retry automático com exponential backoff
- [ ] Testes E2E (Cypress/Playwright)

**Resultado**: UX fluida, sem refresh manual

### Phase 4: AVANÇADO (Opcional, 2-3 dias)

- [ ] Importar instância via JSON/QR code "exportado"
- [ ] Histórico de tentativas
- [ ] Webhooks para mudanças de status
- [ ] Sincronização de múltiplos devices
- [ ] Auto-recovery de desconexões

---

## 💾 ESTADO DO CÓDIGO POR ARQUIVO

| Arquivo | Status | Observações |
|---------|:------:|------------|
| Instances.jsx | ✅ 100% | Pronto, apenas aguarda backend |
| api.js | ✅ 100% | Métodos prontos |
| gateway.mjs | ❌ 0% | Faltam rotas `/api/instances` |
| routes-instances.mjs | ❌ MISSING | Precisa ser criado |
| instances.service.js | ❌ MISSING | Precisa ser criado |
| QRScanner.jsx | ❌ MISSING | Precisa ser criado |
| instance_registry table | ✅ EXISTS | Já existe no Supabase |

---

## 🧪 TESTES NECESSÁRIOS

### Teste Manual (pré-Phase 1)

```bash
# 1. Verificar se rotas existem
curl -X GET http://localhost:3001/api/instances \
  -H "Authorization: Bearer {JWT_TOKEN}"
# Esperado: 200 + array de instâncias OU 404 (atual)

# 2. Criar instância
curl -X POST http://localhost:3001/api/instances \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste 01","systemName":"ruptur-dashboard"}'
# Esperado: 201 + { instance: {...} } OU 404 (atual)
```

### Teste de Scanner (pós-Phase 2)

```javascript
// No console do navegador:
// 1. Abrir Instances page
// 2. Clicar "Conectar"
// 3. Modal abre com câmera ativa
// 4. Escanear QR code real (ou foto)
// 5. Verificar: onScanned callback dispara
// 6. Verificar: código é processado automaticamente
```

---

## 📋 CHECKLIST PRÉ-PRODUÇÃO

- [ ] Rotas de backend implementadas e testadas
- [ ] Service layer com validação e error handling
- [ ] QR scanner integrado e testado
- [ ] Real-time status via Supabase
- [ ] Rate limiting em POST /api/instances
- [ ] Audit logging para create/delete/connect
- [ ] Testes unitários (service layer)
- [ ] Testes E2E (fluxo completo)
- [ ] Documentação de API (OpenAPI/Swagger)
- [ ] Runbook: troubleshooting de conexão
- [ ] Monitoring: status de instâncias por tenant

---

## 🚀 PRÓXIMOS PASSOS RECOMENDADOS

1. **AGORA**: Ler este relatório com atenção
2. **HOJE**: Criar `routes-instances.mjs` (Phase 1)
3. **AMANHÃ**: Implementar `instances.service.js`
4. **DEPOIS**: Testar fluxo completo
5. **SEGUINTE**: Adicionar QR scanner (Phase 2)

---

**Pronto para começar Phase 1?**
