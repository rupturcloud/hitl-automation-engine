document.getElementById('go').addEventListener('click', () => {
  const log = document.getElementById('log');
  const st = document.getElementById('st');

  log.innerHTML += '\n[GO] Disparando robot...\n';
  st.textContent = 'RUNNING';

  // Escreve comando para robot ler
  fetch('http://localhost:9999/start', {method: 'POST'})
    .then(() => log.innerHTML += '[IPC] ✅ Comando enviado\n')
    .catch(e => log.innerHTML += '[IPC] ⚠️ ' + e.message + '\n');
});

document.getElementById('log').innerHTML = '[INIT] Painel pronto, clique GO\n';
