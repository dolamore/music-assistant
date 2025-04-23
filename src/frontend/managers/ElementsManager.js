import {lcmArray} from "../utils/utils";
import {makeAutoObservable} from "mobx";
import {NOTE_MULTIPLIERS} from "../vars/vars.js";

export class ElementsManager {
    _isSettingsPanelVisible = false;
    pendulumAnimationFrame;
    metronomeManager;
    _beatBarsManager;
    _currentNoteSizeIndex = 2;

    constructor(metronomeManager) {
        this.metronomeManager = metronomeManager;
        this._beatBarsManager = metronomeManager.beatBarsManager;
        makeAutoObservable(this)
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

    movePendulum() {
        const barWidth = elements.pendulumBarElement.clientWidth;
        const pendulumWidth = elements.pendulumElement.clientWidth;
        const maxPosition = barWidth - pendulumWidth; // Amplitude of movement
        const beatDuration = (60 / this.metronomeManager.audioEngine.bpm) * 1000 * NOTE_MULTIPLIERS[this._currentNoteSizeIndex]; // Duration of one beat in milliseconds
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
}

//     renderElements() {
//
//         window.addEventListener('resize', () => this.metronomeManager.restartIfPlaying());
//
//         elements.loopSkipProbabilityInput.addEventListener('keypress', (e) => this.preventNonDigitInput(e));
//
//         elements.noteSkipProbabilityInput.addEventListener('keypress', (e) => this.preventNonDigitInput(e));
//     }
// }