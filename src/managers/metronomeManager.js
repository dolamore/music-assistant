import {makeAutoObservable} from "mobx";
import {SoundManager} from "./soundManager.js";
import {
    BPM_MAX_LIMIT,
    BPM_MIN_LIMIT,
    DEFAULT_INITIAL_BPM,
} from "../vars.js";
import {BeatBarsManager} from "./beatBarsManager.js";
import {ElementsManager} from "./elementsManager.js";
import * as Tone from "tone";
import {TrainingModeManager} from "./trainingModeManager.js";
import {VisualEffectsManager} from "./visualEffectsManager.js";
import document from "react";


export class MetronomeManager {
    _bpm = DEFAULT_INITIAL_BPM;
    _isPlaying = false;
    _loop = null;
    _count = 0;
    _loopCount = 0;
    currentNoteSizeIndex = 2;
    _sequence = [];
    _skipper = 0;
    _currentStep = 0;
    _isStartOfLoop = false;
    _bpmMaxLimitReached = false;
    _bpmMinLimitReached = false;

    constructor() {
        this._soundManager = new SoundManager(this);
        this._beatBarsManager = new BeatBarsManager(this);
        this._elementsManager = new ElementsManager(this);
        this.trainingModeManager = new TrainingModeManager();
        this.visualEffectsManager = new VisualEffectsManager();
        makeAutoObservable(this)

    }

    get isPlaying() {
        return this._isPlaying;
    }

    set isPlaying(value) {
        this._isPlaying = value;
    }

    get loopCount() {
        return this._loopCount;
    }

    set loopCount(value) {
        this._loopCount = value;
    }

    get bpmMaxLimitReached() {
        return this._bpmMaxLimitReached;
    }

    set bpmMaxLimitReached(value) {
        this._bpmMaxLimitReached = value;
    }

    get bpmMinLimitReached() {
        return this._bpmMinLimitReached;
    }

    set bpmMinLimitReached(value) {
        this._bpmMinLimitReached = value
    }

    get bpm() {
        return this._bpm;
    }

    set bpm(value) {
        this._bpm = value;
    }

    get beatBarsManager() {
        return this._beatBarsManager;
    }

    get elementsManager() {
        return this._elementsManager;
    }

    get soundManager() {
        return this._soundManager;
    }

    startMetronome() {
        this._isPlaying = true;

        Tone.getTransport().bpm.value = this.bpm * 3;

        this._sequence = this.generateFixedMetronomeSequence();
        this._skipper = 0;
        // Создаем новый луп с нужными параметрами
        this._loop = new Tone.Loop((time) => this.getMetronomeLoopCallback(time), '64n');

        this._loop.start(0);

        Tone.getTransport().start(); //used to be trasnport

        //TODO: move pendulum!
        //    this.elementsManager.movePendulum();
    }

    getMetronomeLoopCallback(time) {
        this._currentStep = this._count % this._sequence.length;
        this._isStartOfLoop = this._currentStep === 0;

        //TODO: add training mode back
        // if (this.trainingModeManager.getIsTrainingMode()) {
        //     if (this._isStartOfLoop &&
        //         (this.trainingModeManager.getIsFirstLoop() || Math.random() < this.trainingModeManager.getLoopSkipProbability())) {
        //         this._skipper = this._sequence.length;
        //     }
        // }

        if (this._skipper > 0) {
            this._skipper--;
            if (this.trainingModeManager.getIsFirstLoop()) {
                this.playMetronomeStep(this._sequence, this._currentStep, time);
            }
            if (this._skipper === 0) {
                this.trainingModeManager.setIsFirstLoop(false);
            }
        } else {
            this.playMetronomeStep(this._sequence, this._currentStep, time);
        }

        if (this._isStartOfLoop) {
             this._loopCount += 1;
        }

        this._count++;
    }

    playMetronomeStep(sequence, currentStep, time) {
        const currentNote = sequence[currentStep];
        if (!currentNote || !currentNote.sound) return;
        if (!(this.trainingModeManager.getIsTrainingMode() && Math.random() < this.trainingModeManager.getNoteSkipProbability() && !this.trainingModeManager.getIsFirstLoop())) {
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
        let position = 0;
        let totalSteps = 0;
        let beatAmount = this.beatBarsManager.beats.length;


        for (let i = 0; i < beatAmount; i++) {
            const noteSize = this.beatBarsManager.beats[i].noteSettings.noteSize;
            const noteAmount = this.beatBarsManager.beats[i].noteAmount;

            totalSteps += 64 / noteSize * 3 * noteAmount;
        }

        const sequence = new Array(totalSteps).fill(null);

        for (let beatIndex = 0; beatIndex < beatAmount; beatIndex++) {
            const {noteSettings, noteAmount, sound, soundSettings} = this.beatBarsManager.beats[beatIndex];
            const {isTriplet, noteSize} = noteSettings;

            const stepSize = isTriplet ? (64 / noteSize) : (64 / noteSize * 3);


            for (let j = 0; j < (isTriplet ? 3 * noteAmount : noteAmount); j++) {
                sequence[position] = {sound, soundSettings, beatIndex: beatIndex};
                position += stepSize;
            }
        }

        return sequence;
    }

    updateMetronomeSequence() {
        this._sequence = this.generateFixedMetronomeSequence();
        this._loop.callback = (time) => this.getMetronomeLoopCallback(time);
    }


    // stopMetronome() {
    //     this.isPlaying = false;
    //     if (this.loop) this.loop.stop();
    //     Tone.getTransport().stop(); //Tone.Transport.stop(); used to be here!!!!
    //     buttons.startStopButton.textContent = 'Start';
    //
    //     this.elementsManager.resetPendulumAnimation();
    //
    //     this.count = 0;
    //     this.loopCount = 0;
    //     //elements.loopCounter.textContent = this.loopCount;
    // }


    //TODO: вернуться к оптимизации этого
    handleBpmChange(newBpm) {
        if (/^0\d/.test(newBpm)) {
            newBpm = newBpm.replace(/^0+/, '');
        }

        if (isNaN(newBpm) || newBpm === '') {
            return;
        }
        if (this.bpm === newBpm) {
            return;
        }
        if (newBpm > BPM_MAX_LIMIT) {
            this.bpm = BPM_MAX_LIMIT;
        } else if (newBpm < BPM_MIN_LIMIT) {
            this.bpm = BPM_MIN_LIMIT;
        } else {
            this.bpm = newBpm;
        }
        this.checkBPMLimit();
        if (this._loop) this._loop.stop();  // Останавливаем текущий цикл метронома
        if (this.isPlaying) {
            this.restartMetronomeAndPendulum();
        }
    }

    checkBPMLimit() {
        this.bpmMinLimitReached = this.bpm <= BPM_MIN_LIMIT;
        this.bpmMaxLimitReached = this.bpm >= BPM_MAX_LIMIT;
    }

    // restartMetronomeAndPendulum() {
    //     this.stopMetronome();
    //     this.startMetronome();
    // }

    // restartIfPlaying() {
    //     if (this.isPlaying) {
    //         this.restartMetronomeAndPendulum();
    //     }
    // }
}