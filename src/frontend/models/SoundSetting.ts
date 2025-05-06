export class SoundSetting {
  private readonly _key: string;
  private readonly _label: string;
  private _value: number;

  private readonly _minValue: number;
  private readonly _maxValue: number;
  private readonly _defaultValue: number;

  constructor(
    key: string,
    label: string,
    value: number,
    min: number,
    max: number,
  ) {
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

  get value(): number {
    return this._value;
  }

  get minValue(): number {
    return this._minValue;
  }

  get maxValue(): number {
    return this._maxValue;
  }

  get defaultValue(): number {
    return this._defaultValue;
  }

  set value(value: number) {
    this._value = value;
  }

  setValue(value: number) {
    this._value = value;
  }
}
