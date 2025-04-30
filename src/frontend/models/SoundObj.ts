import {Instrument} from "./Instruments/Instrument";
import {DEFAULT_SOUNDS} from "../vars/sounds/DEFAULT_SOUNDS";
import {makeAutoObservable} from "mobx";

export class SoundObj {
    private _key: string;
    private readonly _instrument: Instrument;
    public _label: string;
    public _soundIndex: number;

    constructor(key: string, label: string, instrument: Instrument, soundIndex: number) {
        this._key = key;
        this._label = label;
        this._instrument = instrument;
        this._soundIndex = soundIndex;

        makeAutoObservable(this);
    }

    get key(): string {
        return this._key;
    }

    get instrument(): Instrument {
        return this._instrument;
    }

    get label(): string {
        return this._label;
    }

    get soundIndex(): number {
        return this._soundIndex;
    }

    chooseAnotherSound(newSoundIndex: number): string {
        this._soundIndex = (newSoundIndex) % DEFAULT_SOUNDS.length;
        this._key = DEFAULT_SOUNDS[this._soundIndex].key;
        this._label = DEFAULT_SOUNDS[this._soundIndex].label;

        return this._key
    }
}