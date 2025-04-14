import {MetronomeManager} from "../managers/MetronomeManager";
import {action, computed, observable} from "mobx";
import {DEFAULT_INITIAL_BPM} from "../vars/vars";

export abstract class AudioEngine {
    @observable
    public _bpm: number | string = DEFAULT_INITIAL_BPM;
    private readonly _metronomeManager: MetronomeManager;

    abstract setupAudioContextUnlocker(): void;

    protected constructor(metronomeManager: MetronomeManager) {
        this._metronomeManager = metronomeManager;
        this.setupAudioContextUnlocker();
    }

    get metronomeManager(): MetronomeManager {
        return this._metronomeManager;
    }

    @computed
    get bpm(): any {
        return this._bpm;
    }

    @action
    setBpm(value: any) {
        this._bpm = value;
    }
}
