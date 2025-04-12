"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { TransactionOut } from "@/types/transaction";

export default function ConfirmPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const [transaction, setTransaction] = useState<TransactionOut | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${id}`)
      .then(res => setTransaction(res.data))
      .catch(() => setError("No se pudo cargar la transacción"));
  }, [id]);

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!transaction) return <div className="text-center mt-10">Cargando...</div>;

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-xl bg-white shadow-md">
      <h1 className="text-xl font-semibold text-green-600 mb-4">¡Pago completado!</h1>
      <p><strong>Monto:</strong> ${transaction.amount} {transaction.currency}</p>
      <p><strong>Cliente:</strong> {transaction.customer_name}</p>
      <p><strong>Correo:</strong> {transaction.customer_email}</p>
      <p><strong>ID transacción:</strong> {transaction.id}</p>
      <p><strong>Estado:</strong> {transaction.status}</p>
      <p className="text-xs text-gray-500 mt-4">Fecha: {new Date(transaction.created_at).toLocaleString()}</p>
    </div>
  );
}
