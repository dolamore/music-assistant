import {DEFAULT_LOOP_SKIP_PROBABILITY, DEFAULT_NOTE_SKIP_PROBABILITY} from "../vars/vars.js";
import {makeAutoObservable} from "mobx";

export class TrainingModeManager {
    public _loopSkipProbability: number = DEFAULT_LOOP_SKIP_PROBABILITY;
    public _noteSkipProbability: number = DEFAULT_NOTE_SKIP_PROBABILITY;
    public _isTrainingMode: boolean = false;
    public _isFirstLoop: boolean = true;

    constructor() {
        makeAutoObservable(this);
    }

    set loopSkipProbability(probability) {
        this._loopSkipProbability = probability;
    }

    set noteSkipProbability(probability) {
        this._noteSkipProbability = probability;
    }

    set isFirstLoop(isFirstLoop) {
        this._isFirstLoop = isFirstLoop;
    }

    set isTrainingMode(isTrainingMode) {
        this._isTrainingMode = isTrainingMode;
    }

    get loopSkipProbability(): number {
        return this._loopSkipProbability;
    }

    get noteSkipProbability(): number {
        return this._noteSkipProbability;
    }

    get isTrainingMode(): boolean {
        return this._isTrainingMode;
    }

    get isFirstLoop(): boolean {
        return this._isFirstLoop;
    }

    setTrainingMode(enabled: boolean): void {
        this._isTrainingMode = enabled;
        this._isFirstLoop = enabled;
    }

    handleLoopSkipProbabilityChange(changeProbability: number | string): void {
        this.handleProbabilityChange(changeProbability, this._loopSkipProbability, ProbabilityType.LOOP);
    }

    handleNoteSkipProbabilityChange(changeProbability: number | string): void {
        this.handleProbabilityChange(changeProbability, this._noteSkipProbability, ProbabilityType.NOTE);
    }

    handleProbabilityChange(newValue: number | string, currentValue: number, type: ProbabilityType): void {
        if (Number.isNaN(newValue) || newValue === "") {
            return;
        }
        let probability = Number((currentValue + Number(newValue)).toFixed(5));

        if (probability > 1) {
            probability = 1;
        } else if (probability < 0) {
            probability = 0;
        } else {
            probability = Math.round(probability * 100) / 100;
        }

        if (type === ProbabilityType.LOOP) {
            this._loopSkipProbability = probability;
        } else {
            this._noteSkipProbability = probability;
        }
        this._isFirstLoop = true;
    }
}

enum ProbabilityType {
    LOOP,
    NOTE
}

