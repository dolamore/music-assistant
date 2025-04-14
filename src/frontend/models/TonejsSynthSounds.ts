import {Sounds} from "./Sounds";
import {TonejsSound} from "./TonejsSound";
import * as Tone from "tone";
import {SOUNDS} from "../vars/Sounds";

export class TonejsSynthSounds extends Sounds {
    constructor() {
        super(SOUNDS);
    }

    initSounds(): void {
        this._sounds.forEach(soundObj => {
            if (soundObj.key !== 'no-sound') {
                soundObj.sound = new TonejsSound(soundObj.key as Tone.ToneOscillatorType);
            }
        });
    }
}