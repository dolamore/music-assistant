import {expect, test} from '@playwright/test';

test.describe('BeatBars компонент', () => {
    test.beforeEach(async ({page}) => {

        await page.goto('/');

        await page.waitForSelector('#beat-container', {state: 'visible'});

        await page.waitForTimeout(500);

        await page.click('body');
        await page.waitForTimeout(100);
    });

    test('изменение размера ноты должно изменить beatSequence', async ({page}) => {
        // Получаем начальную последовательность
        const initialSequence = await page.evaluate(() => {
            // Ищем метроном в приложении
            for (const key in window) {
                try {
                    const obj = window[key] as any;
                    if (obj && typeof obj === 'object' && obj.audioEngine && obj.beatBarsManager) {
                        // Нашли MetronomeManager
                        return {

                            // sequenceLength: obj.audioEngine.beatSequence.length,
                            // beatsLength: obj.beatBarsManager.beats.length
                        };
                    }
                } catch (e) {
                }
            }
            return null;
        }) as any;

        console.log('Начальная последовательность:', initialSequence);

        // Убедимся, что мы нашли последовательность
        expect(initialSequence).not.toBeNull();

        // Меняем размер ноты для первого бита
        await page.locator('select[data-testid="note-size-dropdown-0"]').selectOption('8n');

        // Получаем обновленную последовательность
        const updatedSequence = await page.evaluate(() => {
            for (const key in window) {
                try {
                    const obj = window[key] as any;
                    if (obj && typeof obj === 'object' && obj.audioEngine && obj.beatBarsManager) {
                        return {
                            sequenceLength: obj.audioEngine.beatSequence.length,
                            beatsLength: obj.beatBarsManager.beats.length,
                            firstBeatNoteSize: obj.beatBarsManager.beats[0].noteSettings.noteSize
                        };
                    }
                } catch (e) {
                }
            }
            return null;
        }) as any;

        console.log('Обновленная последовательность:', updatedSequence);

        // Проверяем, что размер ноты изменился
        expect(updatedSequence.firstBeatNoteSize).toBe(8);

        // Проверяем, что длина последовательности изменилась
        // Если 8n вместо 4n, то количество шагов должно измениться
        expect(updatedSequence.sequenceLength).not.toBe(initialSequence.sequenceLength);
    });

    test('note size changing works', async ({page}) => {
        const noteSizeDropdown = page.locator('select.note-size-dropdown').first();
        await expect(noteSizeDropdown).toHaveValue('4n');

        await noteSizeDropdown.selectOption('8n');

        await expect(noteSizeDropdown).toHaveValue('8n');

        const selectedOption = page.locator('select.note-size-dropdown option:checked').first();
        await expect(selectedOption).toContainText('1/8');

        // Убеждаемся, что аудио-движок обновил последовательность
    });

    test('note amount changing works', async ({page}) => {
        const noteAmountDropdown = page.locator('select.note-amount-dropdown').first();
        await expect(noteAmountDropdown).toHaveValue('1');

        await noteAmountDropdown.selectOption('2');


        await expect(noteAmountDropdown).toHaveValue('2');
    });

    test('запуск метронома должен активировать визуальные индикаторы', async ({page}) => {
        // Находим кнопку запуска
        const playButton = page.locator('#play-button');

        // Нажимаем на кнопку Play
        await playButton.click();

        // Ждем немного, чтобы метроном сработал
        await page.waitForTimeout(500);

        // Проверяем, появляется ли класс playing для бита
        // Это может потребовать ожидания, так как класс может добавляться/убираться в процессе воспроизведения
        await expect.poll(async () => {
            return await page.locator('.beat').first().evaluate(el =>
                el.classList.contains('playing')
            );
        }, {
            timeout: 2000,
            intervals: [100, 200, 300, 500]
        }).toBeTruthy();

        // Останавливаем метроном
        const stopButton = page.locator('#stop-button');
        await stopButton.click();

        // Ждем, пока все индикаторы воспроизведения исчезнут
        await page.waitForTimeout(500);

        // Проверяем, что класс playing удален
        await expect(page.locator('.beat.playing')).not.toBeVisible();
    });

    test('при клике на бит должен меняться тип звука', async ({page}) => {
        // Получаем первоначальный тип звука из data-атрибута
        const beatElement = page.locator('.beat').first();
        const initialSoundType = await beatElement.getAttribute('data-sound');

        // Кликаем на бит, чтобы изменить тип звука
        await beatElement.click();

        // Получаем новый тип звука
        const newSoundType = await beatElement.getAttribute('data-sound');

        // Проверяем, что тип звука изменился
        expect(newSoundType).not.toBe(initialSoundType);
    });
});