export const ICP_TAGS = ['Restaurante', 'E-commerce', 'Clínica', 'Imobiliária', 'Salão', 'Educação', 'Serviços'];

export const OWNERS = [
  { id: 'u1', name: 'Mariana Souza', role: 'SDR Lead', av: 1 },
  { id: 'u2', name: 'Rafael Lima',   role: 'AE Sênior', av: 2 },
  { id: 'u3', name: 'Bruna Castro',  role: 'SDR', av: 3 },
  { id: 'u4', name: 'Diego Marques', role: 'AE', av: 4 },
  { id: 'u5', name: 'Camila Reis',   role: 'CSM', av: 5 },
];

export const LEAD_STATUS = [
  { id: 'new',        label: 'Novo',          tone: 'neutral' },
  { id: 'attempting', label: 'Em contato',    tone: 'info' },
  { id: 'qualified',  label: 'Qualificado',   tone: 'brand' },
  { id: 'unqual',     label: 'Desqualificado',tone: 'danger' },
];

export const SOURCES = ['Site', 'Instagram', 'Indicação', 'Anúncio Meta', 'Inbound WA', 'Lista fria'];

export const LEADS = [
  { id: 'L-2041', name: 'Padaria Pão Quente', contact: 'Júlia Mendes', email: 'julia@paoquente.com.br', phone: '+55 11 9 8412-3322', city: 'São Paulo/SP', score: 92, status: 'qualified', source: 'Inbound WA', owner: 'u2', createdAt: '2026-05-12', value: 2400, icp: 'Restaurante' },
  { id: 'L-2042', name: 'Studio Glow',         contact: 'Letícia Araújo', email: 'leticia@studioglow.com', phone: '+55 21 9 7733-1122', city: 'Rio de Janeiro/RJ', score: 78, status: 'attempting', source: 'Instagram', owner: 'u3', createdAt: '2026-05-13', value: 890, icp: 'Salão' },
  { id: 'L-2043', name: 'Imobiliária Norte',   contact: 'Carlos Bento',  email: 'carlos@imobnorte.com', phone: '+55 41 9 9182-0011', city: 'Curitiba/PR', score: 84, status: 'qualified', source: 'Indicação', owner: 'u4', createdAt: '2026-05-13', value: 4800, icp: 'Imobiliária' },
  { id: 'L-2044', name: 'Loja Veloce',         contact: 'Ana Beatriz',  email: 'ana@veloce.com', phone: '+55 31 9 8001-7733', city: 'Belo Horizonte/MG', score: 55, status: 'new', source: 'Anúncio Meta', owner: null, createdAt: '2026-05-14', value: 1200, icp: 'E-commerce' },
  { id: 'L-2045', name: 'Clínica Bem-Estar',   contact: 'Dr. Renato',   email: 'renato@bemestar.com', phone: '+55 11 9 6644-2200', city: 'São Paulo/SP', score: 88, status: 'qualified', source: 'Site', owner: 'u1', createdAt: '2026-05-12', value: 3200, icp: 'Clínica' },
  { id: 'L-2046', name: 'Doceria Açúcar',      contact: 'Patrícia Lima', email: 'pati@acucar.com', phone: '+55 11 9 4400-2211', city: 'Campinas/SP', score: 40, status: 'unqual', source: 'Lista fria', owner: 'u3', createdAt: '2026-05-10', value: 0, icp: 'Restaurante' },
  { id: 'L-2047', name: 'TecPlus Suporte',     contact: 'Felipe Andrade', email: 'felipe@tecplus.com', phone: '+55 51 9 7100-3344', city: 'Porto Alegre/RS', score: 71, status: 'attempting', source: 'Site', owner: 'u2', createdAt: '2026-05-11', value: 1800, icp: 'Serviços' },
  { id: 'L-2048', name: 'Escola Saber+',       contact: 'Profa. Heloísa', email: 'heloisa@saberplus.com', phone: '+55 11 9 9001-2255', city: 'Guarulhos/SP', score: 66, status: 'new', source: 'Indicação', owner: null, createdAt: '2026-05-14', value: 2200, icp: 'Educação' },
  { id: 'L-2049', name: 'Bistrô da Esquina',   contact: 'Marco Aurélio', email: 'marco@bistro.com', phone: '+55 11 9 5511-9988', city: 'São Paulo/SP', score: 81, status: 'qualified', source: 'Inbound WA', owner: 'u4', createdAt: '2026-05-13', value: 1700, icp: 'Restaurante' },
  { id: 'L-2050', name: 'Auto Peças Brasil',   contact: 'Sérgio Tavares', email: 'sergio@autopecasbrasil.com', phone: '+55 19 9 8800-1102', city: 'Campinas/SP', score: 59, status: 'attempting', source: 'Anúncio Meta', owner: 'u1', createdAt: '2026-05-13', value: 980, icp: 'E-commerce' },
  { id: 'L-2051', name: 'Pizzaria Forno Lenha', contact: 'Rodrigo Sá', email: 'rodrigo@fornolenha.com', phone: '+55 11 9 2233-4477', city: 'Santos/SP', score: 73, status: 'qualified', source: 'Inbound WA', owner: 'u2', createdAt: '2026-05-14', value: 1450, icp: 'Restaurante' },
  { id: 'L-2052', name: 'Beauty Care',         contact: 'Joana Pires', email: 'joana@beautycare.com', phone: '+55 11 9 7711-2244', city: 'São Paulo/SP', score: 64, status: 'new', source: 'Site', owner: null, createdAt: '2026-05-14', value: 700, icp: 'Salão' },
];

export const STAGES = [
  { id: 'prospect',  label: 'Prospect',    weight: .1,  tone: 'neutral' },
  { id: 'qualified', label: 'Qualificado', weight: .25, tone: 'info' },
  { id: 'meeting',   label: 'Reunião',     weight: .45, tone: 'brand' },
  { id: 'proposal',  label: 'Proposta',    weight: .7,  tone: 'warning' },
  { id: 'won',       label: 'Ganho',       weight: 1,   tone: 'success' },
  { id: 'lost',      label: 'Perdido',     weight: 0,   tone: 'danger' },
];

export const DEALS = [
  { id: 'D-301', name: 'Padaria Pão Quente · Plano anual', amount: 24000, stage: 'meeting',   owner: 'u2', closeDate: '2026-05-28', lastActivity: 1, icp: 'Restaurante', risk: false },
  { id: 'D-302', name: 'Studio Glow · Setup + mensal',     amount: 9800,  stage: 'qualified', owner: 'u3', closeDate: '2026-06-05', lastActivity: 2, icp: 'Salão', risk: false },
  { id: 'D-303', name: 'Imobiliária Norte · 3 unidades',   amount: 48600, stage: 'proposal',  owner: 'u4', closeDate: '2026-05-20', lastActivity: 0, icp: 'Imobiliária', risk: false },
  { id: 'D-304', name: 'Clínica Bem-Estar · 6 cadeiras',   amount: 32400, stage: 'proposal',  owner: 'u1', closeDate: '2026-05-22', lastActivity: 8, icp: 'Clínica', risk: true },
  { id: 'D-305', name: 'TecPlus · Plataforma',             amount: 18000, stage: 'meeting',   owner: 'u2', closeDate: '2026-06-12', lastActivity: 5, icp: 'Serviços', risk: false },
  { id: 'D-306', name: 'Loja Veloce · Black Friday',       amount: 12200, stage: 'prospect',  owner: 'u3', closeDate: '2026-06-30', lastActivity: 3, icp: 'E-commerce', risk: false },
  { id: 'D-307', name: 'Bistrô da Esquina · Cashback',     amount: 8400,  stage: 'qualified', owner: 'u4', closeDate: '2026-06-02', lastActivity: 1, icp: 'Restaurante', risk: false },
  { id: 'D-308', name: 'Escola Saber+ · Matrículas',       amount: 22000, stage: 'prospect',  owner: 'u1', closeDate: '2026-07-01', lastActivity: 9, icp: 'Educação', risk: true },
  { id: 'D-309', name: 'Auto Peças Brasil · Catálogo',     amount: 14600, stage: 'meeting',   owner: 'u2', closeDate: '2026-06-08', lastActivity: 2, icp: 'E-commerce', risk: false },
  { id: 'D-310', name: 'Pizzaria Forno Lenha · Delivery',  amount: 7200,  stage: 'qualified', owner: 'u3', closeDate: '2026-05-30', lastActivity: 1, icp: 'Restaurante', risk: false },
  { id: 'D-311', name: 'Beauty Care · Pacote anual',       amount: 9600,  stage: 'won',       owner: 'u4', closeDate: '2026-05-10', lastActivity: 0, icp: 'Salão', risk: false },
  { id: 'D-312', name: 'Doceria Açúcar · Reativação',      amount: 4200,  stage: 'lost',      owner: 'u3', closeDate: '2026-05-08', lastActivity: 12, icp: 'Restaurante', risk: false },
];

export const ACTIVITIES = [
  { id: 'a1', kind: 'wa',    text: 'Júlia respondeu na conversa #4421',  who: 'Padaria Pão Quente', ago: '2 min',  tone: 'wa' },
  { id: 'a2', kind: 'note',  text: 'Rafael criou oportunidade R$ 24.000',who: 'Padaria Pão Quente', ago: '14 min', tone: 'brand' },
  { id: 'a3', kind: 'mail',  text: 'E-mail aberto: Proposta v2',          who: 'Imobiliária Norte',  ago: '38 min', tone: 'info' },
  { id: 'a4', kind: 'phone', text: 'Ligação registrada (3m12s)',          who: 'TecPlus Suporte',    ago: '1 h',    tone: 'neutral' },
  { id: 'a5', kind: 'alert', text: 'Lead L-2048 sem owner há 18 min',     who: 'Escola Saber+',      ago: '18 min', tone: 'warning' },
  { id: 'a6', kind: 'wa',    text: 'Cadência "Reativação 30d" iniciada',  who: 'Doceria Açúcar',     ago: '2 h',    tone: 'wa' },
];

export const ALERTS = [
  { kind: 'sla',  tone: 'danger',  text: '3 leads sem owner há mais de 15 min',          cta: 'Atribuir' },
  { kind: 'risk', tone: 'warning', text: '2 oportunidades sem atividade há 7+ dias',     cta: 'Revisar' },
  { kind: 'cs',   tone: 'warning', text: 'NPS 6 detectado em Clínica Bem-Estar',         cta: 'Abrir' },
  { kind: 'bill', tone: 'info',    text: 'Fatura #INV-1109 com 4 dias de atraso',        cta: 'Cobrar' },
];

export const FUNNEL = {
  seeds:  { label: 'Seeds — base instalada / indicação', value: 84,  color: '#10B981' },
  nets:   { label: 'Nets — marketing / inbound',          value: 156, color: '#3B82F6' },
  spears: { label: 'Spears — outbound SDR',               value: 62,  color: '#FF6A3D' },
};

export const ACCOUNTS = LEADS.slice(0, 6).map(l => ({ ...l }));

export const CONVERSATIONS = [
  { id: 'c1', name: 'Padaria Pão Quente', last: 'Vou fechar até sexta!',           ago: '2m',    unread: 2, owner: 'u2', tag: 'quente',   online: true,  score: 92 },
  { id: 'c2', name: 'Studio Glow',         last: 'Pode me mandar o link?',          ago: '12m',   unread: 0, owner: 'u3', tag: 'morno',    online: true,  score: 78 },
  { id: 'c3', name: 'Imobiliária Norte',   last: 'Recebi a proposta, obrigado.',    ago: '38m',   unread: 0, owner: 'u4', tag: 'quente',   online: false, score: 84 },
  { id: 'c4', name: 'Clínica Bem-Estar',   last: 'Vou conversar com sócio',         ago: '1h',    unread: 1, owner: 'u1', tag: 'em risco', online: false, score: 88 },
  { id: 'c5', name: 'TecPlus Suporte',     last: 'Topo agendar terça',              ago: '2h',    unread: 0, owner: 'u2', tag: 'morno',    online: false, score: 71 },
  { id: 'c6', name: 'Escola Saber+',       last: 'Olá! Vi a propaganda...',         ago: '3h',    unread: 3, owner: null, tag: 'novo',     online: true,  score: 66 },
  { id: 'c7', name: 'Auto Peças Brasil',   last: 'Manda o catálogo?',               ago: '5h',    unread: 0, owner: 'u1', tag: 'morno',    online: false, score: 59 },
  { id: 'c8', name: 'Bistrô da Esquina',   last: 'Combinado, sexta 14h',            ago: 'ontem', unread: 0, owner: 'u4', tag: 'quente',   online: false, score: 81 },
];

export const MESSAGES = [
  { from: 'them', text: 'Oi! Vi o anúncio de vocês no Instagram, quero saber mais sobre o sistema 😊', at: '14:02' },
  { from: 'me',   text: 'Olá Júlia! Que bom falar com você. Posso te explicar em 5 minutos como a gente ajuda padarias a vender mais pelo WhatsApp?', at: '14:03' },
  { from: 'them', text: 'Pode sim, mas hoje só depois das 17h', at: '14:05' },
  { from: 'me',   text: 'Perfeito. Reservei 17h30. Vou te mandar o link do Meet por aqui. Aproveita e dá uma olhada nesse case de outra padaria que faturou +R$8k/mês: ruptur.com.br/case-padaria', at: '14:06' },
  { from: 'them', text: 'Adorei o case! Vou fechar até sexta, pode preparar contrato 🙏', at: '14:32' },
];

export const QUICK_REPLIES = [
  { id: 'qr1', name: 'Saudação inicial', text: 'Olá! Aqui é da Ruptur 👋 Tudo bem? Vi seu interesse e queria te ajudar a entender se a gente faz sentido pro seu negócio.' },
  { id: 'qr2', name: 'Agendar demo',     text: 'Posso te mandar 2 horários nesta semana pra uma demo de 20 min? Geralmente cabe no intervalo do almoço.' },
  { id: 'qr3', name: 'Enviar proposta',  text: 'Acabei de te enviar a proposta. Qualquer dúvida me chama por aqui que respondo na hora.' },
  { id: 'qr4', name: 'Cobrar retorno',   text: 'Oi! Voltando aqui pra entender se ainda faz sentido seguirmos. Se preferir, posso reagendar.' },
];

export const TEMPLATES = [
  { id: 't1', name: 'BoasVindas_Trial',   approved: true,  vars: 2, usage: 1284 },
  { id: 't2', name: 'LembreteFatura_3d',  approved: true,  vars: 3, usage: 612 },
  { id: 't3', name: 'NPSPesquisa_60d',    approved: true,  vars: 1, usage: 218 },
  { id: 't4', name: 'CarrinhoAbandonado', approved: false, vars: 4, usage: 0 },
];

export const PLAYBOOKS = [
  { id: 'pb1', name: 'Outbound SDR · Restaurantes',       steps: 6, leads: 84,  replyRate: 38, status: 'on' },
  { id: 'pb2', name: 'Inbound WA · qualificação rápida',  steps: 4, leads: 212, replyRate: 71, status: 'on' },
  { id: 'pb3', name: 'Reativação 30d sem compra',         steps: 5, leads: 56,  replyRate: 22, status: 'on' },
  { id: 'pb4', name: 'NPS pós-onboarding',                steps: 3, leads: 134, replyRate: 64, status: 'on' },
  { id: 'pb5', name: 'Carrinho abandonado · E-com',       steps: 4, leads: 0,   replyRate: 0,  status: 'draft' },
];

export const INVOICES = [
  { id: 'INV-1112', date: '2026-05-10', amount: 497, status: 'paid',    method: 'Cartão Visa •• 4421' },
  { id: 'INV-1111', date: '2026-04-10', amount: 497, status: 'paid',    method: 'Pix' },
  { id: 'INV-1110', date: '2026-03-10', amount: 497, status: 'paid',    method: 'Cartão Visa •• 4421' },
  { id: 'INV-1109', date: '2026-02-10', amount: 497, status: 'overdue', method: 'Boleto' },
];

export const TIMELINE = [
  { kind: 'wa',    who: 'Júlia Mendes', at: 'hoje 14:32',   title: 'WhatsApp',     text: '"Adorei o case! Vou fechar até sexta, pode preparar contrato 🙏"' },
  { kind: 'note',  who: 'Rafael Lima',  at: 'hoje 13:50',   title: 'Nota',         text: 'Cliente confirmou orçamento aprovado pelo sócio. Pediu contrato em PJ.' },
  { kind: 'mail',  who: 'Rafael Lima',  at: 'hoje 11:14',   title: 'E-mail enviado',text: 'Re: Proposta v2 — anexo com planos Growth e Scale comparados.' },
  { kind: 'phone', who: 'Rafael Lima',  at: 'ontem 17:30',  title: 'Ligação · 12m 04s', text: 'Demo realizada. Stakeholders presentes: dona Júlia e gerente João. Próx. passo: contrato.' },
  { kind: 'wa',    who: 'Júlia Mendes', at: 'ontem 09:21',  title: 'WhatsApp',     text: '"Pode me mandar a proposta por email tbm?"' },
  { kind: 'flag',  who: 'Sistema',      at: '2 dias atrás', title: 'Estágio movido', text: 'Qualificado → Reunião (BANT mini preenchido).' },
];
