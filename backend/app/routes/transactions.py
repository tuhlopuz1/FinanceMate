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
def get_transactions_by_party_rk(party_rk: int, start_date: str = '0000-00-00', end_date: str = '9999-12-31'):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()
    adapter.add_large_csv_with_chunks('task-files/all_user_transactions.csv', 'all_user_transactions')
    return {"status": "ok"}