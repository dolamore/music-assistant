import {DEFAULT_SOUNDS} from "../vars/sounds/DEFAULT_SOUNDS.ts";
import document from "react";
import {makeAutoObservable} from "mobx";

export class SoundManager {
    constructor(metronomeManager) {
        this._metronomeManager = metronomeManager;
        makeAutoObservable(this);
    }

    // changeBeatSound(beatElement) {
    //     const beatIndex = parseInt(beatElement.dataset.beat, 10);
    //     const currentSound = parseInt(beatElement.dataset.sound, 10);
    //
    //     // Cycle through sounds (1 - Sound 1, ..., 4 - Sound 4, 0 - No Sound)
    //     const nextSound = (currentSound % DEFAULT_SOUNDS.length) + 1;
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