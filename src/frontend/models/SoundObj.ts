import { Instrument } from "./Instruments/Instrument";
import { DEFAULT_SOUNDS } from "../vars/sounds/DEFAULT_SOUNDS";
import { makeAutoObservable } from "mobx";

export class SoundObj {
  private _key: string;
  private readonly _instrument: Instrument;
  public _label: string;

  constructor(key: string, label: string, instrument: Instrument) {
    this._key = key;
    this._label = label;
    this._instrument = instrument;

    makeAutoObservable(this);
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

  chooseAnotherSound(newSoundIndex: number): string {
    const soundIndex = newSoundIndex % DEFAULT_SOUNDS.length;
    this._key = DEFAULT_SOUNDS[soundIndex].key;
    this._label = DEFAULT_SOUNDS[soundIndex].label;

    return this._key;
  }
}
