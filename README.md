# 💳 Blumonpay Checkout - Backend API

Este proyecto es una API REST desarrollada con **FastAPI** y **PostgreSQL**, que actúa como intermediario seguro entre un frontend de pagos y la plataforma **Blumonpay**.

---

## 🚀 Requisitos

- Python 3.12+
- PostgreSQL o SQLite (para tests)
- pip

---

## ⚙️ Instalación y ejecución

```bash
# 1. Clona el repositorio
$ git clone <repo-url>
$ cd Blumonpay-checkout

# 2. Crea y activa un entorno virtual
$ python -m venv .venv
$ source .venv/bin/activate  # o .venv\Scripts\activate en Windows

# 3. Instala dependencias
$ pip install -r requirements.txt

# 4. Configura las variables de entorno (.env)
$ cp .env.example .env

# 5. Corre el servidor de desarrollo
$ uvicorn app.main:app --reload
```

---

## 🛠️ Configuración del archivo `.env`

Copia el archivo `.env.example` y asegúrate de completar todos los campos:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=payments_app
DB_USER=postgres
DB_PASSWORD=yourpassword

BLUMONPAY_USER=sistemas@capapay.mx
BLUMONPAY_PASS=;[aMB(=?.Agy=j?
BLUMONPAY_TOKEN_URL=https://sandbox-tokener.blumonpay.net/oauth/token
BLUMONPAY_CHARGE_URL=https://sandbox-ecommerce.blumonpay.net/ecommerce/charge
```

---

## 📡 Endpoints disponibles

### ▶️ POST `/transactions`
Crea una nueva transacción e intenta procesarla vía Blumonpay.

**Body (JSON):**
```json
{
  "amount": 100.0,
  "currency": "MXN",
  "customer_email": "test@example.com",
  "customer_name": "Test User",
  "card": {
    "number": "4524210000002646",
    "exp_month": "12",
    "exp_year": "2028",
    "cvc": "123"
  }
}
```

### 🧾 GET `/transactions/{id}`
Obtiene el estado de una transacción específica por ID.

### 📋 GET `/transactions`
Lista todas las transacciones registradas en la base de datos.

---

## 🧪 Ejecutar pruebas

El proyecto incluye pruebas automatizadas con `pytest`:

```bash
# Asegúrate de tener pytest instalado
$ pip install pytest

# Ejecuta todos los tests
$ pytest tests/

# Ejecuta un archivo de pruebas específico
$ pytest tests/test_transactions.py
```

Incluye pruebas para:
- Crear transacción válida
- Manejo de errores por campos faltantes
- Consultar transacción por ID
- Operaciones directas en base de datos
- Filtros por estado (`pending`, `completed`, `failed`)


# 🖥️ Blumonpay Checkout - Frontend (Next.js + Tailwind)

Este proyecto es la interfaz de usuario del sistema de pagos con **Blumonpay**, desarrollado con **Next.js**, **React**, **TailwindCSS** y validación con **react-hook-form** + **zod**.

---

## 🚀 Requisitos

- Node.js 18+
- npm o yarn
- Backend en ejecución (ver carpeta `/backend`)

---

## ⚙️ Instalación y ejecución

```bash
# 1. Ir al directorio del frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de entorno
cp .env.local.example .env.local

# 4. Correr el servidor de desarrollo
npm run dev
```
---
## 🛠️ Configuración del archivo `.env.local`
Copia el archivo `.env.local.example` y asegúrate de completar todos los campos:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
---
## Funcionalidades
	•	💳 Formulario de pago validado
	•	📝 Listado de transacciones con filtros y paginación
	•	🔍 Vista detallada de transacción
	•	🎨 Diseño responsive y profesional (tipo dashboard)
	•	🧪 Manejo de errores visuales
	•	🌐 Soporte para monedas: MXN y USD

## Estructura de carpetas
```bash
frontend/
├── public/
│   ├── images/
├── src/
    ├── app/
    ├── components/
    ├── lib/
    ├── services/
    ├── types/
```
--- 
## Stack tecnológico
- **Next.js**: Framework de React para aplicaciones web.
- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **TailwindCSS**: Framework CSS para diseño responsivo.
- **react-hook-form**: Biblioteca para manejar formularios en React.
- **zod**: Biblioteca para validación de datos.
- **Axios**: Cliente HTTP para hacer peticiones a la API.

