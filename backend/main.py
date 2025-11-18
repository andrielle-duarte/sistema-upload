from fastapi import FastAPI, File, HTTPException, UploadFile
import csv
from fastapi.middleware.cors import CORSMiddleware
from io import StringIO
from validate_docbr import CPF
import re

app = FastAPI()

origins = [
    "http://localhost:8000]"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CPF com ponto e hífen ou somente números (11 dígitos)
cpf_validator = CPF()
CPF_regex = r'^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$'
#matrícula: somente números, 11 dígitos
Matricula_regex = r'^\d{11}$'

def validacao_matricula_ou_cpf(valor):
    valor = valor.strip()
    if re.match(CPF_regex, valor):
        return cpf_validator.validate(valor)
    elif re.match(Matricula_regex, valor):
        return True
    return False

@app.get("/")#afim de testar se o backend está funcionando
async def root():
    return {"message": "Backend funcionando. Use POST /upload-csv/ para enviar CSV."}


@app.post("/upload/")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'): 
        raise HTTPException(status_code=400, detail="Arquivo não é um CSV válido.")
    
    contents = await file.read()
    csv_string = contents.decode('utf-8')
    
    try:
        csv_reader = csv.reader(StringIO(csv_string))
        
        headers = next(csv_reader)
        expected_columns = ["Nome", "CPF/Matricula"] 
        if headers != expected_columns:
            raise HTTPException(status_code=400, detail="Cabeçalhos CSV inválidos.")
        
        for i, row in enumerate(csv_reader, start=2):
            if len(row) != len(expected_columns):
                raise HTTPException(status_code=400, detail=f"Linha {i} com número incorreto de colunas.")
            if not row[0] or not row[1]:
                raise HTTPException(status_code=400, detail=f"Campos obrigatórios estão vazios na linha {i}.")
            if not validacao_matricula_ou_cpf(row[1]):
                raise HTTPException(status_code=400, detail=f"CPF/Matrícula inválido na linha {i}. Valor: '{row[1]}'")
        
        return {"message": "Arquivo CSV processado com sucesso."}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar o CSV: {str(e)}")
