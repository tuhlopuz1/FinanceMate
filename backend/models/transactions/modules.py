from pydantic import BaseModel
from typing import Optional
from datetime import date


class AddTransactionRequest(BaseModel):
    party_rk: int
    brand_name: Optional[str] = '0'
    category: Optional[str] = '0'
    dttm: Optional[date] = None
    amt: Optional[str] = 0

class SignUp(BaseModel):
    email: str
    password: str
    gender: str
    age: int
    salary: int