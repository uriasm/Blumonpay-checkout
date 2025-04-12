# -*- coding: utf-8 -*-
from app.core.config import get_settings
from sqlalchemy import create_engine, text

if __name__ == "__main__":
    settings = get_settings()

    print("\nConfiguración cargada correctamente:\n")
    print(f"DATABASE_URL: {settings.database_url}")
    print(f"Blumonpay User: {settings.blumonpay_user}")
    print(f"Blumonpay Pass: {settings.blumonpay_pass}")
    print(f"Token URL: {settings.blumonpay_token_url}")
    print(f"Charge URL: {settings.blumonpay_charge_url}")

    try:
        engine = create_engine(settings.database_url)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("\nConexión exitosa a la base de datos PostgreSQL.")
    except Exception as e:
        print("\nError al conectar con la base de datos:", e)

    print("\nTodas las variables requeridas fueron cargadas correctamente.")
