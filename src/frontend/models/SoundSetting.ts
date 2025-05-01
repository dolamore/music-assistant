export class SoundSetting {
    private readonly _key: string;
    private readonly _label: string;
    private _value: number | string;

    private readonly _minValue: number | undefined;
    private readonly _maxValue: number | undefined;
    private readonly _defaultValue: number | string;

    constructor(key: string, label: string, value: number | string, min?: number, max?: number) {
        this._key = key;
        this._label = label;
        this._value = value;
        this._minValue = min;
        this._maxValue = max;
        this._defaultValue = value;
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

    get minValue(): number | undefined {
        return this._minValue;
    }

    get maxValue(): number | undefined {
        return this._maxValue;
    }

    get defaultValue(): number {
        return this._defaultValue;
    }

    set value(value: number | string) {
        this._value = value;
    }

    setValue(value: number | string) {
        this._value = value;
    }
}