import {
    DEFAULT_IS_TRIPLET,
    DEFAULT_NOTE_AMOUNT, DEFAULT_NOTE_SIZE,
    DEFAULT_SOUND_INDEX,
    INITIAL_NUMBER_OF_BEATS,
    NOTE_AMOUNTS,
    NOTES,
    SOUNDS
} from "../vars.js";
import {makeAutoObservable} from "mobx";

class Beat {
    constructor(sound, note, noteAmount) {
        this.soundSettings = sound;
        this.noteSettings = note;
        this.noteAmounts = noteAmount;
        makeAutoObservable(this);
    }
}

export class BeatBarsManager {
    _beats = [];

    constructor(metronomeManager) {
        this.metronomeManager = metronomeManager;
        makeAutoObservable(this)
    }

    get beats() {
        return this._beats;
    }

    addBeat(sound, note, noteAmount) {
        this._beats.push(new Beat(sound, note, noteAmount));
    }

    addStandardBeat() {
        const standardNote = NOTES.find(note => note.noteSize === DEFAULT_NOTE_SIZE && note.isTriplet === DEFAULT_IS_TRIPLET);
        const standardSound = SOUNDS[DEFAULT_SOUND_INDEX];
        const standardNoteAmount = NOTE_AMOUNTS.find(noteAmount => noteAmount === DEFAULT_NOTE_AMOUNT);

        this.addBeat(standardSound, standardNote, standardNoteAmount);
    }

    popBeat() {
        this._beats.pop();
    }

    generateBeats() {
        for (let i = 0; i < INITIAL_NUMBER_OF_BEATS; i++) {
            this.addStandardBeat();
        }
    }

    increaseBeats() {
        this.addStandardBeat()
        this.metronomeManager.soundManager.addNewSoundSettingRow();
        this.metronomeManager.elementsManager.updateTimeSignature();

     //   this.metronomeManager.buttonsManager.checkBeatsLimits();
        this.metronomeManager.buttonsManager.checkNotesLimit();
    }

    decreaseBeats() {
        this.metronomeManager.soundManager.deleteLastBeatRow();
        this.popBeat();
        this.metronomeManager.elementsManager.updateTimeSignature();

      //  this.metronomeManager.buttonsManager.checkBeatsLimits();
        this.metronomeManager.buttonsManager.checkNotesLimit();
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
        this.metronomeManager.elementsManager.updateTimeSignature();
        this.metronomeManager.buttonsManager.checkNotesLimit();
    }
}