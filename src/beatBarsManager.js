import {defaultSoundSettings, elements} from "./vars.js";

export class BeatBarsManager {

    constructor(metronomeManager) {
        this.metronomeManager = metronomeManager;
    }

    decreaseBeat() {
        const beatRows = document.querySelectorAll('.sound-row');

        // Удаляем последнюю строку из DOM
        beatRows[beatRows.length - 1].remove();

        // Удаляем последний элемент из beat-container
        const beatContainer = document.querySelector('.beat-container');
        const lastBeatWrapper = beatContainer.lastElementChild;
        if (lastBeatWrapper) {
            lastBeatWrapper.remove();
        }

        // Обновляем массивы
        metronomeManager.soundManager.popSelectedSound();
        soundSettings.pop();

        // Пересчитываем количество битов
        elements.beatsCounter.textContent = document.querySelectorAll('.beat-wrapper').length;

        // Используем setTimeout, чтобы подождать завершения обновления DOM
        setTimeout(() => {
            updateTimeSignature();
        }, 0);

        // Если метроном запущен, обновляем его
        if (isPlaying) {
            updateMetronomeSequence();
        }

        updateTimeSignature();
    }

    increaseBeat() {
        const beatRows = document.querySelectorAll('.sound-row');

        const newBeatIndex = beatRows.length;

        // Создаём новый элемент и добавляем его на страницу
        createBeatElement(newBeatIndex);

        // Обновляем массивы
        metronomeManager.soundManager.addSelectedSound(1); // Звук по умолчанию
        soundSettings.push(defaultSoundSettings);

        // Обновляем количество битов
        elements.beatsCounter.textContent = newBeatIndex + 1;

        // Обновляем последовательность метронома без перезапуска
        if (isPlaying) {
            updateMetronomeSequence();
        }

        // Обновляем тактовую сетку (если нужно)
        updateTimeSignature();
    }

    renderBeatBars() {

    }
}