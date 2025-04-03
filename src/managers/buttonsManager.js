import {buttons, Elements, elements, MAX_BEATS_AMOUNT, MIN_BEATS_AMOUNT, NOTE_AMOUNTS} from "../vars.js";
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
        makeAutoObservable(this);
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

    checkBeatsLimits() {
        this._decreaseBeatsButtonLimit = this.metronomeManager.beatBarsManager.beats.length <= MIN_BEATS_AMOUNT;
        this._increaseBeatsButtonLimit = this.metronomeManager.beatBarsManager.beats.length >= MAX_BEATS_AMOUNT;
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