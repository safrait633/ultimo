#!/bin/bash
set -e

# Создаем базу данных и пользователя (если они еще не существуют)
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Создаем расширения
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    -- Выводим информацию о версии
    SELECT version();
    
    -- Создаем схему по умолчанию
    CREATE SCHEMA IF NOT EXISTS public;
    
    -- Предоставляем права
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
    GRANT ALL ON SCHEMA public TO $POSTGRES_USER;
    
    \echo 'База данных VITAL 2.0 успешно инициализирована!'
EOSQL