"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { TransactionOut } from "@/types/transaction";
import { CheckCircle, XCircle } from "lucide-react";
import { fetchTransactions } from "@/services/transactionService";

export default function TransactionList() {
  const [transactions, setTransactions] = useState<TransactionOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchTransactions()
      .then((res) => {
        setTransactions(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = transactions.filter((t) =>
    statusFilter === "all" ? true : t.status === statusFilter
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  if (loading) return <p className="text-gray-500">Cargando transacciones...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="mr-2 text-sm">Filtrar por estado:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="all">Todos</option>
            <option value="completed">Aprobados</option>
            <option value="failed">Fallidos</option>
            <option value="pending">Pendientes</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          Página {page} de {totalPages}
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Cliente</th>
            <th className="px-4 py-2">Correo</th>
            <th className="px-4 py-2">Monto</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2 text-right">Acción</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((t) => (
            <tr key={t.id} className="border-b">
              <td className="px-4 py-2">{t.customer_name}</td>
              <td className="px-4 py-2">{t.customer_email}</td>
              <td className="px-4 py-2">
                {t.amount} {t.currency}
              </td>
              <td className="px-4 py-2">
                {t.status === "completed" ? (
                  <span className="inline-flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" /> Aprobado
                  </span>
                ) : t.status === "failed" ? (
                  <span className="inline-flex items-center gap-1 text-red-600">
                    <XCircle className="w-4 h-4" /> Fallido
                  </span>
                ) : (
                  <span className="text-yellow-600">Pendiente</span>
                )}
              </td>
              <td className="px-4 py-2">
                {new Date(t.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-right">
                <Link
                  href={`/transactions/${t.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </>
  );
}
