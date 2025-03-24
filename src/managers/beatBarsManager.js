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

       // this.metronomeManager.elementsManager.deleteLastSoundSettingsRow();

        // Обновляем массивы
        // this.metronomeManager.soundManager.popSelectedSound();
        // this.metronomeManager.soundManager.popSoundSetting();

        // Пересчитываем количество битов
        // elements.beatsCounter.textContent = Elements.beatRows.length;

        // // Используем setTimeout, чтобы подождать завершения обновления DOM
        // setTimeout(() => {
        //     this.metronomeManager.elementsManager.updateTimeSignature();
        // }, 0);

        // // Если метроном запущен, обновляем его
        // if (this.metronomeManager.isPlaying) {
        //     this.metronomeManager.updateMetronomeSequence();
        // }
        //
        // this.metronomeManager.elementsManager.updateTimeSignature();
    }

    deleteLastBeatRow() {
   //     const lastBeatRow = elements.beatContainer.lastElementChild;
   //      if (lastBeatRow) {
   //          lastBeatRow.remove();
   //      }
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