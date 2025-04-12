-- Crear base de datos y otorgar permisos
CREATE DATABASE payments_app;
GRANT ALL PRIVILEGES ON DATABASE payments_app TO postgres;

-- Crear tabla si no existe
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    status TEXT NOT NULL,
    blumonpay_transaction_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas frecuentes
-- para búsquedas por email (por ejemplo, historial del cliente).
CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions (customer_email);
-- para búsquedas por estado (por ejemplo, transacciones pendientes).
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions (status);
-- para búsquedas por fecha (por ejemplo, transacciones recientes).
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions (created_at);
