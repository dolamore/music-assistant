import {initialNumberOfBeats} from "../vars.js";
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

    decreaseBeats() {
        // Удаляем последний элемент из beat-container
        this.deleteLastBeatRow();
        this.popNoteAttributes();
        this._numberOfBeats--;
        this.metronomeManager.elementsManager.updateTimeSignature();

        // // Если метроном запущен, обновляем его
        // if (this.metronomeManager.isPlaying) {
        //     this.metronomeManager.updateMetronomeSequence();
        // }
        //
        // this.metronomeManager.elementsManager.updateTimeSignature();
    }

    deleteLastBeatRow() {
        this.metronomeManager.soundManager.popSelectedSound();
        this.metronomeManager.soundManager.popSoundSetting();
    }


    //TODO check commented code and realise it and for decrease beats also
    increaseBeats() {
        this._numberOfBeats++;
        this.addStandardNoteAttributes()
        this.metronomeManager.soundManager.addNewSoundSettingRow();
        this.metronomeManager.elementsManager.updateTimeSignature();

        // // Обновляем последовательность метронома без перезапуска
        // if (this.metronomeManager.isPlaying) {
        //     this.metronomeManager.updateMetronomeSequence();
        // }

        // // Обновляем тактовую сетку (если нужно)
        // this.metronomeManager.elementsManager.updateTimeSignature();
    }
}