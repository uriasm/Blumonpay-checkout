# -*- coding: utf-8 -*-
from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache


class Settings(BaseSettings):
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }

    db_host: str = Field(..., alias="DB_HOST")
    db_port: str = Field(..., alias="DB_PORT")
    db_name: str = Field(..., alias="DB_NAME")
    db_user: str = Field(..., alias="DB_USER")
    db_password: str = Field(..., alias="DB_PASSWORD")

    blumonpay_user: str = Field(..., alias="BLUMONPAY_USER")
    blumonpay_pass: str = Field(..., alias="BLUMONPAY_PASS")

    blumonpay_token_url: str = Field(..., alias="BLUMONPAY_TOKEN_URL")
    blumonpay_charge_url: str = Field(..., alias="BLUMONPAY_CHARGE_URL")

    @property
    def database_url(self) -> str:
        return (f"postgresql://{self.db_user}:{self.db_password}@"
                f"{self.db_host}:{self.db_port}/{self.db_name}")


@lru_cache()
def get_settings():
    return Settings()
