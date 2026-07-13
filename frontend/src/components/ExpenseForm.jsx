import { useState, useEffect } from "react";

// Fecha de hoy en formato YYYY-MM-DD, para inicializar el input date.
function today() {
  return new Date().toISOString().split("T")[0];
}

function ExpenseForm({ onSave, editingExpense }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today());

  function handleSubmit() {
    onSave({
      amount: parseFloat(amount),
      category,
      description,
      date,
    });
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(today());
  }

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
      setDescription(editingExpense.description || "");
      setDate(editingExpense.date);
    }
    else {
      setAmount("");
      setCategory("");
      setDescription("");
      setDate(today());
    }
  }, [editingExpense]);

  return (
    <div>
      <h2>{editingExpense ? "Editar gasto" : "Nuevo gasto"}</h2>
      <input
        type="number"
        placeholder="Importe"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Categoría"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="text"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={handleSubmit}>{editingExpense ? "Guardar" : "Agregar"}</button>
    </div>
  );
}

export default ExpenseForm;
