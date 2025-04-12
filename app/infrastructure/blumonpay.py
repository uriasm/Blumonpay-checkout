# -*- coding: utf-8 -*-
import base64

import httpx
import logging
from httpx import HTTPStatusError, RequestError
from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger("blumonpay")


def build_basic_auth_header(username: str, password: str) -> str:
    credentials = f"{username}:{password}"
    encoded_credentials = base64.b64encode(
        credentials.encode("utf-8")).decode("utf-8")
    return f"Basic {encoded_credentials}"


async def get_blumonpay_token():
    url = settings.blumonpay_token_url
    auth_header = build_basic_auth_header(
        settings.blumonpay_user,
        settings.blumonpay_pass
    )
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": auth_header
    }
    data = {
        "grant_type": "password",
        "username": settings.blumonpay_user,
        "password": settings.blumonpay_pass
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, data=data)
        response.raise_for_status()
        return response.json()["access_token"]


async def charge_transaction(token: str, data: dict):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    try:
        logger.info("Starting transaction with Blumonpay.")
        async with httpx.AsyncClient() as client:
            response = await client.post(
                settings.blumonpay_charge_url,
                headers=headers,
                json=data,
                timeout=15.0
            )
            response.raise_for_status()
            json_data = response.json()

            if "transaction_id" not in json_data:
                logger.warning(
                    "Response missing transaction_id: %s", json_data)
                raise ValueError("Blumonpay response missing transaction_id.")

            logger.info("Transaction processed successfully")
            return json_data

    except HTTPStatusError as http_exc:
        logger.error(
            "HTTP error from Blumonpay: %s - %s",
            http_exc.response.status_code,
            http_exc.response.text
        )
        raise RuntimeError(
            f"HTTP error from Blumonpay: {http_exc.response.status_code}"
        ) from http_exc

    except RequestError as req_exc:
        logger.error("Connection error with Blumonpay: %s", str(req_exc))
        raise RuntimeError(
            f"Connection error with Blumonpay."
        ) from req_exc

    except ValueError as ve:
        logger.error("Malformed response from Blumonpay: %s",
                     str(ve))
        raise RuntimeError(
            f"Malformed response from Blumonpay."
        ) from ve

    except Exception as e:
        logger.exception(
            "Unexpected error while processing the payment with Blumonpay.")
        raise RuntimeError(
            f"Unexpected error while processing the payment with Blumonpay."
        ) from e
