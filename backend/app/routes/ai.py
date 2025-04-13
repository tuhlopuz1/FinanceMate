from g4f import Client
from fastapi import APIRouter, HTTPException
from backend.adapters.db_source import DatabaseAdapter
client = Client()



ai_route = APIRouter(prefix="/ai", tags=["ai"])

@ai_route.get(path="/future-advice")
def get_advice(party_rk: int, name: str, amt: int):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()

    user = adapter.get_by_value('users_data', 'party_rk', party_rk)[0]

    transactions = adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)
    res = []
    for i in range(len(transactions)):
        if transactions[i]['transaction_type_cd'] in ['PUC']:
            curr = {}
            curr['name'] = transactions[i]['brand_nm'] if transactions[i]['brand_nm'] != '0' else 'Без названия'
            curr['category'] = transactions[i]['loyalty_cashback_category_nm'] if transactions[i]['loyalty_cashback_category_nm'] != '0' else 'Другое'
            curr['amount'] = transactions[i]['transaction_amt_rur']
            curr['date'] = transactions[i]['real_transaction_dttm']
            res.append(curr)
        else:
            print('ПРОПУЩЕНА ЗАПИСЬ', transactions[i])

    prompt = f"Представь что ты выступаешь в роли финансового помощника на сайте. пользователь запрашивает совет по покупке: название покупки: {name}. стоимость покупки: {amt}. оцени суть покупки и расскажи пользователю, стоит ли сейчас совершить эту покупку или может быть сначала накопить денег, или может стоит вообще отказаться от покупки в зависимости от его зарплаты и последних трат. вот некоторые данные этого пользователя: {user}. вот транзакции пользователя: {transactions}. Заметь, что если пользовател ввел что-то несвязное с заданием, надо сказать об этом и вернуть сообщение о том, что данные введены неверно.."

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user",
                   "content": prompt}],
        timeout=100,
    )

    result = response.choices[0].message.content
    print(result)

    return {"result": result}