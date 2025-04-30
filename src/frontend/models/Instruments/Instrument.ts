import {action, computed, makeObservable, observable} from "mobx";
import {cloneDeep} from "lodash";
import {SoundSetting} from "../SoundSetting";
import {handleVariableChange} from "../../utils/utils";

export abstract class Instrument {
    public _soundSettings: SoundSetting[] = [];

    abstract play(time: number): void;

    abstract get soundType(): string;
    abstract set soundType(value: string);

    abstract updateInstrumentParameter(key: string, value: any): void;

    protected constructor(soundSettings: SoundSetting[]) {
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
        handleVariableChange(value, setting, setting?.minValue, setting?.maxValue, (value: number) => setting?.setValue(value));
    }
}