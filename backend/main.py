from collections.abc import AsyncGenerator
from dataclasses import dataclass
from datetime import timedelta, timezone, datetime, date
from enum import Enum
import os
from typing import Optional, cast
from litestar import Litestar, Request, delete, get, post, put
from litestar.plugins.sqlalchemy import SQLAlchemyPlugin, SQLAlchemyAsyncConfig, base, SQLAlchemyDTO, SQLAlchemyDTOConfig
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, ForeignKey, Integer, String, Date, Enum as SqlEnum, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.hybrid import hybrid_property
from collections.abc import AsyncGenerator
from litestar.exceptions import ClientException, HTTPException, NotFoundException
from litestar.di import Provide
import bcrypt
import jwt
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = cast(str, os.getenv("SECRET_KEY"))

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
    date: Mapped[date] = mapped_column(Date)
    name: Mapped[str] = mapped_column(String(100))
    amount_cents: Mapped[int] = mapped_column(Integer)
    category: Mapped[CategoryEnum] = mapped_column(SqlEnum(CategoryEnum))
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.current_timestamp())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    @hybrid_property
    def amount(self) -> float: # type: ignore[misc]
        return self.amount_cents / 100
    
    @amount.setter
    def amount(self, value: float) -> None:
        self.amount_cents = round(value * 100)

class ReadDTO(SQLAlchemyDTO[Expense]):
    config = SQLAlchemyDTOConfig(include={"id", "date", "name", "amount", "category", "description", "created_at", "updated_at", "user_id"})

class WriteDTO(SQLAlchemyDTO[Expense]):
    config = SQLAlchemyDTOConfig(exclude={"id"})

class User(base.BigIntBase):
    __tablename__ = "users"
    username: Mapped[str] = mapped_column(String(100, collation="NOCASE"), unique=True)
    password: Mapped[str] = mapped_column(String(50))
    role: Mapped[str] = mapped_column(String(20), default="user") # user or admin
    expenses: Mapped[list["Expense"]] = relationship("Expense", cascade="all, delete-orphan", lazy="selectin")

class UserDTO(SQLAlchemyDTO[User]):
    config = SQLAlchemyDTOConfig(exclude={"password"})

@dataclass
class RegisterDTO:
    username: str
    password: str
    confirmPassword: str

@dataclass
class LoginDTO:
    username: str
    password: str

# Setup database
async def provide_transaction(db_session: AsyncSession) -> AsyncGenerator[AsyncSession, None]:
    try:
        async with db_session.begin():
            yield db_session
    except IntegrityError as exc:
        raise ClientException(status_code=409, detail=str(exc)) from exc
    
# User Routes and Functions
# hash password before storing in database
def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")

# verify provided password against hashed one in database
# encode both to bytes then use checkpw to compare
def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)

# create token for login
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    payload = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    payload.update({"exp": expire})
    encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return encoded_jwt

@post('/register', return_dto=UserDTO)
async def register_user(data: RegisterDTO, transaction: AsyncSession) -> dict[str, str]:
    username = data.username.strip().lower()

    if data.password != data.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing_user = await transaction.scalar(select(User).where(User.username == username))
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
        
    user = User(
        username=username,
        password=get_password_hash(data.password),
        role="user",
    )
    transaction.add(user)
    await transaction.flush()

    # create jwt so don't have to login after registering
    expires_at = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": username},
        expires_delta=expires_at,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": username,
        "role": user.role,
    }

# get token + login
@post('/token')
async def login_access_token(data: LoginDTO, transaction: AsyncSession) -> dict[str, str]:
    username = data.username.strip().lower()

    user = await transaction.scalar(select(User).where(User.username == username))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})

    # create JWT token
    expires_at = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": username},
        expires_delta=expires_at,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": username,
        "role": user.role,
    }

# To get user to associate with expenses
async def provide_user(request: Request, transaction: AsyncSession) -> User:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing access token")
    
    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Expired token")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await transaction.scalar(select(User).where(User.username == username))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

# Expense Routes - user
@get('/expenses', return_dto=ReadDTO)
async def get_my_expenses(transaction: AsyncSession, current_user: User) -> list[Expense]:
    result = await transaction.execute(select(Expense).where(Expense.user_id == current_user.id))
    return list(result.scalars().all())

# Expense Routes - admin
@get('/admin/expenses', return_dto=ReadDTO)
async def get_expenses(transaction: AsyncSession) -> list[Expense]:
    result = await transaction.execute(select(Expense))
    return list(result.scalars().all())

@get('/expenses/{expense_id:int}', return_dto=ReadDTO)
async def get_expense(expense_id: int, transaction: AsyncSession) -> Expense:
    result = await transaction.execute(select(Expense).where(Expense.id == expense_id))
    expense = result.scalar_one_or_none()
    if not expense:
        raise NotFoundException(detail="Expense not found")
    return expense

@post('/expenses', dto=WriteDTO, return_dto=ReadDTO)
async def create_expense(data: Expense, transaction: AsyncSession) -> Expense:
    transaction.add(data)
    await transaction.flush()
    return data

@put('/expenses/{expense_id:int}', dto=WriteDTO, return_dto=ReadDTO)
async def update_expense(expense_id: int, data: Expense, transaction: AsyncSession) -> Expense:
    expense = await transaction.get(Expense, expense_id)
    if not expense:
        raise NotFoundException(detail="Expense not found")
    for key, value in data.__dict__.items():
        if key != "id" and not key.startswith("_"):
            setattr(expense, key, value)
    return expense

@delete('/expenses/{expense_id:int}')
async def delete_expense(expense_id: int, transaction: AsyncSession) -> None:
    expense = await transaction.get(Expense, expense_id)
    if not expense:
        raise NotFoundException(detail="Expense not found")
    await transaction.delete(expense)

@get('/admin/users', return_dto=UserDTO)
async def get_users(transaction: AsyncSession) -> list[User]:
    result = await transaction.execute(select(User))
    return list(result.scalars().all())

@get('/admin/users/{user_id:int}', return_dto=UserDTO)
async def get_user(user_id: int, transaction: AsyncSession) -> User:
    result = await transaction.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@get('/admin/users/{user_id:int}/expenses', return_dto=ReadDTO)
async def get_all_user_expenses(user_id: int, transaction: AsyncSession) -> list[Expense]:
    result = await transaction.execute(select(Expense).where(Expense.user_id == user_id))
    return list(result.scalars().all())

@delete('/admin/users/{user_id:int}')
async def delete_user(user_id: int, transaction: AsyncSession) -> None:
    result = await transaction.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise NotFoundException(detail="User not found")
    await transaction.delete(user)

# Trend Routes
@get('/expenses/category')
async def get_expenses_by_category(transaction: AsyncSession) -> list[dict[str, str | int]]:
    query = select(Expense.category, func.sum(Expense.amount).label("total")).group_by(Expense.category)
    result = await transaction.execute(query)
    data = [{"category": row.category, "total": row.total} for row in result.all()]
    return data

@get('/expenses/month')
async def get_expenses_by_month(transaction: AsyncSession) -> list[dict[str, str | int]]:
    query = select(func.strftime("%Y-%m", Expense.date).label("month"),
                   func.sum(Expense.amount).label("total")
                ).group_by("month").order_by("month")
    result = await transaction.execute(query)
    data = [{"month": row.month, "total": row.total} for row in result.all()]
    return data

# Setup application including db
BASE = os.path.dirname(os.path.abspath(__file__))
db_config = SQLAlchemyAsyncConfig(
    connection_string=f"sqlite+aiosqlite:///{BASE}/expensetracker.sqlite",
    metadata=base.BigIntBase.metadata,
    create_all=True,
    before_send_handler="autocommit",
)

app = Litestar(
    [register_user, login_access_token, delete_user,
     get_my_expenses,
    get_expenses, get_expense, create_expense, update_expense, delete_expense, get_expenses_by_category, get_expenses_by_month, get_users, get_user, get_all_user_expenses],
    dependencies={"transaction": Provide(provide_transaction),
                   "current_user": Provide(provide_user, use_cache=False)},
    plugins=[SQLAlchemyPlugin(db_config)],
    debug=True,
)