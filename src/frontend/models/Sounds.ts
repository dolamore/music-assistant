import {SoundObj} from "./SoundObj";

export abstract class Sounds {
    protected _sounds: SoundObj[];

    protected constructor(private sounds: SoundObj[]) {
        this._sounds = sounds;
        this.initSounds();
    }

    abstract initSounds(): void;

    getSounds(): SoundObj[] {
        return this._sounds;
    }
}