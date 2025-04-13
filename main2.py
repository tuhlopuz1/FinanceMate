import pandas as pd
import numpy as np
from scipy import stats

# Загрузка данных
for chunk in pd.read_csv('../task-files/all_user_transactions.csv', encoding='windows-1251', chunksize=chunksize, sep=';', on_bad_lines='skip', header=0):
    # Добавляем уникальные значения из столбца 'loyalty_cashback_category_nm' в множество
    unique_values_set.update(chunk['loyalty_cashback_category_nm'].dropna().unique())

transactions = pd.read_csv("all_user_transactions.csv")

# Вычисление возраста
current_year = pd.to_datetime('now').year
users['first_bank_year'] = pd.to_datetime(users['first_bank_product_date']).dt.year
users['age'] = current_year - users['first_bank_year']

# Сегментация
def assign_group(row):
    income = row['monthly_income_amt']
    region = row['lvn_state_nm']
    risk = row['risk_level_cd']
    age = row['age']
    
    # Группа по доходу
    if income <= np.percentile(users['monthly_income_amt'], 25):
        income_group = 'low'
    elif income <= np.percentile(users['monthly_income_amt'], 75):
        income_group = 'medium'
    else:
        income_group = 'high'
    
    # Возрастная группа
    if age <= 30:
        age_group = 'young'
    elif age <= 50:
        age_group = 'middle'
    else:
        age_group = 'senior'
    
    return f"{region}_{income_group}_{risk}_{age_group}"

users['segment'] = users.apply(assign_group, axis=1)

# Расчет перцентилей для групп
def calculate_percentiles(category):
    segments = users['segment'].unique()
    percentiles = {}
    for seg in segments:
        user_ids = users[users['segment'] == seg]['party_rk']
        trans = transactions[
            (transactions['party_rk'].isin(user_ids)) & 
            (transactions['loyalty_cashback_category_nm'] == category)
        ]
        amounts = trans['transaction_amt_rur']
        percentiles[seg] = {
            '25p': np.percentile(amounts, 25),
            '75p': np.percentile(amounts, 75),
            '95p': np.percentile(amounts, 95)
        }
    return percentiles

# Пример для категории "Кредиты"
credit_percentiles = calculate_percentiles("Кредиты")

# Генерация уведомлений
def generate_alerts(user_id):
    user = users[users['party_rk'] == user_id].iloc[0]
    segment = user['segment']
    user_trans = transactions[transactions['party_rk'] == user_id]
    
    alerts = []
    for category in ["Кредиты", "Рестораны", "ЖКХ"]:
        user_spent = user_trans[
            user_trans['loyalty_cashback_category_nm'] == category
        ]['transaction_amt_rur'].sum()
        p95 = credit_percentiles[segment]['95p']
        if user_spent > p95:
            alerts.append(f"Превышение трат в категории {category}: {user_spent} ₽ vs норма {p95} ₽")
    
    return alerts
