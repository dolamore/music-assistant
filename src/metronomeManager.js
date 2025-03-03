import {initialNumberOfBeats} from "./vars.js";

export class MetronomeManager {
    constructor() {
        this.selectedSounds = [];
    }

    generateSelectedSounds() {
        for (let i = 0; i < initialNumberOfBeats; i++) {
            this.selectedSounds.push(1);
        }
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
}

export function renderMetronomeElements(metronomeManager) {
    metronomeManager.generateSelectedSounds();
}

