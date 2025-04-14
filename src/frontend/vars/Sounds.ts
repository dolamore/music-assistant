import {SoundObj} from "../models/SoundObj";
import {TonejsSound} from "../models/TonejsSound";

export const SOUNDS: SoundObj[] = [
    {key: "no-sound", sound: null, label: "No sound"},
    {key: "sine", sound: new TonejsSound("sine"), label: "Sine"},
    {key: "triangle", sound: new TonejsSound("triangle"), label: "Triangle"},
    {key: "square", sound: new TonejsSound("square"), label: "Square"},
    {key: "sawtooth", sound: new TonejsSound("sawtooth"), label: "Sawtooth"}
];