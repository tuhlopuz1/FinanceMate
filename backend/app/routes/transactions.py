import uuid
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional

from backend.models.transactions.modules import AddTransactionRequest
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

@transactions_route.post(path="/")
def add_transaction(request: AddTransactionRequest):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.insert('all_user_transactions',
                   {
    "party_rk": request.party_rk,
    "account_rk": 0,
    "financial_account_type_cd": "",
    "financial_account_subtype_cd": "",
    "transaction_type_cd": "",
    "transaction_amt_rur": request.amt,
    "real_transaction_dttm": request.dttm,
    "brand_nm": request.brand_name,
    "loyalty_cashback_category_nm": request.category,
    "loyalty_accrual_rub_amt": "",
    "utilization_flg": 0
})
    
    return {"status": "ok"}

