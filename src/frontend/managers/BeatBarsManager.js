import {
    DEFAULT_IS_TRIPLET,
    DEFAULT_NOTE_AMOUNT,
    DEFAULT_NOTE_SIZE,
    DEFAULT_SOUND_INDEX,
    DEFAULT_SOUND_SETTINGS,
    INITIAL_NUMBER_OF_BEATS,
    NOTE_AMOUNTS,
    NOTES,
} from "../vars/vars.js";
import{DEFAULT_SOUNDS} from "../vars/sounds/DEFAULT_SOUNDS.ts";
import {makeAutoObservable} from "mobx";
import Beat from "../models/Beat.js";

export class BeatBarsManager {

    constructor(metronomeManager) {
        this._beats = [];
        this.metronomeManager = metronomeManager;
        this.generateBeats();
        makeAutoObservable(this)
    }

    get beats() {
        return this._beats;
    }

    addBeat(sound, note, noteAmount, soundSettings) {
        this._beats.push(new Beat(sound, note, noteAmount, soundSettings));
    }

    addStandardBeat() {
        this.addBeat(
            DEFAULT_SOUNDS[DEFAULT_SOUND_INDEX],
            NOTES.find(note => note.noteSize === DEFAULT_NOTE_SIZE && note.isTriplet === DEFAULT_IS_TRIPLET),
            NOTE_AMOUNTS.find(noteAmount => noteAmount === DEFAULT_NOTE_AMOUNT),
            DEFAULT_SOUND_SETTINGS
        );
    }

    popBeat() {
        this._beats.pop();
    }

    generateBeats() {
        for (let i = 0; i < INITIAL_NUMBER_OF_BEATS; i++) {
            this.addStandardBeat();
        }
    }

    increaseBeats() {
        this.addStandardBeat()
        this.metronomeManager.elementsManager.updateTimeSignature();
    }

    decreaseBeats() {
        this.popBeat();
        this.metronomeManager.elementsManager.updateTimeSignature();
    }


    increaseNotes() {
        this.changeDropdownSize(true);
    }

    decreaseNotes() {
        this.changeDropdownSize(false);
    }

    changeDropdownSize(direction) {
        this._beats.forEach((beat) => {
            const currentIndex = NOTES.findIndex(note => note.label === beat.noteSettings.label);
            const newIndex = currentIndex + (direction ? 2 : -2);
            beat.noteSettings = NOTES[newIndex];
        });
        this.metronomeManager.elementsManager.updateTimeSignature();
    }
}