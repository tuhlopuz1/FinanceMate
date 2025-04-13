import os
import csv
import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor
from typing import List, Any

load_dotenv()

class DatabaseAdapter:
    def __init__(self) -> None:
        self.connection = None

    def connect(self) -> None:
        try:
            self.connection = psycopg2.connect(
                dbname="postgres",
                user="postgres",
                password=os.getenv("DB_PASSWORD"),
                host=os.getenv("DB_HOST"),
                port=os.getenv("DB_PORT")
            )
            print("Соединение с базой данных установлено.")
        except psycopg2.Error as e:
            print(f"Ошибка подключения к базе данных: {e}")
            raise
        
    def create_table_if_not_exists(self, table_name: str) -> None:
        """Создает таблицу, если она не существует."""
        create_table_query = f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            q TEXT,
            party_rk INTEGER,
            gender_cd CHAR(1),
            age INTEGER,
            citizenship TEXT,
            citizenship_country_nm TEXT,
            monthly_income_amt NUMERIC,
            first_bank_product_date DATE,
            first_session_dttm TIMESTAMP,
            lvn_state_nm TEXT,
            risk_level_cd TEXT,
            account_rk INT,
            financial_account_type_cd VARCHAR(10),
            financial_account_subtype_cd VARCHAR(10),
            transaction_type_cd VARCHAR(10),
            transaction_amt_rur VARCHAR(100),
            real_transaction_dttm VARCHAR(50),
            brand_nm VARCHAR(200),
            loyalty_cashback_category_nm VARCHAR(100),
            loyalty_accrual_rub_amt VARCHAR(100),
            utilization_flg INT,
            age_group TEXT,
            salary_group TEXT
        );
        """
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(create_table_query)
                self.connection.commit()
                print(f"Таблица {table_name} успешно создана или уже существует.")
        except Exception as e:
            print(f"Ошибка при создании таблицы: {e}")
            self.connection.rollback()  # Откатываем изменения в случае ошибки

    
    def initialize_tables(self):
        #self.add_table_from_csv('task-files/all_user_balances.csv', 'all_user_balances')
        #self.add_table_from_csv('task-files/all_user_transactions.csv', 'all_user_transactions')
        self.add_table_from_csv('task-files/users_data.csv', 'users_data')

        self.execute_with_request("""
            CREATE TABLE IF NOT EXISTS email_users (
                party_rk INT,
                email VARCHAR(255),
                password VARCHAR(255)
        );
        """)
        self.execute_with_request("""
            CREATE TABLE IF NOT EXISTS custom_categories (
                party_rk INT,
                categories TEXT[]
        );
        """)
        cursor = self.connection.cursor()
        # 1. Добавление нового столбца 'sphere'

        if self.column_exists('all_user_transactions', 'sphere'):
                return
            
        cursor.execute('ALTER TABLE all_user_transactions ADD COLUMN sphere VARCHAR')
        # 2. Определение категорий и соответствующих сфер
        category_to_sphere = {
            "Кредиты": "credit",
            "Проценты": "credit",
            "Финансы": "credit",
            "Дом и ремонт": "base",
            "Мобильная связь": "base",
            "Супермаркеты": "base",
            "Аптеки": "base",
            "ЖКХ": "base",
            "Транспорт": "base",
            "Такси": "base",
            "Рестораны": "base",
            "Одежда и обувь": "base",
            "Медицина": "base",
            "Топливо": "base",
            "Авиабилеты": "base",
            "Ж/д билеты": "base",
            "Услуги банка": "base",
            "Электроника и техника": "base",
            "Детские товары": "base",
            "Красота": "additional",
            "Связь": "base",
            "Телевидение": "base",
            "Интернет": "base",
            "Онлайн-кинотеатры": "base",
            "Музыка": "base",
            "Спорттовары": "base",
            "Фото и видео": "base",
            "Каршеринг": "base",
            "Аренда авто": "base",
            "Экосистема Сбер": "base",
            "Экосистема Яндекс": "base",
            "Комиссия": "base",
            "Наличные": "base",
            "Пополнения": "base",
            "Интернет-магазины": "base",
            "Различные товары": "base",
            "Косметика": "base",
            "Цветы": "base",
            "Животные": "base",
            "Другое": "base",
            "Азартные игры и лотереи": "additional",
            "Благотворительность": "additional",
            "Развлечения": "additional",
            "Турагентства": "additional",
            "Путешествия": "additional",
            "Частные услуги": "additional",
            "Бонусы": "additional",
            "Duty Free": "additional",
            "Эл. кошельки и переводы": "additional",
            "Переводы": "additional",
            "Социальные сети": "additional",
            "Искусство": "additional",
            "Фастфуд": "additional"
        }

        # 3. Обновление столбца 'sphere' на основе 'loyalty_cashback_category_nm'
        for category, sphere in category_to_sphere.items():
            cursor.execute('''
                UPDATE all_user_transactions
                SET sphere = %s
                WHERE loyalty_cashback_category_nm = %s
            ''', (sphere, category))

        # Сохранение изменений и закрытие соединения
        self.connection.commit()
        
    def add_table_from_csv(self, csv_file: str, table_name: str) -> None:
        """Загружает данные из CSV файла в указанную таблицу."""
        self.create_table_if_not_exists(table_name)
        
        data = self.execute_with_request(f'SELECT * FROM {table_name} LIMIT 12')
        if data != []:
            return
        try:
            with open(csv_file, mode='r', encoding='Windows-1251', errors='replace') as file:
                reader = csv.reader(file, delimiter=';')  # Указываем разделитель как точка с запятой
                headers = next(reader)  # Читаем заголовки из первой строки

                with self.connection.cursor() as cursor:
                    for row in reader:
                        # Обработка некорректных значений для даты
                        for i, value in enumerate(row):
                            if headers[i] in ['first_bank_product_date', 'first_session_dttm']:
                                if value == '0' or value == '':
                                    row[i] = None  # Заменяем некорректное значение на NULL

                        # Формируем SQL-запрос для вставки данных
                        insert_query = f"INSERT INTO {table_name} ({', '.join(headers)}) VALUES ({', '.join(['%s'] * len(row))})"
                        cursor.execute(insert_query, row)
                    self.connection.commit()  # Подтверждаем изменения
                    print(f"Данные из {csv_file} успешно загружены в таблицу {table_name}.")
            # 1. Добавление нового столбца 'sphere'

            if self.column_exists('all_user_transactions', 'sphere'):
                return
            cursor.execute('ALTER TABLE all_user_transactions ADD COLUMN sphere VARCHAR')
            # 2. Определение категорий и соответствующих сфер
            category_to_sphere = {
                "0": "base",
                "Duty Free": "additional",
                "Авиабилеты": "additional",
                "Автоуслуги": "base",
                "Азартные игры и лотереи": "additional",
                "Аптеки": "base",
                "Аренда авто": "base",
                "Благотворительность": "additional",
                "Бонусы": "additional",
                "Госуслуги": "base",
                "Детские товары": "base",
                "Дивиденды": "additional",
                "Дом и ремонт": "base",
                "Другое": "base",
                "Ж/д билеты": "additional",
                "Животные": "base",
                "ЖКХ": "base",
                "Зарплата": "base",
                "Зарядка электромобилей": "base",
                "Интернет": "base",
                "Интернет-магазины": "base",
                "Искусство": "additional",
                "Канцтовары": "base",
                "Каршеринг": "base",
                "Кино": "additional",
                "Книги": "additional",
                "Комиссия": "base",
                "Косметика": "base",
                "Красота": "additional",
                "Кредиты": "credit",
                "Маркетплейсы": "base",
                "Медицина": "base",
                "Местный транспорт": "base",
                "Металлы": "additional",
                "Мобильная связь": "base",
                "Музыка": "additional",
                "Наличные": "base",
                "НКО": "additional",
                "Образование": "base",
                "Одежда и обувь": "base",
                "Онлайн-кинотеатры": "additional",
                "Отели": "additional",
                "Переводы": "additional",
                "Платные дороги": "base",
                "Пополнения": "base",
                "Проценты": "credit",
                "Развлечения": "additional",
                "Различные товары": "base",
                "Рестораны": "base",
                "Связь": "base",
                "Сервис": "base",
                "Сетевой маркетинг": "additional",
                "Соцвыплаты и пенсии": "base",
                "Социальные сети": "additional",
                "Спорттовары": "base",
                "Сувениры": "additional",
                "Супермаркеты": "base",
                "Такси": "base",
                "Телевидение": "base",
                "Телефония": "base",
                "Топливо": "base",
                "Транспорт": "base",
                "Турагентства": "additional",
                "Услуги банка": "base",
                "Фастфуд": "additional",
                "Финансы": "credit",
                "Фото и видео": "additional",
                "Цветы": "additional",
                "Цифровые товары": "additional",
                "Частные услуги": "additional",
                "Экосистема Сбер": "base",
                "Экосистема Яндекс": "base",
                "Эл. кошельки и переводы": "additional",
                "Электроника и техника": "base"
            }


            # 3. Обновление столбца 'sphere' на основе 'loyalty_cashback_category_nm'
            for category, sphere in category_to_sphere.items():
                cursor.execute('''
                    UPDATE all_user_transactions
                    SET sphere = %s
                    WHERE loyalty_cashback_category_nm = %s
                ''', (sphere, category))

            # Сохранение изменений и закрытие соединения
            self.connection.commit()
        except Exception as e:
            print(f"Ошибка при загрузке данных из CSV: {e}")
            self.connection.rollback()  # Откатываем изменения в случае ошибки  
    
    def get_all(self, table_name: str) -> List[dict]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(f"SELECT * FROM {table_name};")
            return cursor.fetchall()

    def get_by_id(self, table_name: str, id: str | int) -> List[dict]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(f"SELECT * FROM {table_name} WHERE id = %s;", (id,))
            return cursor.fetchall()

    def get_by_value(
        self,
        table_name: str,
        parameter: str,
        parameter_value: Any,
    ) -> List[dict]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            query = f"SELECT * FROM {table_name} WHERE {parameter} = %s;"
            cursor.execute(query, (parameter_value,))
            return cursor.fetchall()

    def insert(self, table_name: str, insert_dict: dict) -> List[dict]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            columns = ', '.join(insert_dict.keys())
            values = ', '.join(['%s'] * len(insert_dict))
            query = f"INSERT INTO {table_name} ({columns}) VALUES ({values}) RETURNING *;"
            cursor.execute(query, tuple(insert_dict.values()))
            self.connection.commit()
            return cursor.fetchall()

    def update(self, table_name: str, update_dict: dict, id: int) -> List[dict]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            set_clause = ', '.join([f"{key} = %s" for key in update_dict.keys()])
            query = f"UPDATE {table_name} SET {set_clause} WHERE id = %s RETURNING *;"
            cursor.execute(query, tuple(update_dict.values()) + (id,))
            self.connection.commit()
            return cursor.fetchall()

    def delete(self, table_name: str, id: int) -> List[dict]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            query = f"DELETE FROM {table_name} WHERE id = %s RETURNING *;"
            cursor.execute(query, (id,))
            self.connection.commit()
            return cursor.fetchall()

    def execute_with_request(self, request):
        with self.connection.cursor() as cursor:
                cursor.execute(request)
                self.connection.commit()
                if cursor.description:
                    rows = cursor.fetchall()
                    column_names = [desc[0] for desc in cursor.description]
                    return [dict(zip(column_names, row)) for row in rows]
                return None

    def delete_by_value(
        self,
        table_name: str,
        parameter: str,
        parameter_value: Any,
    ) -> List[dict]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            query = f"DELETE FROM {table_name} WHERE {parameter} = %s RETURNING *;"
            cursor.execute(query, (parameter_value,))
            self.connection.commit()
            return cursor.fetchall()
        
    def update_by_value(
        self,
        table_name: str,
        update_dict: dict,
        parameter: Any,
        value: Any
    ) -> List[dict]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            set_clause = ', '.join([f"{key} = %s" for key in update_dict.keys()])
            query = f"UPDATE {table_name} SET {set_clause} WHERE {parameter} = %s RETURNING *;"
            cursor.execute(query, tuple(update_dict.values()) + (value,))
            self.connection.commit()
    
    def truncate_table(self, table_name: str) -> None:
        with self.connection.cursor() as cursor:
            cursor.execute(f"TRUNCATE TABLE {table_name};")
            self.connection.commit()


    def add_large_csv_with_chunks(self, csv_file: str, table_name: str, chunksize: int = 10**5, encoding: str = 'windows-1251') -> None:
        import pandas as pd

        self.create_table_if_not_exists(table_name)
        data = self.execute_with_request(f'SELECT * FROM {table_name} LIMIT 12')
        if data != []:
            return
        try:
            for chunk in pd.read_csv(
                csv_file,
                encoding=encoding,
                sep=';',
                chunksize=chunksize,
                on_bad_lines='skip'
            ):
                # Переименуем безымянный столбец, если есть
                chunk.columns = [col if not col.startswith('Unnamed') else 'q' for col in chunk.columns]

                # Приводим даты к корректному виду
                if 'first_bank_product_date' in chunk.columns:
                    chunk['first_bank_product_date'] = chunk['first_bank_product_date'].replace(['0', ''], pd.NA)
                if 'first_session_dttm' in chunk.columns:
                    chunk['first_session_dttm'] = chunk['first_session_dttm'].replace(['0', ''], pd.NA)

                columns = list(chunk.columns)
                values = [tuple(row) for row in chunk.to_numpy()]

                insert_query = f"""
                    INSERT INTO {table_name} ({', '.join(columns)})
                    VALUES ({', '.join(['%s'] * len(columns))});
                """

                with self.connection.cursor() as cursor:
                    cursor.executemany(insert_query, values)
                    self.connection.commit()
                    print(f"Загружено {len(values)} строк в таблицу {table_name}.")

        except Exception as e:
            print(f"Ошибка при загрузке чанков из CSV: {e}")
            self.connection.rollback()

    def column_exists(self, table_name, column_name):
        cursor = self.connection.cursor()
        cursor.execute(f"""
            SELECT EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = %s AND column_name = %s
            )
        """, (table_name, column_name))
        return cursor.fetchone()[0]