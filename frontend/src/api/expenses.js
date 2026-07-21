const API_URL = "http://localhost:8000";

// Helper: centraliza el manejo de respuestas y errores de red.
async function request(path, options) {
  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    const errorBody = await res.json();
    const message = Array.isArray(errorBody.detail)
      ? errorBody.detail[0].msg
      : errorBody.detail;
    throw new Error(message);
  }
  // 204 (delete) no trae body; el resto sí.
  return res.status === 204 ? null : res.json();
}

export function getExpenses() {
  return request("/expenses");
}

export function getSummary() {
  return request("/expenses/summary");
}

export function createExpense(expense) {
  return request("/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
}

export function deleteExpense(id) {
  return request(`/expenses/${id}`, { method: "DELETE" });
}

export function updateExpense(id, expense) {
  return request(`/expenses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
}
