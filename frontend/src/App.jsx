import { useState, useEffect } from "react";
import { getExpenses, getSummary, createExpense, deleteExpense } from "./api/expenses";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, by_category: {} });
  const [error, setError] = useState(null);

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

  async function handleAdd(expense) {
    try {
      await createExpense(expense);
      await loadData(); // refetch: el backend recalcula lista y summary.
    } catch {
      setError("No se pudo crear el gasto. Revisá los datos.");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteExpense(id);
      await loadData(); // refetch tras borrar.
    } catch {
      setError("No se pudo borrar el gasto.");
    }
  }

  return (
    <div className="container">
      <h1>Gestor de gastos</h1>
      {error && <p className="error">{error}</p>}
      <ExpenseForm onAdd={handleAdd} />
      <Summary summary={summary} />
      <ExpenseList expenses={expenses} onDelete={handleDelete} />
    </div>
  );
}

export default App;
