import {makeAutoObservable, observable} from "mobx";

export default class Beat {
    constructor(beatSound, noteSettings, noteAmount, soundSettings, beatIndex) {
        this._beatSound = observable(beatSound);
        this._noteSettings = observable(noteSettings);
        this._noteAmount = noteAmount;
        this._soundSettings = observable(soundSettings);
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
        return this._soundSettings;
    }

    set soundSettings(value) {
        this._soundSettings = value;
    }

    updateSoundSetting(key, value) {
        const setting = this._soundSettings.find(s => s.key === key);
        if (setting) setting.value = value;
    }
}