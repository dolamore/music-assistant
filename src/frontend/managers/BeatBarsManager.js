import {
    getDefaultNote, getDefaultNoteAmount,
    INITIAL_NUMBER_OF_BEATS,
    NOTES,
} from "../vars/vars";
import {makeAutoObservable} from "mobx";
import Beat from "../models/Beat";
import {createDefaultSoundObject} from "../vars/sounds/DEFAULT_SOUNDS";
import {lcmArray} from "../utils/utils.js";

export class BeatBarsManager {

    constructor(metronomeManager) {
        this._beats = [];
        this.metronomeManager = metronomeManager;
        this.generateBeats();
        this._timeSignature = this.countSize();
        makeAutoObservable(this)
    }

    get timeSignature() {
        return this._timeSignature;
    }

    get beats() {
        return this._beats;
    }

    updateTimeSignature() {
        this._timeSignature = this.countSize();
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

    countSize() {
        let beatAmount = this._beats.length;
        let beatPattern = [];

        for (let index = 0; index < beatAmount; index++) {
            const { isTriplet, noteSize } = this._beats[index].noteSettings;
            const noteAmount = this._beats[index].noteAmount;

            for (let i = 0; i < (isTriplet ? 3 * noteAmount : noteAmount); i++) {
                beatPattern.push(isTriplet ? noteSize * 3 / 2 : noteSize);
            }
        }

        const denominator = lcmArray(beatPattern);
        let numerator = 0;

        for (let index = 0; index < beatAmount; index++) {
            const noteAmount = this._beats[index].noteAmount;
            const {isTriplet, noteSize} = this._beats[index].noteSettings;

            if (isTriplet) {
                numerator += noteAmount * 3 * (denominator / noteSize);
            } else {
                numerator += noteAmount * (denominator / noteSize);
            }
        }

        return {numerator: numerator, tactSize: denominator};
    }
}