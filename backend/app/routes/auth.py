import uuid
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
from backend.models.transactions.modules import SignUp
from backend.adapters.db_source import DatabaseAdapter
import random
import bcrypt


auth_route = APIRouter(prefix="/auth", tags=["auth"])

@auth_route.post(path="/log-in-by-party-rk")
def log_in_by_party_rk(party_rk: int):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()
    
    user = dict(adapter.get_by_value('users_data', 'party_rk', party_rk)[0])
    # распределение по группам
    user_update = {
        'age_group': '1' if user['age'] < 27 else '2' if user['age'] < 44 else '3',
        'salary_group': '1' if user['monthly_income_amt'] < 509 and user['monthly_income_amt'] != 0 else '2' if user['monthly_income_amt'] < 1388 or user['monthly_income_amt'] == 0 else '3'
    }
    adapter.update_by_value('users_data', user_update, 'party_rk', party_rk)

    if len(user) == 0:
        raise HTTPException(status_code=401, detail='No user with this party_rk')

    return {'response': 'success'}

@auth_route.post(path="/sign-up")
def sign_up(body: SignUp):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()
    adapter.add_large_csv_with_chunks('task-files/all_user_transactions.csv', 'all_user_transactions')


    user_check = adapter.get_by_value('email_users', 'email', body.email)

    if len(user_check) != 0:
        raise HTTPException(status_code=409, detail='this email is already taken')
    
    hash_password = bcrypt.hashpw(body.password.encode('utf-8'), bcrypt.gensalt(rounds=7))
    hash_password = str(hash_password)[2:-1]
    
    new_party_rk = random.randint(-10**9, -10**8)

    new_user1 = {
        'email': body.email,
        'party_rk': new_party_rk,
        'password': hash_password
    }
    new_user2 = {
        'party_rk': new_party_rk,
        'gender_cd': body.gender,
        'age': body.age,
        'monthly_income_amt': body.salary,
        'age_group': '1' if body.age < 27 else '2' if body.age < 44 else '3',
        'salary_group': '1' if body.salary < 509 else '2' if body.salary < 1388 else '3'
    }

    adapter.insert('email_users', new_user1)
    adapter.insert('users_data', new_user2)

    return {'party_rk': new_party_rk}


@auth_route.post(path="/log-in-by-email")
def log_in_by_party_rk(email: str, password: str):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()
    
    user = adapter.get_by_value('email_users', 'email', email)

    bytes_hashed_password = user[0]["password"].encode('utf-8')
    pd_check = bcrypt.checkpw(password.encode('utf-8'), bytes_hashed_password)
    if not pd_check:
        raise HTTPException(status_code=401, detail="Invalid credentials")


    if len(user) == 0:
        raise HTTPException(status_code=401, detail='No user with this email')
    


    return {'party_rk': user[0]['party_rk']}