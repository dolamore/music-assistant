# Используем базовый образ от Microsoft с предустановленным Playwright и браузерами
FROM mcr.microsoft.com/playwright:v1.52.0-focal

# Задаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем весь код проекта
COPY . .

# Необязательно: Устанавливаем браузеры для Playwright (уже есть в базовом образе)
# RUN npx playwright install

# Команда для запуска сервера и тестов
CMD ["sh", "-c", "npm run dev & wait-on http://localhost:3001 && npm run test"]