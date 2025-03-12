import {SoundManager} from "./soundManager.js";
import {buttons, defaultInitialBPM, Elements, elements, sounds} from "../vars.js";
import {BeatBarsManager} from "./beatBarsManager.js";
import {ElementsManager} from "./elementsManager.js";
import * as Tone from "tone";
import {parseNoteSize} from "../utils.js";
import {TrainingModeManager} from "./trainingModeManager.js";

export class MetronomeManager {
    constructor() {
        this._bpm = defaultInitialBPM;
        this.isPlaying = false;
        this.loop = null;
        this.count = 0;
        this.loopCount = 0;
        this.currentNoteSizeIndex = 2;
        this.sequence = [];
        this.skipper = 0;
        this.currentStep = 0;
        this.isStartOfLoop = false;
        this.soundManager = new SoundManager(this);
        this.beatBarsManager = new BeatBarsManager(this);
        this.elementsManager = new ElementsManager(this);
        this.trainingModeManager = new TrainingModeManager();
        this._bpmMaxLimitReached = false;
        this._bpmMinLimitReached = false;
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
        let totalSteps = 0;

        Elements.beatRows.forEach((beatRow) => {
            const noteSize = parseNoteSize(beatRow.querySelector('.note-size-dropdown').value).number;
            const noteAmount = parseInt(beatRow.querySelector('.note-amount-dropdown').value, 10);

            totalSteps += 64 / noteSize * 3 * noteAmount;
        });

        const sequence = new Array(totalSteps).fill(null);
        let position = 0; // Current position pointer

        Elements.beatRows.forEach((beatRow, index) => {
            const parsedNote = parseNoteSize(beatRow.querySelector('.note-size-dropdown').value);
            const noteAmount = parseInt(beatRow.querySelector('.note-amount-dropdown').value, 10);
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
            elements.loopCounter.textContent = this.loopCount++;
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

    handleBpmChange(newBpm, setBpm) {
        if (isNaN(newBpm)) {
            setBpm('');
            return;
        }
        if (this.bpm === newBpm) {
            return;
        }
        if (newBpm > 500) {
            this.bpm = 500;
            setBpm(500);
        } else if (newBpm < 1) {
            this.bpm = 1;
            setBpm(1);
        } else {
            this.bpm = newBpm;
            setBpm(newBpm);
        }
        this.checkBPMLimit();
        if (this.loop) this.loop.stop();  // Останавливаем текущий цикл метронома
        if (this.isPlaying) {
            this.restartMetronomeAndPendulum();
        }
    }

    checkBPMLimit() {
        this.bpmMinLimitReached = this.bpm <= 1;
        this.bpmMaxLimitReached = this.bpm >= 500;
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