import {test, expect} from '@playwright/test';
import * as Tone from "tone";

test.describe('Tone.js AudioContext Functionality', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('http://localhost:3001');

        await page.waitForSelector('#root', {state: 'visible'});
    });

    test('should unlock Tone.js AudioContext after user interaction', async ({page}) => {
        // Проверяем начальное состояние AudioContext
        const initialState = await page.evaluate(() => {
            try {
                const audioContext = new AudioContext();
                return {
                    state: audioContext.state,
                    error: null
                };
            } catch (error) {
                return {
                    state: null,
                    initialized: false,
                    error: error
                };
            }
        });


        console.log('Initial AudioContext state:', initialState);

        await page.click('body');

        await expect.poll(async () => {
            return await page.evaluate(() => {
                try {
                    const audioContext = new AudioContext();
                    return audioContext.state;
                } catch (error) {
                    console.error('Error accessing Tone context:', error);
                    return 'error';
                }
            });
        }, {
            timeout: 5000,
            intervals: [100, 200, 500, 1000] // Интервалы между попытками
        }).toBe('running');
    });
});