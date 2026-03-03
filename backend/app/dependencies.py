"""Shared FastAPI dependencies for auth, tenancy, and membership checks."""

from collections.abc import AsyncGenerator, Callable

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession


class User:
    def __init__(self, user_id: str, firm_id: str, role: str) -> None:
        self.id = user_id
        self.firm_id = firm_id
        self.role = role


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    raise NotImplementedError("Connect get_db to the async session factory.")
    yield


async def get_current_user(token: str) -> User:
    raise NotImplementedError("Implement JWT decode and user lookup.")


def require_role(*roles: str) -> Callable[[User], User]:
    async def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
        return current_user

    return dependency


def get_firm_id(current_user: User) -> str:
    return current_user.firm_id


async def require_matter_member(matter_id: str, user: User) -> None:
    raise NotImplementedError("Check matter membership through matter_members or admin role.")
