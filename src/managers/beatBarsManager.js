import {Elements, elements, initialNumberOfBeats} from "../vars.js";
import * as lastBeatRow from "mobx";

export class BeatBarsManager {
    _numberOfBeats = initialNumberOfBeats;

    constructor(metronomeManager) {
        this.metronomeManager = metronomeManager;
    }


    get numberOfBeats() {
        return this._numberOfBeats;
    }

    set numberOfBeats(value) {
        this._numberOfBeats = value;
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
        this._numberOfBeats++;
        this.metronomeManager.soundManager.addNewSoundSettingRow();

        // Обновляем последовательность метронома без перезапуска
        if (this.metronomeManager.isPlaying) {
            this.metronomeManager.updateMetronomeSequence();
        }

        // Обновляем тактовую сетку (если нужно)
        this.metronomeManager.elementsManager.updateTimeSignature();
    }
}