# Will Hybrid Bot - Scripts

## 4 Scripts Principais

### 1️⃣ Salvar Sessão Diego
```bash
python3 /Users/diego/dev/ruptur-cloud/save_session_diego.py
```
- Abre navegador
- Você loga com **diegoizac@gmail.com**
- Digita ENTER quando pronto
- Salva em `betboom_session_diego.json`

---

### 2️⃣ Salvar Sessão Leticia
```bash
python3 /Users/diego/dev/ruptur-cloud/save_session_leticia.py
```
- Abre navegador
- Você loga com **leticiavoglcosta@gmail.com**
- Digita ENTER quando pronto
- Salva em `betboom_session_leticia.json`

---

### 3️⃣ Server IPC (porta 9999)
```bash
python3 /Users/diego/dev/ruptur-cloud/will_server_ipc.py
```
- Ativa o servidor HTTP
- Aguarda comando [GO] da extensão
- **Deixe sempre rodando!**

---

### 4️⃣ Executar Robot (Diego)
```bash
python3 /Users/diego/dev/ruptur-cloud/will_robot_hybrid.py diego
```
- Carrega sessão do Diego
- Abre navegador com extensão
- Aguarda [GO] para automatizar

---

### 4️⃣ Executar Robot (Leticia)
```bash
python3 /Users/diego/dev/ruptur-cloud/will_robot_hybrid.py leticia
```
- Carrega sessão da Leticia
- Abre navegador com extensão
- Aguarda [GO] para automatizar

---

## Fluxo Completo

**1. Uma única vez (salvar sessão):**
```bash
python3 save_session_diego.py      # Ou leticia
# Você loga e digita ENTER
```

**2. Sempre rodando (server):**
```bash
python3 will_server_ipc.py
# Deixe sempre aberto em outro terminal
```

**3. Para rodar (executa robot):**
```bash
python3 will_robot_hybrid.py diego    # Ou leticia
# Clique [GO] na extensão
```

---

## Resumo de Portas
- **9999** - will_server_ipc.py (Server HTTP)
- Outros scripts não usam portas

