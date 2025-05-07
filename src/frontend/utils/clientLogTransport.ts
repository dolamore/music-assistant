import { createLogger, format, transports } from 'winston';

// Простой логгер без сложной конфигурации
export const logger = createLogger({
    level: 'debug', // Всегда логируем все уровни для простоты
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(({ level, message, timestamp, stack, ...meta }) => {
                    const metaStr = Object.keys(meta).length
                        ? `\nMetadata: ${JSON.stringify(meta, null, 2)}`
                        : '';
                    return `${timestamp} ${level}: ${message}${stack ? `\n${stack}` : ''}${metaStr}`;
                })
            )
        })
    ]
});

// Простой интерфейс для использования в компонентах
export const appLogger = {
    error: (message: string, meta?: object) => {
        logger.error(message, meta);
        storeErrorForSync(message, meta);
    },
    warn: (message: string, meta?: object) => {
        logger.warn(message, meta);
    },
    info: (message: string, meta?: object) => {
        logger.info(message, meta);
    },
    debug: (message: string, meta?: object) => {
        logger.debug(message, meta);
    }
};

// Сохраняем ошибки в localStorage
function storeErrorForSync(message: string, meta?: object) {
    try {
        const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
        errors.push({
            timestamp: new Date().toISOString(),
            message,
            meta,
            userAgent: navigator.userAgent,
            url: window.location.href
        });

        // Храним только последние 50 ошибок
        const trimmedErrors = errors.slice(-50);
        localStorage.setItem('app_errors', JSON.stringify(trimmedErrors));
    } catch (e) {
        console.error('Не удалось сохранить ошибку в localStorage:', e);
    }
}

// Функция для выгрузки логов ошибок
export function downloadErrorLogs() {
    try {
        const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
        if (errors.length === 0) {
            console.info('Нет ошибок для выгрузки');
            return;
        }

        const blob = new Blob([JSON.stringify(errors, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `app-errors-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error('Не удалось выгрузить логи ошибок:', e);
    }
}

// Получить логи из хранилища
export function getStoredErrorLogs() {
    try {
        return JSON.parse(localStorage.getItem('app_errors') || '[]');
    } catch (e) {
        console.error('Не удалось получить логи ошибок:', e);
        return [];
    }
}

// Очистить логи
export function clearStoredErrorLogs() {
    localStorage.setItem('app_errors', '[]');
}