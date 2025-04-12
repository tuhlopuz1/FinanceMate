import pandas as pd
import io

# Путь к файлу
file_path = './task-files/users_data.csv'

# Размер чанка в строках
chunksize = 10**6

# Множество для хранения уникальных значений
unique_values_set = set()

# Читаем файл с декодированием и обработкой ошибок
with open(file_path, 'r', encoding='windows-1251', errors='ignore') as f:
    content = f.read()

# Загружаем CSV из строки с помощью StringIO
csv_buffer = io.StringIO(content)

# Обрабатываем файл по частям
for chunk in pd.read_csv(csv_buffer, sep=';', chunksize=chunksize, on_bad_lines='skip'):
    if 'loyalty_cashback_category_nm' in chunk.columns:
        unique_values_set.update(chunk['loyalty_cashback_category_nm'].dropna().unique())

# Выводим результат
print("Уникальные значения в столбце 'loyalty_cashback_category_nm':")
for val in sorted(unique_values_set):
    print(val)
