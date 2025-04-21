import {Instrument} from "./Instruments/Instrument";

export class SoundObj {
    private readonly _key: string;
    private readonly _instrument: Instrument;
    private readonly _label: string;

    constructor(key: string, label: string, instrument: Instrument) {
        this._key = key;
        this._label = label;
        this._instrument = instrument;
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
}