from backend.app.fastapi import app
from backend.app.routes.transactions import transactions_route


app.include_router(transactions_route)