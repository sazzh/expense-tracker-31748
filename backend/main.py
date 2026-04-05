import datetime
from enum import Enum
from typing import Optional, Annotated
from litestar import Litestar, get
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


@get('/test')
async def test() -> str:
    return "welcome to the backend"

app = Litestar([test])