import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app

# BD de test separada: otro archivo, no toca expenses.db
SQLALCHEMY_TEST_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Esta versión de get_db usa la BD de test en vez de la real
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():
    # Creo las tablas limpias antes de cada test
    Base.metadata.create_all(bind=engine)

    # Le digo a la app: "cuando pidas get_db, usá el de test"
    app.dependency_overrides[get_db] = override_get_db

    yield TestClient(app)   # el test corre acá

    # Limpio: borro las tablas para que el próximo test arranque de cero
    Base.metadata.drop_all(bind=engine)
