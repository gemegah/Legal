import hashlib
import hmac

import httpx

from app.config import settings

HUBTEL_BASE_URL = "https://api.hubtel.com/v2/pos/onlinecheckout/items/initiate-direct-pay"


async def initiate_momo_payment(amount: float, phone_number: str, description: str, client_reference: str, network: str = "MTN") -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            HUBTEL_BASE_URL,
            json={
                "totalAmount": amount,
                "description": description,
                "callbackUrl": settings.HUBTEL_CALLBACK_URL,
                "returnUrl": f"{settings.FRONTEND_URL}/portal/invoices/{client_reference}",
                "cancellationUrl": f"{settings.FRONTEND_URL}/portal/invoices/{client_reference}",
                "merchantAccountNumber": settings.HUBTEL_CLIENT_ID,
                "clientReference": client_reference,
                "paymentRequest": {"accountNumber": phone_number, "network": network},
            },
            auth=(settings.HUBTEL_CLIENT_ID, settings.HUBTEL_CLIENT_SECRET),
            timeout=30,
        )
        response.raise_for_status()
        return response.json()


def verify_hubtel_signature(payload_bytes: bytes, signature_header: str) -> bool:
    expected = hmac.new(settings.HUBTEL_CLIENT_SECRET.encode(), payload_bytes, hashlib.sha512).hexdigest()
    return hmac.compare_digest(expected, signature_header)
