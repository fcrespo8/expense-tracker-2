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

export function getExpenses({ category, date_from, date_to, skip, limit }) {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (date_from) params.append("date_from", date_from);
  if (date_to) params.append("date_to", date_to);
  if (skip) params.append("skip", skip);
  if (limit) params.append("limit", limit);
  return request(`/expenses?${params.toString()}`);
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
