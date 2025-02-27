import {buttons, defaultLoopSkipProbability, defaultNoteSkipProbability, elements} from "./vars.js";
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

    handleLoopSkipProbabilityChange(newProbability) {
        if (isNaN(newProbability) || this.loopSkipProbability === newProbability) {
            return;
        }
        if (newProbability > 1) {
            this.setLoopSkipProbability(1);
            elements.loopSkipProbabilityInput.value = 100;
        } else if (newProbability < 0) {
            this.setLoopSkipProbability(0);
            elements.loopSkipProbabilityInput.value = 0;
        } else {
            elements.loopSkipProbabilityInput.value += newProbability * 100;
            this.loopSkipProbability += newProbability
        }

        this.checkSkipProbabilityLimit({
            probability: this.loopSkipProbability, probButtons: {
                increaseButton: buttons.increaseLoopSkipProbabilityButton,
                decreaseButton: buttons.decreaseLoopSkipProbabilityButton,
                increaseFiveButton: buttons.increaseLoopSkipProbabilityFiveButton,
                decreaseFiveButton: buttons.decreaseLoopSkipProbabilityFiveButton
            }
        });
    }

    setLoopSkipProbability(probability) {
        this.loopSkipProbability = probability;
    }

    handleNoteSkipProbabilityChange(newProbability) {
        if (isNaN(newProbability) || this.noteSkipProbability === newProbability) {
            return;
        }
        if (newProbability > 1) {
            this.setNoteSkipProbability(1);
            elements.noteSkipProbabilityInput.value = 100;
        } else if (newProbability < 0) {
            this.setNoteSkipProbability(0);
            elements.noteSkipProbabilityInput.value = 0;
        } else {
            elements.noteSkipProbabilityInput.value += newProbability * 100;
            this.noteSkipProbability += newProbability;
        }
        this.checkSkipProbabilityLimit({
            probability: this.noteSkipProbability, probButtons: {
                increaseButton: buttons.increaseNoteSkipProbabilityButton,
                decreaseButton: buttons.decreaseNoteSkipProbabilityButton,
                increaseFiveButton: buttons.increaseNoteSkipProbabilityFiveButton,
                decreaseFiveButton: buttons.decreaseNoteSkipProbabilityFiveButton
            }
        });
    }

    checkSkipProbabilityLimit({probability, probButtons}) {
        const isMinLimit = probability <= 0;
        const isMaxLimit = probability >= 1;

        toggleButtonsLimit(isMinLimit, isMaxLimit, probButtons.increaseButton, probButtons.decreaseButton);
        toggleButtonsLimit(isMinLimit, isMaxLimit, probButtons.increaseFiveButton, probButtons.decreaseFiveButton);
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
    buttons.toggleTrainingMode.addEventListener('change', function (e) {
        trainingModeManager.setTrainingMode(e.target.checked);
    });

    elements.loopSkipProbabilityInput.addEventListener('input', function (e) {
        trainingModeManager.handleLoopSkipProbabilityChange(e.target.value / 100);
    });
    elements.loopSkipProbabilityInput.addEventListener('blur', () => handleInputBlur(elements.loopSkipProbabilityInput, 0));

    elements.noteSkipProbabilityInput.addEventListener('input', function (e) {
        trainingModeManager.handleNoteSkipProbabilityChange(e.target.value / 100);
    });
    elements.noteSkipProbabilityInput.addEventListener('blur', () => handleInputBlur(elements.noteSkipProbabilityInput, 0));


    buttons.increaseLoopSkipProbabilityButton.addEventListener('click', () => trainingModeManager.handleLoopSkipProbabilityChange(0.01));
    buttons.increaseLoopSkipProbabilityFiveButton.addEventListener('click', () => trainingModeManager.handleLoopSkipProbabilityChange(0.05));
    buttons.decreaseLoopSkipProbabilityButton.addEventListener('click', () => trainingModeManager.handleLoopSkipProbabilityChange(0.01));
    buttons.decreaseLoopSkipProbabilityFiveButton.addEventListener('click', () => trainingModeManager.handleLoopSkipProbabilityChange(0.05));

    buttons.increaseNoteSkipProbabilityButton.addEventListener('click', () => trainingModeManager.handleNoteSkipProbabilityChange(0.01));
    buttons.increaseNoteSkipProbabilityFiveButton.addEventListener('click', () => trainingModeManager.handleNoteSkipProbabilityChange(0.05));
    buttons.decreaseNoteSkipProbabilityButton.addEventListener('click', () => trainingModeManager.handleNoteSkipProbabilityChange(0.01));
    buttons.decreaseNoteSkipProbabilityFiveButton.addEventListener('click', () => trainingModeManager.handleNoteSkipProbabilityChange(0.05));
}

