# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from app.schemas.transaction import TransactionCreate, TransactionOut, \
    TransactionStatus
from app.repository.transactions import create_transaction, get_transaction, \
    list_transactions
from app.infrastructure.blumonpay import get_blumonpay_token, \
    charge_transaction
from app.infrastructure.db import get_db

router = APIRouter()
logger = logging.getLogger("transactions")


@router.post("/transactions", response_model=TransactionOut)
async def create_new_transaction(
        data: TransactionCreate, db: Session = Depends(get_db)):
    try:
        logger.info("Iniciando proceso de pago para %s", data.customer_email)

        token = await get_blumonpay_token()
        payload = {
            "amount": int(data.amount * 100),
            "currency": data.currency.upper(),
            "card": {
                "number": data.card.number,
                "exp_month": data.card.exp_month,
                "exp_year": data.card.exp_year,
                "cvc": data.card.cvc
            },
            "customer": {
                "email": data.customer_email,
                "name": data.customer_name
            },
            "capture": True
        }
        result = await charge_transaction(token, payload)
        logger.info("Pago exitoso para %s", data.customer_email)

        transaction = create_transaction(db, data)
        transaction.status = TransactionStatus.completed.value
        transaction.blumonpay_transaction_id = result.get(
            "transaction_id", "N/A")

        db.commit()
        db.refresh(transaction)
        return TransactionOut(**transaction.__dict__)

    except Exception as e:
        logger.error(
            "Error al procesar el pago para %s: %s",
            data.customer_email, str(e))
        raise HTTPException(
            status_code=502,
            detail="Error al procesar el pago con el proveedor")


@router.get("/transactions/{transaction_id}", response_model=TransactionOut)
def get_transaction_status(transaction_id: str, db: Session = Depends(get_db)):
    transaction = get_transaction(db, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return TransactionOut(**transaction.__dict__)


@router.get("/transactions", response_model=list[TransactionOut])
def list_all_transactions(db: Session = Depends(get_db)):
    return [TransactionOut(**t.__dict__) for t in list_transactions(db)]
