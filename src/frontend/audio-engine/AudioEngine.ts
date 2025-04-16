import {MetronomeManager} from "../managers/MetronomeManager";
import {action, computed, makeObservable, observable} from "mobx";
import {DEFAULT_INITIAL_BPM} from "../vars/vars";

export abstract class AudioEngine {

    public _bpm: number | string = DEFAULT_INITIAL_BPM;
    protected readonly _metronomeManager: MetronomeManager;

    protected constructor(metronomeManager: MetronomeManager) {
        this._metronomeManager = metronomeManager;

        makeObservable(this, {
            _bpm: observable,
            bpm: computed,
            setBpm: action,
        });
    }

    get metronomeManager(): MetronomeManager {
        return this._metronomeManager;
    }

    get bpm(): any {
        return this._bpm;
    }

    setBpm(value: any) {
        this._bpm = value;
    }


    abstract handleBpmChange(newBpm: any): void;

    abstract startPlaying(): void;
    abstract stopPlaying(): void;
    abstract playStep(...args: any[]): void;
    abstract get loopCount(): number;
}
