import {action, computed, makeObservable, observable} from "mobx";
import {cloneDeep} from "lodash";
import {SoundSetting} from "../SoundSetting";
import {DEFAULT_SOUND_SETTINGS} from "../../vars/sound-settings/DEFAULT_SOUND_SETTINGS";

export abstract class Instrument {
    public _soundSettings: SoundSetting[] = [];

    abstract play(time: number): void;

    abstract updateInstrumentParameter(key: string, value: any): void;

    protected constructor(soundSettings: any) {
        this._soundSettings = cloneDeep(soundSettings);

        makeObservable(this, {
            _soundSettings: observable,
            soundSettings: computed,
            updateSoundSetting: action
        });
    }

    get soundSettings(): SoundSetting[] {
        return this._soundSettings;
    }

    set soundSettings(value: SoundSetting[]) {
        this._soundSettings = value;
    }

    updateSoundSetting(key: string, value: number | string): void {
        const setting = this._soundSettings.find(s => s.key === key);
        if (setting) {
            setting.value = value;
        }
    }
}

export type InstrumentType = {
    get soundSettings(): SoundSetting[];
    play: (time: number) => void;
    updateSoundSetting(key: string, value: string | number): void;
};