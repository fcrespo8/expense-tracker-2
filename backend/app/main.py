from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import expenses

# Crea las tablas en SQLite a partir de los modelos, si no existen.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Expense Tracker API")

# CORS: permite que el frontend (que corre en otro puerto, ej: 5173)
# haga peticiones a esta API. Sin esto, el navegador las bloquea.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # el puerto de Vite/React
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monta las rutas de /expenses definidas en el router.
app.include_router(expenses.router)


@app.get("/")
def health_check():
    return {"status": "ok"}
