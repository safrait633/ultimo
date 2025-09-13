# VITAL 2.0 - Prompt для Запуска Установки

## 🚀 Быстрый Старт

### Для Windows (PowerShell)
```powershell
# Откройте PowerShell от имени администратора и выполните:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Перейдите в папку с бэкапом и запустите:
.\install.ps1
```

### Для Linux/Mac (Bash)
```bash
# Сделайте скрипт исполняемым и запустите:
chmod +x install.sh
./install.sh
```

## 📋 Предварительные Требования

### Обязательно установите:
1. **Node.js 18+** - https://nodejs.org/
2. **PostgreSQL 14+** - https://www.postgresql.org/
3. **Git** (опционально) - https://git-scm.com/

### Проверьте установку:
```bash
node --version    # Должно показать v18.0.0 или выше
npm --version     # Должно показать версию npm
psql --version    # Должно показать версию PostgreSQL
```

## 🗄️ Настройка Базы Данных

### 1. Создайте базу данных PostgreSQL:
```sql
-- Подключитесь к PostgreSQL как суперпользователь
psql -U postgres

-- Создайте базу данных
CREATE DATABASE vital2_db;

-- Создайте пользователя
CREATE USER vital_user WITH PASSWORD 'your_secure_password';

-- Дайте права пользователю
GRANT ALL PRIVILEGES ON DATABASE vital2_db TO vital_user;

-- Выйдите из psql
\q
```

### 2. Настройте переменные окружения:
Отредактируйте файл `.env` в корне проекта:
```env
DATABASE_URL=postgresql://vital_user:your_secure_password@localhost:5432/vital2_db
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
NODE_ENV=development
PORT=8080
```

## 🔄 Восстановление из Бэкапа

### Автоматическая установка:
```powershell
# Windows PowerShell
.\install.ps1
```

### Ручная установка (если автоматическая не работает):
```bash
# 1. Извлеките архив приложения
unzip vital2.0-app.zip -d VITAL2.0-Restored
cd VITAL2.0-Restored

# 2. Установите зависимости
npm install

# 3. Настройте .env файл
cp .env.example .env
# Отредактируйте .env с вашими настройками

# 4. Восстановите базу данных (если есть дамп)
psql -U vital_user -d vital2_db -f ../vital2.0-database-YYYYMMDD_HHMMSS.sql

# 5. Запустите приложение
npm run dev
```

## 🌐 Запуск Приложения

### Режим разработки:
```bash
npm run dev
```
Приложение будет доступно по адресу: http://localhost:8080

### Продакшн режим:
```bash
# Сборка приложения
npm run build

# Запуск продакшн сервера
npm start
```

## 🔑 Тестовые Учетные Данные

После успешной установки используйте эти данные для входа:

**Врач:**
- Email: `dr.johnson@hospital.com`
- Пароль: `Password123!`

**Администратор:**
- Email: `admin@medicalsystem.com`
- Пароль: `AdminPass123!`

## 🛠️ Устранение Неполадок

### Проблема: "Execution Policy" в PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Проблема: Ошибка подключения к базе данных
1. Проверьте, что PostgreSQL запущен
2. Проверьте настройки в `.env` файле
3. Убедитесь, что база данных и пользователь созданы

### Проблема: Порт уже занят
```bash
# Найдите процесс, использующий порт 8080
netstat -ano | findstr :8080

# Завершите процесс или измените порт в .env файле
```

### Проблема: Ошибки TypeScript
```bash
# Очистите кэш и переустановите зависимости
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📚 Дополнительная Информация

- **Архитектура проекта**: См. `roadmap.md`
- **API документация**: Доступна в приложении после запуска
- **Техническая поддержка**: Проверьте логи в консоли браузера и терминале

## 🔄 Создание Нового Бэкапа

Для создания нового бэкапа текущего состояния:

```powershell
# Создание дампа базы данных
.\create_db_backup.ps1

# Создание архива приложения
Compress-Archive -Path client,server,shared,*.json,*.ts,*.md,*.js,.env.example,.gitignore -DestinationPath vital2.0-app-new.zip
```

---

**Важно**: Всегда создавайте резервные копии перед внесением изменений в продакшн среду!

**Версия**: VITAL 2.0  
**Дата создания бэкапа**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  
**Совместимость**: Windows 10+, Linux, macOS