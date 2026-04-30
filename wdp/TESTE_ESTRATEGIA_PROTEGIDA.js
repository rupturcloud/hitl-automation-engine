/**
 * TESTE_ESTRATEGIA_PROTEGIDA.js
 *
 * Estratégia de teste com proteção:
 * - Aposta sempre em UM lado (Player ou Banker)
 * - Aposta SEMPRE em Empate (proteção)
 * - Registra TODOS os resultados
 * - Analisa taxa de sucesso
 *
 * Cole no console do Betboom e execute: TesteProtegido.iniciar()
 */

window.TesteProtegido = (function() {
  let resultados = {
    apostas: [],
    sucesso: 0,
    falha: 0,
    tempoTotal: 0,
    erros: []
  };

  const ESTRATEGIAS = [
    { nome: 'Azul + Empate', lado: 'P', stake: 5, empate: 5 },      // Player + Tie
    { nome: 'Vermelho + Empate', lado: 'B', stake: 5, empate: 5 },  // Banker + Tie
    { nome: 'Azul + Empate', lado: 'P', stake: 10, empate: 5 },     // Player + Tie (maior)
    { nome: 'Vermelho + Empate', lado: 'B', stake: 10, empate: 5 }, // Banker + Tie (maior)
  ];

  async function testarEstrategia(estrategia, indice) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`TESTE ${indice + 1}/${ESTRATEGIAS.length}: ${estrategia.nome}`);
    console.log(`Aposta: R$ ${estrategia.stake} ${estrategia.lado === 'P' ? 'PLAYER' : 'BANKER'} + R$ ${estrategia.empate} EMPATE`);
    console.log(`${'═'.repeat(60)}\n`);

    const tempoInicio = Date.now();

    try {
      // Verificar se função existe
      if (!globalThis.WillDadosAposta?.realizarAposta) {
        throw new Error('WillDadosAposta.realizarAposta não encontrado!');
      }

      // Fazer aposta no lado
      console.log(`[TESTE ${indice + 1}] Apostando R$ ${estrategia.stake} em ${estrategia.lado === 'P' ? 'PLAYER' : 'BANKER'}...`);
      const resultado1 = await globalThis.WillDadosAposta.realizarAposta(estrategia.lado, estrategia.stake);

      if (!resultado1.ok) {
        throw new Error(`Falha ao apostar no lado: ${resultado1.motivo}`);
      }
      console.log(`[TESTE ${indice + 1}] ✓ Aposta no lado bem-sucedida`);

      // Aguardar um pouco
      await new Promise(r => setTimeout(r, 1000));

      // Fazer aposta de proteção no empate
      console.log(`[TESTE ${indice + 1}] Apostando R$ ${estrategia.empate} em EMPATE (proteção)...`);
      const resultado2 = await globalThis.WillDadosAposta.realizarAposta('T', estrategia.empate);

      if (!resultado2.ok) {
        throw new Error(`Falha ao apostar no empate: ${resultado2.motivo}`);
      }
      console.log(`[TESTE ${indice + 1}] ✓ Aposta de proteção bem-sucedida`);

      const tempoGasto = Date.now() - tempoInicio;

      const registro = {
        numero: indice + 1,
        estrategia: estrategia.nome,
        lado: estrategia.lado === 'P' ? 'PLAYER' : 'BANKER',
        stakeLado: estrategia.stake,
        stakeEmpate: estrategia.empate,
        status: 'SUCESSO',
        tempoMs: tempoGasto,
        timestamp: new Date().toLocaleTimeString()
      };

      resultados.apostas.push(registro);
      resultados.sucesso++;
      resultados.tempoTotal += tempoGasto;

      console.log(`[TESTE ${indice + 1}] ✓ SUCESSO em ${tempoGasto}ms\n`);
      return true;

    } catch (error) {
      const tempoGasto = Date.now() - tempoInicio;

      const registro = {
        numero: indice + 1,
        estrategia: estrategia.nome,
        lado: estrategia.lado === 'P' ? 'PLAYER' : 'BANKER',
        stakeLado: estrategia.stake,
        stakeEmpate: estrategia.empate,
        status: 'FALHA',
        erro: error.message,
        tempoMs: tempoGasto,
        timestamp: new Date().toLocaleTimeString()
      };

      resultados.apostas.push(registro);
      resultados.falha++;
      resultados.erros.push(error.message);

      console.error(`[TESTE ${indice + 1}] ✗ FALHA: ${error.message}`);
      console.error(`[TESTE ${indice + 1}] Tempo decorrido: ${tempoGasto}ms\n`);
      return false;
    }
  }

  async function iniciar() {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║     TESTE AUTOMATICO - ESTRATEGIA COM PROTECAO             ║
║                                                            ║
║  Vai fazer ${ESTRATEGIAS.length} apostas com proteção em empate      ║
║  Total de R$ ${ESTRATEGIAS.reduce((a, e) => a + e.stake + e.empate, 0)}                                          ║
║  Registra todos os resultados para análise                ║
╚════════════════════════════════════════════════════════════╝
    `);

    const tempoTotalInicio = Date.now();

    for (let i = 0; i < ESTRATEGIAS.length; i++) {
      const estrategia = ESTRATEGIAS[i];
      await testarEstrategia(estrategia, i);

      // Aguardar 2 segundos entre testes para dar tempo da mesa preparar
      if (i < ESTRATEGIAS.length - 1) {
        console.log('Aguardando próximo teste...\n');
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    const tempoTotalGasto = Date.now() - tempoTotalInicio;
    relatorio(tempoTotalGasto);
  }

  function relatorio(tempoTotal) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log('RELATORIO FINAL');
    console.log(`${'═'.repeat(60)}\n`);

    console.log(`Total de testes: ${resultados.apostas.length}`);
    console.log(`Sucessos: ${resultados.sucesso} ✓`);
    console.log(`Falhas: ${resultados.falha} ✗`);
    console.log(`Taxa de sucesso: ${Math.round((resultados.sucesso / resultados.apostas.length) * 100)}%`);
    console.log(`Tempo total: ${tempoTotal / 1000}s\n`);

    console.log('DETALHES DE CADA TESTE:');
    console.log('─'.repeat(60));

    resultados.apostas.forEach((r, i) => {
      const status = r.status === 'SUCESSO' ? '✓' : '✗';
      console.log(`\n[Teste ${r.numero}] ${status} ${r.estrategia}`);
      console.log(`  Ação: R$ ${r.stakeLado} em ${r.lado} + R$ ${r.stakeEmpate} em EMPATE`);
      console.log(`  Status: ${r.status}`);
      console.log(`  Tempo: ${r.tempoMs}ms`);
      if (r.erro) console.log(`  Erro: ${r.erro}`);
    });

    // Análise de erros comuns
    if (resultados.erros.length > 0) {
      console.log(`\n${'─'.repeat(60)}`);
      console.log('ERROS ENCONTRADOS:');
      const errosUnicos = [...new Set(resultados.erros)];
      errosUnicos.forEach((erro, i) => {
        const count = resultados.erros.filter(e => e === erro).length;
        console.log(`  [${i + 1}] ${erro} (${count}x)`);
      });
    }

    // Recomendações
    console.log(`\n${'─'.repeat(60)}`);
    console.log('RECOMENDACOES:');
    if (resultados.sucesso === resultados.apostas.length) {
      console.log('🎉 100% de sucesso! Sistema funcionando perfeitamente.');
      console.log('   Próximo passo: testar com valores maiores e em múltiplas rodadas.');
    } else if (resultados.sucesso > 0) {
      console.log('⚠️  Sucesso parcial. Alguns testes falharam.');
      console.log('   Verifique os erros acima e corrija os seletores.');
    } else {
      console.log('❌ 0% de sucesso. Nenhuma aposta funcionou.');
      console.log('   Problema crítico - verifique se a extensão está ativa.');
    }

    // Exportar para análise
    console.log(`\n${'─'.repeat(60)}`);
    console.log('DADOS PARA ENVIAR:');
    console.log('─'.repeat(60));
    console.log(JSON.stringify(resultados, null, 2));

    console.log(`\n\n${'═'.repeat(60)}`);
    console.log('FIM DO TESTE');
    console.log(`${'═'.repeat(60)}\n`);
  }

  return {
    iniciar,
    relatorio: () => console.log(JSON.stringify(resultados, null, 2)),
    resultados: () => resultados,
    exportarCSV: () => {
      const csv = [
        'Teste,Estratégia,Lado,Valor Lado,Valor Empate,Status,Tempo(ms),Erro'
      ];
      resultados.apostas.forEach(r => {
        csv.push(
          `${r.numero},"${r.estrategia}","${r.lado}","${r.stakeLado}","${r.stakeEmpate}","${r.status}","${r.tempoMs}","${r.erro || ''}"`
        );
      });
      return csv.join('\n');
    }
  };
})();

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PRONTO PARA TESTAR!

 Comando: TesteProtegido.iniciar()

 Vai fazer 4 apostas com proteção:
 1. R$ 5 PLAYER + R$ 5 EMPATE
 2. R$ 5 BANKER + R$ 5 EMPATE
 3. R$ 10 PLAYER + R$ 5 EMPATE
 4. R$ 10 BANKER + R$ 5 EMPATE

 Total: R$ 50 máximo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Auto-start (remover comentário para auto-executar)
// TesteProtegido.iniciar();
