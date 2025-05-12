import {MetronomeManager} from "../managers/MetronomeManager";
import {action, computed, makeObservable, observable} from "mobx";
import {DEFAULT_INITIAL_BPM} from "../vars/vars";
import {TrainingModeManager} from "../managers/TrainingModeManager";

export abstract class AudioEngine {
    public _bpm: number = DEFAULT_INITIAL_BPM;
    public _loopCount: number = 0;
    protected readonly _metronomeManager: MetronomeManager;
    protected readonly _trainingModeManager: TrainingModeManager;

    protected constructor(metronomeManager: MetronomeManager) {
        this._metronomeManager = metronomeManager;
        this._trainingModeManager = metronomeManager.trainingModeManager;

        makeObservable(this, {
            _loopCount: observable,
            loopCount: computed,
            _bpm: observable,
            bpm: computed,
            setBpm: action,
        });
    }

    get loopCount(): number {
        return this._loopCount;
    }

    get metronomeManager(): MetronomeManager {
        return this._metronomeManager;
    }

    get bpm(): number {
        return this._bpm;
    }

    abstract setBpm(value: number): void;

    abstract handleBpmChange(newBpm: number): void;

    abstract startPlaying(): void;

    abstract stopPlaying(): void;

    abstract updateBeatSequence(): void;

    abstract cleanTrainingMode(): void;
}
