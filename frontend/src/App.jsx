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
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [skip, setSkip] = useState(0);
  const LIMIT = 10;

  async function loadData() {
    try {
      const summaryData = await getSummary();
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

  useEffect(() => {
    loadFilteredExpenses();
  }, [filterCategory, filterDateFrom, filterDateTo]);

  async function loadFilteredExpenses() {
    const data = await getExpenses({
      category: filterCategory,
      date_from: filterDateFrom,
      date_to: filterDateTo,
      skip: 0,
    });
    setExpenses(data);       // REEMPLAZA
    setSkip(0);              // resetea la paginación
  }

  async function handleLoadMore() {
    const nextSkip = skip + LIMIT;
    const data = await getExpenses({
      category: filterCategory,
      date_from: filterDateFrom,
      date_to: filterDateTo,
      skip: nextSkip,
    });
    setExpenses([...expenses, ...data]);   // AGREGA
    setSkip(nextSkip);
  }

  async function handleSave(expense) {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, expense);
      } else {
        await createExpense(expense);
      }
      await loadData();
      await loadFilteredExpenses();
      setEditingExpense(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteExpense(id);
      await loadData();
      await loadFilteredExpenses();
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
