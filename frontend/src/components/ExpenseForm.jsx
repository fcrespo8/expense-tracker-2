import { useState } from "react";

// Fecha de hoy en formato YYYY-MM-DD, para inicializar el input date.
function today() {
  return new Date().toISOString().split("T")[0];
}

function ExpenseForm({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today());

  function handleSubmit() {
    onAdd({
      amount: parseFloat(amount),
      category,
      description,
      date,
    });
    // Reset: importe, categoría y descripción se limpian; la fecha vuelve a hoy.
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(today());
  }

  return (
    <div>
      <h2>Nuevo gasto</h2>
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
      <button onClick={handleSubmit}>Agregar</button>
    </div>
  );
}

export default ExpenseForm;
