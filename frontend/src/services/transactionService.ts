import axios from "axios";
import type { TransactionCreatePayload, TransactionOut } from "@/types/transaction";
import { API_URL } from "@/lib/config";

export async function createTransaction(payload: TransactionCreatePayload): Promise<TransactionOut> {
  try {
    const response = await axios.post(`${API_URL}/transactions`, payload, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creando la transacción:", error);
    throw new Error(error?.response?.data?.detail || "Ocurrió un error al procesar el pago");
  }
}

export async function fetchTransactions(): Promise<TransactionOut[]> {
  try {
    const response = await axios.get(`${API_URL}/transactions`);
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo transacciones:", error);
    throw new Error("No se pudo cargar la lista de transacciones");
  }
}

export async function getTransactionById(id: string): Promise<TransactionOut> {
    try {
      const response = await axios.get(`${API_URL}/transactions/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener transacción con ID ${id}:`, error);
      throw new Error("Transacción no encontrada o error al cargarla");
    }
  }
  