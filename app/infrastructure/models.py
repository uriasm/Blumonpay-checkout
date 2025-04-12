# -*- coding: utf-8 -*-
from sqlalchemy import Column, String, DateTime, Numeric
from sqlalchemy.orm import declarative_base
from datetime import datetime, timezone

Base = declarative_base()


class TransactionDB(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    amount = Column(Numeric, nullable=False)
    currency = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    customer_name = Column(String, nullable=False)
    status = Column(String, nullable=False)
    blumonpay_transaction_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
