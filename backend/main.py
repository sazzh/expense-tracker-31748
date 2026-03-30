import datetime
import enum
from litestar import Litestar, get, post
from sqlalchemy import Date, Enum, Integer, String, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from litestar.plugins.sqlalchemy import SQLAlchemyAsyncConfig, SQLAlchemyPlugin
from typing import Sequence
from sqlalchemy.ext.asyncio import AsyncSession

class Base(DeclarativeBase): ...

class Category(enum.Enum):
    FOOD = "food"
    TRANSPORT = "transport"
    UTILITIES = "utilities"
    SHOPPINH = "shopping"
    ENTERTAINMENT = "entertainment"
    OTHER = "other"

class Expense(Base):
    __tablename__ = "expense"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date: Mapped[datetime.date] = mapped_column(Date)
    name: Mapped[str] = mapped_column(String(50))
    amount: Mapped[int] = mapped_column(Integer) # cents
    category: Mapped[Category] = mapped_column(Enum(Category))
    description: Mapped[str] = mapped_column(String(255))

@post('/new')
async def add_expense(data: Expense, db_session: AsyncSession) -> Sequence[Expense]:
    async with db_session.begin():
        db_session.add(data)
    return (await db_session.execute(select(Expense))).scalars().all()

config = SQLAlchemyAsyncConfig(
    connection_string="sqlite+aiosqlite:///expense_tracker.sqlite", create_all=True, metadata=Base.metadata
)

plugin = SQLAlchemyPlugin(config=config)
app = Litestar(
    route_handlers=[add_expense],
    plugins=[plugin]
)