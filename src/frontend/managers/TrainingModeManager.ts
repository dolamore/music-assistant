import {DEFAULT_LOOP_SKIP_PROBABILITY, DEFAULT_NOTE_SKIP_PROBABILITY} from "../vars/vars.js";
import {makeAutoObservable} from "mobx";
import {handleVariableChange} from "../utils/utils";

export class TrainingModeManager {
    private _loopSkipProbability: number = DEFAULT_LOOP_SKIP_PROBABILITY;
    private _noteSkipProbability: number = DEFAULT_NOTE_SKIP_PROBABILITY;
    private _isTrainingMode: boolean = true;
    private _isFirstLoop: boolean = true;
    private _loopSkipPercentage = this._loopSkipProbability / 100;
    private _noteSkipPercentage = this._noteSkipProbability / 100;

    constructor() {
        makeAutoObservable(this);
    }

    set isFirstLoop(isFirstLoop) {
        this._isFirstLoop = isFirstLoop;
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


    get loopSkipPercentage(): number {
        return this._loopSkipPercentage;
    }

    get noteSkipPercentage(): number {
        return this._noteSkipPercentage;
    }

    toggleTrainingMode(): void {
        this._isTrainingMode = !this._isTrainingMode;

        if (this._isTrainingMode) {
            this._isFirstLoop = true;
        }
    }

    handleLoopSkipProbabilityChange = (changeProbability: number | string): void => {
        this.handleProbabilityChange(changeProbability, this._loopSkipProbability, ProbabilityType.LOOP);
    }

    handleNoteSkipProbabilityChange = (changeProbability: number | string): void => {
        this.handleProbabilityChange(changeProbability, this._noteSkipProbability, ProbabilityType.NOTE);
    }

    setLoopSkipProbability(probability: number): void {
        this._loopSkipProbability = probability;
        this._loopSkipPercentage = probability / 100;
    }

    setNoteSkipProbability(probability: number): void {
        this._noteSkipProbability = probability;
        this._noteSkipPercentage = probability / 100;
    }

    handleProbabilityChange(newValue: number | string, currentProbability: number, type: ProbabilityType): void {
        if (type === ProbabilityType.LOOP) {
            handleVariableChange(newValue, currentProbability, 0, 100, (value: number) => this.setLoopSkipProbability(value))
        } else {
            handleVariableChange(newValue, currentProbability, 0, 100, (value: number) => this.setNoteSkipProbability(value))
        }

        if (Number(newValue) !== currentProbability) {
            this._isFirstLoop = true;
        }
    }
}

enum ProbabilityType {
    LOOP,
    NOTE
}
