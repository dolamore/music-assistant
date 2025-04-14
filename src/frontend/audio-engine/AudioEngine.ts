import {MetronomeManager} from "../managers/MetronomeManager";
import {makeAutoObservable} from "mobx";
import {DEFAULT_INITIAL_BPM} from "../vars/vars";

export abstract class AudioEngine {
    private readonly _metronomeManager: MetronomeManager;
    private _bpm: number | string = DEFAULT_INITIAL_BPM;

    abstract setupAudioContextUnlocker(): void;

    constructor(metronomeManager: MetronomeManager) {
        this._metronomeManager = metronomeManager;
        this.setupAudioContextUnlocker();
        makeAutoObservable(this);
    }

    get metronomeManager(): MetronomeManager {
        return this._metronomeManager;
    }

    get bpm(): any {
        return this._bpm;
    }

    set bpm(value: any) {
        this._bpm = value;
    }
}
