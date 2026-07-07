from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite: la BD es un archivo local (expenses.db) en la carpeta backend.
SQLALCHEMY_DATABASE_URL = "sqlite:///./expenses.db"

# check_same_thread=False: SQLite por defecto bloquea el uso desde
# distintos hilos. FastAPI puede atender requests en hilos diferentes,
# así que lo desactivamos. Es específico de SQLite; con Postgres no haría falta.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# SessionLocal: fábrica de sesiones. Cada request abrirá una sesión,
# la usará y la cerrará. Una sesión = una conversación con la BD.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base: clase madre de la que heredarán nuestros modelos ORM (Expense).
Base = declarative_base()


# Dependencia de FastAPI: abre una sesión por request y la cierra siempre,
# incluso si algo falla. Esto lo inyectamos en los endpoints con Depends().
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
