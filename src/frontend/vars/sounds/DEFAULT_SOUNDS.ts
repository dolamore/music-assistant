import {SoundObj} from "../../models/SoundObj";
import {TONEJS_SYNTH_SOUNDS} from "./TONEJS_SYNTH_SOUNDS";
import {TonejsSynth} from "../../models/Instruments/TonejsSynth";
import {DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS} from "../sound-settings/DEFAULT_TONEJS_SYNTH_SOUND_SETTING";

export const DEFAULT_SOUNDS: SoundObj[] = TONEJS_SYNTH_SOUNDS;

export function createDefaultSoundObject(): SoundObj {
    return new SoundObj("sine", "Sine", new TonejsSynth(DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS, 'sine'));
}