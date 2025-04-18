import * as Tone from "tone";
import {Instrument, InstrumentType} from "./Instrument";
import {ToneOscillatorType} from "tone";

export class TonejsSynth extends Instrument implements InstrumentType {
    private _synth: Tone.Synth;
    private _oscillatorType: string | ToneOscillatorType;

    constructor(soundSettings: any, oscillatorType: string | Tone.ToneOscillatorType) {
        super(soundSettings);
        this._oscillatorType = oscillatorType;
        const noSound = oscillatorType === "no-sound";
        this._synth = new Tone.Synth({
            oscillator: {
                type: (noSound ? 'sine' : oscillatorType) as Tone.ToneOscillatorType,
            } as Tone.SynthOptions["oscillator"],
            volume: noSound ? -Infinity : 0,
        }).toDestination();
    }


    get soundType(): string {
        return this._oscillatorType as string;
    }

    updateOscillatorType(): void {
        if (this._oscillatorType === "no-sound") {
            this._synth.volume.value = -Infinity;
        } else {
            this._synth.oscillator.type = this._oscillatorType as Tone.ToneOscillatorType;
        }
    }

    updateInstrumentParameter(key: string, value: number | string): void {
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

    updateSoundSetting(key: string, value: number | string) {
        if (key === "oscillatorType") {
            console.log("Oscillator type changed to: " + value);
            this._oscillatorType = value as string;
        } else {
            super.updateSoundSetting(key, value);
        }
    }

    play(time: number): void {
        const volumeSetting = this._soundSettings.find(setting => setting.key === 'volume')?.value !== -Infinity;
        if (volumeSetting) {
            this._soundSettings.forEach(setting => {
                this.updateInstrumentParameter(setting.key, setting.value);
            });
            this.updateOscillatorType();

            this._synth.triggerAttackRelease("C4", "64n", time);
        }
    }
}