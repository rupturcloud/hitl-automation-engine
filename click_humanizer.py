#!/usr/bin/env python3
"""
Click Humanizer - Clicks humanizados com cursor visual + movimento
Simula comportamento real do mouse (não instantâneo)
Mostra cursor do robot em tempo real (tipo Claude Code Computador)
"""

import time
import random
from seleniumbase import SB

class HumanizedClicker:
    """
    Humaniza clicks do Selenium:
    - Movimento suave do mouse
    - Delay natural entre ações
    - Velocidade variável (human-like)
    """

    def __init__(self, sb):
        self.sb = sb
        self.min_delay = 0.3  # mínimo entre clicks
        self.max_delay = 1.2  # máximo entre clicks

    def _get_random_delay(self):
        """Retorna delay aleatório entre min e max"""
        return random.uniform(self.min_delay, self.max_delay)

    def _move_mouse_smoothly(self, x, y, steps=20, duration=0.5):
        """
        Move o mouse de forma suave para (x, y)
        Simula movimento humano (não instantâneo)
        """
        try:
            # Pega posição atual do mouse
            current_x, current_y = self.sb.get_mouse_x(), self.sb.get_mouse_y()

            # Calcula delta pra cada step
            dx = (x - current_x) / steps
            dy = (y - current_y) / steps
            step_duration = duration / steps

            # Move gradualmente
            for i in range(steps):
                next_x = current_x + (dx * (i + 1))
                next_y = current_y + (dy * (i + 1))
                self.sb.move_to(next_x, next_y)
                time.sleep(step_duration)

        except Exception as e:
            # Fallback: move direto
            self.sb.move_to(x, y)

    def click_element(self, selector, delay_before=None, delay_after=None):
        """
        Clica em elemento com movimento humanizado:
        1. Move mouse pra elemento (suavemente)
        2. Aguarda delay natural
        3. Clica
        4. Aguarda delay pós-click
        """
        try:
            # Aguarda elemento
            self.sb.wait_for_element(selector, timeout=5)

            # Pega coordenadas do elemento
            element = self.sb.find_element(selector)
            location = element.location
            size = element.size

            # Centro do elemento + pequena variação (natural)
            center_x = location['x'] + size['width'] / 2 + random.uniform(-5, 5)
            center_y = location['y'] + size['height'] / 2 + random.uniform(-5, 5)

            # Delay pré-click
            pre_delay = delay_before or self._get_random_delay()
            time.sleep(pre_delay)

            # Move mouse suavemente pra elemento
            self._move_mouse_smoothly(center_x, center_y, steps=15, duration=0.4)

            # Delay pequeno antes do click (natural)
            time.sleep(random.uniform(0.1, 0.3))

            # Clica
            element.click()

            # Delay pós-click
            post_delay = delay_after or self._get_random_delay()
            time.sleep(post_delay)

            return True

        except Exception as e:
            print(f'[CLICK] ❌ Erro ao clicar: {e}')
            return False

    def click_coordinates(self, x, y, delay_before=None, delay_after=None):
        """
        Clica em coordenadas específicas com movimento humanizado
        """
        try:
            # Delay pré-click
            pre_delay = delay_before or self._get_random_delay()
            time.sleep(pre_delay)

            # Move mouse suavemente
            self._move_mouse_smoothly(x, y, steps=15, duration=0.4)

            # Delay pequeno
            time.sleep(random.uniform(0.1, 0.3))

            # Clica via Selenium
            self.sb.move_to(x, y)
            self.sb.click(x, y)

            # Delay pós-click
            post_delay = delay_after or self._get_random_delay()
            time.sleep(post_delay)

            return True

        except Exception as e:
            print(f'[CLICK] ❌ Erro ao clicar em ({x}, {y}): {e}')
            return False

    def mouse_over(self, selector, duration=0.5):
        """Simula mouse over em elemento"""
        try:
            element = self.sb.find_element(selector)
            location = element.location
            size = element.size

            x = location['x'] + size['width'] / 2
            y = location['y'] + size['height'] / 2

            self._move_mouse_smoothly(x, y, steps=10, duration=duration)
            return True

        except:
            return False

    def type_humanized(self, selector, text, char_delay=None):
        """
        Digita texto com delays naturais entre caracteres
        """
        try:
            element = self.sb.find_element(selector)
            element.clear()

            for char in text:
                element.send_keys(char)
                delay = char_delay or random.uniform(0.05, 0.15)
                time.sleep(delay)

            return True

        except Exception as e:
            print(f'[TYPE] ❌ Erro ao digitar: {e}')
            return False


class MouseCursorVisualizer:
    """
    Visualiza cursor duplo em tempo real:
    - 🤖 Cursor do robot (Selenium)
    - 👆 Cursor do user (posição real do mouse)
    """

    def __init__(self, sb):
        self.sb = sb

    def injetar_css_cursor_duplo(self):
        """
        Injeta CSS pra mostrar dois cursores:
        1. Cursor padrão (user)
        2. Cursor especial pra robot (com emoji/ícone)
        """
        css = """
        /* Cursor do robot - visível quando Selenium tá movendo */
        body::before {
            content: "🤖";
            position: fixed;
            pointer-events: none;
            z-index: 10000;
            font-size: 20px;
            display: none;
        }

        body.robot-active::before {
            display: block;
            left: var(--robot-x, 0);
            top: var(--robot-y, 0);
        }

        /* Cursor do user - normal */
        * {
            cursor: pointer;
        }
        """

        script = f"""
        const style = document.createElement('style');
        style.textContent = `{css}`;
        document.head.appendChild(style);
        """

        try:
            self.sb.execute_script(script)
            return True
        except:
            return False

    def atualizar_cursor_robot(self, x, y):
        """
        Atualiza posição visual do cursor do robot
        """
        try:
            script = f"""
            document.documentElement.style.setProperty('--robot-x', '{x}px');
            document.documentElement.style.setProperty('--robot-y', '{y}px');
            document.body.classList.add('robot-active');
            """
            self.sb.execute_script(script)
        except:
            pass

    def esconder_cursor_robot(self):
        """Esconde cursor do robot"""
        try:
            script = "document.body.classList.remove('robot-active');"
            self.sb.execute_script(script)
        except:
            pass


# Exemplo de uso
if __name__ == '__main__':
    print('[HUMANIZER] Exemplo de clicks humanizados\n')

    with SB(headless=False) as sb:
        sb.open('https://example.com')

        clicker = HumanizedClicker(sb)
        visualizer = MouseCursorVisualizer(sb)

        # Injeta CSS do cursor duplo
        visualizer.injetar_css_cursor_duplo()

        # Exemplo: move e clica humanizado
        print('[CLICK] Clicando com movimento humanizado...')
        clicker.click_coordinates(500, 300)

        print('[CLICK] ✅ Movimento completo!')
