from fastapi import APIRouter, HTTPException
from backend.adapters.db_source import DatabaseAdapter
from datetime import date


summary_route = APIRouter(prefix="/summary", tags=["summary"])

@summary_route.get(path="/")
def get_summary(party_rk: int):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()

    age_group = dict(adapter.get_by_value('users_data', 'party_rk', party_rk)[0])['age_group']
    salary_group = dict(adapter.get_by_value('users_data', 'party_rk', party_rk)[0])['salary_group']
    
    all_sum = sum([float(dict(i)['transaction_amt_rur'].replace(',', '.')) for i in adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)])
    
    print(all_sum)
    print(222222, date.today)
    summaries = []
    
    credit_sum = adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)
    credit_dict = dict()
    credit_dict['date'] = date.today
    credit_dict['title'] = ''
    summaries.append(credit_dict)
    #print(credit_sum)
    
    base_sum = adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)
    base_dict = dict()
    base_dict['date'] = date.today
    base_dict['title'] = ''
    summaries.append(base_dict)
    #print(base_dict)
    
    additional_sum = adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)
    additional_dict = dict()
    additional_dict['date'] = date.today
    additional_dict['title'] = ''
    summaries.append(additional_dict)
    #print(additional_dict)

    return {"count": 0,
            "summaries": summaries}