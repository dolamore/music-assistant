import {InstrumentType} from "./Instruments/Instrument";

export class SoundObj {
    private readonly _key: string;
    private _instrument: InstrumentType | null;
    private readonly _label: string;

    constructor(key: string, label: string, instrument: InstrumentType | null) {
        this._key = key;
        this._label = label;
        this._instrument = instrument;
    }

    get key(): string {
        return this._key;
    }

    get instrument(): InstrumentType | null {
        return this._instrument;
    }

    get label(): string {
        return this._label;
    }

    set instrument(value: InstrumentType | null) {
        this._instrument = value;
    }
}