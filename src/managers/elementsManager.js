import {
    elements,
    NOTE_AMOUNTS,
    NOTE_MULTIPLIERS, NOTES
} from "../vars.js";
import {lcmArray} from "../utils.js";
import {makeAutoObservable} from "mobx";
import * as performance from "tone";

export class ElementsManager {
    _isSettingsPanelVisible = false;
    pendulumAnimationFrame;
    metronomeManager;
    _timeSignature;

    constructor(metronomeManager) {
        this.metronomeManager = metronomeManager;
        this._timeSignature = this.countSize();
        makeAutoObservable(this)
    }

    get timeSignature() {
        return this._timeSignature;
    }

    get isSettingsPanelVisible() {
        return this._isSettingsPanelVisible;
    }

    set isSettingsPanelVisible(value) {
        this._isSettingsPanelVisible = value;
    }

    toggleSettingsPanel() {
        this._isSettingsPanelVisible = !this._isSettingsPanelVisible;
    }

    updateTimeSignature() {
        this._timeSignature = this.countSize();
    }

    countSize() {
        let beatAmount = this.metronomeManager.beatBarsManager.numberOfBeats;
        let beatPattern = [];

        for (let index = 0; index < beatAmount; index++) {
            const { isTriplet, noteSize } = this.metronomeManager.beatBarsManager.noteAttributes.noteSettings[index];
            const noteAmount = this.metronomeManager.beatBarsManager.noteAttributes.noteAmounts[index];

            for (let i = 0; i < (isTriplet ? 3 * noteAmount : noteAmount); i++) {
                beatPattern.push(isTriplet ? noteSize * 3 / 2 : noteSize);
            }
        }

        const denominator = lcmArray(beatPattern);
        let numerator = 0;

        for (let index = 0; index < beatAmount; index++) {
            const noteAmount = this.metronomeManager.beatBarsManager.noteAttributes.noteAmounts[index];
            const {isTriplet, noteSize: noteSize} = this.metronomeManager.beatBarsManager.noteAttributes.noteSettings[index];

            if (isTriplet) {
                numerator += noteAmount * 3 * (denominator / noteSize);
            } else {
                numerator += noteAmount * (denominator / noteSize);
            }
        }

        return {numerator: numerator, tactSize: denominator};
    }

    movePendulum() {

        const barWidth = elements.pendulumBarElement.clientWidth;
        const pendulumWidth = elements.pendulumElement.clientWidth;
        const maxPosition = barWidth - pendulumWidth; // Amplitude of movement
        const beatDuration = (60 / this.metronomeManager.bpm) * 1000 * NOTE_MULTIPLIERS[this.metronomeManager.currentNoteSizeIndex]; // Duration of one beat in milliseconds
        const pendulumPeriod = beatDuration * 2; // Full cycle (back and forth)

        let startTime = performance.now();

        const updatePendulumPosition = (currentTime) => {
            if (!this.metronomeManager.isPlaying) return; // Stop animation if metronome is stopped

            const elapsed = (currentTime - startTime) % pendulumPeriod;
            const normalizedTime = elapsed / pendulumPeriod; // From 0 to 1

            const position = normalizedTime <= 0.5 ? normalizedTime * 2 * maxPosition // Move right
                : maxPosition - (normalizedTime - 0.5) * 2 * maxPosition; // Move left

            elements.pendulumElement.style.left = `${position}px`;

            this.pendulumAnimationFrame = requestAnimationFrame(updatePendulumPosition);
        }

        startTime = performance.now();
        requestAnimationFrame(updatePendulumPosition);
    }

    resetPendulumAnimation() {
        cancelAnimationFrame(this.pendulumAnimationFrame); // Stop the current animation
        elements.pendulumElement.style.left = '0px'; // Reset pendulum to initial position
    }

    //TODO: проверить что метроном будет перезапускаться в нужный момент при изменении бпм

    preventNonDigitInput(e) {
        const allowedKeys = new Set([8, 46, 37, 39]); // Backspace, Delete, Left Arrow, Right Arrow

        if (!/[0-9]/.test(e.key) && !allowedKeys.has(e.keyCode)) {
            e.preventDefault();
        }
    }


    changeDropdownSize(dropdown, direction) {
        const options = Array.from(dropdown.options);
        const currentIndex = options.findIndex(option => option.value === dropdown.value);
        // Изменяем индекс с учетом пропуска триолей
        let newIndex = currentIndex + (direction ? 2 : -2);

        // Проверяем валидность нового значения
        const newValue = parseInt(options[newIndex]?.value);
        if (newValue >= 1 && newValue <= 64) {
            dropdown.value = options[newIndex].value;
        }
    }

    // updateBeatDropdowns(e) {
    //     if (e.target.matches('.note-size-dropdown') || e.target.matches('.note-amount-dropdown')) {
    //         this.updateTimeSignature();
    //
    //         if (this.metronomeManager.isPlaying) {
    //             this.metronomeManager.updateMetronomeSequence();
    //         }
    //     }
    // }

    //TODO: реализовать это в элементе!!

    // handleBeatClick(e) {
    //     if (e.target.classList.contains('beat')) {
    //         this.metronomeManager.soundManager.changeBeatSound(e.target);
    //     }
    // }
}

//     renderElements() {
//         this.renderSoundSettings();
//
//         window.addEventListener('resize', () => this.metronomeManager.restartIfPlaying());
//
//         elements.loopSkipProbabilityInput.addEventListener('keypress', (e) => this.preventNonDigitInput(e));
//
//         elements.noteSkipProbabilityInput.addEventListener('keypress', (e) => this.preventNonDigitInput(e));
//
//         document.addEventListener('change', (e) => this.updateBeatDropdowns(e));
//
//         document.addEventListener('click', (e) => this.handleBeatClick(e));
//     }
// }