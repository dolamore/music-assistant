import * as Tone from "tone";
import {Time} from "tone/build/esm/core/type/Units";
import {Sound, SoundType} from "./Sound";

export class TonejsSynthSound extends Sound implements SoundType {
    private _synth: Tone.Synth;

    constructor(oscillatorType: Tone.ToneOscillatorType) {
        super();
        this._synth = new Tone.Synth({
            oscillator: {
                type: oscillatorType
            } as Tone.SynthOptions["oscillator"],
        }).toDestination();

    }

    play(time: Time): void {
        this._synth.triggerAttackRelease("C4", "64n", time);
    }
}