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

@transactions_route.get(path="")
def get_transactions_by_party_rk(party_rk: int):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()
    adapter.add_large_csv_with_chunks('task-files/all_user_transactions.csv', 'all_user_transactions')
    transactions = adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)
    res = []
    for i in range(len(transactions)):
        if transactions[i]['transaction_type_cd'] in ['PUC']:
            curr = {}
            curr['name'] = transactions[i]['brand_nm'] if transactions[i]['brand_nm'] != '0' else 'Без названия'
            curr['category'] = transactions[i]['loyalty_cashback_category_nm'] if transactions[i]['loyalty_cashback_category_nm'] != '0' else 'Другое'
            curr['amount'] = transactions[i]['transaction_amt_rur']
            curr['date'] = transactions[i]['real_transaction_dttm']
            res.append(curr)
    
    print(transactions)
    print(len(transactions))
    print(len(res))
    return res