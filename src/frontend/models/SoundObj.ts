import {InstrumentType} from "./SoundModels/Instrument";

export class SoundObj {
    private readonly _key: string;
    private _sound: InstrumentType | null;
    private readonly _label: string;

    constructor(key: string, label: string, sound: InstrumentType | null) {
        this._key = key;
        this._label = label;
        this._sound = sound;
    }

    get key(): string {
        return this._key;
    }

    get sound(): InstrumentType | null {
        return this._sound;
    }

    get label(): string {
        return this._label;
    }

    set sound(value: InstrumentType | null) {
        this._sound = value;
    }
}