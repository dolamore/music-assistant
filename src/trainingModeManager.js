import {buttons, defaultLoopSkipProbability, defaultNoteSkipProbability, elements, probButtons} from "./vars.js";
import {handleInputBlur, toggleButtonsLimit} from "./utils.js";

export class TrainingModeManager {
    constructor() {
        this.loopSkipProbability = defaultLoopSkipProbability;
        this.noteSkipProbability = defaultNoteSkipProbability;
        this.isTrainingMode = false;
        this.isFirstLoop = true;
    }

    setTrainingMode(enabled) {
        this.setIsTrainingMode(enabled);
        this.setIsFirstLoop(enabled);
        elements.trainingSettings.classList.toggle('hidden', !enabled);
    }

    handleLoopSkipProbabilityChange(changeProbability) {
        if (isNaN(changeProbability)) {
            return;
        }
        const possibility = Number((this.loopSkipProbability + changeProbability).toFixed(5));

        if (possibility > 1) {
            this.setLoopSkipProbability(1);
            elements.loopSkipProbabilityInput.value = 100;
        } else if (possibility < 0) {
            this.setLoopSkipProbability(0);
            elements.loopSkipProbabilityInput.value = 0;
        } else {
            const roundedPossibility = Math.round(possibility * 100);
            elements.loopSkipProbabilityInput.value = roundedPossibility;
            this.loopSkipProbability = roundedPossibility / 100;
        }

        this.checkSkipProbabilityLimit(this.loopSkipProbability, probButtons.loopSkipProbability);
    }

    handleNoteSkipProbabilityChange(changeProbability) {
        if (isNaN(changeProbability)) {
            return;
        }
        const possibility = Number((this.noteSkipProbability + changeProbability).toFixed(5));

        if (possibility > 1) {
            this.setNoteSkipProbability(1);
            elements.noteSkipProbabilityInput.value = 100;
        } else if (possibility < 0) {
            this.setNoteSkipProbability(0);
            elements.noteSkipProbabilityInput.value = 0;
        } else {
            const roundedPossibility = Math.round(possibility * 100);
            elements.noteSkipProbabilityInput.value = roundedPossibility;
            this.noteSkipProbability = roundedPossibility / 100;
        }
        this.checkSkipProbabilityLimit(this.noteSkipProbability, probButtons.noteSkipProbability);
    }

    checkSkipProbabilityLimit(probability, checkButtons) {
        const isMinLimit = probability <= 0;
        const isMaxLimit = probability >= 1;
        toggleButtonsLimit(isMinLimit, isMaxLimit, checkButtons.increaseButton, checkButtons.decreaseButton);
        toggleButtonsLimit(isMinLimit, isMaxLimit, checkButtons.increaseFiveButton, checkButtons.decreaseFiveButton);
    }

    setLoopSkipProbability(probability) {
        this.loopSkipProbability = probability;
    }

    setNoteSkipProbability(probability) {
        this.noteSkipProbability = probability;
    }

    setIsFirstLoop(isFirstLoop) {
        this.isFirstLoop = isFirstLoop;
    }

    setIsTrainingMode(isTrainingMode) {
        this.isTrainingMode = isTrainingMode;
    }

    getLoopSkipProbability() {
        return this.loopSkipProbability;
    }

    getNoteSkipProbability() {
        return this.noteSkipProbability;
    }

    getIsTrainingMode() {
        return this.isTrainingMode;
    }

    getIsFirstLoop() {
        return this.isFirstLoop;
    }
}

export function renderTrainingModeElements(trainingModeManager) {
    trainingModeManager.checkSkipProbabilityLimit(trainingModeManager.getLoopSkipProbability(), probButtons.loopSkipProbability);

    trainingModeManager.checkSkipProbabilityLimit(trainingModeManager.getNoteSkipProbability(), probButtons.noteSkipProbability);

    buttons.toggleTrainingMode.addEventListener('change', function (e) {
        trainingModeManager.setTrainingMode(e.target.checked);
    });

    elements.loopSkipProbabilityInput.addEventListener('input', function (e) {
        trainingModeManager.handleLoopSkipProbabilityChange(e.target.value / 100 - trainingModeManager.getLoopSkipProbability());
    });
    elements.loopSkipProbabilityInput.addEventListener('blur', () => handleInputBlur(elements.loopSkipProbabilityInput, 0));

    elements.noteSkipProbabilityInput.addEventListener('input', function (e) {
        trainingModeManager.handleNoteSkipProbabilityChange(e.target.value / 100 - trainingModeManager.getNoteSkipProbability());
    });
    elements.noteSkipProbabilityInput.addEventListener('blur', () => handleInputBlur(elements.noteSkipProbabilityInput, 0));


    buttons.increaseLoopSkipProbabilityButton.addEventListener('click', () => trainingModeManager.handleLoopSkipProbabilityChange(0.01));
    buttons.increaseLoopSkipProbabilityFiveButton.addEventListener('click', () => trainingModeManager.handleLoopSkipProbabilityChange(0.05));
    buttons.decreaseLoopSkipProbabilityButton.addEventListener('click', () => trainingModeManager.handleLoopSkipProbabilityChange(-0.01));
    buttons.decreaseLoopSkipProbabilityFiveButton.addEventListener('click', () => trainingModeManager.handleLoopSkipProbabilityChange(-0.05));

    buttons.increaseNoteSkipProbabilityButton.addEventListener('click', () => trainingModeManager.handleNoteSkipProbabilityChange(0.01));
    buttons.increaseNoteSkipProbabilityFiveButton.addEventListener('click', () => trainingModeManager.handleNoteSkipProbabilityChange(0.05));
    buttons.decreaseNoteSkipProbabilityButton.addEventListener('click', () => trainingModeManager.handleNoteSkipProbabilityChange(-0.01));
    buttons.decreaseNoteSkipProbabilityFiveButton.addEventListener('click', () => trainingModeManager.handleNoteSkipProbabilityChange(-0.05));
}

