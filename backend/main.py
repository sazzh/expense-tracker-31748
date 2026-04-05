import datetime
from enum import Enum
from typing import Optional, Annotated
from litestar import Litestar, delete, get, post, put
from litestar.dto import dto_field
from dataclasses import dataclass

# Models
class CategoryEnum(Enum):
    FOOD = "food"
    TRANSPORT = "transport"
    ENTERTAINMENT = "entertainment"
    UTILITIES = "utilities"
    SHOPPING = "shopping"
    OTHER = "other"

@dataclass
class Expense:
    id: Annotated[int, dto_field("read-only")]
    date: datetime.date
    name: str
    amount: int
    category: CategoryEnum
    description: Optional[str]

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

app = Litestar([get_expenses, get_expense, create_expense, update_expense, delete_expense])