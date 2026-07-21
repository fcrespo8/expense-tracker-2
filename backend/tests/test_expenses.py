from datetime import date, timedelta

def test_create_valid_expense(client):
    response = client.post("/expenses", json={
        "amount": 10.5, "category": "comida", "date": "2026-01-01"
    })
    assert response.status_code == 201
    assert response.json()["amount"] == 10.5
    assert "id" in response.json()


def test_create_negative_amount_fails(client):
    response = client.post("/expenses", json={
        "amount": -5, "category": "comida", "date": "2026-01-01"
    })
    assert response.status_code == 422


def test_create_missing_category_fails(client):
    response = client.post("/expenses", json={
        "amount": 10, "date": "2026-01-01"
    })
    assert response.status_code == 422


def test_list_expenses(client):
    client.post("/expenses", json={"amount": 10, "category": "comida", "date": "2026-01-01"})
    response = client.get("/expenses")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_delete_existing_expense(client):
    created = client.post("/expenses", json={"amount": 10, "category": "comida", "date": "2026-01-01"})
    expense_id = created.json()["id"]
    response = client.delete(f"/expenses/{expense_id}")
    assert response.status_code == 204


def test_delete_missing_expense_returns_404(client):
    response = client.delete("/expenses/999")
    assert response.status_code == 404


def test_summary(client):
    client.post("/expenses", json={"amount": 10, "category": "comida", "date": "2026-01-01"})
    client.post("/expenses", json={"amount": 30, "category": "ocio", "date": "2026-01-02"})
    response = client.get("/expenses/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 40
    assert data["by_category"] == {"comida": 10, "ocio": 30}

def test_update_existing_expense(client):
    created = client.post("/expenses", json={"amount": 10, "category": "comida", "date": "2026-01-01"})
    expense_id = created.json()["id"]
    response = client.put(f"/expenses/{expense_id}", json={"amount": 20, "category": "ocio", "date": "2026-01-01"})
    assert response.status_code == 200
    updated_expense = response.json()
    assert updated_expense["amount"] == 20

def test_update_missing_expense_returns_404(client):
    response = client.put("/expenses/999", json={"amount": 20, "category": "comida", "date": "2026-01-01"})
    assert response.status_code == 404

def test_update_negative_amount_fails(client):
    response = client.put("/expenses/1", json={"amount": -20, "category": "comida", "date": "2026-01-01"})
    assert response.status_code == 422

def test_create_future_date_fails(client):
    tomorrow = date.today() + timedelta(days=1)
    response = client.post("/expenses", json={
        "amount": 10, "category": "comida", "date": str(tomorrow)
    })
    assert response.status_code == 422
