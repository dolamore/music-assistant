import * as Tone from "tone";
import {Instrument, InstrumentType} from "./Instrument";

export class TonejsSynth extends Instrument implements InstrumentType {
    private _synth: Tone.Synth;

    constructor(oscillatorType: Tone.ToneOscillatorType) {
        super();
        this._synth = new Tone.Synth({
            oscillator: {
                type: oscillatorType
            } as Tone.SynthOptions["oscillator"],
        }).toDestination();

    }

    play(time: number): void {
        this._synth.triggerAttackRelease("C4", "64n", time);
    }
}