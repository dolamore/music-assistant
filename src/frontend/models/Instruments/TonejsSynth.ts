import * as Tone from "tone";
import { Instrument } from "./Instrument";
import { ToneOscillatorType } from "tone";
import { computed, makeObservable, observable, override } from "mobx";
import { SoundSetting } from "../SoundSetting";

export class TonejsSynth extends Instrument {
  private _synth: Tone.Synth;
  public _oscillatorType: string | ToneOscillatorType;

  constructor(
    soundSettings: SoundSetting[],
    oscillatorType: string | Tone.ToneOscillatorType,
  ) {
    super(soundSettings);
    this._oscillatorType = oscillatorType;
    const noSound = oscillatorType === "no-sound";
    this._synth = new Tone.Synth({
      oscillator: {
        type: (noSound ? "sine" : oscillatorType) as Tone.ToneOscillatorType,
      } as Tone.SynthOptions["oscillator"],
    }).toDestination();

    makeObservable(this, {
      _oscillatorType: observable,
      soundType: computed,
      updateSoundSetting: override,
    });
  }

  get soundType(): string {
    return this._oscillatorType as string;
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

  updateSoundSetting(key: string, value: number | string): void {
    if (key === "soundType") {
      this._oscillatorType = value as string;
    } else {
      super.updateSoundSetting(key, value);
    }
  }

  play(time: number): void {
    if (this._oscillatorType !== "no-sound") {
      this._soundSettings.forEach((setting) => {
        this.updateInstrumentParameter(setting.key, setting.value);
      });
      this._synth.oscillator.type = this
        ._oscillatorType as Tone.ToneOscillatorType;
      this._synth.triggerAttack("C4", time);
    }
  }
}
