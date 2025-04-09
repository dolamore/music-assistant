import {handleInputBlur, toggleButtonsLimit} from "../utils/utils.js";

export class TrainingModeManager {
    constructor() {
   //     this.loopSkipProbability = defaultLoopSkipProbability;
   //     this.noteSkipProbability = defaultNoteSkipProbability;
        this.isTrainingMode = false;
        this.isFirstLoop = true;
    }

    setTrainingMode(enabled) {
        this.setIsTrainingMode(enabled);
        this.setIsFirstLoop(enabled);
      //  elements.trainingSettings.classList.toggle('hidden', !enabled);
    }

    handleLoopSkipProbabilityChange(changeProbability) {
        if (isNaN(changeProbability)) {
            return;
        }
        const possibility = Number((this.loopSkipProbability + changeProbability).toFixed(5));

        if (possibility > 1) {
            this.setLoopSkipProbability(1);
      //      elements.loopSkipProbabilityInput.value = 100;
        } else if (possibility < 0) {
            this.setLoopSkipProbability(0);
       //     elements.loopSkipProbabilityInput.value = 0;
        } else {
            const roundedPossibility = Math.round(possibility * 100);
       //     elements.loopSkipProbabilityInput.value = roundedPossibility;
            this.loopSkipProbability = roundedPossibility / 100;
        }
    //    this.checkSkipProbabilityLimit(this.loopSkipProbability, probButtons.loopSkipProbabilityButtons);
        this.setIsFirstLoop(true);
    }

    handleNoteSkipProbabilityChange(changeProbability) {
        if (isNaN(changeProbability)) {
            return;
        }
        const possibility = Number((this.noteSkipProbability + changeProbability).toFixed(5));

        if (possibility > 1) {
            this.setNoteSkipProbability(1);
      //      elements.noteSkipProbabilityInput.value = 100;
        } else if (possibility < 0) {
            this.setNoteSkipProbability(0);
       //     elements.noteSkipProbabilityInput.value = 0;
        } else {
            const roundedPossibility = Math.round(possibility * 100);
       //     elements.noteSkipProbabilityInput.value = roundedPossibility;
            this.noteSkipProbability = roundedPossibility / 100;
        }
        this.setIsFirstLoop(true);
 //       this.checkSkipProbabilityLimit(this.noteSkipProbability, probButtons.noteSkipProbabilityButtons);
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

    renderTrainingModeElements() {
    //    this.checkSkipProbabilityLimit(this.getLoopSkipProbability(), probButtons.loopSkipProbabilityButtons);

    //    this.checkSkipProbabilityLimit(this.getNoteSkipProbability(), probButtons.noteSkipProbabilityButtons);

    //    buttons.toggleTrainingMode.addEventListener('change', (e) => this.setTrainingMode(e.target.checked));

        // elements.loopSkipProbabilityInput.addEventListener('input', (e) => {
        //     this.handleLoopSkipProbabilityChange(e.target.value / 100 - this.getLoopSkipProbability());
        // });
        // elements.loopSkipProbabilityInput.addEventListener('blur', () => handleInputBlur(elements.loopSkipProbabilityInput, 0));
        //
        // elements.noteSkipProbabilityInput.addEventListener('input', (e) => {
        //     this.handleNoteSkipProbabilityChange(e.target.value / 100 - this.getNoteSkipProbability());
        // });
        // elements.noteSkipProbabilityInput.addEventListener('blur', () => handleInputBlur(elements.noteSkipProbabilityInput, 0));


        // buttons.increaseLoopSkipProbabilityButton.addEventListener('click', () => this.handleLoopSkipProbabilityChange(0.01));
        // buttons.increaseLoopSkipProbabilityFiveButton.addEventListener('click', () => this.handleLoopSkipProbabilityChange(0.05));
        // buttons.decreaseLoopSkipProbabilityButton.addEventListener('click', () => this.handleLoopSkipProbabilityChange(-0.01));
        // buttons.decreaseLoopSkipProbabilityFiveButton.addEventListener('click', () => this.handleLoopSkipProbabilityChange(-0.05));
        //
        // buttons.increaseNoteSkipProbabilityButton.addEventListener('click', () => this.handleNoteSkipProbabilityChange(0.01));
        // buttons.increaseNoteSkipProbabilityFiveButton.addEventListener('click', () => this.handleNoteSkipProbabilityChange(0.05));
        // buttons.decreaseNoteSkipProbabilityButton.addEventListener('click', () => this.handleNoteSkipProbabilityChange(-0.01));
        // buttons.decreaseNoteSkipProbabilityFiveButton.addEventListener('click', () => this.handleNoteSkipProbabilityChange(-0.05));
    }
}

