from fastapi import APIRouter, HTTPException, File, UploadFile, Query
from fastapi.responses import JSONResponse
import json

from backend.adapters.db_source import DatabaseAdapter


notifications_route = APIRouter(prefix="/notifications", tags=["notifications"])

@notifications_route.get(path="/get-notifications")
def get_notifications(party_rk):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()
    
    notifications = adapter.get_by_value('notifications', 'party_rk', party_rk)

    user = adapter.get_by_value('users_data', 'party_rk', party_rk)[0]


    brief_not = {
                    'text': 'Здравствуйте, я ваш личный финансовый помощник. здесь будут отображаться отчеты о ваших покупках.',
                    'date': user['first_bank_product_date']
                }


    if len(notifications) == 0:
        return [
                brief_not
            ]

    notifications = notifications[0]['notifications']
    
    list_of_dicts = json.loads(notifications)

    print(list_of_dicts)

    return list_of_dicts + [brief_not]