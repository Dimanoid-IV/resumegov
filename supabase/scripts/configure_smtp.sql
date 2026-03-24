-- Настройка SMTP для Supabase
-- Выполни этот SQL в Supabase Dashboard → SQL Editor

-- Замени значения на свои SMTP данные
DO $$
BEGIN
  -- Обновляем SMTP настройки
  PERFORM set_config('smtp.host', 'smtp.resumegov.com', false);
  PERFORM set_config('smtp.port', '587', false);
  PERFORM set_config('smtp.username', 'auth@resumegov.com', false);
  PERFORM set_config('smtp.password', 'ТВОЙ_ПАРОЛЬ_ОТ_ПОЧТЫ', false);
  PERFORM set_config('smtp.sender_email', 'auth@resumegov.com', false);
  PERFORM set_config('smtp.sender_name', 'ResumeGov', false);
END $$;

-- Проверка настроек
SELECT 
  current_setting('smtp.host') as smtp_host,
  current_setting('smtp.port') as smtp_port,
  current_setting('smtp.sender_email') as sender_email,
  current_setting('smtp.sender_name') as sender_name;
