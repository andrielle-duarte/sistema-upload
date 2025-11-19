
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import csv_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # adicione 5173!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test/")
def test():
    return {"message": "CORS funcionando!"}


app.include_router(csv_routes.router)
