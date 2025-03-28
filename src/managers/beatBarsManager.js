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

export class BeatBarsManager {
    _numberOfBeats = INITIAL_NUMBER_OF_BEATS;
    _noteAttributes = {
        soundSettings: [],
        noteSettings: [],
        noteAmounts: [],
    };

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
        this._noteAttributes.soundSettings.push(sound);
        this._noteAttributes.noteSettings.push(note);
        this._noteAttributes.noteAmounts.push(noteAmount);
    }

    //TODO: Переделать так чтобы звуки тоже хранились прямыми ссылками на объекты
    addStandardNoteAttributes() {
        const standardNote = NOTES.find(note => note.noteSize === 4 && !note.isTriplet);
        const standardSound = SOUNDS[DEFAULT_SOUND_INDEX];
        const standardNoteAmount = NOTE_AMOUNTS.find(noteAmount => noteAmount === DEFAULT_NOTE_AMOUNT);

        this.addNoteAttributes(standardSound, standardNote, standardNoteAmount);
    }

    popNoteAttributes() {
        this._noteAttributes.soundSettings.pop();
        this._noteAttributes.noteSettings.pop();
        this._noteAttributes.noteAmounts.pop();
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
        this.deleteLastBeatRow();
        this.popNoteAttributes();
        this._numberOfBeats--;
        this.metronomeManager.elementsManager.updateTimeSignature();

        this.checkBeatLimits();
    }

    deleteLastBeatRow() {
        this.metronomeManager.soundManager.popSelectedSound();
        this.metronomeManager.soundManager.popSoundSetting();
    }

    checkBeatLimits() {
        const minLimit = this._numberOfBeats <= MIN_BEATS_AMOUNT;
        const maxLimit = this._numberOfBeats >= MAX_BEATS_AMOUNT;

        this.metronomeManager.buttonsManager.decreaseBeatsButtonLimit = minLimit;
        this.metronomeManager.buttonsManager.increaseBeatsButtonLimit = maxLimit;
    }
}