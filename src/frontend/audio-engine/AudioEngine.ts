import {MetronomeManager} from "../managers/MetronomeManager";
import {action, computed, observable} from "mobx";
import {BPM_MAX_LIMIT, BPM_MIN_LIMIT, DEFAULT_INITIAL_BPM} from "../vars/vars";

export abstract class AudioEngine {
    @observable
    public _bpm: number | string = DEFAULT_INITIAL_BPM;
    protected readonly _metronomeManager: MetronomeManager;

    protected constructor(metronomeManager: MetronomeManager) {
        this._metronomeManager = metronomeManager;
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

    handleBpmChange(newBpm: any): void {
        if (/^0\d/.test(newBpm)) {
            newBpm = newBpm.replace(/^0+/, '');
        }

        if (isNaN(newBpm) || newBpm === '') {
            return;
        }
        if (this.bpm === newBpm) {
            return;
        }
        if (newBpm > BPM_MAX_LIMIT) {
            this._bpm = BPM_MAX_LIMIT;
        } else if (newBpm < BPM_MIN_LIMIT) {
            this._bpm = BPM_MIN_LIMIT;
        } else {
            this._bpm = newBpm;
        }

        // if (this._loop) this._loop.stop();  // Останавливаем текущий цикл метронома
        // if (this.isPlaying) {
        //     // this.restartMetronomeAndPendulum();
        // }
    }

    abstract startPlaying(): void;
    abstract playStep(...args: any[]): void;
}
