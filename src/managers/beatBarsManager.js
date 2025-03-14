import {defaultSoundSettings, Elements, elements} from "../vars.js";

export class BeatBarsManager {

    constructor(metronomeManager) {
        this.metronomeManager = metronomeManager;
    }

    decreaseBeat() {
        // Удаляем последний элемент из beat-container
        this.deleteLastBeatRow();

        this.metronomeManager.elementsManager.deleteLastSoundSettingsRow();

        // Обновляем массивы
        this.metronomeManager.soundManager.popSelectedSound();
        this.metronomeManager.soundManager.popSoundSetting();

        // Пересчитываем количество битов
        elements.beatsCounter.textContent = Elements.beatRows.length;

        // Используем setTimeout, чтобы подождать завершения обновления DOM
        setTimeout(() => {
            this.metronomeManager.elementsManager.updateTimeSignature();
        }, 0);

        // Если метроном запущен, обновляем его
        if (this.metronomeManager.isPlaying) {
            this.metronomeManager.updateMetronomeSequence();
        }

        this.metronomeManager.elementsManager.updateTimeSignature();
    }

    deleteLastBeatRow() {
        const lastBeatRow = elements.beatContainer.lastElementChild;
        if (lastBeatRow) {
            lastBeatRow.remove();
        }
    }

    increaseBeat() {
        const newBeatIndex = Elements.beatRows.length;

        // Создаём новый элемент и добавляем его на страницу
        this.metronomeManager.elementsManager.createBeatElement(newBeatIndex);

        // Обновляем массивы
        this.metronomeManager.soundManager.addSelectedSound(1); // Звук по умолчанию
        this.metronomeManager.soundManager.addSoundSetting(defaultSoundSettings);

        // Обновляем количество битов
        elements.beatsCounter.textContent = newBeatIndex + 1;

        // Обновляем последовательность метронома без перезапуска
        if (this.metronomeManager.isPlaying) {
            this.metronomeManager.updateMetronomeSequence();
        }

        // Обновляем тактовую сетку (если нужно)
        this.metronomeManager.elementsManager.updateTimeSignature();
    }
}