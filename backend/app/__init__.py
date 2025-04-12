from backend.app.fastapi import app
from backend.app.routes.transactions import transactions_route
from backend.app.routes.auth import auth_route

app.include_router(transactions_route)
app.include_router(auth_route)