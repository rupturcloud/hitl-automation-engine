# 🎬 EXECUTAR TESTE AGORA

## O Que Vamos Fazer

Sistema vai **fazer 4 apostas reais** com estratégia de proteção:

| # | Estratégia | Lado | Valor | Empate | Total |
|---|-----------|------|-------|--------|-------|
| 1 | Azul + Empate | PLAYER | R$ 5 | R$ 5 | R$ 10 |
| 2 | Vermelho + Empate | BANKER | R$ 5 | R$ 5 | R$ 10 |
| 3 | Azul + Empate | PLAYER | R$ 10 | R$ 5 | R$ 15 |
| 4 | Vermelho + Empate | BANKER | R$ 10 | R$ 5 | R$ 15 |

**Total de investimento**: R$ 50

---

## Passo a Passo

### 1. Abra o Betboom
```
https://betboom.bet.br
```

Vá para uma **mesa viva** de Bac Bo (não histórico!).

### 2. Pressione F12
Abra o Developer Tools, clique em **Console**.

### 3. Cole Este Script Inteiro

**COPIE TUDO ABAIXO E COLE NO CONSOLE:**

```javascript
window.TesteProtegido = (function() {
  let resultados = {
    apostas: [],
    sucesso: 0,
    falha: 0,
    erros: []
  };

  const ESTRATEGIAS = [
    { nome: 'Azul + Empate', lado: 'P', stake: 5, empate: 5 },
    { nome: 'Vermelho + Empate', lado: 'B', stake: 5, empate: 5 },
    { nome: 'Azul + Empate', lado: 'P', stake: 10, empate: 5 },
    { nome: 'Vermelho + Empate', lado: 'B', stake: 10, empate: 5 },
  ];

  async function testarEstrategia(estrategia, indice) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`TESTE ${indice + 1}/4: ${estrategia.nome}`);
    console.log(`Aposta: R$ ${estrategia.stake} ${estrategia.lado === 'P' ? 'PLAYER' : 'BANKER'} + R$ ${estrategia.empate} EMPATE`);
    console.log(`${'═'.repeat(60)}\n`);

    const tempoInicio = Date.now();
    try {
      if (!globalThis.WillDadosAposta?.realizarAposta) {
        throw new Error('WillDadosAposta.realizarAposta não encontrado!');
      }

      console.log(`[TESTE ${indice + 1}] Apostando R$ ${estrategia.stake} em ${estrategia.lado === 'P' ? 'PLAYER' : 'BANKER'}...`);
      const resultado1 = await globalThis.WillDadosAposta.realizarAposta(estrategia.lado, estrategia.stake);
      if (!resultado1.ok) throw new Error(`Lado: ${resultado1.motivo}`);
      console.log(`[TESTE ${indice + 1}] ✓ Aposta no lado bem-sucedida`);

      await new Promise(r => setTimeout(r, 1000));

      console.log(`[TESTE ${indice + 1}] Apostando R$ ${estrategia.empate} em EMPATE (proteção)...`);
      const resultado2 = await globalThis.WillDadosAposta.realizarAposta('T', estrategia.empate);
      if (!resultado2.ok) throw new Error(`Empate: ${resultado2.motivo}`);
      console.log(`[TESTE ${indice + 1}] ✓ Aposta de proteção bem-sucedida`);

      const tempoGasto = Date.now() - tempoInicio;
      resultados.apostas.push({
        numero: indice + 1,
        estrategia: estrategia.nome,
        lado: estrategia.lado === 'P' ? 'PLAYER' : 'BANKER',
        stake: estrategia.stake,
        empate: estrategia.empate,
        status: 'SUCESSO',
        tempoMs: tempoGasto
      });
      resultados.sucesso++;
      console.log(`[TESTE ${indice + 1}] ✓ SUCESSO em ${tempoGasto}ms\n`);
      return true;
    } catch (error) {
      const tempoGasto = Date.now() - tempoInicio;
      resultados.apostas.push({
        numero: indice + 1,
        estrategia: estrategia.nome,
        lado: estrategia.lado === 'P' ? 'PLAYER' : 'BANKER',
        stake: estrategia.stake,
        empate: estrategia.empate,
        status: 'FALHA',
        erro: error.message,
        tempoMs: tempoGasto
      });
      resultados.falha++;
      resultados.erros.push(error.message);
      console.error(`[TESTE ${indice + 1}] ✗ FALHA: ${error.message}`);
      return false;
    }
  }

  async function iniciar() {
    console.log(`
╔════════════════════════════════════════╗
║     TESTE - ESTRATEGIA PROTEGIDA       ║
║           4 APOSTAS REAIS              ║
║            Total: R$ 50                ║
╚════════════════════════════════════════╝
    `);

    const tempoInicio = Date.now();

    for (let i = 0; i < ESTRATEGIAS.length; i++) {
      await testarEstrategia(ESTRATEGIAS[i], i);
      if (i < ESTRATEGIAS.length - 1) {
        console.log('Aguardando próximo teste...\n');
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    const tempoTotal = Date.now() - tempoInicio;

    console.log(`\n${'═'.repeat(60)}`);
    console.log('RELATORIO FINAL');
    console.log(`${'═'.repeat(60)}\n`);
    console.log(`Total: ${resultados.apostas.length} testes`);
    console.log(`Sucessos: ${resultados.sucesso} ✓`);
    console.log(`Falhas: ${resultados.falha} ✗`);
    console.log(`Taxa: ${Math.round((resultados.sucesso / resultados.apostas.length) * 100)}%`);
    console.log(`Tempo: ${(tempoTotal / 1000).toFixed(1)}s\n`);

    console.log('RESULTADOS:');
    resultados.apostas.forEach(r => {
      const status = r.status === 'SUCESSO' ? '✓' : '✗';
      console.log(`[${r.numero}] ${status} ${r.estrategia} - ${r.status}${r.erro ? ': ' + r.erro : ''}`);
    });

    console.log(`\n${'═'.repeat(60)}`);
    console.log('DADOS PARA ENVIAR:');
    console.log(`${'═'.repeat(60)}\n`);
    console.log(JSON.stringify(resultados, null, 2));

    if (resultados.sucesso === resultados.apostas.length) {
      console.log('\n🎉 100% DE SUCESSO!');
    } else if (resultados.sucesso > 0) {
      console.log('\n⚠️  SUCESSO PARCIAL');
    } else {
      console.log('\n❌ FALHA TOTAL');
    }
  }

  return { iniciar, resultados: () => resultados };
})();

console.log('\n✓ Script carregado!\nExecute: TesteProtegido.iniciar()');
```

### 4. Pressione Enter

Você verá:
```
✓ Script carregado!
Execute: TesteProtegido.iniciar()
```

### 5. No Console, Digite:

```javascript
TesteProtegido.iniciar()
```

### 6. Pressione Enter

O sistema vai:
- Fazer aposta 1 em PLAYER + EMPATE
- Aguardar 2 segundos
- Fazer aposta 2 em BANKER + EMPATE
- Aguardar 2 segundos
- Fazer aposta 3 em PLAYER + EMPATE (maior)
- Aguardar 2 segundos
- Fazer aposta 4 em BANKER + EMPATE (maior)
- Mostrar relatório final

---

## O Que Você Verá

### Se FUNCIONAR (100% sucesso)
```
═════════════════════════════════════════
TESTE 1/4: Azul + Empate
═════════════════════════════════════════

[TESTE 1] Apostando R$ 5 em PLAYER...
[TESTE 1] ✓ Aposta no lado bem-sucedida
[TESTE 1] Apostando R$ 5 em EMPATE (proteção)...
[TESTE 1] ✓ Aposta de proteção bem-sucedida
[TESTE 1] ✓ SUCESSO em 2345ms

...

═════════════════════════════════════════
RELATORIO FINAL
═════════════════════════════════════════

Total: 4 testes
Sucessos: 4 ✓
Falhas: 0 ✗
Taxa: 100%
Tempo: 15.2s

🎉 100% DE SUCESSO!
```

### Se FALHAR (alguns erros)
```
[TESTE 2] ✗ FALHA: Área BANKER não encontrada
[TESTE 3] ✓ SUCESSO em 2100ms
[TESTE 4] ✗ FALHA: Chip R$ 10 não encontrado

Sucessos: 2 ✓
Falhas: 2 ✗
Taxa: 50%

⚠️  SUCESSO PARCIAL
```

---

## O Que Fazer Depois

### Se 100% Sucesso ✓
```
🎉 PROBLEMA RESOLVIDO!

Próximas ações:
1. Testar com valores maiores
2. Testar em múltiplas rodadas
3. Otimizar timing dos cliques
4. Implementar sistema de gale
```

### Se Sucesso Parcial ⚠️
```
Copie:
1. Toda a saída do console
2. O JSON final (DADOS PARA ENVIAR)
3. Me envie
4. Vou analisar e corrigir
```

### Se Falha Total ❌
```
Copie:
1. Todos os logs
2. A lista de erros
3. Me envie
4. Vou debugar
```

---

## 💡 Dicas

- **Não feche console** enquanto roda (leva ~15-20s)
- **Mesa precisa estar viva** (rodadas em andamento)
- **Tenha saldo suficiente** (mínimo R$ 50)
- **Use conta de teste** se tiver

---

## 📞 Próximas Ações Após Teste

1. Me envie **TODA a saída do console**
2. Me envie o **JSON final** (seção "DADOS PARA ENVIAR")
3. Eu vou **analisar os resultados**
4. Vou **otimizar o código** baseado nos erros
5. Você testa novamente

---

**EXECUTE AGORA!** Cole o script e rode `TesteProtegido.iniciar()` 🚀
