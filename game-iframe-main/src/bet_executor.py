# Bet Executor — Deterministic Click Execution
# Responsável por: resolver fichas, clicar, confirmar

import asyncio
import time
from typing import Optional, List
from datetime import datetime
from schemas import ExecutionCommand, ExecutionResult
from codes import Codes, format_alert

class ChipResolver:
    """Resolve stake em fichas disponíveis."""

    CHIP_VALUES = [5, 10, 25, 100, 500, 1000]  # Valores típicos Evolution

    @staticmethod
    def resolve_stake(stake: float, available_chips: List[float]) -> Optional[List[float]]:
        """
        Resolve stake em combinação de fichas.
        Retorna lista de fichas que somam stake, ou None se impossível.
        """
        if stake <= 0:
            return None

        # Usar chips disponíveis
        chips_to_use = sorted(available_chips, reverse=True)

        plan = []
        remaining = stake

        for chip_value in chips_to_use:
            while remaining >= chip_value:
                plan.append(chip_value)
                remaining -= chip_value

        # Verificar se conseguiu resolver exatamente
        if abs(remaining) < 0.01:  # Tolerância de arredondamento
            return plan

        return None


class BetExecutor:
    """Executa apostas no navegador."""

    def __init__(self, page, debug=True):
        self.page = page
        self.debug = debug
        self.chip_resolver = ChipResolver()

        # Selectores approximados (variam conforme a Evolution)
        self.selectors = {
            "btn_blue": 'button[data-test="bet-player"]',
            "btn_red": 'button[data-test="bet-banker"]',
            "btn_tie": 'button[data-test="bet-tie"]',
            "chip_5": '[data-chip-value="5"]',
            "chip_10": '[data-chip-value="10"]',
            "chip_25": '[data-chip-value="25"]',
            "chip_100": '[data-chip-value="100"]',
            "chip_500": '[data-chip-value="500"]',
            "chip_1000": '[data-chip-value="1000"]',
            "btn_confirm": 'button[data-test="confirm-bet"]',
            "btn_cancel": 'button[data-test="cancel-bet"]',
        }

    async def pre_execution_check(self) -> bool:
        """Valida estado da UI antes de clicar."""
        try:
            # Verificar se página está respondendo
            await asyncio.wait_for(
                self.page.evaluate("1 + 1"),
                timeout=2.0
            )

            # Verificar se há botões de aposta visíveis
            blue_visible = await self.page.is_visible(self.selectors["btn_blue"])
            red_visible = await self.page.is_visible(self.selectors["btn_red"])

            if not (blue_visible or red_visible):
                alert = format_alert(
                    Codes.EXECUTOR_SEM_CONFIRMACAO_PRE_CLICK,
                    "Botões de aposta não visíveis",
                    ""
                )
                print(alert["formatted"])
                return False

            return True

        except Exception as e:
            alert = format_alert(
                Codes.EXECUTOR_SEM_CONFIRMACAO_PRE_CLICK,
                "Erro ao validar UI pré-clique",
                str(e)
            )
            print(alert["formatted"])
            return False

    async def execute_bet(self, command: ExecutionCommand) -> ExecutionResult:
        """Executa aposta: seleciona fichas, clica, confirma."""
        execution_id = command.execution_id
        start_time = datetime.utcnow().isoformat()

        result = ExecutionResult(
            execution_id=execution_id,
            executed_at=start_time,
            status="FAILED",
            pre_click_ui_valid=False,
            post_click_ui_valid=False,
            error_code=Codes.EXECUTOR_SEM_CONFIRMACAO_PRE_CLICK,
            error_message="Não iniciado"
        )

        try:
            # 1. Validação pré-clique
            pre_check = await self.pre_execution_check()
            if not pre_check:
                result.status = "FAILED"
                result.error_code = Codes.EXECUTOR_SEM_CONFIRMACAO_PRE_CLICK
                return result

            result.pre_click_ui_valid = True

            # 2. Resolver fichas
            available_chips = [5, 10, 25, 100, 500, 1000]
            chip_plan = self.chip_resolver.resolve_stake(command.stake, available_chips)

            if not chip_plan:
                result.status = "FAILED"
                result.error_code = Codes.CHIP_PLAN_UNSATISFIABLE
                result.error_message = f"Não conseguiu resolver stake {command.stake} com fichas {available_chips}"
                return result

            if self.debug:
                print(f"[Executor] Chip plan: {chip_plan} (soma={sum(chip_plan)})")

            # 3. Clicar em fichas (sequência)
            for chip_value in chip_plan:
                selector = {
                    5: self.selectors["chip_5"],
                    10: self.selectors["chip_10"],
                    25: self.selectors["chip_25"],
                    100: self.selectors["chip_100"],
                    500: self.selectors["chip_500"],
                    1000: self.selectors["chip_1000"],
                }.get(chip_value)

                if selector:
                    try:
                        await self.page.click(selector)
                        await asyncio.sleep(0.1)  # Pequeno delay entre cliques
                    except Exception as e:
                        if self.debug:
                            print(f"[Executor] Aviso: chip {chip_value} não encontrado ({e})")

            # 4. Clicar em lado (BLUE/RED/TIE)
            side_selector = {
                "BLUE": self.selectors["btn_blue"],
                "RED": self.selectors["btn_red"],
                "TIE": self.selectors["btn_tie"],
            }.get(command.side)

            if not side_selector:
                result.status = "FAILED"
                result.error_code = "INVALID_SIDE"
                result.error_message = f"Lado inválido: {command.side}"
                return result

            try:
                await asyncio.wait_for(
                    self.page.click(side_selector),
                    timeout=2.0
                )
                result.click_timestamp = datetime.utcnow().isoformat()
                result.click_side_rendered = command.side
                result.click_stake_rendered = command.stake

            except asyncio.TimeoutError:
                result.status = "FAILED"
                result.error_code = Codes.JANELA_ENTRADA_EXPIRADA
                result.error_message = "Clique no botão de lado expirou"
                return result

            if self.debug:
                print(f"[Executor] Clique em {command.side} com stake {command.stake}")

            # 5. Confirmar aposta (click em "Confirmar" se houver botão)
            try:
                if await self.page.is_visible(self.selectors["btn_confirm"]):
                    await self.page.click(self.selectors["btn_confirm"])
                    await asyncio.sleep(0.2)
            except:
                pass  # Nem sempre há botão de confirmação explícito

            # 6. Validação pós-clique
            post_check = await self.post_execution_check()
            result.post_click_ui_valid = post_check

            result.status = "SUCCESS"
            result.executed_at = datetime.utcnow().isoformat()

            return result

        except Exception as e:
            result.status = "FAILED"
            result.error_code = "EXECUTOR_ERROR"
            result.error_message = str(e)
            return result

    async def post_execution_check(self) -> bool:
        """Valida estado da UI após clique."""
        try:
            # Verificar se página ainda responde
            await asyncio.wait_for(
                self.page.evaluate("1 + 1"),
                timeout=2.0
            )
            return True
        except:
            return False

    async def cancel_bet(self) -> bool:
        """Cancela aposta se houver botão."""
        try:
            if await self.page.is_visible(self.selectors["btn_cancel"]):
                await self.page.click(self.selectors["btn_cancel"])
                return True
        except:
            pass
        return False


async def execute_command(page, command: ExecutionCommand, debug=True) -> ExecutionResult:
    """Helper para executar comando de aposta."""
    executor = BetExecutor(page, debug=debug)
    return await executor.execute_bet(command)
