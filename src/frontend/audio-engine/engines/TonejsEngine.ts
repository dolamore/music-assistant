import * as Tone from 'tone';
import {AudioEngine} from "../AudioEngine";
import {MetronomeManager} from "../../managers/MetronomeManager";
import {action} from "mobx";
import {Sequence} from "tone";

export class TonejsEngine extends AudioEngine {
    private _transport = Tone.getTransport();
    private _loop: Tone.Loop | null = null;
    private readonly _sequence: Sequence<any>;

    constructor(metronomeManager: MetronomeManager) {
        super(metronomeManager);
        this._sequence = new Tone.Sequence((time, beat) => {
            this._metronomeManager.playStep(time, beat);
        }, this._metronomeManager._beatBarsManager.beatSequence, "4n");
    }


    get sequence(): Sequence<any> {
        return this._sequence;
    }

    @action
    setBpm(bpm: number): void {
        this._bpm = bpm;
        this._transport.bpm.value = bpm;
    }

    generateSequence(): any[] {
        // Реализуйте логику для генерации последовательности
        // Здесь можно использовать ваш метод generateFixedMetronomeSequence
        return [];
    }

    handleBpmChange(newBpm: any): void {
        if (/^0\d/.test(newBpm)) {
            newBpm = newBpm.replace(/^0+/, '');
        }

        if (isNaN(newBpm) || newBpm === '') {
            return;
        }

        if (newBpm > 300) {
            this.setBpm(300);
        } else if (newBpm < 40) {
            this.setBpm(40);
        } else {
            this.setBpm(newBpm);
        }
    }

    startPlaying(): void {
        this._transport.start();
        this._sequence.start(0);
    }
}
