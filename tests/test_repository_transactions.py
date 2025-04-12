import pytest
from decimal import Decimal
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.infrastructure.models import Base, TransactionDB
from app.repository.transactions import (
    create_transaction,
    get_transaction,
    list_transactions
)
from app.schemas.transaction import TransactionCreate, TransactionStatus

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


@pytest.fixture(scope="function")
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_create_transaction(db_session):
    data = TransactionCreate(
        amount=99.99,
        currency="USD",
        customer_email="dbuser@example.com",
        customer_name="DB Tester",
        card={
            "number": "4524210000002646",
            "exp_month": "12",
            "exp_year": "2028",
            "cvc": "123"
        }
    )
    transaction = create_transaction(db_session, data)
    assert transaction.id is not None
    assert transaction.customer_email == data.customer_email
    assert transaction.amount == Decimal(str(data.amount))


def test_get_transaction(db_session):
    data = TransactionCreate(
        amount=75.00,
        currency="EUR",
        customer_email="findme@example.com",
        customer_name="Find Me",
        card={
            "number": "4524210000002646",
            "exp_month": "11",
            "exp_year": "2026",
            "cvc": "321"
        }
    )
    created = create_transaction(db_session, data)
    found = get_transaction(db_session, created.id)
    assert found is not None
    assert found.id == created.id


def test_list_transactions(db_session):
    data = TransactionCreate(
        amount=50.0,
        currency="MXN",
        customer_email="list@example.com",
        customer_name="List User",
        card={
            "number": "4524210000002646",
            "exp_month": "01",
            "exp_year": "2029",
            "cvc": "456"
        }
    )
    create_transaction(db_session, data)
    transactions = list_transactions(db_session)
    assert isinstance(transactions, list)
    assert len(transactions) >= 1


def test_update_transaction_status_completed(db_session):
    data = TransactionCreate(
        amount=120.0,
        currency="USD",
        customer_email="completed@example.com",
        customer_name="Complete Test",
        card={
            "number": "4524210000002646",
            "exp_month": "03",
            "exp_year": "2027",
            "cvc": "999"
        }
    )
    transaction = create_transaction(db_session, data)
    transaction.status = TransactionStatus.completed.value
    db_session.commit()
    db_session.refresh(transaction)
    assert transaction.status == "completed"


def test_update_transaction_status_failed(db_session):
    data = TransactionCreate(
        amount=5.0,
        currency="USD",
        customer_email="failed@example.com",
        customer_name="Fail Test",
        card={
            "number": "4524210000002646",
            "exp_month": "05",
            "exp_year": "2026",
            "cvc": "000"
        }
    )
    transaction = create_transaction(db_session, data)
    transaction.status = TransactionStatus.failed.value
    db_session.commit()
    db_session.refresh(transaction)
    assert transaction.status == "failed"


def test_filter_transactions_by_status(db_session):
    statuses = [TransactionStatus.pending, TransactionStatus.completed,
                TransactionStatus.failed]
    for i, status in enumerate(statuses):
        data = TransactionCreate(
            amount=10 * (i + 1),
            currency="MXN",
            customer_email=f"user{i}@example.com",
            customer_name=f"User {i}",
            card={
                "number": "4524210000002646",
                "exp_month": "08",
                "exp_year": "2027",
                "cvc": "111"
            }
        )
        transaction = create_transaction(db_session, data)
        transaction.status = status.value
        db_session.commit()

    # Verificamos filtrado por estado
    all_tx = db_session.query(TransactionDB).all()
    assert len(all_tx) >= 3

    for status in statuses:
        filtered = db_session.query(TransactionDB).filter(
            TransactionDB.status == status.value).all()
        assert all(tx.status == status.value for tx in filtered)
        assert len(filtered) >= 1
