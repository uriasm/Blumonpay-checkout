import TransactionList from "@/components/TransactionList";

export default function Home() {
  return (
    <>
      <h2 className="text-3xl font-semibold mb-6">Panel de Transacciones</h2>

      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Últimas transacciones</h3>
        <TransactionList />
      </div>
    </>
  );
}
