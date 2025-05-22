import {expect, test} from '@playwright/test';

test.describe('BeatBars компонент', () => {
    test.beforeEach(async ({page}) => {

        await page.goto('/');

        await page.waitForSelector('#beat-container', {state: 'visible'});

        await page.waitForTimeout(500);

        await page.click('body');
        await page.waitForTimeout(100);
    });

    test('note size changing works', async ({page}) => {
        const getNoteSize = async () => page.evaluate(() =>
            (window as any).__METRONOME_MANAGER__.audioEngine.beatSequence[0].noteSettings.noteSize
        );

        const noteSizeDropdown = page.locator('select.note-size-dropdown').first();
        const noteBefore = await getNoteSize();

        expect(noteBefore).toEqual(4);

        await expect(noteSizeDropdown).toHaveValue('4n');

        await noteSizeDropdown.selectOption('8n');

        const noteAfter = await getNoteSize();

        await expect(noteSizeDropdown).toHaveValue('8n');

        const selectedOption = page.locator('select.note-size-dropdown option:checked').first();
        await expect(selectedOption).toContainText('1/8');

        expect(noteAfter).toEqual(8);
    });

    //TODO: добавить в проверку metronomeManager
    test('note amount changing works', async ({page}) => {
        const noteAmountDropdown = page.locator('select.note-amount-dropdown').first();
        await expect(noteAmountDropdown).toHaveValue('1');

        await noteAmountDropdown.selectOption('2');


        await expect(noteAmountDropdown).toHaveValue('2');
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