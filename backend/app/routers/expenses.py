from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.post("", response_model=schemas.ExpenseOut, status_code=status.HTTP_201_CREATED)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    return crud.create_expense(db, expense)


@router.get("", response_model=list[schemas.ExpenseOut])
def list_expenses(db: Session = Depends(get_db)):
    return crud.get_expenses(db)

@router.get("/summary", response_model=schemas.Summary)
def get_summary(db: Session = Depends(get_db)):
    return crud.get_summary(db)

@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_expense(db, expense_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Expense not found")

@router.put("/{expense_id}", response_model=schemas.ExpenseOut, status_code=status.HTTP_200_OK)
def update_expense(expense_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    updated_expense = crud.update_expense(db, expense_id, expense)
    if updated_expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return updated_expense
