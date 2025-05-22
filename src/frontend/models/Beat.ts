import { makeAutoObservable, observable } from "mobx";
import { SoundObj } from "./SoundObj";
import { DEFAULT_SOUNDS } from "../vars/sounds/DEFAULT_SOUNDS";
import Note from "./Note";

export default class Beat {
  private readonly _beatSound: SoundObj;
  private _noteSettings: Note;
  private _noteAmount: number;
  private readonly _beatIndex: number;

  constructor(
    beatSound: SoundObj,
    noteSettings: Note,
    noteAmount: number,
    beatIndex: number,
  ) {
    this._beatSound = observable(beatSound);
    this._noteSettings = observable(noteSettings);
    this._noteAmount = noteAmount;
    this._beatIndex = beatIndex;

    makeAutoObservable(this);
  }

  get beatIndex() {
    return this._beatIndex;
  }

  get beatSound() {
    return this._beatSound;
  }

  get noteSettings() {
    return this._noteSettings;
  }

  set noteSettings(value) {
    this._noteSettings = value;
  }

  get noteAmount() {
    return this._noteAmount;
  }

  set noteAmount(value) {
    this._noteAmount = value;
  }

  updateSoundSetting(key: string, value: string | number) {
    if (key === "soundType") {
      const newSoundIndex = DEFAULT_SOUNDS.findIndex(
        (sound) => sound.key === value,
      );
      this._beatSound.chooseAnotherSound(newSoundIndex);
    }
    this._beatSound.instrument.updateSoundSetting(key, Number(value));
  }
}
