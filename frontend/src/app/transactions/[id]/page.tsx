"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import type { TransactionOut } from "@/types/transaction";
import { getTransactionById } from "@/services/transactionService";

export default function TransactionDetailPage() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState<TransactionOut | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getTransactionById(id as string)
      .then(setTransaction)
      .catch(() => setError("No se pudo cargar la transacción"));
  }, [id]);

  if (error) {
    return (
      <div className="p-10">
        <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader className="w-6 h-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Cargando transacción...</span>
      </div>
    );
  }

  const statusIcon = transaction.status === "completed" ? (
    <span className="inline-flex items-center gap-1 text-green-600">
      <CheckCircle className="w-4 h-4" /> Aprobada
    </span>
  ) : transaction.status === "failed" ? (
    <span className="inline-flex items-center gap-1 text-red-600">
      <XCircle className="w-4 h-4" /> Fallida
    </span>
  ) : (
    <span className="text-yellow-600">Pendiente</span>
  );

  return (
    <>
      <h2 className="text-3xl font-semibold mb-6">Detalle de Transacción</h2>

      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Información de la transacción</h3>
          {statusIcon}
        </div>

        <div className="text-sm space-y-1">
          <p>
            <strong>Cliente:</strong> {transaction.customer_name}
          </p>
          <p>
            <strong>Correo:</strong> {transaction.customer_email}
          </p>
          <p>
            <strong>Monto:</strong> {transaction.amount} {transaction.currency}
          </p>
          <p>
            <strong>Estado:</strong> {transaction.status}
          </p>
          <p>
            <strong>Creado:</strong>{" "}
            {new Date(transaction.created_at).toLocaleString()}
          </p>
          {transaction.blumonpay_transaction_id && (
            <p>
              <strong>ID Blumonpay:</strong>{" "}
              {transaction.blumonpay_transaction_id}
            </p>
          )}
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            ← Regresar
          </Link>
        </div>
      </div>
    </>
  );
}