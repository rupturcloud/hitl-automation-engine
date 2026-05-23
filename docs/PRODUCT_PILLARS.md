# Ruptur OS — Pilares de Produto

**Status:** filtro permanente. Toda nova tela, fluxo ou funcionalidade
deve passar pelos 3 pilares antes de ser fechada.

---

## P1 — Replicabilidade

Materiais e ações que outro cliente (ou um voluntário/colaborador)
consegue reaproveitar **sem** modificar.

Aplicação no produto:
- Templates de campanha por nicho (cervejaria, clínica, imob, e-commerce)
- Fluxos conversacionais como ativo importável
- Playbooks de warmup pré-configurados
- Onboarding curto e visual (≤ 5 min)

Pergunta de gate:
**"Isso é fácil de copiar/reutilizar?"**

---

## P2 — Linguagem humana

Zero jargão técnico na UI do cliente final. PMEs precisam entender
sem tutorial.

Substituições obrigatórias:

| Não usar          | Usar                  |
|-------------------|-----------------------|
| instância         | número de WhatsApp    |
| tenant            | conta / workspace     |
| RBAC              | permissões            |
| webhook           | integração automática |
| session           | conexão               |
| token / API key   | chave de acesso       |
| timeout           | conexão demorou       |
| 503 / 5xx         | "Não conseguimos conectar agora" |

Onboarding com analogias do mundo real:
> "Aquecer um número é como apresentar um vendedor novo para o mercado."

Pergunta de gate:
**"Isso usa linguagem humana?"**

---

## P3 — Comunidade e aprendizado

Loop em que cliente aprende com cliente, sem depender do time Ruptur.

Aplicação no produto:
- Hall de campanhas vencedoras (importáveis)
- Indicações (`modules/referrals/`) como mola da comunidade
- Canal WhatsApp/Discord oficial dos clientes
- Marketplace de templates (P1) é o catalisador deste pilar

Pergunta de gate:
**"Isso aumenta aprendizado/compartilhamento?"**

---

## Como usar os pilares

1. **Antes de fechar uma feature:** as 3 perguntas precisam ter resposta.
2. **Se não passar:** registrar a divergência no PR e revisar.
3. **PRs de hotfix urgente em prod:** podem pular, mas devem entrar
   na próxima sprint pra ajustar.
4. **Pilares são camada transversal:** não param a arquitetura
   nem a fila P0 atual. Entram em paralelo.

---

## Backlog priorizado pelos pilares (sprint atual)

### P0 — Cliente pagante usando (sprint urgente)
Foco em operação funcional. Pilares cobrem como, não o quê.

- D1  Login único + redirect correto → `/v0/dashboard`
- D2  Signup → Tenant → Dashboard
- D3  Inbox conectado (conversas reais + webhook)
- D4  CRM conectado (leads + pipeline)
- D5  Instâncias WhatsApp (QR pairing + status)
- D6  Campanhas e disparos (idempotência)
- D7  Aquecimento (ativar/pausar + score)
- D8  Segurança mínima (tenant isolation, RBAC, audit)
- D9  GetNet sandbox (checkout → wallet/assinatura)
- D10 Mobile hotfix em todas as telas principais

### P1 — Replicabilidade
- Marketplace de templates por nicho
- Campanhas importáveis
- Playbooks de warmup por segmento

### P2 — Comunidade
- Hall de campanhas vencedoras
- Referrals evoluídos
- Canal externo da comunidade

---

## Não fazer agora (pós-sprint)
- Flow builder visual
- Marketplace completo (fase 2)
- Proxy como produto vendável
- Comunidade interna no produto
- Refactor arquitetural grande
- Design polish

---

**Última revisão:** 2026-05-21
