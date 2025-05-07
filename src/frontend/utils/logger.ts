// src/utils/errorLogger.ts
import { createLogger, format, transports } from 'winston';
import TransportStream from 'winston-transport';
import axios from 'axios';

// Правильное объявление кастомного транспорта
class ServerTransport extends TransportStream {
    constructor(options: TransportStream.TransportStreamOptions = {}) {
        super(options);
        this.name = 'ServerTransport';
        this.level = options.level || 'error';
    }

    log(info: any, callback: () => void) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        const { timestamp, level, message, stack, ...meta } = info;

        // Собираем данные для отправки
        const logData = {
            timestamp: timestamp || new Date().toISOString(),
            level,
            message,
            stack,
            meta,
            // Дополнительная информация об окружении
            environment: {
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
                url: typeof window !== 'undefined' ? window.location.href : '',
                resolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '',
            }
        };

        // Отправляем на сервер
        axios.post('/api/logs', logData)
            .catch(err => {
                // Печатаем в консоль, если отправка не удалась
                console.error('Ошибка отправки лога на сервер:', err.message);
            })
            .finally(() => {
                callback();
            });
    }
}

// Создаем логгер
const errorLogger = createLogger({
    level: 'error',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),
    transports: [
        // Консоль для отладки
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(({ level, message, timestamp, stack, ...meta }) => {
                    const metaStr = Object.keys(meta).length
                        ? `\nМетаданные: ${JSON.stringify(meta, null, 2)}`
                        : '';
                    return `${timestamp} ${level}: ${message}${stack ? `\n${stack}` : ''}${metaStr}`;
                })
            )
        }),

        // Отправка на сервер
        new ServerTransport()
    ]
});

// Остальной код остается тем же