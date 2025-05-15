import * as Tone from "tone";
import { AudioEngine } from "../AudioEngine";
import { MetronomeManager } from "../../managers/MetronomeManager";
import { action, makeObservable, override } from "mobx";
import { BPM_MAX_LIMIT, BPM_MIN_LIMIT } from "../../vars/vars";
import { uiState } from "../../states/UIState";
import Beat from "../../models/Beat";
import { handleVariableChange } from "../../utils/utils";

export class TonejsEngine extends AudioEngine {
  private _transport = Tone.getTransport();
  private _loop: Tone.Loop;
  private _beatSequence: Beat[] = [];
  private _count: number = 0;
  private _currentStep: number = 0;
  private _skipper: number = 0;

  constructor(metronomeManager: MetronomeManager) {
    super(metronomeManager);
    this._beatSequence = this.generateFixedMetronomeSequence();
    this._loop = new Tone.Loop((time) => {
      this.getMetronomeLoopCallback(time);
    }, "64n");
    Tone.getTransport().bpm.value = Number(this._bpm) * 3;

    makeObservable(this, {
      getMetronomeLoopCallback: action,
      stopPlaying: action,

      setBpm: override,
    });
  }

  setBpm(bpm: number): void {
    this._bpm = bpm;
    this._transport.bpm.value = bpm * 3;
  }

  startPlaying(): void {
    this._count = 0;
    this._loopCount = 0;
    this._skipper = 0;
    this._trainingModeManager.isFirstLoop = true;

    this._transport.start();
    this._loop.start(0);
  }

  stopPlaying() {
    this._loop.stop();
    this._transport.stop();
  }

  getMetronomeLoopCallback(time: number): void {
    const length = this._beatSequence.length;

    this._currentStep = this._count % length;
    const isStartOfLoop = this._currentStep === 0;

    if (
      this._trainingModeManager.isTrainingMode &&
      isStartOfLoop &&
      (Math.random() < this._trainingModeManager.loopSkipPercentage ||
        this._trainingModeManager.isFirstLoop)
    ) {
      this._skipper = length;
    }

    if (this._skipper > 0) {
      this._skipper--;
      if (this._trainingModeManager.isFirstLoop) {
        this.playMetronomeStep(time);
        if (this._skipper === 0) {
          this._trainingModeManager.isFirstLoop = false;
        }
      }
    } else {
      this.playMetronomeStep(time);
    }

    if (this._currentStep === 0 && this._count > 0) {
      this._loopCount++;
    }

    this._count++;
  }

  playMetronomeStep(time: number) {
    const currentNote = this._beatSequence[this._currentStep];
    if (!currentNote || !currentNote.beatSound) return;
    if (
      !(
        this._trainingModeManager.isTrainingMode &&
        Math.random() < this._trainingModeManager.noteSkipPercentage &&
        !this._trainingModeManager.isFirstLoop
      )
    ) {
      const {
        beatSound: { instrument },
        beatIndex,
      } = currentNote;
      instrument.play(time);
      uiState.playBeat(beatIndex);
    }
  }

  generateFixedMetronomeSequence() {
    const { beats } = this.metronomeManager.beatBarsManager;
    let position = 0;
    let totalSteps = 0;
    const beatAmount = beats.length;

    for (let i = 0; i < beatAmount; i++) {
      const noteSize = beats[i].noteSettings.noteSize;
      const noteAmount = beats[i].noteAmount;
      totalSteps += (64 / noteSize) * 3 * noteAmount;
    }

    const sequence = new Array(totalSteps).fill(null);

    for (let beatIndex = 0; beatIndex < beatAmount; beatIndex++) {
      const { noteSettings, noteAmount } = beats[beatIndex];
      const { isTriplet, noteSize } = noteSettings;

      const stepSize = isTriplet ? 64 / noteSize : (64 / noteSize) * 3;

      for (let j = 0; j < (isTriplet ? 3 * noteAmount : noteAmount); j++) {
        sequence[position] = beats[beatIndex];
        position += stepSize;
      }
    }

    return sequence;
  }

  updateBeatSequence() {
    this._beatSequence = this.generateFixedMetronomeSequence();
  }

  handleBpmChange = (newBpm: number): void => {
    handleVariableChange(
      newBpm,
      this._bpm,
      BPM_MIN_LIMIT,
      BPM_MAX_LIMIT,
      (value: number) => this.setBpm(value),
    );
  };

  cleanTrainingMode(): void {
    this._skipper = 0;
  }
}
