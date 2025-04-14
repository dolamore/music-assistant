import {SoundObj} from "../models/SoundObj";
import {TonejsSynth} from "../models/SoundModels/TonejsSynth";

export const TONEJS_SYNTH_SOUNDS: SoundObj[] = [
    new SoundObj("no-sound", "No Sound", null),
    new SoundObj("sine", "Sine", new TonejsSynth('sine')),
    new SoundObj("triangle", "Triangle", new TonejsSynth('triangle')),
    new SoundObj("square", "Square", new TonejsSynth('square')),
    new SoundObj("sawtooth", "Sawtooth", new TonejsSynth('sawtooth')),
];