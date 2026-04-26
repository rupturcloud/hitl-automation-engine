"""Testes do Bet Executor."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from bet_executor import ChipResolver, BetExecutor
from schemas import ExecutionCommand
from datetime import datetime

def test_chip_resolver_exact():
    """Testa resolução exata de fichas."""
    # Teste 1: Stake simples
    chips = ChipResolver.resolve_stake(50, [5, 10, 25, 100, 500])
    assert chips is not None
    assert sum(chips) == 50
    print(f"✓ Stake 50 resolved: {chips}")

    # Teste 2: Stake maior
    chips = ChipResolver.resolve_stake(175, [5, 10, 25, 100, 500])
    assert chips is not None
    assert sum(chips) == 175
    print(f"✓ Stake 175 resolved: {chips}")

    # Teste 3: Stake com uma ficha
    chips = ChipResolver.resolve_stake(100, [5, 10, 25, 100, 500])
    assert chips is not None
    assert sum(chips) == 100
    print(f"✓ Stake 100 resolved: {chips}")

def test_chip_resolver_impossible():
    """Testa caso impossível."""
    # Stake não é múltiplo mínimo
    chips = ChipResolver.resolve_stake(7, [10, 25, 100])
    assert chips is None
    print("✓ Impossível 7 com fichas [10, 25, 100] corretamente rejeitado")

def test_chip_resolver_zero_negative():
    """Testa valores inválidos."""
    chips = ChipResolver.resolve_stake(0, [5, 10])
    assert chips is None
    print("✓ Stake 0 rejeitado")

    chips = ChipResolver.resolve_stake(-50, [5, 10])
    assert chips is None
    print("✓ Stake negativo rejeitado")

def test_execution_command():
    """Testa criação de ExecutionCommand."""
    cmd = ExecutionCommand(
        execution_id="exec-001",
        decision_id="dec-001",
        round_id="round-1",
        issued_at=datetime.utcnow().isoformat(),
        side="BLUE",
        stake=100.0,
        chips_plan=[100],
        must_verify_ui_before_submit=True,
        must_verify_ui_after_submit=True
    )

    assert cmd.side == "BLUE"
    assert cmd.stake == 100.0
    assert cmd.chips_plan == [100]
    print("✓ ExecutionCommand criado corretamente")

if __name__ == "__main__":
    test_chip_resolver_exact()
    test_chip_resolver_impossible()
    test_chip_resolver_zero_negative()
    test_execution_command()
    print("\n✅ Todos os testes do Executor passaram!")
