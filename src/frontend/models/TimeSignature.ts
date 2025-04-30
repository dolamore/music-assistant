import {makeAutoObservable} from "mobx";

export default class TimeSignature {
    private _numerator: number;
    private _denominator: number;

    constructor(numerator: number, denominator: number) {
        this._numerator = numerator;
        this._denominator = denominator;
        makeAutoObservable(this);
    }

    get numerator(): number {
        return this._numerator;
    }

    set numerator(value: number) {
        this._numerator = value;
    }

    get denominator(): number {
        return this._denominator;
    }

    set denominator(value: number) {
        this._denominator = value;
    }
}