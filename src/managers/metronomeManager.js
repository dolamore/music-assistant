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
    isPlaying = false;
    loop = null;
    count = 0;
    _loopCount = 0;
    currentNoteSizeIndex = 2;
    sequence = [];
    skipper = 0;
    currentStep = 0;
    isStartOfLoop = false;
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

    // startMetronome() {
    //     this.isPlaying = true;
    //
    //     Tone.getTransport().bpm.value = this.bpm * 3;
    //
    //     this.sequence = this.generateFixedMetronomeSequence();
    //     this.skipper = 0;
    //
    //     // Создаем новый луп с нужными параметрами
    //     this.loop = new Tone.Loop((time) => this.getMetronomeLoopCallback(time), '64n');
    //
    //     this.loop.start(0);
    //
    //     Tone.getTransport().start(); //used to be trasnport
    //     //  buttons.startStopButton.textContent = 'Stop';
    //
    //     //TODO: move pendulum!
    //     //    this.elementsManager.movePendulum();
    // }

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

    restartMetronomeAndPendulum() {
        this.stopMetronome();
        this.startMetronome();
    }

    generateFixedMetronomeSequence() {
        let totalSteps = 0;


        for (let i = 0; i < this.beatBarsManager.beats.length; i++) {
            const noteSize = this.beatBarsManager.beats[i].noteSettings.noteSize;
            const noteAmount = this.beatBarsManager.beats[i].noteAmounts;

            totalSteps += 64 / noteSize * 3 * noteAmount;
        }

        const sequence = new Array(totalSteps).fill(null);
        let position = 0; // Current position pointer

        for (let beatIndex = 0; beatIndex < this.beatBarsManager.beats.length; beatIndex++) {
            const {isTriplet, noteSize} = this.beatBarsManager.beats[beatIndex].noteSettings;
            const noteAmount = this.beatBarsManager.beats[beatIndex].noteAmounts;
            const stepSize = isTriplet ? (64 / noteSize) : (64 / noteSize * 3);
            const sound = this.soundManager.selectedSounds[beatIndex];
            const settings = this.soundManager.soundSettings()[beatIndex]; // Получаем актуальные настройки звука

            for (let j = 0; j < (isTriplet ? 3 * noteAmount : noteAmount); j++) {
                sequence[position] = {sound, settings, beatIndex: beatIndex};
                position += stepSize;
            }
        }

        return sequence;
    }

    getMetronomeLoopCallback(time) {
        this.currentStep = this.count % this.sequence.length;
        this.isStartOfLoop = this.currentStep === 0;

        if (this.trainingModeManager.getIsTrainingMode()) {
            if (this.isStartOfLoop &&
                (this.trainingModeManager.getIsFirstLoop() || Math.random() < this.trainingModeManager.getLoopSkipProbability())) {
                this.skipper = this.sequence.length;
            }
        }

        if (this.skipper > 0) {
            this.skipper--;
            if (this.trainingModeManager.getIsFirstLoop()) {
                this.playMetronomeStep(this.sequence, this.currentStep, time);
            }
            if (this.skipper === 0) {
                this.trainingModeManager.setIsFirstLoop(false);
            }
        } else {
            this.playMetronomeStep(this.sequence, this.currentStep, time);
        }

        if (this.isStartOfLoop) {
            /* elements.loopCounter.textContent = this.loopCount += 1;
             */
        }

        this.count++;
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

    updateMetronomeSequence() {
        this.sequence = this.generateFixedMetronomeSequence();
        this.loop.callback = (time) => this.getMetronomeLoopCallback(time);
    }

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
        if (this.loop) this.loop.stop();  // Останавливаем текущий цикл метронома
        if (this.isPlaying) {
            this.restartMetronomeAndPendulum();
        }
    }

    checkBPMLimit() {
        this.bpmMinLimitReached = this.bpm <= BPM_MIN_LIMIT;
        this.bpmMaxLimitReached = this.bpm >= BPM_MAX_LIMIT;
    }

    restartIfPlaying() {
        if (this.isPlaying) {
            this.restartMetronomeAndPendulum();
        }
    }

    renderMetronomeElements() {
        this.soundManager.renderSoundElements();
        this.trainingModeManager.renderTrainingModeElements();
        this.elementsManager.renderElements();
    }
}