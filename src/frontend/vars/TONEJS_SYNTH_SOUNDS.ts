import {SoundObj} from "../models/SoundObj";
import {TonejsSynthSound} from "../models/Sound/TonejsSynthSound";

export const TONEJS_SYNTH_SOUNDS: SoundObj[] = [
    new SoundObj("no-sound", "No Sound", null),
    new SoundObj("sine", "Sine", new TonejsSynthSound('sine')),
    new SoundObj("triangle", "Triangle", new TonejsSynthSound('triangle')),
    new SoundObj("square", "Square", new TonejsSynthSound('square')),
    new SoundObj("sawtooth", "Sawtooth", new TonejsSynthSound('sawtooth')),
];