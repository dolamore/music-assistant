import {buttons, Elements, elements} from "../vars.js";
import * as Tone from "tone";
import {makeAutoObservable} from "mobx";

export class ButtonsManager {
    _metronomeManager;
    _beatsBarsManager;
    _elementsManager;

    constructor(metronomeManager) {
        this._metronomeManager = metronomeManager;
        this._beatsBarsManager = metronomeManager.beatBarsManager;
        this._elementsManager = metronomeManager.elementsManager;
        makeAutoObservable(this)
    }

    get metronomeManager() {
        return this._metronomeManager;
    }

    get beatsBarsManager() {
        return this._beatsBarsManager;
    }

    get elementsManager() {
        return this._elementsManager;
    }

    changeNoteSize(increase) {
        Elements.noteSizeDropdowns.forEach((dropdown) => {
            this.elementsManager.changeDropdownSize(dropdown, increase);
        });
        this.elementsManager.updateTimeSignature();
        if (this.metronomeManager.isPlaying) {
            this.metronomeManager.restartMetronomeAndPendulum();
        }

    }

    async toggleStartStopButton() {
        await Tone.start();
        if (this.metronomeManager.isPlaying) {
            this.metronomeManager.stopMetronome();
        } else {
            this.metronomeManager.startMetronome();
        }
    }

    handleSaveSettings() {
        const soundManager = this.metronomeManager.soundManager;
        soundManager.clearSelectedSounds();
        soundManager.clearSoundSettings();
        // Извлекаем и обновляем настройки для каждого бита
        Elements.soundSettingsRows.forEach((row) => {
            soundManager.addSelectedSound(parseInt(row.querySelector('select').value, 10));
            soundManager.addSoundSetting(soundManager.getSoundSettingsData(row));
        });

        // Обновляем данные в DOM
        Elements.beats.forEach((beat, index) => {
            beat.dataset.sound = soundManager.selectedSounds()[index];  // Обновляем звук для каждого бита
        });

        // Обновляем метроном, не останавливая его
        if (this.metronomeManager.isPlaying) {
            this.metronomeManager.updateMetronomeSequence();
        }

        // Скрываем панель настроек
        elements.settingsPanel.classList.toggle('hidden');
    }

    renderButtons() {
        buttons.decreaseBeatsButton.addEventListener('click', () => this.beatsBarsManager.decreaseBeats());

        buttons.increaseBeatsButton.addEventListener('click', () => this.beatsBarsManager.increaseBeats());

        buttons.increaseNotesButton.addEventListener('click', () => this.changeNoteSize(true));

        buttons.decreaseNotesButton.addEventListener('click', () => this.changeNoteSize(false));

        buttons.startStopButton.addEventListener('click', this.toggleStartStopButton.bind(this));

        buttons.togglePendulumBar.addEventListener('change', (e) => this.elementsManager.togglePendulumBar(e));

        buttons.toggleFlashingBar.addEventListener('change', (e) => this.elementsManager.toggleFlashingBar(e));

        buttons.toggleBeatBars.addEventListener('change', (e) => this.elementsManager.toggleBeatBars(e));

        buttons.settingsButton.addEventListener('click', () => elements.settingsPanel.classList.toggle('hidden'));

        buttons.saveSettingsButton.addEventListener('click', () => this.handleSaveSettings());
    }
}