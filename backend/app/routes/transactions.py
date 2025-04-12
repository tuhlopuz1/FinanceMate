import uuid
import pandas as pd
from fastapi import APIRouter, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
from typing import Optional
from io import StringIO

from backend.models.transactions.modules import AddTransactionRequest
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

@transactions_route.post(path="")
def add_transaction(request: AddTransactionRequest):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.insert('all_user_transactions',
                   {
    "party_rk": request.party_rk,
    "account_rk": 0,
    "financial_account_type_cd": "",
    "financial_account_subtype_cd": "",
    "transaction_type_cd": "PUC",
    "transaction_amt_rur": request.amt,
    "real_transaction_dttm": request.dttm,
    "brand_nm": request.brand_name,
    "loyalty_cashback_category_nm": request.category,
    "loyalty_accrual_rub_amt": "",
    "utilization_flg": 0
})
    
    return {"status": "ok"}

@transactions_route.post(path="/csv")
async def add_transaction_csv(file: UploadFile = File(...)):
    contents = await file.read()

    try:
        csv_string = contents.decode("utf-8")
    except UnicodeDecodeError:
        csv_string = contents.decode("Windows-1251", errors="replace")

    df = pd.read_csv(StringIO(csv_string), sep=';')
    
    print(df.head().to_dict(orient="records")[0])
    
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.insert('all_user_transactions', df.head().to_dict(orient="records")[0])
    
    return {"status": "ok"}


@transactions_route.post(path="/add-category")
async def add_transaction_category(party_rk: int, category: str):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()
    current_categories = adapter.get_by_value('custom_categories', 'party_rk', party_rk)

    if len(current_categories) == 0:
        adapter.insert('custom_categories', {
            'party_rk': party_rk,
            'categories': [category]
        })
    else:
        adapter.delete_by_value('custom_categories', 'party_rk', party_rk)
        adapter.insert('custom_categories', {
            'party_rk': party_rk,
            'categories': current_categories[0]['categories'] + [category]
        })

@transactions_route.get(path="/get-categories")
async def get_categories(party_rk: int):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()

    categories = adapter.get_by_value('custom_categories', 'party_rk', party_rk)

    if len(categories) == 0:
        return []
    return  categories[0]['categories']