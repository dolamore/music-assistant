import {buttons, Elements, elements, NOTE_AMOUNTS} from "../vars.js";
import * as Tone from "tone";
import {makeAutoObservable} from "mobx";

export class ButtonsManager {
    _metronomeManager;

    _increaseNoteButtonLimit = false;
    _decreaseNoteButtonLimit = false;
    _increaseBeatsButtonLimit = false;
    _decreaseBeatsButtonLimit = false;

    constructor(metronomeManager) {
        this._metronomeManager = metronomeManager;
        makeAutoObservable(this)
    }

    get increaseBeatsButtonLimit() {
        return this._increaseBeatsButtonLimit;
    }

    set increaseBeatsButtonLimit(value) {
        this._increaseBeatsButtonLimit = value;
    }

    get decreaseBeatsButtonLimit() {
        return this._decreaseBeatsButtonLimit;
    }

    set decreaseBeatsButtonLimit(value) {
        this._decreaseBeatsButtonLimit = value;
    }

    get increaseNoteButtonLimit() {
        return this._increaseNoteButtonLimit;
    }

    set increaseNoteButtonLimit(value) {
        this._increaseNoteButtonLimit = value;
    }

    get decreaseNoteButtonLimit() {
        return this._decreaseNoteButtonLimit;
    }

    set decreaseNoteButtonLimit(value) {
        this._decreaseNoteButtonLimit = value;
    }

    get metronomeManager() {
        return this._metronomeManager;
    }

    checkNotesLimit() {
        let minLimit = false;
        let maxLimit = false;

        this.metronomeManager.beatBarsManager.beats.forEach((beat, index) => {
            const currentValue = NOTE_AMOUNTS[beat.noteAmounts[index]];

            if (currentValue === 1) {
                minLimit = true;
            }

            if (currentValue === 64) {
                maxLimit = true;
            }
        });
        this._decreaseNoteButtonLimit = minLimit;
        this._increaseNoteButtonLimit = maxLimit;
    }

    // changeNoteSize(increase) {
    //     Elements.noteSizeDropdowns.forEach((dropdown) => {
    //         this.elementsManager.changeDropdownSize(dropdown, increase);
    //     });
    //     this.elementsManager.updateTimeSignature();
    //     if (this.metronomeManager.isPlaying) {
    //         this.metronomeManager.restartMetronomeAndPendulum();
    //     }
    //
    // }
    //
    // async toggleStartStopButton() {
    //     await Tone.start();
    //     if (this.metronomeManager.isPlaying) {
    //         this.metronomeManager.stopMetronome();
    //     } else {
    //         this.metronomeManager.startMetronome();
    //     }
    // }
    //
    // handleSaveSettings() {
    //     const soundManager = this.metronomeManager.soundManager;
    //     soundManager.clearSelectedSounds();
    //     soundManager.clearSoundSettings();
    //     // Извлекаем и обновляем настройки для каждого бита
    //     Elements.soundSettingsRows.forEach((row) => {
    //         soundManager.addSelectedSound(parseInt(row.querySelector('select').value, 10));
    //         soundManager.addSoundSetting(soundManager.getSoundSettingsData(row));
    //     });
    //
    //     // Обновляем данные в DOM
    //     Elements.beats.forEach((beat, index) => {
    //         beat.dataset.sound = soundManager.selectedSounds()[index];  // Обновляем звук для каждого бита
    //     });
    //
    //     // Обновляем метроном, не останавливая его
    //     if (this.metronomeManager.isPlaying) {
    //         this.metronomeManager.updateMetronomeSequence();
    //     }
    //
    //     // Скрываем панель настроек
    //     elements.settingsPanel.classList.toggle('hidden');
    // }
}