#!/usr/bin/env node
/**
 * Valida se o build frontend está completo e pronto para servir
 */
import { existsSync, readdirSync, statSync } from 'fs';
import { resolve } from 'path';

const distDir = resolve(process.cwd(), 'dist-client');
const errors = [];
const warnings = [];

console.log('\n🔍 Validando build frontend...\n');

// 1. Verificar se dist-client existe
if (!existsSync(distDir)) {
  errors.push('❌ dist-client/ não encontrado');
} else {
  console.log('✅ dist-client/ encontrado');

  // 2. Verificar arquivos críticos
  const requiredFiles = ['index.html', 'favicon.svg', 'manifest.json'];
  requiredFiles.forEach(file => {
    const filePath = resolve(distDir, file);
    if (existsSync(filePath)) {
      const size = statSync(filePath).size;
      console.log(`✅ ${file} (${(size / 1024).toFixed(1)}KB)`);
    } else {
      errors.push(`❌ ${file} não encontrado`);
    }
  });

  // 3. Verificar pasta de assets
  const assetsDir = resolve(distDir, 'assets');
  if (!existsSync(assetsDir)) {
    errors.push('❌ dist-client/assets/ não encontrado');
  } else {
    const assets = readdirSync(assetsDir);
    console.log(`\n✅ assets/ (${assets.length} arquivos)`);

    const jsFiles = assets.filter(f => f.endsWith('.js'));
    const cssFiles = assets.filter(f => f.endsWith('.css'));

    if (jsFiles.length === 0) {
      errors.push('❌ Nenhum arquivo .js encontrado em assets/');
    } else {
      jsFiles.forEach(f => {
        const size = statSync(resolve(assetsDir, f)).size;
        console.log(`  • ${f} (${(size / 1024).toFixed(1)}KB)`);
      });
    }

    if (cssFiles.length === 0) {
      warnings.push('⚠️  Nenhum arquivo .css encontrado em assets/');
    } else {
      cssFiles.forEach(f => {
        const size = statSync(resolve(assetsDir, f)).size;
        console.log(`  • ${f} (${(size / 1024).toFixed(1)}KB)`);
      });
    }
  }

  // 4. Verificar se index.html referencia os assets corretos
  if (existsSync(resolve(distDir, 'index.html'))) {
    const { readFileSync } = await import('fs');
    const html = readFileSync(resolve(distDir, 'index.html'), 'utf-8');

    const jsRef = html.match(/\/assets\/index-[a-zA-Z0-9]+\.js/);
    const cssRef = html.match(/\/assets\/index-[a-zA-Z0-9]+\.css/);

    if (jsRef && existsSync(resolve(distDir, jsRef[0].substring(1)))) {
      console.log(`\n✅ index.html referencia JS correto: ${jsRef[0]}`);
    } else if (jsRef) {
      errors.push(`❌ index.html referencia JS inexistente: ${jsRef[0]}`);
    }

    if (cssRef && existsSync(resolve(distDir, cssRef[0].substring(1)))) {
      console.log(`✅ index.html referencia CSS correto: ${cssRef[0]}`);
    } else if (cssRef) {
      errors.push(`❌ index.html referencia CSS inexistente: ${cssRef[0]}`);
    }
  }
}

// Resumo
console.log('\n' + '='.repeat(50));
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ Build validado com sucesso!');
  console.log('\nPróximos passos:');
  console.log('1. npm run saas       # Inicia o gateway');
  console.log('2. curl http://localhost:3000/');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log('\n🚨 ERROS ENCONTRADOS:\n');
    errors.forEach(e => console.log(`  ${e}`));
  }
  if (warnings.length > 0) {
    console.log('\n⚠️  AVISOS:\n');
    warnings.forEach(w => console.log(`  ${w}`));
  }
  console.log('\nFix: npm run build');
  process.exit(1);
}
