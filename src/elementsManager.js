import {buttons, defaultInitialBPM, elements, initialNumberOfBeats, maxBeatsAmount, noteMultipliers} from "./vars.js";
import {lcmArray, toggleButtonsLimit} from "./utils.js";

export class ElementsManager {
    constructor(metronomeManager) {
        this.pendulumAnimationFrame = null;
        this.metronomeManager = metronomeManager;
    }

    updateTimeSignature() {
        const timeSignature = this.countSize();
        elements.timeSignature.textContent = `${timeSignature.beatAmount}/${timeSignature.tactSize}`;
        this.checkNotesLimit();
        this.checkBeatsLimit();
    }

    checkNotesLimit() {
        let minLimit = false;
        let maxLimit = false;

        elements.noteSizeDropdowns.forEach((dropdown) => {
            const currentValue = parseInt(dropdown.value);

            if (currentValue === 1) {
                minLimit = true;
            }

            if (currentValue === 64) {
                maxLimit = true;
            }
        });

        toggleButtonsLimit(minLimit, maxLimit, buttons.increaseNotesButton, buttons.decreaseNotesButton);
    }

    checkBeatsLimit() {
        const minLimit = elements.beatsRows.length <= 1;
        const maxLimit = elements.beatsRows.length >= maxBeatsAmount;

        toggleButtonsLimit(minLimit, maxLimit, buttons.increaseBeatsButton, buttons.decreaseBeatsButton);
    }

    countSize() {
        let beatAmount = 0;
        const beats = document.querySelectorAll('.beat-wrapper');
        let beatPattern = [];

        beats.forEach((beat) => {
            const noteData = parseNoteSize(beat.querySelector('.note-size-dropdown').value);
            const noteAmount = parseInt(beat.querySelector('.note-amount-dropdown').value, 10);
            const isTriplet = noteData.isTriplet;
            const noteSize = noteData.number;

            for (let i = 0; i < (isTriplet ? 3 * noteAmount : noteAmount); i++) {
                beatPattern.push(isTriplet ? noteSize * 3 / 2 : noteSize);
            }
        });

        const denominator = lcmArray(beatPattern);

        beats.forEach((beat) => {
            const noteData = parseNoteSize(beat.querySelector('.note-size-dropdown').value);
            const noteAmount = parseInt(beat.querySelector('.note-amount-dropdown').value, 10);
            const isTriplet = noteData.isTriplet;
            const noteSize = isTriplet ? noteData.number * 3 / 2 : noteData.number;

            if (isTriplet) {
                beatAmount += noteAmount * 3 * (denominator / noteSize);
            } else {
                beatAmount += noteAmount * (denominator / noteSize);
            }
        });

        return {beatAmount: beatAmount, tactSize: denominator};
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

    movePendulum() {

        const barWidth = elements.pendulumBarElement.clientWidth;
        const pendulumWidth = elements.pendulumElement.clientWidth;
        const maxPosition = barWidth - pendulumWidth; // Amplitude of movement
        const beatDuration = (60 / bpm) * 1000 * noteMultipliers[currentNoteSizeIndex]; // Duration of one beat in milliseconds
        const pendulumPeriod = beatDuration * 2; // Full cycle (back and forth)

        let startTime = performance.now();

        function updatePendulumPosition(currentTime) {
            if (!this.metronomeManager.isPlaying()) return; // Stop animation if metronome is stopped

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

    renderElements() {
        elements.beatsCounter.textContent = initialNumberOfBeats;
        elements.bpmInput.value = defaultInitialBPM;
    }
}