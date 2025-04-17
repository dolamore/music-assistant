import * as Tone from "tone";
import {Instrument, InstrumentType} from "./Instrument";

export class TonejsSynth extends Instrument implements InstrumentType {
    private _synth: Tone.Synth;

    constructor(soundSettings: any, oscillatorType: string | Tone.ToneOscillatorType) {
        super(soundSettings);
        const noSound = oscillatorType === "no-sound";
        this._synth = new Tone.Synth({
            oscillator: {
                type: (noSound ? 'sine' : oscillatorType) as Tone.ToneOscillatorType,
            } as Tone.SynthOptions["oscillator"],
            volume: noSound ? -Infinity : 0,
        }).toDestination();
    }

    updateInstrumentParameter(key: string, value: number | string): void {
        if (key === "oscillatorType") {
            if (value === "no-sound") {
                this._synth.volume.value = -Infinity;
            } else {
                this._synth.oscillator.type = value as Tone.ToneOscillatorType;
            }
            return;
        }

        const numValue = Number(value);

        switch (key) {
            case "frequency":
                this._synth.oscillator.frequency.value = numValue;
                break;
            case "detune":
                this._synth.oscillator.detune.value = numValue;
                break;
            case "phase":
                this._synth.oscillator.phase = numValue;
                break;
            case "volume":
                this._synth.volume.value = numValue;
                break;
            case "attack":
                this._synth.envelope.attack = numValue;
                break;
            case "decay":
                this._synth.envelope.decay = numValue;
                break;
            case "sustain":
                this._synth.envelope.sustain = numValue;
                break;
            case "release":
                this._synth.envelope.release = numValue;
                break;
        }
    }

    play(time: number): void {
        const volumeSetting = this._soundSettings.find(setting => setting.key === 'volume')?.value !== -Infinity;
        if (volumeSetting) {
            this._soundSettings.forEach(setting => {
                this.updateInstrumentParameter(setting.key, setting.value);
            });

            this._synth.triggerAttackRelease("C4", "64n", time);
        }
    }
}