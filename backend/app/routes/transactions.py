import uuid
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse


transactions_route = APIRouter(prefix="/transactions", tags=["transactions"])

