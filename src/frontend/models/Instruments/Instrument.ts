import {observable} from "mobx";

export abstract class Instrument {
    private _soundSettings: { key: string; value: any }[] = [];
    abstract play(time: number): void;
    abstract updateInstrumentParameter(key: string, value: any): void;

    protected constructor(soundSettings: any) {
        this._soundSettings = observable(soundSettings);
    }

    get soundSettings(): { key: string; value: any }[] {
        return this._soundSettings;
    }

    set soundSettings(value: { key: string; value: any }[]) {
        this._soundSettings = value;
    }

    getSoundSetting(key: string): [] {
        return this._soundSettings.find(s => s.key === key)?.value;
    }

    updateSoundSetting(key: string, value: any): void {
        const setting = this._soundSettings.find(s => s.key === key);
        if (setting) {
            setting.value = value;
        } else {
            this._soundSettings.push({ key, value });
        }
    }
}

export type InstrumentType = {
    get soundSettings(): { key: string; value: any }[];
    play: (time: number) => void;
    updateInstrumentParameter(key: string, value: any): void;
};