# -*- coding: utf-8 -*-
from sqlalchemy.orm import Session
from uuid import uuid4
from typing import List, Optional
from app.infrastructure.models import TransactionDB
from app.schemas.transaction import TransactionCreate, TransactionStatus


def create_transaction(db: Session, data: TransactionCreate) -> TransactionDB:
    db_transaction = TransactionDB(
        id=str(uuid4()),
        amount=data.amount,
        currency=data.currency,
        customer_email=data.customer_email,
        customer_name=data.customer_name,
        status=TransactionStatus.pending.value,
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def get_transaction(db: Session, transaction_id: str) -> Optional[
    TransactionDB]:
    return db.query(TransactionDB).filter(
        TransactionDB.id == transaction_id).first()


def list_transactions(db: Session) -> List[TransactionDB]:
    return db.query(TransactionDB).order_by(
        TransactionDB.created_at.desc()).all()
