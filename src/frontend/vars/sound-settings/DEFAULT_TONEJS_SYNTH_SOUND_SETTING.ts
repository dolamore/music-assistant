import {SoundSetting} from "../../models/SoundSetting";

export const DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS: SoundSetting[] = [
    new SoundSetting('frequency', "Frequency", 440, 440, 0, 20000),
    new SoundSetting('detune', "Detune", 0, 0, -1200, 1200),
    new SoundSetting('phase', "Phase", 0, 0, 0, 360),
    new SoundSetting('volume', "Volume", 0, 0, -60, 0),
    new SoundSetting('attack', "Attack", 0.001, 0.001, 0.001, 10),
    new SoundSetting('decay', "Decay", 0.1, 0.1, 0.001, 10),
    new SoundSetting('sustain', "Sustain", 0, 0, 0, 1),
    new SoundSetting('release', "Release", 0.1, 0.1, 0.001, 10),
];