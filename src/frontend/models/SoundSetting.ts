export class SoundSetting {
    private readonly _key: string;
    private readonly _label: string;
    private _value: number | string;

    private readonly _min: number | undefined;
    private readonly _max: number | undefined;

    constructor(key: string, label: string, value: number | string, min?: number, max?: number) {
        this._key = key;
        this._label = label;
        this._value = value;
        this._min = min;
        this._max = max;
    }

    get key(): string {
        return this._key;
    }

    get label(): string {
        return this._label;
    }

    get value(): number | string {
        return this._value;
    }

    get min(): number | undefined {
        return this._min;
    }

    get max(): number | undefined {
        return this._max;
    }

    set value(value: number | string) {
        this._value = value;
    }
}