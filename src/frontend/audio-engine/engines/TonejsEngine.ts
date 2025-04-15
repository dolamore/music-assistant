import * as Tone from 'tone';
import {AudioEngine} from "../AudioEngine";
import {MetronomeManager} from "../../managers/MetronomeManager";
import {action} from "mobx";
import {Sequence} from "tone";

export class TonejsEngine extends AudioEngine {
    private _transport = Tone.getTransport();
    private _loop: Tone.Loop | null = null;
    private readonly _sequence: Sequence<any>;
    private _beatSequence: any[] = [];

    constructor(metronomeManager: MetronomeManager) {
        super(metronomeManager);
        this.generateBeatSequence();
        this._sequence = new Tone.Sequence((time, beat) => {
            this.playStep(time, beat);
        }, this._beatSequence, "4n");
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

    playStep(time : any, beat : any) : void {
        const {beatSound, soundSettings} = beat;
        const { sound } = beatSound;

        const soundParams = {
            sound: sound,
            oscillator: sound.oscillator,
            envelope: sound.envelope,
            filter: sound.filter
        };

        // for (const [param, target] of Object.entries(soundParams)) {
        //     if (param in settings) {
        //         target[param] = settings[param];
        //     }
        // }

        sound.triggerAttackRelease('C4', '64n', time);
    }

    generateBeatSequence() {
        for (const beat of this._metronomeManager._beatBarsManager.beats) {
            for (let i = 0; i < beat.noteAmount; i++) {
                if (beat.noteSettings.isTriplet) {
                    this._beatSequence.push(Array(beat.noteAmount * 3).fill(beat));
                } else {
                    this._beatSequence.push(beat);
                }
            }
        }
    }

}
