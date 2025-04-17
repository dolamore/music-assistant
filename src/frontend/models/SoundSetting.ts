export class SoundSetting {
    private readonly _key: string;
    private readonly _label: string;
    private _value: number | string;

    private readonly _min: number | undefined;
    private readonly _max: number | undefined;

    constructor(key: string, label: string, value: number, min?: number, max?: number) {
        this._key = key;
        this._label = label;
        this._value = value;
        this._min = min;
        this._max = max;
    }
}