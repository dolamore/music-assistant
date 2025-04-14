import * as Tone from 'tone';
import {AudioEngine} from "../AudioEngine";
import {MetronomeManager} from "../../managers/MetronomeManager";
import {makeAutoObservable, makeObservable} from "mobx";

export class TonejsEngine extends AudioEngine {
    public transport = Tone.getTransport();
    public _loop: Tone.Loop | null = null;
    public _sequence: any[] = [];

    constructor(metronomeManager: MetronomeManager) {
        super(metronomeManager);
        makeObservable(this, {
            _loop: true,
            _sequence: true,
            transport: true,
        });
    }


    get sequence(): any[] {
        return this._sequence;
    }

    setupAudioContextUnlocker(): void {
    const unlockAudioContext = async () => {
        await Tone.start();
        await Tone.getContext().resume();

        // Delete the unlock function after the first call
        window.removeEventListener("click", unlockAudioContext);
        window.removeEventListener("keydown", unlockAudioContext);
    };

    // Add event listeners to unlock the audio context
    window.addEventListener("click", unlockAudioContext);
    window.addEventListener("keydown", unlockAudioContext);
    }

    playNote(note: string, duration: string, time: number): void {
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease(note, duration, time);
    }

    setBpm(bpm: number): void {
        this.transport.bpm.value = bpm * 3; // Умножаем на 3, как указано в вашем коде
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
            this.setBpm(300);
        } else if (newBpm < 40) {
            this.setBpm(40);
        } else {
            this.setBpm(newBpm);
        }
    }
}
