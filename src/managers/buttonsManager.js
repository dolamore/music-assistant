import {buttons, Elements, elements, MAX_BEATS_AMOUNT, MIN_BEATS_AMOUNT, NOTE_AMOUNTS} from "../vars.js";
import * as Tone from "tone";
import {makeAutoObservable} from "mobx";

export class ButtonsManager {
    _metronomeManager;

    _increaseNoteButtonLimit = false;
    _decreaseNoteButtonLimit = false;

    constructor(metronomeManager) {
        this._metronomeManager = metronomeManager;
        this.initialize();
        makeAutoObservable(this);
    }

    initialize() {
        this.metronomeManager.beatBarsManager.generateBeats();
        this.checkLimits();
    }

    async checkLimits() {
        this.checkNotesLimit();
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
        this._decreaseNoteButtonLimit =
            this.metronomeManager.beatBarsManager.beats.some(beat => beat.noteSettings.noteSize === 1);
        this._increaseNoteButtonLimit =
            this.metronomeManager.beatBarsManager.beats.some(beat => beat.noteSettings.noteSize === 64);
    }
    //
    // async toggleStartStopButton() {
    //     await Tone.start();
    //     if (this.metronomeManager.isPlaying) {
    //         this.metronomeManager.stopMetronome();
    //     } else {
    //         this.metronomeManager.startMetronome();
    //     }
    // }
}