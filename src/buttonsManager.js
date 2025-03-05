import {buttons, Elements, elements} from "./vars.js";
import * as Tone from 'https://cdn.skypack.dev/tone';

export class ButtonsManager {
    constructor(metronomeManager) {
        this.metronomeManager = metronomeManager;
        this.beatsBarsManager = metronomeManager.getBeatBarsManager();
        this.elementsManager = metronomeManager.getElementsManager();
    }

    changeNoteSize(increase) {
        console.log("entered changeNoteSize");
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
            beat.dataset.sound = soundManager.getSelectedSounds()[index];  // Обновляем звук для каждого бита
        });

        // Обновляем метроном, не останавливая его
        if (this.metronomeManager.isPlaying) {
            this.metronomeManager.updateMetronomeSequence();
        }

        // Скрываем панель настроек
        elements.settingsPanel.classList.add('hidden');
    }

    renderButtons() {
        buttons.decreaseBeatsButton.addEventListener('click', () => this.beatsBarsManager.decreaseBeat());

        buttons.increaseBeatsButton.addEventListener('click', () => this.beatsBarsManager.increaseBeat());

        buttons.increaseNotesButton.addEventListener('click', () => this.changeNoteSize(true));

        buttons.decreaseNotesButton.addEventListener('click', () => this.changeNoteSize(false));

        buttons.startStopButton.addEventListener('click', this.toggleStartStopButton.bind(this));

        buttons.togglePendulumBar.addEventListener('change', (e) => this.elementsManager.togglePendulumBar(e));

        buttons.toggleFlashingBar.addEventListener('change', (e) => this.elementsManager.toggleFlashingBar(e));

        buttons.toggleBeatBars.addEventListener('change', (e) => this.elementsManager.toggleBeatBars(e));

        buttons.settingsButton.addEventListener('click', () => this.elementsManager.toggleSettingsPanel());

        buttons.saveSettingsButton.addEventListener('click', () => this.handleSaveSettings());


        buttons.increaseBPMButton.addEventListener('click', () => this.metronomeManager.handleBpmChange(1));

        buttons.increaseFiveBPMButton.addEventListener('click', () => this.metronomeManager.handleBpmChange(5));

        buttons.decreaseBPMButton.addEventListener('click', () => this.metronomeManager.handleBpmChange(-1));

        buttons.decreaseFiveBPMButton.addEventListener('click', () => this.metronomeManager.handleBpmChange(-5));
    }
}