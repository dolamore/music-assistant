import axios from 'axios';

// Буфер для временного хранения логов перед отправкой
let logBuffer: Array<{
    level: string;
    message: string;
    meta?: object;
    timestamp: string;
}> = [];

// URL API для отправки логов
const LOG_API_URL = '/api/logs'; // Замените на ваш реальный URL

// Флаг отправки (чтобы избежать параллельных отправок)
let isSending = false;

// Максимальное количество логов в буфере перед принудительной отправкой
const MAX_BUFFER_SIZE = 10;

// Тайм-аут для периодической отправки (в мс)
const FLUSH_INTERVAL = 10000; // 10 секунд

// Инициализация периодической отправки
let flushInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Инициализация транспорта для отправки логов
 */
export function initRemoteLogTransport() {
    // Восстанавливаем сохраненные логи из localStorage, если есть
    try {
        const savedLogs = localStorage.getItem('pending_logs');
        if (savedLogs) {
            logBuffer = JSON.parse(savedLogs);
            console.info(`Восстановлено ${logBuffer.length} логов из хранилища`);
        }
    } catch (e) {
        console.error('Ошибка при восстановлении логов из localStorage:', e);
    }

    // Устанавливаем интервал для периодической отправки
    flushInterval = setInterval(flushLogs, FLUSH_INTERVAL);

    // Отправляем логи при закрытии страницы
    window.addEventListener('beforeunload', () => {
        // Сохраняем неотправленные логи в localStorage
        localStorage.setItem('pending_logs', JSON.stringify(logBuffer));

        // Попытка отправить логи синхронно перед закрытием
        if (logBuffer.length > 0 && navigator.sendBeacon) {
            navigator.sendBeacon(LOG_API_URL, JSON.stringify(logBuffer));
        }
    });

    // Отправляем логи, когда возвращается онлайн
    window.addEventListener('online', flushLogs);
}

/**
 * Отправка всех накопленных логов на сервер
 */
export async function flushLogs(): Promise<void> {
    // Если буфер пуст или отправка уже идет, выходим
    if (logBuffer.length === 0 || isSending || !navigator.onLine) {
        return;
    }

    // Ставим флаг отправки
    isSending = true;

    // Копируем буфер и очищаем его
    const logsToSend = [...logBuffer];
    logBuffer = [];

    try {
        // Отправляем логи на сервер
        await axios.post(LOG_API_URL, logsToSend, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Очищаем сохраненные логи в localStorage после успешной отправки
        localStorage.removeItem('pending_logs');

        console.info(`Успешно отправлено ${logsToSend.length} логов на сервер`);
    } catch (error) {
        console.error('Ошибка при отправке логов на сервер:', error);

        // Возвращаем логи обратно в буфер в случае ошибки
        logBuffer = [...logsToSend, ...logBuffer];

        // Сохраняем неотправленные логи в localStorage
        localStorage.setItem('pending_logs', JSON.stringify(logBuffer));
    } finally {
        // Снимаем флаг отправки
        isSending = false;
    }
}