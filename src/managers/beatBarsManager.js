import {initialNumberOfBeats, maxBeatsAmount, minBeatsAmount, notes} from "../vars.js";
import {makeAutoObservable} from "mobx";

export class BeatBarsManager {
    _numberOfBeats = initialNumberOfBeats;
    _noteAttributes = {
        sounds: [],
        notes: [],
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
        this._noteAttributes.sounds.push(sound);
        this._noteAttributes.notes.push(note);
        this._noteAttributes.noteAmounts.push(noteAmount);
    }

    //TODO: Переделать так чтобы звуки тоже хранились прямыми ссылками на объекты
    addStandardNoteAttributes() {
        const standardNote = notes.find(note => note.value === 4 && !note.isTriplet);
        this.addNoteAttributes(1, standardNote, 0);
    }

    popNoteAttributes() {
        this._noteAttributes.sounds.pop();
        this._noteAttributes.notes.pop();
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
        const minLimit = this._numberOfBeats <= minBeatsAmount;
        const maxLimit = this._numberOfBeats >= maxBeatsAmount;

        this.metronomeManager.buttonsManager.decreaseBeatsButtonLimit = minLimit;
        this.metronomeManager.buttonsManager.increaseBeatsButtonLimit = maxLimit;
    }
}