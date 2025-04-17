import {observable} from "mobx";
import {cloneDeep} from "lodash";
import {SoundSetting} from "../SoundSetting";
import {Time} from "tone/build/esm/core/type/Units";

export abstract class Instrument {
    protected _soundSettings: SoundSetting[] = [];

    abstract play(time: number): void;

    abstract updateInstrumentParameter(key: string, value: number | string | Time): void;

    protected constructor(soundSettings: any) {
        // this._soundSettings = observable(soundSettings);
        this._soundSettings = observable(cloneDeep(soundSettings));

    }

    get soundSettings(): { key: string; value: number | string | Time }[] {
        return this._soundSettings;
    }

    set soundSettings(value: SoundSetting[]) {
        this._soundSettings = value;
    }

    getSoundSetting(key: string): number | string | Time | undefined {
        return this._soundSettings.find(s => s.key === key)?.value;
    }

    updateSoundSetting(key: string, value: number | string | Time): void {
        const setting = this._soundSettings.find(s => s.key === key);
        if (setting) {
            setting.value = value;
        }
    }
}

export type InstrumentType = {
    get soundSettings(): { key: string; value: string | number | Time}[];
    play: (time: number) => void;
    updateInstrumentParameter(key: string, value: string | number | Time): void;
};