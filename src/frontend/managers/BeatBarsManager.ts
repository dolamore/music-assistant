import {
    DEFAULT_NOTE_AMOUNT,
    DEFAULT_NOTE_SIZE,
    getDefaultNote,
    INITIAL_NUMBER_OF_BEATS,
    NOTES,
} from "../vars/vars";
import {makeAutoObservable} from "mobx";
import Beat from "../models/Beat";
import {createDefaultSoundObject} from "../vars/sounds/DEFAULT_SOUNDS";
import {lcmArray} from "../utils/utils.js";
import {MetronomeManager} from "./MetronomeManager";
import {SoundObj} from "../models/SoundObj";
import Note from "../models/Note";
import TimeSignature from "../models/TimeSignature";

export class BeatBarsManager {
    private readonly _beats: Beat[];
    private readonly _timeSignature: TimeSignature = new TimeSignature(INITIAL_NUMBER_OF_BEATS, DEFAULT_NOTE_SIZE);
    private readonly metronomeManager: MetronomeManager;

    constructor(metronomeManager: MetronomeManager) {
        this._beats = [];
        this.metronomeManager = metronomeManager;
        this.generateBeats();
        this.updateTimeSignature();
        makeAutoObservable(this)
    }

    get timeSignature(): TimeSignature {
        return this._timeSignature;
    }

    get beats() {
        return this._beats;
    }

    addBeat(sound: SoundObj, note: Note, noteAmount: number, beatIndex: number): void {
        this._beats.push(new Beat(sound, note, noteAmount, beatIndex));
    }

    addStandardBeat(beatIndex: number): void {
        this.addBeat(
            createDefaultSoundObject(),
            getDefaultNote(),
            DEFAULT_NOTE_AMOUNT,
            beatIndex
        );
    }

    popBeat(): void {
        this._beats.pop();
    }

    generateBeats(): void {
        for (let i = 0; i < INITIAL_NUMBER_OF_BEATS; i++) {
            this.addStandardBeat(i);
        }
    }

    increaseBeats(): void {
        this.addStandardBeat(this._beats.length);
        this.metronomeManager.updateMetronome();
    }

    decreaseBeats(): void {
        this.popBeat();
        this.metronomeManager.updateMetronome();
    }


    increaseNotes(): void {
        this.changeDropdownSize(true);
    }

    decreaseNotes(): void {
        this.changeDropdownSize(false);
    }

    changeDropdownSize(direction: boolean): void {
        this._beats.forEach((beat) => {
            const currentIndex = NOTES.findIndex(note => note.label === beat.noteSettings.label);
            const newIndex = currentIndex + (direction ? 2 : -2);
            beat.noteSettings = NOTES[newIndex];
        });
        this.metronomeManager.updateMetronome();
    }

    updateTimeSignature(): void {
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

        this._timeSignature.numerator = numerator;
        this._timeSignature.denominator = denominator;
    }
}