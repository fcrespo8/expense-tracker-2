import { useState, useEffect } from "react";
import { getExpenses, getSummary, createExpense, updateExpense, deleteExpense } from "./api/expenses";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, by_category: {} });
  const [error, setError] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  // Carga lista + resumen desde el backend. Fuente única de verdad.
  async function loadData() {
    try {
      const [expensesData, summaryData] = await Promise.all([
        getExpenses(),
        getSummary(),
      ]);
      setExpenses(expensesData);
      setSummary(summaryData);
      setError(null);
    } catch {
      setError("No se pudieron cargar los gastos. ¿Está el servidor encendido?");
    }
  }

  // Carga inicial, una sola vez al montar.
  useEffect(() => {
    loadData();
  }, []);

  async function handleSave(expense) {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, expense);
      } else {
        await createExpense(expense);
      }
      await loadData();
      setEditingExpense(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteExpense(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(expense) {
    setEditingExpense(expense);
  }

  return (
    <div className="container">
      <h1>Gestor de gastos</h1>
      {error && <p className="error">{error}</p>}
      <ExpenseForm onSave={handleSave} editingExpense={editingExpense} />
      <Summary summary={summary} />
      <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

export default App;
