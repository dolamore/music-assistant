import * as Tone from 'tone';
import {AudioEngine} from "../AudioEngine";
import {MetronomeManager} from "../../managers/MetronomeManager";
import {action, computed, makeObservable, observable, override} from "mobx";
import {BPM_MAX_LIMIT, BPM_MIN_LIMIT} from "../../vars/vars";
import {uiState} from "../../states/UIState";
import Beat from "../../models/Beat";

export class TonejsEngine extends AudioEngine {
    private _transport = Tone.getTransport();
    private _loop: Tone.Loop;
    private _beatSequence: Beat[] = [];
    private _count: number = 0;
    public _loopCount: number = 0;
    private _currentStep: number = 0;
    private _isStartOfLoop: boolean = false;
    private _isFirstLoop: boolean = true;
    private _skipper: number = 0;
    private _totalSteps = 0;

    constructor(metronomeManager: MetronomeManager) {
        super(metronomeManager);
        this._beatSequence = this.generateFixedMetronomeSequence();
        this._loop = new Tone.Loop((time) => {
            this.getMetronomeLoopCallback(time);
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

    get beatSequence(): Beat[] {
        return this._beatSequence;
    }

    get loopCount(): number {
        return this._loopCount;
    }

    setBpm(bpm: number): void {
        this._bpm = bpm;
        this._transport.bpm.value = bpm * 3;
    }

    startPlaying(): void {
        this._count = 0;
        this._loopCount = 0;
        this._skipper = 0;
        this._isFirstLoop = true;

        this._transport.start();
        this._loop.start(0);
    }

    stopPlaying() {
        this._loop.stop();
        this._transport.stop();


    }

    getMetronomeLoopCallback(time: number): void {
        this._currentStep = this._count % this._beatSequence.length;
        this._isStartOfLoop = this._currentStep === 0;

        const progress = this._currentStep / this._totalSteps;
        uiState.updatePendulum(progress);


        this.playMetronomeStep(time);
        // TODO: add training mode back
        // if (this.trainingModeManager.getIsTrainingMode()) {
        //     if (this._isStartOfLoop &&
        //         (this.trainingModeManager.getIsFirstLoop() || Math.random() < this.trainingModeManager.getLoopSkipProbability())) {
        //         this._skipper = this._sequence.length;
        //     }
        // }
        //
        // if (this._skipper > 0) {
        //     this._skipper--;
        //     if (this.trainingModeManager.getIsFirstLoop()) {
        //         this.playMetronomeStep();
        //     }
        //     if (this._skipper === 0) {
        //         this.trainingModeManager.setIsFirstLoop(false);
        //     }
        // } else {
        //     this.playMetronomeStep();
        // }

        if (this._currentStep === 0) {
            if (this._count !== 0) {
                this._isFirstLoop = false;
                this._loopCount += 1;
            }
        }

        this._count++;
    }

    playMetronomeStep(time: number) {
        const currentNote = this._beatSequence[this._currentStep];
        if (!currentNote || !currentNote.beatSound) return;
        if (!(this._trainingModeManager.getIsTrainingMode() && Math.random() < this._trainingModeManager.getNoteSkipProbability() && !this._trainingModeManager.getIsFirstLoop())) {
            const {beatSound: {instrument}, beatIndex} = currentNote;
            instrument.play(time);
            uiState.flashBar();
            uiState.playBeat(beatIndex);
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
            const {noteSettings, noteAmount} = beats[beatIndex];
            const {isTriplet, noteSize} = noteSettings;

            const stepSize = isTriplet ? (64 / noteSize) : (64 / noteSize * 3);


            for (let j = 0; j < (isTriplet ? 3 * noteAmount : noteAmount); j++) {
                sequence[position] = beats[beatIndex];
                position += stepSize;
            }
        }

        this._totalSteps = totalSteps;

        return sequence;
    }

    updateBeatSequence() {
        this._beatSequence = this.generateFixedMetronomeSequence();
    }

    handleBpmChange = (newBpm: any): void => {
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
    }

}