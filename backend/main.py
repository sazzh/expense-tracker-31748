from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
import datetime
from enum import Enum
from typing import Optional, Annotated
from litestar import Litestar, delete, get, post, put
from litestar.dto import dto_field
from litestar.plugins.sqlalchemy import SQLAlchemyPlugin, SQLAlchemyAsyncConfig
from dataclasses import dataclass
from sqlalchemy.orm import Mapped, registry, mapped_column
from sqlalchemy import Integer, String, Date, Enum as SqlEnum
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.exc import IntegrityError
from contextlib import asynccontextmanager
from typing import Any
from collections.abc import AsyncGenerator, Sequence
from litestar.exceptions import ClientException, NotFoundException

# Models
class CategoryEnum(Enum):
    FOOD = "food"
    TRANSPORT = "transport"
    ENTERTAINMENT = "entertainment"
    UTILITIES = "utilities"
    SHOPPING = "shopping"
    OTHER = "other"

mapper_registry = registry()

@mapper_registry.mapped
@dataclass
class Expense:
    __tablename__ = "expenses"
    id: Mapped[Annotated[int, dto_field("read-only")]] = mapped_column(Integer, primary_key=True)
    date: Mapped[datetime.date] = mapped_column(Date)
    name: Mapped[str] = mapped_column(String(100))
    amount: Mapped[int] = mapped_column(Integer)
    category: Mapped[CategoryEnum] = mapped_column(SqlEnum(CategoryEnum))
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

# Setup database
async def provide_transaction(db_session: AsyncSession) -> AsyncGenerator[AsyncSession, None]:
    try:
        async with db_session.begin():
            yield db_session
    except IntegrityError as exc:
        raise ClientException(status_code=409, detail=str(exc)) from exc

# Routes
@get('/expenses')
async def get_expenses() -> list[Expense]:
    ...

@get('/expenses/{expense_id:int}')
async def get_expense(expense_id: int) -> Expense:
    ...

@post('/expenses')
async def create_expense(data: Expense) -> Expense:
    ...

@put('/expenses/{expense_id:int}')
async def update_expense(expense_id: int, data: Expense) -> Expense:
    ...

@delete('/expenses/{expense_id:int}')
async def delete_expense() -> None:
    ...

db_config = SQLAlchemyAsyncConfig(
    connection_string="sqlite+aiosqlite:///expensetracker.sqlite",
    metadata=mapper_registry.metadata,
    create_all=True,
    before_send_handler="autocommit",
)

app = Litestar(
    [get_expenses, get_expense, create_expense, update_expense, delete_expense],
    dependencies={"transaction": provide_transaction},
    plugins=[SQLAlchemyPlugin(db_config)],
)