# 🧪 Teste de Apostas Mínimas - Script Automático

## Objetivo
Testar se os cliques em Player/Banker/Tie funcionam fazendo apostas **mínimas** (R$ 5).

## Como Usar

### 1. Abra o Betboom
```
https://betboom.bet.br
```
Ou qualquer site com mesa viva de Bac Bo.

### 2. Abra Console (F12)
Pressione **F12**, clique na aba **Console**.

### 3. Cole Este Script

```javascript
console.log(`
╔════════════════════════════════════════╗
║  TESTE AUTOMATICO DE APOSTAS MINIMAS   ║
╚════════════════════════════════════════╝
`);

// Verificar se WillDadosAposta carregou
if (typeof globalThis.WillDadosAposta === 'undefined') {
  console.error('✗ WillDadosAposta não carregou!');
  console.error('  Recarregue a extensão (chrome://extensions → Reload)');
  console.error('  Depois recarregue a página (F5)');
} else if (typeof globalThis.WillDadosAposta.realizarAposta !== 'function') {
  console.error('✗ Função realizarAposta não encontrada!');
} else {
  console.log('✓ WillDadosAposta carregado com sucesso\n');

  // Função de teste
  async function testarApostasMinimas() {
    console.log('═══════════════════════════════════════════════════');
    console.log('TESTE 1: Aposta Mínima em PLAYER (R$ 5)');
    console.log('═══════════════════════════════════════════════════\n');
    
    try {
      const resultado1 = await globalThis.WillDadosAposta.realizarAposta('P', 5);
      console.log('\nResultado Teste 1:', resultado1);
      
      // Aguardar 3 segundos para próximo teste
      await new Promise(r => setTimeout(r, 3000));
      
      console.log('\n═══════════════════════════════════════════════════');
      console.log('TESTE 2: Aposta Mínima em BANKER (R$ 5)');
      console.log('═══════════════════════════════════════════════════\n');
      
      const resultado2 = await globalThis.WillDadosAposta.realizarAposta('B', 5);
      console.log('\nResultado Teste 2:', resultado2);
      
      // Aguardar 3 segundos
      await new Promise(r => setTimeout(r, 3000));
      
      console.log('\n═══════════════════════════════════════════════════');
      console.log('TESTE 3: Aposta Mínima em TIE (R$ 5)');
      console.log('═══════════════════════════════════════════════════\n');
      
      const resultado3 = await globalThis.WillDadosAposta.realizarAposta('T', 5);
      console.log('\nResultado Teste 3:', resultado3);
      
      // Resumo final
      console.log('\n═══════════════════════════════════════════════════');
      console.log('RESUMO DOS TESTES');
      console.log('═══════════════════════════════════════════════════\n');
      
      const resultados = [
        { nome: 'PLAYER', ok: resultado1.ok, motivo: resultado1.motivo },
        { nome: 'BANKER', ok: resultado2.ok, motivo: resultado2.motivo },
        { nome: 'TIE', ok: resultado3.ok, motivo: resultado3.motivo }
      ];
      
      resultados.forEach((r, i) => {
        const status = r.ok ? '✓' : '✗';
        console.log(`[${i+1}] ${status} ${r.nome}: ${r.motivo}`);
      });
      
      const sucessos = resultados.filter(r => r.ok).length;
      console.log(`\nTotal: ${sucessos}/3 testes passaram`);
      
      if (sucessos === 3) {
        console.log('🎉 SUCESSO! Todos os cliques funcionam!');
      } else if (sucessos > 0) {
        console.log('⚠️  Alguns testes passaram, mas nem todos.');
        console.log('Verifique os logs acima para ver qual falhou.');
      } else {
        console.log('❌ Nenhum teste passou. Verifique os logs acima.');
      }
      
    } catch (error) {
      console.error('✗ Erro ao executar testes:', error.message);
      console.error(error);
    }
  }

  // Executar testes
  testarApostasMinimas();
}
```

### 4. Pressione Enter

O script irá:
1. Fazer uma aposta de R$ 5 em **PLAYER**
2. Aguardar 3 segundos
3. Fazer uma aposta de R$ 5 em **BANKER**
4. Aguardar 3 segundos
5. Fazer uma aposta de R$ 5 em **TIE**
6. Mostrar um resumo com os resultados

---

## O Que Você Verá

### Se Funcionar Perfeitamente
```
✓ WillDadosAposta carregado com sucesso

═══════════════════════════════════════════════════
TESTE 1: Aposta Mínima em PLAYER (R$ 5)
═══════════════════════════════════════════════════

[REALIZAR-APOSTA] Procurando chip de R$ 5...
[REALIZAR-APOSTA] ✓ Chip exato R$ 5 encontrado, clicando...
[REALIZAR-APOSTA] Procurando área de PLAYER...
[REALIZAR-APOSTA] ✓ Encontrou 1 candidatos para PLAYER
[REALIZAR-APOSTA] Clicando em PLAYER...
[REALIZAR-APOSTA] ✓ Clique em PLAYER executado

═══════════════════════════════════════════════════
RESUMO DOS TESTES
═══════════════════════════════════════════════════

[1] ✓ PLAYER: Aposta P enviada: Chip R$ 5 selecionado -> Clique em P [<button class="...">]
[2] ✓ BANKER: Aposta B enviada: Chip R$ 5 selecionado -> Clique em B [<button class="...">]
[3] ✓ TIE: Aposta T enviada: Chip R$ 5 selecionado -> Clique em T [<button class="...">]

Total: 3/3 testes passaram
🎉 SUCESSO! Todos os cliques funcionam!
```

### Se Falhar
Se ver algo como:
```
✗ Área PLAYER não encontrada na UI após aguardar
```

Significa que o seletor de `candidatosArea` não está encontrando o elemento. Vamos coletar mais dados.

---

## Se Um Teste Falhar

1. Copie **toda a saída** do console
2. Me envie
3. Vamos diagnosticar qual é a estrutura HTML do Betboom

Os logs vão mostrar exatamente:
- Se encontrou o chip ✓ ou ✗
- Se encontrou a área ✓ ou ✗
- Quantas tentativas fez
- Por que falhou

---

## ⚠️ IMPORTANTE

- As apostas são **MÍNIMAS** (R$ 5 cada)
- Total: R$ 15 no máximo
- Você precisa ter **saldo suficiente** na conta
- As apostas são **REAIS** (não fake) - use conta de teste!
- Se não quiser fazer apostas, só copie os logs de erro

---

## Próximas Ações

1. **Faça o teste**
2. **Copie os logs**
3. **Me envie a saída**
4. **Corrigirei** baseado no resultado

**Teste agora!** 🚀
