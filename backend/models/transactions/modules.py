from pydantic import BaseModel
from typing import Optional
from datetime import date


class AddTransactionRequest(BaseModel):
    party_rk: str
    category: Optional[str] = '0'
    dttm: Optional[date] = None
    amt: Optional[float] = 0
