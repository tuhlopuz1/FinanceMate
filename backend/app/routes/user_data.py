
from fastapi import APIRouter, HTTPException

from backend.adapters.db_source import DatabaseAdapter


users_route = APIRouter(prefix="/users", tags=["users"])

@users_route.get(path="/get-user-data")
def log_in_by_party_rk(party_rk: int):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()

    user = adapter.get_by_value('users_data', 'party_rk', party_rk)[0]

    

    return user


@users_route.put(path="/put-user-data")
def log_in_by_party_rk(party_rk: int, gender: str, age: int, salary: int):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()

    user = adapter.get_by_value('users_data', 'party_rk', party_rk)[0]

    user['gender_cd'] = gender
    user['age'] = age
    user['monthly_income_amt'] = salary

    adapter.delete_by_value('users_data', 'party_rk', party_rk)

    adapter.insert('users_data', user)

    return user