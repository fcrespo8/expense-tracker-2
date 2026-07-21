from datetime import date
from pydantic import BaseModel, Field, field_validator


# Lo que el cliente ENVÍA al crear un gasto.
class ExpenseCreate(BaseModel):
    amount: float = Field(gt=0)          # gt=0: importe > 0, validado en el borde
    category: str = Field(min_length=1)  # no vacío
    description: str | None = None       # opcional
    date: date

    @field_validator("date")
    @classmethod
    def validate_date(cls, value: date) -> date:
        if value > date.today():
            raise ValueError("La fecha no puede ser futura")
        return value

# Lo que la API DEVUELVE. Incluye el id que genera la BD.
class ExpenseOut(ExpenseCreate):
    id: int

    model_config = {"from_attributes": True}  # permite crear el schema desde el objeto ORM

class Summary(BaseModel):
    total: float
    by_category: dict[str, float]
