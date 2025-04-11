import uuid
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional

from backend.models.transactions.modules import FiltersRequest
from backend.adapters.db_source import DatabaseAdapter


transactions_route = APIRouter(prefix="/transactions", tags=["transactions"])

@transactions_route.post(path="/default")
def set_default_transactions():
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()
    
    return {'response': 'success'}

@transactions_route.get(path="/")
def get_transactions(filters: Optional[FiltersRequest] = None):
    adapter = DatabaseAdapter()
    adapter.connect()
    
    return adapter.get_all('users_data')