from sqlalchemy.orm import Session
from app import models, schemas
from sqlalchemy import func


def create_expense(db: Session, expense: schemas.ExpenseCreate) -> models.Expense:
    db_expense = models.Expense(**expense.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)  # recarga el objeto con el id que generó la BD
    return db_expense


def get_expenses(db: Session) -> list[models.Expense]:
    return db.query(models.Expense).all()

def delete_expense(db: Session, expense_id: int) -> bool:
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if db_expense is None:
        return False
    db.delete(db_expense)
    db.commit()
    return True

def get_summary(db: Session):
    total = db.query(func.sum(models.Expense.amount)).scalar() or 0.0

    rows = (
        db.query(
            models.Expense.category,
            func.sum(models.Expense.amount),
        )
        .group_by(models.Expense.category)
        .all()
    )
    by_category = {category: amount for category, amount in rows}

    return {"total": total, "by_category": by_category}
