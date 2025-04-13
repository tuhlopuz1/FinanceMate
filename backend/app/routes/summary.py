import json
from datetime import datetime
from fastapi import APIRouter, HTTPException
from backend.adapters.db_source import DatabaseAdapter
from datetime import date


summary_route = APIRouter(prefix="/summary", tags=["summary"])
summary_titles = {
    "age": {
        "1": {
            "credit": """Уведомление: Вы превысили % от своих общих трат на кредиты, что значительно превышает 75-й персентиль вашей группы.
Предупреждение: Это может привести к финансовым трудностям в будущем.
Совет: Рассмотрите возможность пересмотра своих кредитных обязательств, чтобы снизить эту долю.""",
            
            "base": """Уведомление: Ваша доля необходимых трат превышает норму в вашей группе.
Предупреждение: Высокие расходы на необходимые нужды могут ограничивать ваш бюджет.
Совет: Попробуйте оптимизировать свои расходы, исследуя альтернативные варианты.""",
            
            "additional": """Уведомление: Вы потратили большой % на необязательные траты, что выше 75-го персентиля.
Предупреждение: Это может повлиять на ваше финансовое состояние.
Совет: Рассмотрите возможность сокращения ненужных трат, чтобы обеспечить финансовую стабильность."""
        },
        "2": {
            "credit": """Уведомление: Ваша доля расходов на кредиты превышает 75-й персентиль.
Предупреждение: Это может свидетельствовать о проблемах с управлением долгами.
Совет: Рекомендуем пересмотреть свои кредитные обязательства и составить план по их погашению.""",
            
            "base": """Уведомление: Вы потратили высокий % на необходимые нужды для вашей группы.
Предупреждение: Высокие обязательные расходы могут ограничивать ваш бюджет.
Совет: Постарайтесь найти способы сократить расходы, чтобы улучшить финансовую ситуацию.""",
            
            "additional": """Уведомление: Ваша доля необязательных трат аномально велика.
Предупреждение: Это может негативно сказаться на ваших сбережениях.
Совет: Пересмотрите свой стиль жизни и постарайтесь уменьшить ненужные покупки."""
        },
        "3": {
            "credit": """Уведомление: Вы потратили значительный % на оплаты кредитов.
Предупреждение: Это может указывать на избыточное использование кредитов.
Совет: Рассмотрите возможность использования своих средств более эффективно и уменьшите зависимость от кредитов.""",
            
            "base": """Уведомление: Ваша доля необходимых трат превышает 75-й персентиль.
Предупреждение: Это может свидетельствовать о недостаточной оптимизации ваших расходов.
Совет: Попробуйте снизить расходы на необходимые нужды, чтобы увеличить свободные средства.""",
            
            "additional": """Уведомление: Вы потратили слишком большую долю трат на необязательные траты.
Предупреждение: Это может негативно повлиять на ваши накопления.
Совет: Рекомендуем пересмотреть свои необязательные расходы и сократить их для улучшения финансового положения."""
        }
    },
    "salary": {
        "1": {
            "credit": """Уведомление: Вы потратили большой % от своих общих трат на кредиты, что превышает 75-й персентиль вашей группы.
Предупреждение: Это может привести к серьезным финансовым трудностям.
Совет: Рассмотрите возможность пересмотра своих кредитных обязательств и ищите способы уменьшить долги.""",
            
            "base": """Уведомление: Ваша доля необходимых трат превышает норму.
Предупреждение: Высокие расходы на необходимые нужды могут ограничивать ваши возможности для экономии.
Совет: Попробуйте оптимизировать расходы, исследуя более доступные варианты.""",
            
            "additional": """Уведомление: Вы потратили большой % на необязательные траты.
Предупреждение: Это может подорвать вашу финансовую стабильность.
Совет: Рассмотрите возможность сокращения ненужных расходов для улучшения вашего бюджета."""
        },
        "2": {
            "credit": """Уведомление: Ваша доля расходов на кредиты составила слишком большое значение.
Предупреждение: Это может свидетельствовать о проблемах с управлением долгами.
Совет: Рекомендуем пересмотреть свои кредитные обязательства и составить план по их погашению.""",
            
            "base": """Уведомление: Вы потратили аномально большую долю трат на необходимые нужды.
Предупреждение: Высокие обязательные расходы могут ограничивать ваш бюджет.
Совет: Постарайтесь найти способы сократить расходы, чтобы улучшить финансовую ситуацию.""",
            
            "additional": """Уведомление: Ваша доля необязательных трат превышает 75-й персентиль.
Предупреждение: Это может негативно сказаться на ваших сбережениях.
Совет: Пересмотрите свой стиль жизни и постарайтесь уменьшить ненужные покупки."""
        },
        "3": {
            "credit": """Уведомление: Расходы на кредиты превышают норму.
Предупреждение: Это может указывать на избыточное использование кредитов.
Совет: Рассмотрите возможность использования своих средств более эффективно и уменьшите зависимость от кредитов.""",
            
            "base": """Уведомление: Ваша доля необходимых трат превышает 75-й персентиль.
Предупреждение: Это может свидетельствовать о недостаточной оптимизации ваших расходов.
Совет: Попробуйте снизить расходы на необходимые нужды, чтобы увеличить свободные средства.""",
            
            "additional": """Уведомление: Вы потратили большой % расходов на необязательные траты.
Предупреждение: Это может негативно повлиять на ваши накопления.
Совет: Рекомендуем пересмотреть свои необязательные расходы и сократить их для улучшения финансового положения."""
        }
    }
}

categories_json = {
    "base": [
        "0", "Дом и ремонт", "Мобильная связь", "Супермаркеты", "Аптеки",
        "ЖКХ", "Транспорт", "Такси", "Рестораны", "Одежда и обувь",
        "Медицина", "Топливо", "Авиабилеты", "Ж/д билеты", "Услуги банка",
        "Электроника и техника", "Детские товары", "Связь", "Телевидение",
        "Интернет", "Онлайн-кинотеатры", "Музыка", "Спорттовары",
        "Фото и видео", "Каршеринг", "Аренда авто", "Экосистема Сбер",
        "Экосистема Яндекс", "Комиссия", "Наличные", "Пополнения",
        "Интернет-магазины", "Различные товары", "Косметика", "Цветы",
        "Животные", "Другое"
    ],
    "credit": ["Кредиты", "Проценты", "Финансы"],
    "additional": [
        "Красота", "Азартные игры и лотереи", "Благотворительность",
        "Развлечения", "Турагентства", "Путешествия", "Частные услуги",
        "Бонусы", "Duty Free", "Эл. кошельки и переводы", "Переводы",
        "Социальные сети", "Искусство", "Фастфуд"
    ]
}


with open('task-files/segmentation.json', mode='r', encoding='Windows-1251') as file:
    data_dict = json.load(file)

@summary_route.get(path="")
def get_summary(party_rk: int):
    global categories_json
    global formatted_date
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()

    age_group = dict(adapter.get_by_value('users_data', 'party_rk', party_rk)[0])['age_group']
    salary_group = dict(adapter.get_by_value('users_data', 'party_rk', party_rk)[0])['salary_group']
    
    all_sum = sum([float(str(dict(i)['transaction_amt_rur']).replace(',', '.')) if str(dict(i)['transaction_type_cd']) == 'PUC' else 0 for i in adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)])
    credit_sum = sum([float(str(dict(i)['transaction_amt_rur']).replace(',', '.')) if str(dict(i)['loyalty_cashback_category_nm']) in categories_json['credit'] and str(dict(i)['transaction_type_cd']) == 'PUC' else 0 for i in adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)])
    base_sum = sum([float(str(dict(i)['transaction_amt_rur']).replace(',', '.')) if str(dict(i)['loyalty_cashback_category_nm']) in categories_json['base'] and str(dict(i)['transaction_type_cd']) == 'PUC' else 0 for i in adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)])
    additional_sum = sum([float(str(dict(i)['transaction_amt_rur']).replace(',', '.')) if str(dict(i)['loyalty_cashback_category_nm']) in categories_json['additional'] and str(dict(i)['transaction_type_cd']) == 'PUC' else 0 for i in adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)])
    credit_part = credit_sum / all_sum
    base_part = base_sum / all_sum
    additional_part  = additional_sum / all_sum
    formatted_date = datetime.now().strftime("%Y-%m-%d")
    
    print(credit_part, base_part, additional_part, 1111, data_dict['age'][age_group]['credit_max'], data_dict['age'][age_group]['credit_min'])
    nots = adapter.get_by_value('notifications', 'party_rk', party_rk)
    if len(nots) == 0:
        summaries = []
    else:
        summaries = json.loads(nots[0]['notifications'])

    if len(adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)) <= 20:
        notification = dict()
        notification['date'] = formatted_date
        notification['text'] = '! Недостаточно транзакций, набертие не менее 20 покупок для отчёта.'
        summaries.insert(0, notification)
        return {'party_rk': party_rk, 'notifications': str(summaries).replace("'",'"')}

    
    bad = False

    today = datetime.now()
    
    if credit_part > data_dict['age'][age_group]['credit_max']:
        notification = dict()
        notification['date'] = formatted_date
        notification['text'] = summary_titles['age'][age_group]['credit']
        bad = True
        summaries.insert(0, notification)
    if base_part > data_dict['age'][age_group]['base_max']:
        notification = dict()
        notification['date'] = formatted_date
        notification['text'] = summary_titles['age'][age_group]['base']
        bad = True
        summaries.insert(0, notification)
    if credit_part > data_dict['age'][age_group]['additional_max']:
        notification = dict()
        notification['date'] = formatted_date
        notification['text'] = summary_titles['age'][age_group]['additional']
        bad = True
        summaries.insert(0, notification)
    if credit_part > data_dict['monthly_income_amt'][salary_group]['credit_max']:
        notification = dict()
        notification['date'] = formatted_date
        bad = True
        notification['text'] = summary_titles['salary'][salary_group]['credit']
        summaries.insert(0, notification)
    if base_part > data_dict['monthly_income_amt'][salary_group]['base_max']:
        notification = dict()
        notification['date'] = formatted_date
        notification['text'] = summary_titles['salary'][salary_group]['base']
        bad = True
        summaries.insert(0, notification)
    if credit_part > data_dict['monthly_income_amt'][salary_group]['additional_max']:
        notification = dict()
        notification['date'] = formatted_date
        notification['text'] = summary_titles['salary'][salary_group]['additional']
        bad = True
        summaries.insert(0, notification)
    
    if not bad:
        notification = dict()
        notification['text'] = '! Транзакции в норме, в распоряжении финансами нет отходов от корректных чисел'
        notification['date'] = formatted_date
        summaries.insert(0, notification)


    print('AAAAAAAAAAAAAAAAAAA', summaries)

    dict_to_db = {'party_rk': party_rk, 'notifications': str(summaries).replace("'",'"')}

    adapter.delete_by_value('notifications', 'party_rk', party_rk)

    adapter.insert('notifications', dict_to_db)
    print()
    print(all_sum)
    print(222222, date.today)
    return dict_to_db