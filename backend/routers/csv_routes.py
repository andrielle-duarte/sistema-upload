from fastapi import APIRouter, File, UploadFile, HTTPException
import csv
from io import StringIO
from database import collection

router = APIRouter()

@router.post("/upload/")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.csv'):
        raise HTTPException(status_code=400, detail="Arquivo não é um CSV válido.")

    contents = await file.read()
    try:
        csv_string = contents.decode('utf-8')
    except UnicodeDecodeError:
        csv_string = contents.decode('latin1') 

    try:
        csv_reader = csv.reader(StringIO(csv_string), delimiter=';')
        headers = next(csv_reader)
        expected_columns = ["nome", "siape_matricula"]
        if [h.lower() for h in headers] != [h.lower() for h in expected_columns]:
            raise HTTPException(status_code=400, detail=f"Cabeçalho deve ser {expected_columns}")

        documentos = []
        for i, row in enumerate(csv_reader, start=2):
            if len(row) != len(expected_columns):
                raise HTTPException(status_code=400, detail=f"Linha {i} com número incorreto de colunas.")
            nome = row[0].strip()
            siape = row[1].strip()
            if not nome or not siape:
                raise HTTPException(status_code=400, detail=f"Campos obrigatórios vazios na linha {i}.")

            # Validação estrita, simplificada
            if not (siape.isdigit() and len(siape) in (6,7,11)):
                raise HTTPException(status_code=400, detail=f"Siape/Matrícula inválido na linha {i}: '{siape}'")

            documentos.append({"nome": nome, "siape_matricula": siape})

        # Insere os documentos na coleção MongoDB
        result = collection.insert_many(documentos)

        return {"message": f"{len(result.inserted_ids)} documentos inseridos com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar CSV: {str(e)}")


@router.get("/visualizar/")
def visualizar_csv():
    documentos = list(collection.find({}, {'_id': 0}))  
    return documentos
