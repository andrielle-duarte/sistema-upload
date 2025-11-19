import re

def limpar_siape_matricula(valor):
    valor = str(valor).strip().replace(',', '').replace('.', '').replace('-', '')
    if 'e' in valor.lower():
        try:
            valor = str(int(float(valor)))
        except Exception:
            pass

    valor = re.sub(r'[^\d]', '', valor)
    return valor

    
def validacao_siape_matricula(valor):
    valor = str(valor).strip()
    return valor.isdigit() and len(valor) in (6, 7, 11)
