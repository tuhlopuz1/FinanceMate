from g4f import Client
from fastapi import APIRouter, HTTPException

client = Client()



ai_route = APIRouter(prefix="/ai", tags=["ai"])

@ai_route.get(path="/future-advice")
def get_advice(name: str, amt: int):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user",
                   "content": f"дай совет по покупке {name} за {amt} рублей. скажи"}],
        timeout=100,
    )

    title = response.choices[0].message.content
    print(title)

    return {"title": title}