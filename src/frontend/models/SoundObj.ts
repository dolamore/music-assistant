import {SoundType} from "./Sound/Sound";

export class SoundObj {
    private readonly _key: string;
    private _sound: SoundType | null;
    private readonly _label: string;

    constructor(key: string, label: string, sound: SoundType | null) {
        this._key = key;
        this._label = label;
        this._sound = sound;
    }

    get key(): string {
        return this._key;
    }

    get sound(): SoundType | null {
        return this._sound;
    }

    get label(): string {
        return this._label;
    }

    set sound(value: SoundType | null) {
        this._sound = value;
    }
}