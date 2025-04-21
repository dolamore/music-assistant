import {makeAutoObservable, observable} from "mobx";
import {SoundObj} from "./SoundObj";
import {DEFAULT_SOUNDS} from "../vars/sounds/DEFAULT_SOUNDS";

export default class Beat {
    private _beatSound: SoundObj;
    private _noteSettings: any;
    private _noteAmount: number;
    private readonly _beatIndex: number;

    constructor(beatSound: SoundObj, noteSettings: any, noteAmount: number, beatIndex: number) {
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

    set beatSound(value) {
        this._beatSound = value;
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

    get soundSettings() {
        return this._beatSound.instrument.soundSettings;
    }

    updateSoundSetting(key: string, value: string | number) {
        if (key === "soundType") {
            const newSoundIndex = DEFAULT_SOUNDS.findIndex(sound => sound.key === value);
            this._beatSound.chooseNextSound(newSoundIndex)
        }
        this._beatSound.instrument.updateSoundSetting(key, value);
    }
}