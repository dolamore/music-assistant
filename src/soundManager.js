import {initialNumberOfBeats} from "./vars.js";

export class SoundManager {
    constructor() {
        this.selectedSounds = [];
        this.soundSettings = [];
    }

    generateSelectedSounds() {
        for (let i = 0; i < initialNumberOfBeats; i++) {
            this.selectedSounds.push(1);
        }
    }

    getSoundSettings() {
        return this.soundSettings;
    }

    clearSoundSettings() {
        this.soundSettings = [];
    }

    addSoundSetting(setting) {
        this.soundSettings.push(setting);
    }

    getSelectedSounds() {
        return this.selectedSounds;
    }

    clearSelectedSounds() {
        this.selectedSounds = [];
    }

    addSelectedSound(sound) {
        this.selectedSounds.push(sound);
    }

    popSelectedSound() {
        this.selectedSounds.pop();
    }

    renderSoundElements() {
        this.generateSelectedSounds();
    }
}