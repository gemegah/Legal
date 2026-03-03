"""Shared FastAPI dependencies for auth, tenancy, and membership checks.

These development-safe defaults keep the starter runnable until the real
database session, JWT validation, and membership checks are wired.
"""

from collections.abc import AsyncGenerator, Callable

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession


class User:
    def __init__(self, user_id: str, firm_id: str, role: str) -> None:
        self.id = user_id
        self.firm_id = firm_id
        self.role = role


async def get_db() -> AsyncGenerator[AsyncSession | None, None]:
    # TODO: replace this with the async session factory once persistence is wired.
    yield None


async def get_current_user(authorization: str | None = Header(default=None)) -> User:
    # TODO: replace this fixed dev principal with JWT decode + lookup.
    role = "admin"
    if authorization and "staff" in authorization.lower():
        role = "staff"
    elif authorization and "lawyer" in authorization.lower():
        role = "lawyer"
    return User(user_id="dev-user-1", firm_id="firm-demo-001", role=role)


def require_role(*roles: str) -> Callable[[User], User]:
    async def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
        return current_user

    return dependency


def get_firm_id(current_user: User) -> str:
    return current_user.firm_id


async def require_matter_member(matter_id: str, user: User) -> None:
    if user.role == "admin":
        return

    if not matter_id.startswith("matter-"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Matter access denied")
