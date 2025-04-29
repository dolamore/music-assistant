import {DEFAULT_LOOP_SKIP_PROBABILITY, DEFAULT_NOTE_SKIP_PROBABILITY} from "../vars/vars.js";
import {makeAutoObservable} from "mobx";
import {handleVariableChange} from "../utils/utils";

export class TrainingModeManager {
    public _loopSkipProbability: number = DEFAULT_LOOP_SKIP_PROBABILITY;
    public _noteSkipProbability: number = DEFAULT_NOTE_SKIP_PROBABILITY;
    public _isTrainingMode: boolean = true;
    public _isFirstLoop: boolean = true;
    public _loopSkipPercentage = this._loopSkipProbability / 100;
    public _noteSkipPercentage = this._noteSkipProbability / 100;

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
            handleVariableChange(newValue, this._loopSkipProbability, 0, 100, (value: number) => this.setLoopSkipProbability(value))
        } else {
            handleVariableChange(newValue, this._noteSkipProbability, 0, 100, (value: number) => this.setNoteSkipProbability(value))
        }

        if (!(Number(newValue) === currentProbability)) {
            this._isFirstLoop = true;
        }
    }
}

enum ProbabilityType {
    LOOP,
    NOTE
}
