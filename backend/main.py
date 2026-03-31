import datetime
import enum
from litestar import Litestar, delete, get, post, put, Controller
from sqlalchemy import Date, Enum, Integer, String, select
from sqlalchemy.orm import Mapped, mapped_column
from litestar.plugins.sqlalchemy import SQLAlchemyAsyncConfig, SQLAlchemyPlugin, SQLAlchemyDTO, SQLAlchemyDTOConfig, repository
from litestar.contrib.sqlalchemy.base import BigIntBase as Base
from litestar.di import Provide
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

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
    date: Mapped[datetime.date] = mapped_column(Date)
    name: Mapped[str] = mapped_column(String(50))
    amount: Mapped[int] = mapped_column(Integer) # cents
    category: Mapped[Category] = mapped_column(Enum(Category))
    description: Mapped[Optional[str]] = mapped_column(String(255))

# DTOs from model
class ExpenseRead(SQLAlchemyDTO[Expense]):
    pass

class ExpenseCreate(SQLAlchemyDTO[Expense]):
    config = SQLAlchemyDTOConfig(exclude={"id"})

class ExpenseUpdate(SQLAlchemyDTO[Expense]):
    config = SQLAlchemyDTOConfig(
        exclude={"id"},
        partial=True,
    )

# Routes
class ExpenseRepository(repository.SQLAlchemyAsyncRepository[Expense]):
    model_type = Expense

async def provide_expense_repo(db_session: AsyncSession) -> ExpenseRepository:
    return ExpenseRepository(session=db_session)

class ExpenseController(Controller):
    path = '/expense'
    dependencies = {'expense_repo': Provide(provide_expense_repo)}

    @get('/', return_dto=ExpenseRead)
    async def list_expenses(self, expense_repo: ExpenseRepository) -> list[Expense]:
        return await expense_repo.list()

    @get('/{expense_id:int}')
    async def get_expense(self, expense_id: int, expense_repo: ExpenseRepository) -> ExpenseRead:
        ... # TODO

    @post('/', dto=ExpenseCreate, return_dto=ExpenseRead)
    async def create_expense(self, data: Expense, expense_repo: ExpenseRepository) -> Expense:
        return await expense_repo.add(data, auto_commit=True)

    @put('/{expense_id:int}')
    async def update_expense(self, expense_id: int, data: ExpenseCreate, expense_repo: ExpenseRepository) -> ExpenseRead:
        ...

    @delete('/{expense_id:int}')
    async def delete_expense(self, expense_id: int, expense_repo: ExpenseRepository) -> None:
        ...

config = SQLAlchemyAsyncConfig(
    connection_string="sqlite+aiosqlite:///expense_tracker.sqlite", create_all=True, metadata=Base.metadata
)

# prints db objects to console 
async def show_db(app: Litestar) -> None:
    async with config.get_session() as session:
        statement = select(Expense).order_by(Expense.name.desc())
        result = await session.execute(statement)
        print(result.all()) 

plugin = SQLAlchemyPlugin(config=config)
app = Litestar(
    route_handlers=[ExpenseController],
    plugins=[plugin],
    on_startup=[show_db]
)