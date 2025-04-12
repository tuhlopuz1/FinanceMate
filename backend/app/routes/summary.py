from fastapi import APIRouter, HTTPException


summary_route = APIRouter(prefix="/summary", tags=["summary"])

@summary_route.get(path="/")
def get_summary(party_rk: int):


    return {"count": 0}