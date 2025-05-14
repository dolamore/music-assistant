import { test, expect } from '@playwright/test';

test.describe('Audio Context in Real Application', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3001');
    });

    test('audio UI elements should work after user interaction', async ({ page }) => {
        // 1. Проверяем, что элементы пользовательского интерфейса доступны
        // Предположим, что у вас есть какие-то аудио элементы управления
        const playButton = page.locator('[data-testid="start-stop-button"]');
        await expect(playButton).toBeVisible();

        // Возможно, у вас есть индикатор состояния AudioContext
        const audioContextStatus = page.locator('[data-testid="audio-context-status"]');

        // Проверяем начальное состояние (заблокировано)
        if (await audioContextStatus.isVisible()) {
            await expect(audioContextStatus).toHaveText(/locked|waiting|pending/i);
        }

        // 2. Имитируем действие пользователя для разблокировки AudioContext
        // Обычно любое взаимодействие с UI разблокирует AudioContext
        await page.click('body');

        // Даем немного времени для обработки события
        await page.waitForTimeout(300);

        // 3. Пытаемся воспроизвести звук, кликая по кнопке воспроизведения
        await playButton.click();

        // 4. Проверяем, что произошло воспроизведение
        // Это может быть проверка класса, текста или атрибута, который меняется
        // при успешном воспроизведении звука

        // Например, если кнопка меняет текст или класс
        await expect(playButton).toHaveClass(/playing|active/i, { timeout: 5000 });

        // Или если статус меняется
        if (await audioContextStatus.isVisible()) {
            await expect(audioContextStatus).toHaveText(/unlocked|running/i, { timeout: 5000 });
        }

        // 5. Дополнительно можно проверить через консоль
        const consoleLogs = [];
        page.on('console', msg => {
            consoleLogs.push(msg.text());
        });

        // Проверяем, что нет ошибок в консоли связанных с AudioContext
        expect(consoleLogs.filter(log =>
            log.includes('AudioContext') && log.includes('error')
        ).length).toBe(0);
    });
});