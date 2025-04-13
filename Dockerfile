FROM python:3.12-alpine3.21

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы проекта в контейнер
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Команда для запуска вашего приложения
CMD ["python", "main.py"]
