import * as Tone from "tone";
import {Instrument, InstrumentType} from "./Instrument";

export class TonejsSynth extends Instrument implements InstrumentType {
    private _synth: Tone.Synth;

    constructor(soundSettings: any, oscillatorType: Tone.ToneOscillatorType) {
        super(soundSettings);
        this._synth = new Tone.Synth({
            oscillator: {
                type: oscillatorType
            } as Tone.SynthOptions["oscillator"],
        }).toDestination();
    }

    updateInstrumentParameter(key: string, value: any): void {
        switch (key) {
            case "frequency":
                this._synth.oscillator.frequency.value = value;
                console.log("we are here");
                console.log(this._synth.oscillator.frequency.value);
                break;
            case "detune":
                this._synth.oscillator.detune.value = value;
                break;
            case "phase":
                this._synth.oscillator.phase = value;
                break;
            case "volume":
                this._synth.volume.value = value;
                break;
            case "attack":
                this._synth.envelope.attack = value;
                break;
            case "decay":
                this._synth.envelope.decay = value;
                break;
            case "sustain":
                this._synth.envelope.sustain = value;
                break;
            case "release":
                this._synth.envelope.release = value;
                break;
            default:
                console.warn(`Параметр ${key} не поддерживается`);
        }
    }

    play(time: number): void {
        console.log("we are playing");
        console.log(this._synth.oscillator.frequency.value);
        this._soundSettings.forEach(setting => {
            this.updateInstrumentParameter(setting.key, setting.value);
        });

        this._synth.triggerAttackRelease("C4", "64n", time);
        console.log("we finished playing")
        console.log(this._synth.oscillator.frequency.value);
    }
}