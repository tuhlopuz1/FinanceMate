import uuid
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from backend.models.transactions.modules import FiltersRequest
from backend.adapters.db_source import DatabaseAdapter


transactions_route = APIRouter(prefix="/transactions", tags=["transactions"])

@transactions_route.post(path="/default_transactions")
def set_default_transactions():
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()
    
    return {'response': 'success'}

@transactions_route.get(path="/transactions")
def get_transactions(filters: FiltersRequest):
    adapter = DatabaseAdapter()
    adapter.connect()
    
    return {'response': 'success'}