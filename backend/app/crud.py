from sqlalchemy.orm import Session
from sympy import limit
from app import models, schemas
from sqlalchemy import func
from datetime import date

def create_expense(db: Session, expense: schemas.ExpenseCreate) -> models.Expense:
    db_expense = models.Expense(**expense.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)  # recarga el objeto con el id que generó la BD
    return db_expense


def get_expenses(db: Session, category: str | None = None, date_from: date | None = None, date_to: date | None = None, skip: int = 0, limit: int = 10) -> list[models.Expense]:
    query = db.query(models.Expense)

    if category is not None:
        query = query.filter(models.Expense.category == category)
    if date_from is not None:
        query = query.filter(models.Expense.date >= date_from)
    if date_to is not None:
        query = query.filter(models.Expense.date <= date_to)

    query = query.offset(skip).limit(limit)

    return query.all()

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

def update_expense(db: Session, expense_id: int, expense: schemas.ExpenseCreate) -> models.Expense | None:
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if db_expense is None:
        return None
    for key, value in expense.model_dump().items():
        setattr(db_expense, key, value)
    db.commit()
    db.refresh(db_expense)
    return db_expense
