import {SOUNDS} from "../vars/SOUNDS.ts";
import document from "react";
import {makeAutoObservable} from "mobx";

export class SoundManager {
    constructor(metronomeManager) {
        this._metronomeManager = metronomeManager;
        makeAutoObservable(this);
    }

    // getSoundSettingsData(row) {
    //     return Object.fromEntries(Object.keys(DEFAULT_SOUND_SETTINGS).map(key => {
    //         const input = row.querySelector(`input[placeholder="${key.charAt(0).toUpperCase() + key.slice(1)}"]`);
    //         return [key, input ? parseFloat(input.value) : DEFAULT_SOUND_SETTINGS[key]];
    //     }));
    // }

    // changeBeatSound(beatElement) {
    //     const beatIndex = parseInt(beatElement.dataset.beat, 10);
    //     const currentSound = parseInt(beatElement.dataset.sound, 10);
    //
    //     // Cycle through sounds (1 - Sound 1, ..., 4 - Sound 4, 0 - No Sound)
    //     const nextSound = (currentSound % SOUNDS.length) + 1;
    //     beatElement.dataset.sound = nextSound;
    //
    //     // Update selectedSounds array
    //     this.selectedSounds()[beatIndex] = nextSound;
    //
    //     // Update select in sound settings
    //     const soundSelect = document.getElementById(`sound-${beatIndex}`);
    //     if (soundSelect) {
    //         soundSelect.value = nextSound;
    //     }
    //
    //     // Update metronome sequence without restarting
    //     if (this.metronomeManager.isPlaying) {
    //         this.metronomeManager.updateMetronomeSequence();
    //     }
    // }
}