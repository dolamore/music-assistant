import {SoundObj} from "../../models/SoundObj";
import {TonejsSynth} from "../../models/Instruments/TonejsSynth";
import {DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS} from "../sound-settings/DEFAULT_TONEJS_SYNTH_SOUND_SETTING";

export const TONEJS_SYNTH_SOUNDS: SoundObj[] = [
    new SoundObj("no-sound", "No Sound", new TonejsSynth(DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS, 'no-sound')),
    new SoundObj("sine", "Sine", new TonejsSynth(DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS, 'sine')),
    new SoundObj("triangle", "Triangle", new TonejsSynth(DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS, 'triangle')),
    new SoundObj("square", "Square", new TonejsSynth(DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS, 'square')),
    new SoundObj("sawtooth", "Sawtooth", new TonejsSynth(DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS, 'sawtooth')),
];