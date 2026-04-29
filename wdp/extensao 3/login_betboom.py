#!/usr/bin/env python3
"""
login_betboom.py — Login manual no betboom e salva a sessão no perfil Selenium.

Abre o Chrome com o perfil ~/.selenium_profile_diego.
Você faz login manualmente, navega até o jogo Bac Bo.
Quando fechar o Chrome (Cmd+Q), a sessão fica salva para próximas execuções.

Uso:
  python3 extensao\ 3/login_betboom.py
"""

from seleniumbase import Driver
from pathlib import Path

PROFILE_DIR = Path.home() / ".selenium_profile_diego"
EXT_PATH = str(Path(__file__).parent.resolve())

print("=" * 60)
print("  Will Dados Pro — Login BetBoom")
print(f"  Perfil: {PROFILE_DIR}")
print(f"  Extensão: {EXT_PATH}")
print("=" * 60)
print("\n📋 INSTRUÇÕES:")
print("  1. O Chrome vai abrir")
print("  2. Faça LOGIN no betboom")
print("  3. Navegue até: https://betboom.bet.br/casino/game/bac_bo-26281/")
print("  4. Quando o jogo carregar, FECHE o Chrome (Cmd+Q ou Ctrl+Q)")
print("  5. A sessão será salva automaticamente")
print("\n")

PROFILE_DIR.mkdir(parents=True, exist_ok=True)

# Remove lock files
for lock in ["SingletonLock", "SingletonCookie", "SingletonSocket"]:
    p = PROFILE_DIR / lock
    if p.exists():
        try:
            p.unlink()
        except Exception:
            pass

print("🔓 Abrindo Chrome com extensão carregada...")
driver = Driver(
    uc=True,
    headed=True,
    extension_dir=EXT_PATH,
    user_data_dir=str(PROFILE_DIR),
)

driver.open("https://betboom.bet.br")
print("✓ Chrome aberto. Faça login e navegue até o jogo Bac Bo.")
print("✓ Quando terminar, feche o Chrome (Cmd+Q).")
print("\nAguardando... (você pode fechar o Chrome quando estiver pronto)\n")

try:
    while True:
        import time
        time.sleep(1)
except KeyboardInterrupt:
    print("\n✓ Encerrando...")
    driver.quit()
    print("✓ Sessão salva em:", PROFILE_DIR)
