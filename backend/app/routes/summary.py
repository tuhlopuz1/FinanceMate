from fastapi import APIRouter, HTTPException
from backend.adapters.db_source import DatabaseAdapter


summary_route = APIRouter(prefix="/summary", tags=["summary"])

@summary_route.get(path="/")
def get_summary(party_rk: int):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()

    groups = adapter.get_by_value('email_users', 'party_rk', party_rk)
    print(groups)

    return {"count": 0}