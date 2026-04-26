#!/usr/bin/env python3
"""
Click Humanizer v2 - CORRIGIDO
Usa métodos REAIS do SeleniumBase
"""

import time
import random

class HumanizedClicker:
    """
    Humaniza clicks do Selenium usando métodos REAIS do SB
    """

    def __init__(self, sb):
        self.sb = sb
        self.min_delay = 0.3
        self.max_delay = 1.0

    def _get_random_delay(self):
        """Delay aleatório entre min e max"""
        return random.uniform(self.min_delay, self.max_delay)

    def click_element(self, selector, delay_before=None, delay_after=None):
        """
        Clica em elemento de forma humanizada:
        1. Aguarda elemento existir
        2. Hover suave
        3. Delay natural
        4. Click
        5. Delay pós-click
        """
        try:
            # Aguarda elemento estar clicável
            self.sb.wait_for_element_clickable(selector, timeout=5)

            # Delay pré-click (natural)
            pre_delay = delay_before or self._get_random_delay()
            time.sleep(pre_delay)

            # Hover suave no elemento (movimento humanizado)
            self.sb.hover(selector)
            time.sleep(random.uniform(0.15, 0.4))

            # Click lento (humanizado - não instantâneo)
            self.sb.slow_click(selector)

            # Delay pós-click
            post_delay = delay_after or self._get_random_delay()
            time.sleep(post_delay)

            return True

        except Exception as e:
            print(f'[CLICK] ❌ Erro ao clicar: {e}')
            return False

    def hover_and_click(self, selector, hover_duration=0.3, delay_before=None, delay_after=None):
        """
        Hover + click (mais humanizado ainda)
        """
        try:
            self.sb.wait_for_element_clickable(selector, timeout=5)

            pre_delay = delay_before or self._get_random_delay()
            time.sleep(pre_delay)

            # Hover com duração
            self.sb.hover(selector)
            time.sleep(hover_duration)

            # Click
            self.sb.click(selector)

            post_delay = delay_after or self._get_random_delay()
            time.sleep(post_delay)

            return True

        except Exception as e:
            print(f'[CLICK] ❌ Erro: {e}')
            return False

    def click_by_text(self, button_text, delay_before=None, delay_after=None):
        """
        Clica em botão procurando pelo texto
        """
        try:
            # Procura botão com esse texto
            selector = f'button:contains("{button_text}")'
            self.sb.wait_for_element_clickable(selector, timeout=5)

            pre_delay = delay_before or self._get_random_delay()
            time.sleep(pre_delay)

            self.sb.hover(selector)
            time.sleep(0.2)

            self.sb.slow_click(selector)

            post_delay = delay_after or self._get_random_delay()
            time.sleep(post_delay)

            return True

        except Exception as e:
            print(f'[CLICK] ❌ Erro: {e}')
            return False


class MouseCursorVisualizer:
    """
    Mostra cursor do robot na página (CSS injection)
    """

    def __init__(self, sb):
        self.sb = sb

    def injetar_css_cursor_duplo(self):
        """
        Injeta CSS pra mostrar cursor do robot
        """
        css = """
        /* Cursor do robot - 🤖 emoji */
        body::before {
            content: "🤖";
            position: fixed;
            pointer-events: none;
            z-index: 99999;
            font-size: 24px;
            display: none;
            left: 0;
            top: 0;
        }

        body.robot-active::before {
            display: block;
        }

        /* Destaca elemento sendo clicado */
        .robot-target {
            border: 3px solid #00ff00 !important;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.8) !important;
            background: rgba(0, 255, 0, 0.1) !important;
        }
        """

        script = f"""
        const style = document.createElement('style');
        style.textContent = `{css}`;
        document.head.appendChild(style);
        console.log('[VISUALIZER] CSS injetado');
        """

        try:
            self.sb.execute_script(script)
            print('[VISUALIZER] ✅ CSS cursor duplo injetado')
            return True
        except Exception as e:
            print(f'[VISUALIZER] ⚠️ Erro ao injetar CSS: {e}')
            return False

    def ativar_cursor_robot(self, x=0, y=0):
        """
        Ativa cursor do robot na tela
        """
        try:
            script = f"""
            document.body.classList.add('robot-active');
            document.documentElement.style.setProperty('--robot-x', '{x}px');
            document.documentElement.style.setProperty('--robot-y', '{y}px');
            """
            self.sb.execute_script(script)
        except:
            pass

    def desativar_cursor_robot(self):
        """
        Desativa cursor do robot
        """
        try:
            script = "document.body.classList.remove('robot-active');"
            self.sb.execute_script(script)
        except:
            pass

    def destacar_elemento(self, selector):
        """
        Destaca elemento com borda verde brilhante
        """
        try:
            script = f"""
            const elem = document.querySelector('{selector}');
            if (elem) {{
                elem.classList.add('robot-target');
            }}
            """
            self.sb.execute_script(script)
        except:
            pass

    def remover_destaque(self, selector):
        """
        Remove destaque do elemento
        """
        try:
            script = f"""
            const elem = document.querySelector('{selector}');
            if (elem) {{
                elem.classList.remove('robot-target');
            }}
            """
            self.sb.execute_script(script)
        except:
            pass
