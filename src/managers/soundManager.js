import {defaultSoundSettings, initialNumberOfBeats, sounds} from "../vars.js";
import document from "react";

export class SoundManager {
    _selectedSounds = [];
    _soundSettings = [];
    _metronomeManager = null;

    constructor(metronomeManager) {
        this._selectedSounds = [];
        this._soundSettings = [];
        this._metronomeManager = metronomeManager;
    }

    get metronomeManager() {
        return this._metronomeManager;
    }

    set metronomeManager(value) {
        this._metronomeManager = value;
    }

    get selectedSounds() {
        return this._selectedSounds;
    }

    set selectedSounds(value) {
        this._selectedSounds = value;
    }

    addSelectedSound(sound) {
        this._selectedSounds.push(sound);
    }

    popSelectedSound() {
        this._selectedSounds.pop();
    }

    generateSelectedSounds() {
        for (let i = 0; i < initialNumberOfBeats; i++) {
            this._selectedSounds.push(1);
        }
    }

    clearSelectedSounds() {
        this._selectedSounds = [];
    }

    get soundSettings() {
        return this._soundSettings;
    }

    set soundSettings(value) {
        this._soundSettings = value;
    }

    addSoundSetting(setting) {
        this._soundSettings.push(setting);
    }

    popSoundSetting() {
        this._soundSettings.pop();
    }

    clearSoundSettings() {
        this.soundSettings = [];
    }

    getSoundSettingsData(row) {
        return Object.fromEntries(Object.keys(defaultSoundSettings).map(key => {
            const input = row.querySelector(`input[placeholder="${key.charAt(0).toUpperCase() + key.slice(1)}"]`);
            return [key, input ? parseFloat(input.value) : defaultSoundSettings[key]];
        }));
    }

    changeBeatSound(beatElement) {
        const beatIndex = parseInt(beatElement.dataset.beat, 10);
        const currentSound = parseInt(beatElement.dataset.sound, 10);

        // Cycle through sounds (1 - Sound 1, ..., 4 - Sound 4, 0 - No Sound)
        const nextSound = (currentSound % sounds.length) + 1;
        beatElement.dataset.sound = nextSound;

        // Update selectedSounds array
        this.selectedSounds()[beatIndex] = nextSound;

        // Update select in sound settings
        const soundSelect = document.getElementById(`sound-${beatIndex}`);
        if (soundSelect) {
            soundSelect.value = nextSound;
        }

        // Update metronome sequence without restarting
        if (this.metronomeManager.isPlaying) {
            this.metronomeManager.updateMetronomeSequence();
        }
    }

    renderSoundElements() {
        this.generateSelectedSounds();
    }
}