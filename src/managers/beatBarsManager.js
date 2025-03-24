import {initialNumberOfBeats} from "../vars.js";
import {makeAutoObservable} from "mobx";

export class BeatBarsManager {
    _numberOfBeats = initialNumberOfBeats;

    constructor(metronomeManager) {
        this.metronomeManager = metronomeManager;
        makeAutoObservable(this)
    }


    get numberOfBeats() {
        return this._numberOfBeats;
    }

    set numberOfBeats(value) {
        this._numberOfBeats = value;
    }

    decreaseBeats() {
        // Удаляем последний элемент из beat-container
        this.deleteLastBeatRow();
        this._numberOfBeats--;

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


    //TODO check commented code and realise it and for decrase beats also
    increaseBeats() {
        this._numberOfBeats++;
        this.metronomeManager.soundManager.addNewSoundSettingRow();

        // // Обновляем последовательность метронома без перезапуска
        // if (this.metronomeManager.isPlaying) {
        //     this.metronomeManager.updateMetronomeSequence();
        // }

        // // Обновляем тактовую сетку (если нужно)
        // this.metronomeManager.elementsManager.updateTimeSignature();
    }
}