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
    _beats = [];

    constructor(metronomeManager) {
        this.metronomeManager = metronomeManager;
        this.generateBeats();
        makeAutoObservable(this)
    }

    get beats() {
        return this._beats;
    }

    addBeats(sound, note, noteAmount) {
        this._beats.push(new Beat(sound, note, noteAmount));
    }

    addStandardBeats() {
        const standardNote = NOTES.find(note => note.noteSize === 4 && !note.isTriplet);
        const standardSound = SOUNDS[DEFAULT_SOUND_INDEX];
        const standardNoteAmount = NOTE_AMOUNTS.find(noteAmount => noteAmount === DEFAULT_NOTE_AMOUNT);

        this.addBeats(standardSound, standardNote, standardNoteAmount);
    }

    popBeats() {
        this._beats.pop();
    }

    generateBeats() {
        for (let i = 0; i < INITIAL_NUMBER_OF_BEATS; i++) {
            this.addStandardBeats();
        }
    }

    //TODO обновить updateMetronomeSequence if playing
    increaseBeats() {
        this.addStandardBeats()
        this.metronomeManager.soundManager.addNewSoundSettingRow();
        this.metronomeManager.elementsManager.updateTimeSignature();

        this.checkBeatLimits();
    }

    decreaseBeats() {
        // Удаляем последний элемент из beat-container
        this.metronomeManager.soundManager.deleteLastBeatRow();
        this.popBeats();
        this.metronomeManager.elementsManager.updateTimeSignature();

        this.checkBeatLimits();
    }

    checkBeatLimits() {
        const minLimit = this._beats.length <= MIN_BEATS_AMOUNT;
        const maxLimit = this._beats.length >= MAX_BEATS_AMOUNT;

        this.metronomeManager.buttonsManager.decreaseBeatsButtonLimit = minLimit;
        this.metronomeManager.buttonsManager.increaseBeatsButtonLimit = maxLimit;
    }
}