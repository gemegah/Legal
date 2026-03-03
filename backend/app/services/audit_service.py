# THE ONLY authorized writer to audit_log.

import logging
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit import AuditLog


async def log(
    db: AsyncSession,
    firm_id: str,
    user_id: Optional[str],
    entity_type: str,
    entity_id: str,
    action: str,
    diff: Optional[dict] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> None:
    try:
        entry = AuditLog(
            firm_id=firm_id,
            user_id=user_id,
            entity_type=entity_type,
            entity_id=entity_id,
            action=action,
            diff=diff,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        db.add(entry)
        await db.flush()
    except Exception as exc:
        logging.getLogger("audit").error("Audit log write failed: %s", exc)
