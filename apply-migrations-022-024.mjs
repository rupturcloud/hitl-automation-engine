import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://axrwlboyowoskdxeogba.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BASE = '/Users/diego/hitl/projects/tiatendeai/dev/x1-mercado-contingencia/saas/migrations';

const migrations = [
  { file: '022_uazapi_events_tables.sql', name: 'uazapi_events + uazapi_messages' },
  { file: '023_tenant_status_index.sql',  name: 'idx_tenants_id_status' },
  { file: '024_campaign_status_low_credits.sql', name: 'campaign_events + paused_low_credits' },
];

(async () => {
  for (const m of migrations) {
    const sql = readFileSync(`${BASE}/${m.file}`, 'utf-8');
    console.log(`\n⏳ Aplicando ${m.file} (${m.name})...`);
    try {
      const { data, error } = await supabase.rpc('exec_sql', { query: sql });
      if (error) {
        console.error(`❌ Erro: ${error.message}`);
        console.error('   Details:', error.details || '—');
      } else {
        console.log(`✅ OK — ${m.name}`);
      }
    } catch (err) {
      console.error(`❌ Exceção: ${err.message}`);
    }
  }
})();
