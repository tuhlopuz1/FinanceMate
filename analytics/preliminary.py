import pandas as pd

# Размер чанка в строках
chunksize = 10**6

# Множество для хранения уникальных значений
unique_values_set = set()

# Обрабатываем файл по частям
for chunk in pd.read_csv('./task-files/users_data.csv', encoding='windows-1251', chunksize=chunksize, sep=';', on_bad_lines='skip', header=0):
    # Добавляем уникальные значения из столбца 'loyalty_cashback_category_nm' в множество
    unique_values_set.update(chunk['loyalty_cashback_category_nm'].dropna().unique())
