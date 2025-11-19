import re
from fastapi import HTTPException

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

def validar_ou_levantar_excecao(siape, linha_numero):
    valor_limpo = limpar_siape_matricula(siape)
    if not validacao_siape_matricula(valor_limpo):
        raise HTTPException(status_code=400, detail=f"Siape/Matrícula inválido na linha {linha_numero}: '{siape}'")
    return valor_limpo
