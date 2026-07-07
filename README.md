# Gestor de Gastos / Expense Tracker

Mini aplicación full-stack para registrar, listar, eliminar y resumir gastos personales.
Backend en **FastAPI + SQLite**, frontend en **React (Vite)**.

> 🇪🇸 Español abajo · 🇬🇧 English version further down.

---

## 🇪🇸 Español

### Stack

- **Backend:** FastAPI, SQLAlchemy, Pydantic, SQLite. Tests con pytest.
- **Frontend:** React + Vite, `fetch` nativo (sin librerías de datos), CSS plano.

### Estructura del repositorio

```
expense-tracker/
├── backend/
│   └── app/
│       ├── main.py        # instancia FastAPI + CORS
│       ├── routers/       # endpoints (expenses)
│       ├── crud.py        # lógica de acceso a datos
│       ├── models.py      # modelo SQLAlchemy
│       ├── schemas.py     # schemas Pydantic
│       └── database.py    # sesión SQLite
│   └── tests/             # tests de backend
└── frontend/
    └── src/
        ├── api/expenses.js       # capa HTTP centralizada
        ├── components/
        │   ├── ExpenseForm.jsx   # alta de gasto
        │   ├── ExpenseList.jsx   # listado + borrar
        │   └── Summary.jsx       # total + desglose por categoría
        └── App.jsx               # estado y orquestación
```

### Cómo levantar el proyecto

**Requisitos:** Python 3.11+ y Node.js 20+.

**Backend** (desde `backend/`):

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API disponible en `http://localhost:8000`. Documentación interactiva en `http://localhost:8000/docs`.

**Frontend** (desde `frontend/`):

```bash
npm install
npm run dev
```

App disponible en `http://localhost:5173`. **El backend debe estar corriendo en paralelo.**

### API

| Método | Ruta                 | Descripción                          | Respuesta            |
|--------|----------------------|--------------------------------------|----------------------|
| POST   | `/expenses`          | Crea un gasto                        | 201 + gasto creado   |
| GET    | `/expenses`          | Lista todos los gastos               | 200 + array          |
| GET    | `/expenses/summary`  | Total y desglose por categoría       | 200 + `{total, by_category}` |
| DELETE | `/expenses/{id}`     | Elimina un gasto                     | 204 · 404 si no existe |

Validación: importe ≤ 0 o campo obligatorio faltante → **422**.

### Decisiones de diseño

**Backend como única fuente de verdad para el resumen.**
El total y el desglose por categoría se calculan en el backend (`/expenses/summary`), no en el cliente. Tras crear o eliminar un gasto, el frontend **re-consulta** lista y resumen en lugar de recalcular localmente. Esto evita duplicar la lógica de agregación en dos lugares y garantiza consistencia. El coste es una petición extra por mutación, un trade-off asumido conscientemente.

**Capa de API separada (`src/api/expenses.js`).**
Todas las llamadas HTTP viven en un único módulo sin dependencia de React. Los componentes no conocen `fetch` ni la URL del backend. Misma separación de responsabilidades que en el backend entre routers y capa de acceso a datos.

**Componentes presentacionales + estado centralizado.**
`App.jsx` es dueño de todo el estado (`expenses`, `summary`, `error`) y lo pasa por props. Los tres componentes hijos son "tontos": renderizan props y emiten eventos hacia arriba (`onAdd`, `onDelete`). Flujo de datos unidireccional. Se optó por `useState` + props en lugar de `useReducer`/Context porque, con un árbol de un solo nivel y tres piezas de estado, la indirección extra no se justifica.

**Manejo de errores visible y centralizado.**
Cada operación captura sus errores y setea un mensaje en el estado `error`, que se muestra al usuario en un único lugar. Sin librería de notificaciones: para esta escala, un estado y un mensaje son suficientes. `fetch` no lanza error ante respuestas 4xx/5xx (solo ante fallos de red), por lo que la capa de API comprueba `res.ok` explícitamente y lanza.

**Validación delegada al backend.**
El formulario no reimplementa la validación (importe > 0, campos obligatorios): el backend ya es la autoridad y devuelve 422. El frontend muestra ese error en lugar de duplicar reglas. Decisión de "lo suficientemente bueno": evita mantener la misma lógica en dos sitios.

**Sin TypeScript, sin librería de UI, `fetch` nativo.**
Para una aplicación de cuatro endpoints, TypeScript y una librería de componentes añadirían peso y dependencias sin retorno claro. El enunciado pide "limpio y funcional, no elaborado". Son decisiones de escala: se adoptarían si el dominio creciera.

### Qué dejé fuera (opcional del enunciado)

- **Editar un gasto:** ver "Próximos pasos".
- **Filtros por categoría / rango de fechas:** la consulta ya existe en backend; faltaría exponerla como query params y añadir controles en el front.
- **Tests de frontend:** el backend tiene cobertura de validación, códigos de estado y resumen; el frontend no.

### Próximos pasos / qué mejoraría con más tiempo

- **Editar gasto:** añadir `PUT /expenses/{id}` en el backend (con su schema, crud y test) y, en el front, un modo edición reutilizando `ExpenseForm` con estado "gasto en edición" en `App.jsx`. Mantendría el patrón de refetch tras la mutación.
- **Formato localizado:** usar `Intl.NumberFormat` para moneda e `Intl.DateTimeFormat` para fechas en lugar del texto crudo actual.
- **Variable de entorno para la URL del backend:** hoy está hardcodeada; pasaría a `import.meta.env`.
- **Feedback de carga:** un indicador de "cargando" durante las peticiones.
- **Tests de frontend:** con Vitest + Testing Library para los componentes.

---

## 🇬🇧 English

### Stack

- **Backend:** FastAPI, SQLAlchemy, Pydantic, SQLite. Tests with pytest.
- **Frontend:** React + Vite, native `fetch` (no data-fetching libraries), plain CSS.

### How to run

**Requirements:** Python 3.11+ and Node.js 20+.

**Backend** (from `backend/`):

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

**Frontend** (from `frontend/`):

```bash
npm install
npm run dev
```

App at `http://localhost:5173`. **The backend must be running in parallel.**

### API

| Method | Path                 | Description                          | Response             |
|--------|----------------------|--------------------------------------|----------------------|
| POST   | `/expenses`          | Create an expense                    | 201 + created expense |
| GET    | `/expenses`          | List all expenses                    | 200 + array          |
| GET    | `/expenses/summary`  | Total and per-category breakdown     | 200 + `{total, by_category}` |
| DELETE | `/expenses/{id}`     | Delete an expense                    | 204 · 404 if missing |

Validation: amount ≤ 0 or missing required field → **422**.

### Design decisions

**Backend as the single source of truth for the summary.**
Total and per-category breakdown are computed on the backend (`/expenses/summary`), not on the client. After creating or deleting an expense, the frontend **refetches** both list and summary instead of recomputing locally. This avoids duplicating aggregation logic and guarantees consistency, at the cost of one extra request per mutation — a consciously accepted trade-off.

**Separate API layer (`src/api/expenses.js`).**
All HTTP calls live in a single React-agnostic module. Components never touch `fetch` or the backend URL — the same separation of concerns as the backend's routers vs. data-access layer.

**Presentational components + centralized state.**
`App.jsx` owns all state (`expenses`, `summary`, `error`) and passes it down via props. The three child components are "dumb": they render props and emit events upward (`onAdd`, `onDelete`). Unidirectional data flow. `useState` + props was chosen over `useReducer`/Context because, with a single-level tree and three pieces of state, the extra indirection isn't justified.

**Visible, centralized error handling.**
Each operation catches its errors and sets a message in the `error` state, shown to the user in one place. No notification library: at this scale, one state value and one message suffice. `fetch` does not throw on 4xx/5xx responses (only on network failures), so the API layer checks `res.ok` explicitly and throws.

**Validation delegated to the backend.**
The form does not reimplement validation (amount > 0, required fields): the backend is already the authority and returns 422. The frontend surfaces that error instead of duplicating rules — a "good enough" decision that avoids maintaining the same logic in two places.

**No TypeScript, no UI library, native `fetch`.**
For a four-endpoint app, TypeScript and a component library would add weight and dependencies without clear payoff. The brief asks for "clean and functional, not elaborate." These are scale decisions, revisited if the domain grew.

### Left out (optional in the brief)

- **Edit an expense:** see "Next steps".
- **Filter by category / date range:** the query already exists in the backend; it would need to be exposed as query params with controls added on the front.
- **Frontend tests:** the backend covers validation, status codes and summary; the frontend does not.

### Next steps / what I'd improve with more time

- **Edit expense:** add `PUT /expenses/{id}` on the backend (with schema, crud and test) and an edit mode on the front reusing `ExpenseForm` with an "expense being edited" state in `App.jsx`, keeping the refetch-after-mutation pattern.
- **Localized formatting:** use `Intl.NumberFormat` for currency and `Intl.DateTimeFormat` for dates instead of raw text.
- **Environment variable for the backend URL:** currently hardcoded; move to `import.meta.env`.
- **Loading feedback:** a "loading" indicator during requests.
- **Frontend tests:** with Vitest + Testing Library for the components.
