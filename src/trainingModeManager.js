import {buttons, elements} from "./vars.js";
import {toggleButtonsLimit} from "./utils.js";

export function handleLoopSkipProbabilityChange(newProbability, loopSkipProbability) {
    if (isNaN(newProbability) || loopSkipProbability === newProbability) {
        return;
    }
    if (newProbability > 1) {
        loopSkipProbability = 1;
        elements.loopSkipProbabilityInput.value = 100;
    } else if (newProbability < 0) {
        loopSkipProbability = 0;
        elements.loopSkipProbabilityInput.value = 0;
    } else {
        elements.loopSkipProbabilityInput.value = newProbability * 100;
        //elements.loopSkipProbabilityInput.value.replace(/^0+/, '');
        loopSkipProbability = newProbability;
    }

    checkSkipProbabilityLimit({
        probability: loopSkipProbability,
        probButtons: {
            increaseButton: buttons.increaseLoopSkipProbabilityButton,
            decreaseButton: buttons.decreaseLoopSkipProbabilityButton,
            increaseFiveButton: buttons.increaseLoopSkipProbabilityFiveButton,
            decreaseFiveButton: buttons.decreaseLoopSkipProbabilityFiveButton
        }
    });
}

export function handleNoteSkipProbabilityChange(newProbability, noteSkipProbability) {
    if (isNaN(newProbability) || noteSkipProbability === newProbability) {
        return;
    }
    if (newProbability > 1) {
        noteSkipProbability = 0;
        elements.noteSkipProbabilityInput.value = 100;
    } else if (newProbability < 0) {
        noteSkipProbability = 0;
        elements.noteSkipProbabilityInput.value = 0;
    } else {
        elements.noteSkipProbabilityInput.value = elements.noteSkipProbabilityInput.value.replace(/^0+/, '');
        noteSkipProbability = newProbability;
    }
    checkSkipProbabilityLimit({
        probability: noteSkipProbability,
        probButtons: {
            increaseButton: buttons.increaseNoteSkipProbabilityButton,
            decreaseButton: buttons.decreaseNoteSkipProbabilityButton,
            increaseFiveButton: buttons.increaseNoteSkipProbabilityFiveButton,
            decreaseFiveButton: buttons.decreaseNoteSkipProbabilityFiveButton
        }
    });
}

function checkSkipProbabilityLimit({probability, probButtons}) {
    const isMinLimit = probability <= 0;
    const isMaxLimit = probability >= 1;

    toggleButtonsLimit(isMinLimit, isMaxLimit, probButtons.increaseButton, probButtons.decreaseButton);
    toggleButtonsLimit(isMinLimit, isMaxLimit, probButtons.increaseFiveButton, probButtons.decreaseFiveButton);
}