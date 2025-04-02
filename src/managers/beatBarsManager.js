import {
    DEFAULT_NOTE_AMOUNT,
    DEFAULT_SOUND_INDEX,
    INITIAL_NUMBER_OF_BEATS,
    MAX_BEATS_AMOUNT,
    MIN_BEATS_AMOUNT, NOTE_AMOUNTS,
    NOTES,
    SOUNDS
} from "../vars.js";
import {makeAutoObservable} from "mobx";

class Beat {
    constructor(sound, note, noteAmount) {
        this.soundSettings = sound;
        this.noteSettings = note;
        this.noteAmounts = noteAmount;
    }
}

export class BeatBarsManager {
    _numberOfBeats = INITIAL_NUMBER_OF_BEATS;
    _noteAttributes = [];

    constructor(metronomeManager) {
        this.metronomeManager = metronomeManager;
        this.generateNoteAttributes();
        makeAutoObservable(this)
    }


    get numberOfBeats() {
        return this._numberOfBeats;
    }

    set numberOfBeats(value) {
        this._numberOfBeats = value;
    }

    get noteAttributes() {
        return this._noteAttributes;
    }

    addNoteAttributes(sound, note, noteAmount) {
        this._noteAttributes.push(new Beat(sound, note, noteAmount));
    }

    addStandardNoteAttributes() {
        const standardNote = NOTES.find(note => note.noteSize === 4 && !note.isTriplet);
        const standardSound = SOUNDS[DEFAULT_SOUND_INDEX];
        const standardNoteAmount = NOTE_AMOUNTS.find(noteAmount => noteAmount === DEFAULT_NOTE_AMOUNT);

        this.addNoteAttributes(standardSound, standardNote, standardNoteAmount);
    }

    popNoteAttributes() {
        this._noteAttributes.pop();
    }

    generateNoteAttributes() {
        for (let i = 0; i < this.numberOfBeats; i++) {
            this.addStandardNoteAttributes();
        }
    }

    //TODO обновить updateMetronomeSequence if playing
    increaseBeats() {
        this._numberOfBeats++;
        this.addStandardNoteAttributes()
        this.metronomeManager.soundManager.addNewSoundSettingRow();
        this.metronomeManager.elementsManager.updateTimeSignature();

        this.checkBeatLimits();
    }

    decreaseBeats() {
        // Удаляем последний элемент из beat-container
        this.metronomeManager.soundManager.deleteLastBeatRow();
        this.popNoteAttributes();
        this._numberOfBeats--;
        this.metronomeManager.elementsManager.updateTimeSignature();

        this.checkBeatLimits();
    }

    checkBeatLimits() {
        const minLimit = this._numberOfBeats <= MIN_BEATS_AMOUNT;
        const maxLimit = this._numberOfBeats >= MAX_BEATS_AMOUNT;

        this.metronomeManager.buttonsManager.decreaseBeatsButtonLimit = minLimit;
        this.metronomeManager.buttonsManager.increaseBeatsButtonLimit = maxLimit;
    }
}