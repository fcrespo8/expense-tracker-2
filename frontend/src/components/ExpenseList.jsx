function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return <p>No hay gastos todavía.</p>;
  }

  return (
    <div>
      <h2>Gastos</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.date} — {expense.category} — {expense.amount}€
            {expense.description && ` (${expense.description})`}
            <button onClick={() => onDelete(expense.id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;
