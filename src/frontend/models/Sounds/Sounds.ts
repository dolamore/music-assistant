import {SoundObj} from "../SoundObj";

export abstract class Sounds {
    private readonly _sounds: SoundObj[] = [];

    protected constructor(sounds: SoundObj[]) {
        this._sounds = sounds;
    }

    get sounds(): SoundObj[] {
        return this._sounds;
    }
}