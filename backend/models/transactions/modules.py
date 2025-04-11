from pydantic import BaseModel
from typing import Optional
from datetime import date


class FiltersRequest(BaseModel):
    party_rk: str
    min_date: Optional[date] = None
    max_date: Optional[date] = None