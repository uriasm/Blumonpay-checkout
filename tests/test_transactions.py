import uuid


def test_create_transaction_missing_field(test_client):
    payload = {
        "currency": "MXN",
        "customer_email": "test@example.com",
        "customer_name": "Test User",
        "card": {
            "number": "4524210000002646",
            "exp_month": "12",
            "exp_year": "2028",
            "cvc": "123"
        }
    }
    response = test_client.post("/transactions", json=payload)
    assert response.status_code == 422


def test_get_transaction_by_invalid_id(test_client):
    fake_id = str(uuid.uuid4())
    response = test_client.get(f"/transactions/{fake_id}")
    assert response.status_code == 404
