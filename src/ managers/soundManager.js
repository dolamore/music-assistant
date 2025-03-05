import {defaultSoundSettings, initialNumberOfBeats, sounds} from "../vars.js";

export class SoundManager {
    constructor(metronomeManager) {
        this.selectedSounds = [];
        this.soundSettings = [];
        this.metronomeManager = metronomeManager;
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

    popSoundSetting() {
        this.soundSettings.pop();
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
        this.getSelectedSounds()[beatIndex] = nextSound;

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