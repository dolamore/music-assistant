import {initialNumberOfBeats, maxBeatsAmount, minBeatsAmount} from "../vars.js";
import {makeAutoObservable} from "mobx";

export class BeatBarsManager {
    _numberOfBeats = initialNumberOfBeats;
    _noteAttributes = {
        noteSizes: [],
        noteAmounts: [],
        isTriplets: []
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

    addNoteAttributes(noteSize, noteAmount, isTriplet) {
        this._noteAttributes.noteSizes.push(noteSize);
        this._noteAttributes.noteAmounts.push(noteAmount);
        this._noteAttributes.isTriplets.push(isTriplet);
    }

    addStandardNoteAttributes() {
        this.addNoteAttributes(2, 0, false);
    }

    popNoteAttributes() {
        this._noteAttributes.noteSizes.pop();
        this._noteAttributes.noteAmounts.pop();
        this._noteAttributes.isTriplets.pop();
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