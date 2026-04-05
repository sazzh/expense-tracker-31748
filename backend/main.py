from collections.abc import AsyncGenerator
import datetime
from enum import Enum
from typing import Optional
from litestar import Litestar, delete, get, post, put
from litestar.plugins.sqlalchemy import SQLAlchemyPlugin, SQLAlchemyAsyncConfig, base, SQLAlchemyDTO, SQLAlchemyDTOConfig
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, Date, Enum as SqlEnum, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
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

class Expense(base.BigIntBase):
    __tablename__ = "expenses"
    date: Mapped[datetime.date] = mapped_column(Date)
    name: Mapped[str] = mapped_column(String(100))
    amount_cents: Mapped[int] = mapped_column(Integer)
    category: Mapped[CategoryEnum] = mapped_column(SqlEnum(CategoryEnum))
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

class ReadDTO(SQLAlchemyDTO[Expense]):
    config = SQLAlchemyDTOConfig(include={"id", "date", "name", "amount_cents", "category", "description"})

class WriteDTO(SQLAlchemyDTO[Expense]):
    config = SQLAlchemyDTOConfig(exclude={"id"})

# Setup database
async def provide_transaction(db_session: AsyncSession) -> AsyncGenerator[AsyncSession, None]:
    try:
        async with db_session.begin():
            yield db_session
    except IntegrityError as exc:
        raise ClientException(status_code=409, detail=str(exc)) from exc

# Routes
@get('/expenses')
async def get_expenses(transaction: AsyncSession) -> list[Expense]:
    result = await transaction.execute(select(Expense))
    return list(result.scalars().all())

@get('/expenses/{expense_id:int}')
async def get_expense(expense_id: int, transaction: AsyncSession) -> Expense:
    result = await transaction.execute(select(Expense).where(Expense.id == expense_id))
    expense = result.scalar_one_or_none()
    if not expense:
        raise NotFoundException(detail="Expense not found")
    return expense

@post('/expenses')
async def create_expense(data: Expense, transaction: AsyncSession) -> Expense:
    transaction.add(data)
    await transaction.flush()
    return data

@put('/expenses/{expense_id:int}')
async def update_expense(expense_id: int, data: Expense) -> Expense:
    ...

@delete('/expenses/{expense_id:int}')
async def delete_expense() -> None:
    ...

db_config = SQLAlchemyAsyncConfig(
    connection_string="sqlite+aiosqlite:///expensetracker.sqlite",
    metadata=base.BigIntBase.metadata,
    create_all=True,
    before_send_handler="autocommit",
)

app = Litestar(
    [get_expenses, get_expense, create_expense, update_expense, delete_expense],
    dependencies={"transaction": provide_transaction},
    plugins=[SQLAlchemyPlugin(db_config)],
)