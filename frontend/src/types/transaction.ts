// types/transaction.ts

export interface CardData {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
  }
  
  export interface TransactionCreatePayload {
    amount: number;
    currency: string;
    customer_email: string;
    customer_name: string;
    card: CardData;
  }
  
  export interface TransactionOut {
    id: string;
    amount: number;
    currency: string;
    customer_email: string;
    customer_name: string;
    status: "pending" | "completed" | "failed";
    blumonpay_transaction_id?: string;
    created_at: string;
  }