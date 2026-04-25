# 🧬 J.A.R.V.I.S. - Bac Bo Patterns
# Definição das 18 estratégias de entrada conhecidas

class Patterns:
    # Exemplos de padrões comuns (substituir pelos reais do Diego)
    PATTERNS = {
        "P1_CONTAGEM_SIMPLES": {"sequence": ["P", "P", "B"], "trigger": "B"},
        "P2_ALTERNANCIA_SOLO": {"sequence": ["P", "B", "P"], "trigger": "B"},
        "P3_ESMAGAMENTO": {"sequence": ["B", "B", "B"], "trigger": "P"},
        # ... Adicionar as 18 estratégias aqui
    }

    @staticmethod
    def match(history):
        """
         history: lista de strings ['P', 'B', 'T', ...]
         Retorna lista de matches [(pattern_id, confidence), ...]
        """
        matches = []
        for pid, pdata in Patterns.PATTERNS.items():
            seq = pdata["sequence"]
            if len(history) >= len(seq):
                if history[-len(seq):] == seq:
                    matches.append((pid, 1.0)) # 1.0 = match exato
        return matches
