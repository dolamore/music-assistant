import { makeAutoObservable } from "mobx";

/**
 * Time Signature consists of numerator, which means the amount of beats, and denominator, which means the size of this beat
 * (e.g 4/4 means four beats with the note size 1/4)
 */
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
