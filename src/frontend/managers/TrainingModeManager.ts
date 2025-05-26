import {
  DEFAULT_LOOP_SKIP_PROBABILITY,
  DEFAULT_NOTE_SKIP_PROBABILITY,
} from "../vars/vars";
import { makeAutoObservable } from "mobx";
import { handleVariableChange } from "../utils/utils";
import { MetronomeManager } from "./MetronomeManager";

export class TrainingModeManager {
  private _loopSkipProbability: number = DEFAULT_LOOP_SKIP_PROBABILITY;
  private _noteSkipProbability: number = DEFAULT_NOTE_SKIP_PROBABILITY;
  private _isTrainingMode: boolean = false;
  private _isFirstLoop: boolean = true;
  private _loopSkipPercentage: number = this._loopSkipProbability / 100;
  private _noteSkipPercentage: number = this._noteSkipProbability / 100;
  private readonly _metronomeManager: MetronomeManager;

  constructor(metronomeManager: MetronomeManager) {
    this._metronomeManager = metronomeManager;
    makeAutoObservable(this);
  }

  set isFirstLoop(isFirstLoop: boolean) {
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
    } else {
      this._metronomeManager.audioEngine.cleanTrainingMode();
    }
  }

  handleLoopSkipProbabilityChange = (
    changeProbability: number | string,
  ): void => {
    this.handleProbabilityChange(
      changeProbability,
      this._loopSkipProbability,
      ProbabilityType.LOOP,
    );
  };

  handleNoteSkipProbabilityChange = (
    changeProbability: number | string,
  ): void => {
    this.handleProbabilityChange(
      changeProbability,
      this._noteSkipProbability,
      ProbabilityType.NOTE,
    );
  };

  setLoopSkipProbability(probability: number): void {
    this._loopSkipProbability = probability;
    this._loopSkipPercentage = probability / 100;
  }

  setNoteSkipProbability(probability: number): void {
    this._noteSkipProbability = probability;
    this._noteSkipPercentage = probability / 100;
  }

  handleProbabilityChange(
    newValue: number | string,
    currentProbability: number,
    type: ProbabilityType,
  ): void {
    if (type === ProbabilityType.LOOP) {
      handleVariableChange(
        Number(newValue),
        currentProbability,
        0,
        100,
        (value: number) => this.setLoopSkipProbability(value),
      );
    } else {
      handleVariableChange(
        Number(newValue),
        currentProbability,
        0,
        100,
        (value: number) => this.setNoteSkipProbability(value),
      );
    }

    if (Number(newValue) !== currentProbability) {
      this._isFirstLoop = true;
    }
  }
}

enum ProbabilityType {
  LOOP,
  NOTE,
}
