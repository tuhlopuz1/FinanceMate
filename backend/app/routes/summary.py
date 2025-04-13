import json
from fastapi import APIRouter, HTTPException
from backend.adapters.db_source import DatabaseAdapter
from datetime import date


summary_route = APIRouter(prefix="/summary", tags=["summary"])
summary_titles = {
    "age": {
        "1": {
            "credit": """Уведомление: Вы потратили 15% от своих общих трат на кредиты, что значительно превышает 75-й персентиль вашей группы.
Предупреждение: Это может привести к финансовым трудностям в будущем.
Совет: Рассмотрите возможность пересмотра своих кредитных обязательств, чтобы снизить эту долю.""",
            
            "base": """Уведомление: Ваша доля необходимых трат составила 70%, что превышает 75-й персентиль.
Предупреждение: Высокие расходы на необходимые нужды могут ограничивать ваш бюджет.
Совет: Попробуйте оптимизировать свои расходы, исследуя альтернативные варианты.""",
            
            "additional": """Уведомление: Вы потратили 30% на необязательные траты, что выше 75-го персентиля.
Предупреждение: Это может повлиять на ваше финансовое состояние.
Совет: Рассмотрите возможность сокращения ненужных трат, чтобы обеспечить финансовую стабильность."""
        },
        "2": {
            "credit": """Уведомление: Ваша доля расходов на кредиты составила 12%, что превышает 75-й персентиль.
Предупреждение: Это может свидетельствовать о проблемах с управлением долгами.
Совет: Рекомендуем пересмотреть свои кредитные обязательства и составить план по их погашению.""",
            
            "base": """Уведомление: Вы потратили 70% на необходимые нужды, что превышает 75-й персентиль.
Предупреждение: Высокие обязательные расходы могут ограничивать ваш бюджет.
Совет: Постарайтесь найти способы сократить расходы, чтобы улучшить финансовую ситуацию.""",
            
            "additional": """Уведомление: Ваша доля необязательных трат составила 28%, что превышает 75-й персентиль.
Предупреждение: Это может негативно сказаться на ваших сбережениях.
Совет: Пересмотрите свой стиль жизни и постарайтесь уменьшить ненужные покупки."""
        },
        "3": {
            "credit": """Уведомление: Вы потратили 5% на кредиты, что превышает 75-й персентиль.
Предупреждение: Это может указывать на избыточное использование кредитов.
Совет: Рассмотрите возможность использования своих средств более эффективно и уменьшите зависимость от кредитов.""",
            
            "base": """Уведомление: Ваша доля необходимых трат составила 60%, что превышает 75-й персентиль.
Предупреждение: Это может свидетельствовать о недостаточной оптимизации ваших расходов.
Совет: Попробуйте снизить расходы на необходимые нужды, чтобы увеличить свободные средства.""",
            
            "additional": """Уведомление: Вы потратили 40% на необязательные траты, что превышает 75-й персентиль.
Предупреждение: Это может негативно повлиять на ваши накопления.
Совет: Рекомендуем пересмотреть свои необязательные расходы и сократить их для улучшения финансового положения."""
        }
    },
    "salary": {
        "1": {
            "credit": """Уведомление: Вы потратили 15% от своих общих трат на кредиты, что превышает 75-й персентиль вашей группы.
Предупреждение: Это может привести к серьезным финансовым трудностям.
Совет: Рассмотрите возможность пересмотра своих кредитных обязательств и ищите способы уменьшить долги.""",
            
            "base": """Уведомление: Ваша доля необходимых трат составила 85%, что превышает 75-й персентиль.
Предупреждение: Высокие расходы на необходимые нужды могут ограничивать ваши возможности для экономии.
Совет: Попробуйте оптимизировать расходы, исследуя более доступные варианты.""",
            
            "additional": """Уведомление: Вы потратили 30% на необязательные траты, что превышает 75-й персентиль.
Предупреждение: Это может подорвать вашу финансовую стабильность.
Совет: Рассмотрите возможность сокращения ненужных расходов для улучшения вашего бюджета."""
        },
        "2": {
            "credit": """Уведомление: Ваша доля расходов на кредиты составила 12%, что превышает 75-й персентиль.
Предупреждение: Это может свидетельствовать о проблемах с управлением долгами.
Совет: Рекомендуем пересмотреть свои кредитные обязательства и составить план по их погашению.""",
            
            "base": """Уведомление: Вы потратили 70% на необходимые нужды, что превышает 75-й персентиль.
Предупреждение: Высокие обязательные расходы могут ограничивать ваш бюджет.
Совет: Постарайтесь найти способы сократить расходы, чтобы улучшить финансовую ситуацию.""",
            
            "additional": """Уведомление: Ваша доля необязательных трат составила 28%, что превышает 75-й персентиль.
Предупреждение: Это может негативно сказаться на ваших сбережениях.
Совет: Пересмотрите свой стиль жизни и постарайтесь уменьшить ненужные покупки."""
        },
        "3": {
            "credit": """Уведомление: Вы потратили 5% на кредиты, что превышает 75-й персентиль.
Предупреждение: Это может указывать на избыточное использование кредитов.
Совет: Рассмотрите возможность использования своих средств более эффективно и уменьшите зависимость от кредитов.""",
            
            "base": """Уведомление: Ваша доля необходимых трат составила 60%, что превышает 75-й персентиль.
Предупреждение: Это может свидетельствовать о недостаточной оптимизации ваших расходов.
Совет: Попробуйте снизить расходы на необходимые нужды, чтобы увеличить свободные средства.""",
            
            "additional": """Уведомление: Вы потратили 40% на необязательные траты, что превышает 75-й персентиль.
Предупреждение: Это может негативно повлиять на ваши накопления.
Совет: Рекомендуем пересмотреть свои необязательные расходы и сократить их для улучшения финансового положения."""
        }
    }
}



with open('task-files/segmentation.json', mode='r', encoding='Windows-1251') as file:
    data_dict = json.load(file)

@summary_route.get(path="/")
def get_summary(party_rk: int):
    adapter = DatabaseAdapter()
    adapter.connect()
    adapter.initialize_tables()

    age_group = dict(adapter.get_by_value('users_data', 'party_rk', party_rk)[0])['age_group']
    salary_group = dict(adapter.get_by_value('users_data', 'party_rk', party_rk)[0])['salary_group']
    
    all_sum = sum([float(str(dict(i)['transaction_amt_rur']).replace(',', '.')) if str(dict(i)['transaction_type_cd']) == 'PUC' else 0 for i in adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)])
    credit_sum = sum([float(str(dict(i)['transaction_amt_rur']).replace(',', '.')) if str(dict(i)['sphere']) == 'credit' else 0 for i in adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)])
    base_sum = sum([float(str(dict(i)['transaction_amt_rur']).replace(',', '.')) if str(dict(i)['sphere']) == 'base' else 0 for i in adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)])
    additional_sum = sum([float(str(dict(i)['transaction_amt_rur']).replace(',', '.')) if str(dict(i)['sphere']) == 'credit' else 0 for i in adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)])
    credit_part = credit_sum / all_sum
    base_part = base_sum / all_sum
    additional_part  = additional_sum / all_sum
    
    print(credit_part, base_part, additional_part, 1111, data_dict['age'][age_group]['credit_max'], data_dict['age'][age_group]['credit_min'])
    summaries = []
    
    if credit_part > data_dict['age'][age_group]['credit_max'] or credit_part < data_dict['age'][age_group]['credit_min']:
        notification = dict()
        notification['id'] = 1
        notification['date'] = date.today
        notification['title'] = summary_titles['age'][age_group]['credit']
        summaries.append(dict())
        
    dict_to_db = {'party_rk': party_rk, 'notifications': str(summaries)}

    adapter.delete_by_value('notifications', 'party_rk', party_rk)

    adapter.insert('notifications', dict_to_db)
    
    print(all_sum)
    print(222222, date.today)
    
    # credit_sum = adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)
    # credit_dict = dict()
    # credit_dict['date'] = date.today
    # credit_dict['title'] = ''
    # summaries.append(credit_dict)
    # #print(credit_sum)
    
    # base_sum = adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)
    # base_dict = dict()
    # base_dict['date'] = date.today
    # base_dict['title'] = ''
    # summaries.append(base_dict)
    # #print(base_dict)
    
    # additional_sum = adapter.get_by_value('all_user_transactions', 'party_rk', party_rk)
    # additional_dict = dict()
    # additional_dict['date'] = date.today
    # additional_dict['title'] = ''
    # summaries.append(additional_dict)
    # #print(additional_dict)

    return dict_to_db