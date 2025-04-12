# -*- coding: utf-8 -*-
from pydantic import BaseModel, EmailStr, Field, field_validator
from enum import Enum
from typing import Optional
from uuid import UUID
from datetime import datetime


class TransactionStatus(str, Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"


class CardData(BaseModel):
    number: str = Field(..., min_length=13, max_length=19)
    exp_month: str = Field(..., min_length=2, max_length=2)
    exp_year: str = Field(..., min_length=4, max_length=4)
    cvc: str = Field(..., min_length=3, max_length=4)

    @field_validator("number")
    @classmethod
    def validate_card_number(cls, v: str) -> str:
        if not v.isdigit():
            raise ValueError("Card number must contain only digits.")
        return v

    @field_validator("exp_month", mode="before")
    @classmethod
    def validate_month(cls, v: str) -> str:
        if not v.isdigit() or not (1 <= int(v) <= 12):
            raise ValueError("Expiration month must be between 01 and 12.")
        return v.zfill(2)

    @field_validator("exp_year", mode="before")
    @classmethod
    def validate_year(cls, v: str) -> str:
        if not v.isdigit() or len(v) != 4:
            raise ValueError("Expiration year must be 4 digits.")
        current_year = datetime.now().year
        if int(v) < current_year:
            raise ValueError("Expiration year cannot be in the past.")
        return v

    @field_validator("cvc")
    @classmethod
    def validate_cvc(cls, v: str) -> str:
        if not v.isdigit():
            raise ValueError("CVC must contain only digits.")
        return v


class TransactionCreate(BaseModel):
    amount: float = Field(..., gt=0)
    currency: str
    customer_email: EmailStr
    customer_name: str
    card: CardData


class TransactionOut(BaseModel):
    id: UUID
    amount: float
    currency: str
    customer_email: EmailStr
    customer_name: str
    status: TransactionStatus
    blumonpay_transaction_id: Optional[str]
    created_at: datetime
