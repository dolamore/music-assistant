import * as Tone from 'tone';
import {AudioEngine} from "../AudioEngine";
import {MetronomeManager} from "../../managers/MetronomeManager";
import {action, computed, makeObservable, observable, override} from "mobx";
import {BPM_MAX_LIMIT, BPM_MIN_LIMIT} from "../../vars/vars";
import document from "react";

export class TonejsEngine extends AudioEngine {
    private _transport = Tone.getTransport();
    private _loop;
    private _beatSequence;
    private _count = 0;
    public _loopCount = 0;
    private _currentStep = 0;
    private _isStartOfLoop = false;
    private _skipper = 0;

    constructor(metronomeManager: MetronomeManager) {
        super(metronomeManager);
        this.generateBeatSequence();
        this._beatSequence = this.generateFixedMetronomeSequence();
        this._loop= new Tone.Loop(() => {
            this.getMetronomeLoopCallback();
        }, "64n");
        Tone.getTransport().bpm.value = Number(this._bpm) * 3;

        makeObservable(this, {
            _loopCount: observable,
            loopCount: computed,
            getMetronomeLoopCallback: action,
            stopPlaying: action,

            setBpm: override,
        });
    }

    get loopCount(): number {
        return this._loopCount;
    }

    setBpm(bpm: number): void {
        this._bpm = bpm;
        this._transport.bpm.value = bpm;
    }

    startPlaying(): void {
        this._count = 0;
        this._loopCount = 0;
        this._skipper = 0;

        this._transport.start();
        this._loop.start(0);
    }

    stopPlaying() {
        this._loop.stop();
        this._transport.stop();


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

    getMetronomeLoopCallback() {
        console.log("loop callback has started");
        this._currentStep = this._count % this._sequence.length;
        this._isStartOfLoop = this._currentStep === 0;

        //TODO: add training mode back
        // if (this.trainingModeManager.getIsTrainingMode()) {
        //     if (this._isStartOfLoop &&
        //         (this.trainingModeManager.getIsFirstLoop() || Math.random() < this.trainingModeManager.getLoopSkipProbability())) {
        //         this._skipper = this._sequence.length;
        //     }
        // }

        // if (this._skipper > 0) {
        //     this._skipper--;
        //     if (this.trainingModeManager.getIsFirstLoop()) {
        //         this.playMetronomeStep(this._sequence, this._currentStep, time);
        //     }
        //     if (this._skipper === 0) {
        //         this.trainingModeManager.setIsFirstLoop(false);
        //     }
        // } else {
        //     this.playMetronomeStep(this._sequence, this._currentStep, time);
        // }

        if (this._isStartOfLoop) {
            this._loopCount += 1;
        }

        this._count++;
    }

    playMetronomeStep(sequence, currentStep, time) {
        const currentNote = sequence[currentStep];
        if (!currentNote || !currentNote.sound) return;
        if (!(this.trainingModeManager.getIsTrainingMode() && Math.random() < this.trainingModeManager.getNoteSkipProbability() && !this.trainingModeManager.getIsFirstLoop())) {
            console.log("stepped here");
            const {sound, settings} = currentNote;


            // Динамически применяем все параметры из settings к sound
            for (const key in settings) {
                if (settings.hasOwnProperty(key)) {
                    if (key in sound) {
                        // Если параметр есть в объекте sound (например, volume)
                        sound[key].value = settings[key];
                    } else if (key in sound.oscillator) {
                        // Если параметр относится к осциллятору (например, frequency, detune, phase)
                        sound.oscillator[key] = settings[key];
                    } else if (key in sound.envelope) {
                        // Если параметр относится к огибающей (например, attack, decay, sustain, release)
                        sound.envelope[key] = settings[key];
                    } else if (key in sound.filter) {
                        // Если параметр относится к фильтру (например, filterFrequency, filterQ, filterType)
                        sound.filter[key] = settings[key];
                    }
                }
            }

            // Запускаем звук
            sound.triggerAttackRelease('C4', '64n', time);

            // Визуальные эффекты
            elements.flashingBar.style.opacity = 1;
            setTimeout(() => elements.flashingBar.style.opacity = 0, 100);

            const beatElement = document.querySelector(`.beat[data-beat="${currentNote.beatIndex}"]`);
            beatElement.classList.add('playing');
            setTimeout(() => beatElement.classList.remove('playing'), 100);
        }
    }

    generateFixedMetronomeSequence() {
        const {beats} = this.metronomeManager.beatBarsManager;
        let position = 0;
        let totalSteps = 0;
        let beatAmount = beats.length;


        for (let i = 0; i < beatAmount; i++) {
            const noteSize = beats[i].noteSettings.noteSize;
            const noteAmount = beats[i].noteAmount;

            totalSteps += 64 / noteSize * 3 * noteAmount;
        }

        const sequence = new Array(totalSteps).fill(null);

        for (let beatIndex = 0; beatIndex < beatAmount; beatIndex++) {
            const {noteSettings, noteAmount, beatSound, soundSettings} = beats[beatIndex];
            const {isTriplet, noteSize} = noteSettings;

            const stepSize = isTriplet ? (64 / noteSize) : (64 / noteSize * 3);


            for (let j = 0; j < (isTriplet ? 3 * noteAmount : noteAmount); j++) {
                sequence[position] = {beatSound, soundSettings, beatIndex};
                position += stepSize;
            }
        }

        return sequence;
    }

    updateMetronomeSequence() {
        this._beatSequence = this.generateFixedMetronomeSequence();
        this._loop.callback = (time) => this.getMetronomeLoopCallback(time);
    }

    handleBpmChange = (newBpm: any): void  => {
        if (/^0\d/.test(newBpm)) {
            newBpm = newBpm.replace(/^0+/, '');
        }

        if (isNaN(newBpm) || newBpm === '') {
            return;
        }
        if (this._bpm === newBpm) {
            return;
        }
        if (newBpm > BPM_MAX_LIMIT) {
            this.setBpm(BPM_MAX_LIMIT)
        } else if (newBpm < BPM_MIN_LIMIT) {
            this.setBpm(BPM_MIN_LIMIT);
        } else {
            this.setBpm(newBpm);
        }
        // if (this._loop) this._loop.stop();  // Останавливаем текущий цикл метронома
        // if (this.isPlaying) {
        //     // this.restartMetronomeAndPendulum();
        // }
    }

}
