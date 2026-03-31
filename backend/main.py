import datetime
import enum
from litestar import Litestar, delete, get, post, put
from dataclasses import dataclass
from sqlalchemy import Date, Enum, Integer, String, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from litestar.dto import DTOConfig
from litestar.plugins.sqlalchemy import SQLAlchemyAsyncConfig, SQLAlchemyPlugin, SQLAlchemyDTO
from typing import Optional, Sequence
from sqlalchemy.ext.asyncio import AsyncSession

class Base(DeclarativeBase):
    pass

class Category(enum.Enum):
    FOOD = "food"
    TRANSPORT = "transport"
    UTILITIES = "utilities"
    SHOPPING = "shopping"
    ENTERTAINMENT = "entertainment"
    OTHER = "other"

# SQL Model
class Expense(Base):
    __tablename__ = "expenses"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date: Mapped[datetime.date] = mapped_column(Date)
    name: Mapped[str] = mapped_column(String(50))
    amount: Mapped[int] = mapped_column(Integer) # cents
    category: Mapped[Category] = mapped_column(Enum(Category))
    description: Mapped[Optional[str]] = mapped_column(String(255))

# DTOs from model
class ExpenseRead(SQLAlchemyDTO[Expense]):
    pass

class ExpenseCreate(SQLAlchemyDTO[Expense]):
    create_config = DTOConfig(exclude={"id"})

class ExpenseUpdate(SQLAlchemyDTO[Expense]):
    update_config = DTOConfig(
        exclude={"id"},
        partial=True,
    )

# Routes
@get('/expense')
async def list_expenses() -> list[Expense]:
    ... # TODO

@get('/expense/{expense_id:int}')
async def get_expense(expense_id: int) -> Expense:
    ... # TODO

@post('/expense')
async def create_expense(data: ExpenseCreate) -> Expense:
    ...

@put('/expense/{expense_id:int}') # might need dataclass with optionals?
async def update_expense(expense_id: int, data: ExpenseCreate) -> Expense:
    ...

@delete('/expense/{expense_id:int}')
async def delete_expense(expense_id: int) -> None:
    ...

config = SQLAlchemyAsyncConfig(
    connection_string="sqlite+aiosqlite:///expense_tracker.sqlite", create_all=True, metadata=Base.metadata
)

plugin = SQLAlchemyPlugin(config=config)
app = Litestar(
    route_handlers=[list_expenses, get_expense, create_expense, update_expense, delete_expense],
    plugins=[plugin]
)