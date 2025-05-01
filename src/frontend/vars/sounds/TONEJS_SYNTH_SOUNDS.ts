import {SoundObj} from "../../models/SoundObj";
import {TonejsSynth} from "../../models/Instruments/TonejsSynth";
import {DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS} from "../sound-settings/DEFAULT_TONEJS_SYNTH_SOUND_SETTING";

//TODO: проверить как можно получать их индексы автоматом
export const TONEJS_SYNTH_SOUNDS: SoundObj[] = [
    new SoundObj("no-sound", "No Sound", new TonejsSynth(DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS, 'no-sound'), 0),
    new SoundObj("sine", "Sine", new TonejsSynth(DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS, 'sine'), 1),
    new SoundObj("triangle", "Triangle", new TonejsSynth(DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS, 'triangle'), 2),
    new SoundObj("square", "Square", new TonejsSynth(DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS, 'square'), 3),
    new SoundObj("sawtooth", "Sawtooth", new TonejsSynth(DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS, 'sawtooth'), 4),
];