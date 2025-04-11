import uvicorn


def start():
    uvicorn.run(
        app="backend.app:app",
        host="localhost",   
        port=8080,
        reload=True,
    )