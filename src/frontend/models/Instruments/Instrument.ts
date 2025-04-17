import {observable} from "mobx";
import {cloneDeep} from "lodash";
import {SoundSetting} from "../SoundSetting";

export abstract class Instrument {
    protected _soundSettings: SoundSetting[] = [];

    abstract play(time: number): void;

    abstract updateInstrumentParameter(key: string, value: any): void;

    protected constructor(soundSettings: any) {
        // this._soundSettings = observable(soundSettings);
        this._soundSettings = observable(cloneDeep(soundSettings));

    }

    get soundSettings(): { key: string; value: number | string }[] {
        return this._soundSettings;
    }

    set soundSettings(value: SoundSetting[]) {
        this._soundSettings = value;
    }

    getSoundSetting(key: string): number | string | undefined {
        return this._soundSettings.find(s => s.key === key)?.value;
    }

    updateSoundSetting(key: string, value: number | string): void {
        const setting = this._soundSettings.find(s => s.key === key);
        if (setting) {
            setting.value = value;
        }
    }
}

export type InstrumentType = {
    get soundSettings(): { key: string; value: string | number}[];
    play: (time: number) => void;
    updateInstrumentParameter(key: string, value: any): void;
};