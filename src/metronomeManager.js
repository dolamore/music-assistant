import {SoundManager} from "./soundManager.js";
import {buttons, defaultInitialBPM, elements, sounds} from "./vars.js";
import {BeatBarsManager} from "./beatBarsManager.js";
import {ElementsManager} from "./elementsManager.js";
import {ButtonsManager} from "./buttonsManager.js";
import * as Tone from 'https://cdn.skypack.dev/tone';
import {parseNoteSize} from "./utils.js";
import {TrainingModeManager} from "./trainingModeManager.js";

export class MetronomeManager {
    constructor() {
        this.bpm = defaultInitialBPM;
        this.isPlaying = false;
        this.loop = null;
        this.count = 0;
        this.loopCount = 0;
        this.currentNoteSizeIndex = 2;
        this.sequence = [];
        this.skipper = 0;
        this.currentStep = 0;
        this.isStartOfLoop = false;
        this.soundManager = new SoundManager();
        this.beatBarsManager = new BeatBarsManager(this);
        this.elementsManager = new ElementsManager(this);
        this.trainingModeManager = new TrainingModeManager();
    }

    getBeatBarsManager() {
        return this.beatBarsManager;
    }

    getElementsManager() {
        return this.elementsManager;
    }

    startMetronome() {
        this.isPlaying = true;

        Tone.Transport.bpm.value = this.bpm * 3;

        this.sequence = this.generateFixedMetronomeSequence();
        this.skipper = 0;

        // Создаем новый луп с нужными параметрами
        this.loop = new Tone.Loop((time) => this.getMetronomeLoopCallback(time), '64n');

        this.loop.start(0);

        Tone.Transport.start();
        buttons.startStopButton.textContent = 'Stop';
        this.elementsManager.movePendulum();
    }

    stopMetronome() {
        this.isPlaying = false;
        if (this.loop) this.loop.stop();
        Tone.Transport.stop();
        buttons.startStopButton.textContent = 'Start';

        this.elementsManager.resetPendulumAnimation();

        this.count = 0;
        this.loopCount = 0;
        elements.loopCounter.textContent = this.loopCount;
    }

    restartMetronomeAndPendulum() {
        this.stopMetronome();
        this.startMetronome();
    }

    generateFixedMetronomeSequence() {
        const beats = document.querySelectorAll('.beat-wrapper');
        let totalSteps = 0;

        beats.forEach((beatWrapper) => {
            const noteSize = parseNoteSize(beatWrapper.querySelector('.note-size-dropdown').value).number;
            const noteAmount = parseInt(beatWrapper.querySelector('.note-amount-dropdown').value, 10);

            totalSteps += 64 / noteSize * 3 * noteAmount;
        });

        const sequence = new Array(totalSteps).fill(null);
        let position = 0; // Current position pointer

        beats.forEach((beatWrapper, index) => {
            const parsedNote = parseNoteSize(beatWrapper.querySelector('.note-size-dropdown').value);
            const noteAmount = parseInt(beatWrapper.querySelector('.note-amount-dropdown').value, 10);
            const noteSize = parsedNote.number;
            const isTriplet = parsedNote.isTriplet;
            const stepSize = isTriplet ? (64 / noteSize) : (64 / noteSize * 3);
            const sound = sounds[this.soundManager.getSelectedSounds()[index]];
            const settings = this.soundManager.getSoundSettings()[index]; // Получаем актуальные настройки звука

            for (let i = 0; i < (isTriplet ? 3 * noteAmount : noteAmount); i++) {
                sequence[position] = {sound, settings, beatIndex: index};
                position += stepSize;
            }
        });

        return sequence;
    }

    getMetronomeLoopCallback(time) {
        this.currentStep = this.count % this.sequence.length;
        this.isStartOfLoop = this.currentStep === 0;

        if (this.trainingModeManager.getIsTrainingMode()) {
            if (this.isStartOfLoop && (this.trainingModeManager.getIsFirstLoop() || Math.random() < this.trainingModeManager.getLoopSkipProbability())) {
                this.skipper = this.sequence.length;
            }
        }

        if (this.skipper > 0) {
            this.skipper--;
            if (this.trainingModeManager.getIsFirstLoop()) {
                playMetronomeStep(sequence, currentStep, time);
            }
            if (this.skipper === 0) {
                trainingModeManager.setIsFirstLoop(false);
            }
        } else {
            this.playMetronomeStep(this.sequence, this.currentStep, time);
        }

        if (this.isStartOfLoop) {
            elements.loopCounter.textContent = this.loopCount++;
        }

        this.count++;
    }

    playMetronomeStep(sequence, currentStep, time) {
        const currentNote = sequence[currentStep];
        if (!currentNote || !currentNote.sound) return;
        if (!(this.trainingModeManager.getIsTrainingMode() && Math.random() < this.trainingModeManager.getNoteSkipProbability())) {
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
            const flashingBar = document.querySelector('.flashing-bar');
            flashingBar.style.opacity = 1;
            setTimeout(() => flashingBar.style.opacity = 0, 100);

            const beatElement = document.querySelector(`.beat[data-beat="${currentNote.beatIndex}"]`);
            beatElement.classList.add('playing');
            setTimeout(() => beatElement.classList.remove('playing'), 100);
        }
    }

    renderMetronomeElements() {
        this.soundManager.renderSoundElements();
        this.beatBarsManager.renderBeatBars();
        this.trainingModeManager.renderTrainingModeElements();
        this.elementsManager.renderElements();
    }
}