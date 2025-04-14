import * as Tone from 'tone';
import {AudioEngine} from "../AudioEngine";
import {MetronomeManager} from "../../managers/MetronomeManager";

export class TonejsEngine extends AudioEngine {
    public transport = Tone.getTransport();
    public _loop: Tone.Loop | null = null;
    public _sequence: any[] = [];

    constructor(metronomeManager: MetronomeManager) {
        super(metronomeManager);
    }


    get sequence(): any[] {
        return this._sequence;
    }

    setTransportBpm(bpm: number): void {
        this._bpm = bpm;
        this.transport.bpm.value = bpm;
    }

    generateSequence(): any[] {
        // Реализуйте логику для генерации последовательности
        // Здесь можно использовать ваш метод generateFixedMetronomeSequence
        return [];
    }

    updateSequence(): void {
        this._sequence = [];
    }

    handleBpmChange(newBpm: any): void {
        if (/^0\d/.test(newBpm)) {
            newBpm = newBpm.replace(/^0+/, '');
        }

        if (isNaN(newBpm) || newBpm === '') {
            return;
        }

        if (newBpm > 300) {
            this.setTransportBpm(300);
        } else if (newBpm < 40) {
            this.setTransportBpm(40);
        } else {
            this.setTransportBpm(newBpm);
        }
    }
}
