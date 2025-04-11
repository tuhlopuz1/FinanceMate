import uvicorn


def start():
    uvicorn.run(
        app="backend.app:app",
        host="localhost",   
        port=8000,
        reload=True,
    )