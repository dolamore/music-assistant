import {
    getDefaultNote, getDefaultNoteAmount,
    INITIAL_NUMBER_OF_BEATS,
    NOTES,
} from "../vars/vars.js";
import {makeAutoObservable} from "mobx";
import Beat from "../models/Beat.ts";
import {createDefaultSoundObject} from "../vars/sounds/DEFAULT_SOUNDS.js";

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

    addBeat(sound, note, noteAmount, beatIndex) {
        this._beats.push(new Beat(sound, note, noteAmount, beatIndex));
    }

    addStandardBeat(beatIndex) {
        this.addBeat(
            createDefaultSoundObject(),
            getDefaultNote(),
            getDefaultNoteAmount(),
            beatIndex
        );
    }

    popBeat() {
        this._beats.pop();
    }

    generateBeats() {
        for (let i = 0; i < INITIAL_NUMBER_OF_BEATS; i++) {
            this.addStandardBeat(i);
        }
    }

    increaseBeats() {
        this.addStandardBeat(this._beats.length);
        this.metronomeManager.updateMetronome();
    }

    decreaseBeats() {
        this.popBeat();
        this.metronomeManager.updateMetronome();
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
        this.metronomeManager.updateMetronome();
    }
}