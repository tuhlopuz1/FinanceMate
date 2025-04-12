from fastapi import FastAPI
from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

def lifespan(app: FastAPI):
    print("Server started")
    yield
    print("Server stopped")


# Инициализация приложения
app = FastAPI(lifespan=lifespan, title="FinanceMate")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Или укажите конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)