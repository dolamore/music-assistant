import * as Tone from "tone";

export function toggleButtonsLimit(minLimit, maxLimit, increasingButton, decreasingButton) {
    increasingButton.disabled = maxLimit;
    decreasingButton.disabled = minLimit;
    increasingButton.classList.toggle('button-limit', maxLimit);
    decreasingButton.classList.toggle('button-limit', minLimit);
}

//TODO make it generic
export function handleInputBlur(inputValue, defaultElementValue, metronomeManager) {
    if (inputValue === '') {
        metronomeManager.audioEngine.handleBpmChange(defaultElementValue)
    }
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

export function lcmArray(arr) {
    return arr.reduce((a, b) => lcm(a, b));
}

export async function setupAudioContextUnlocker() {
        await Tone.start();
        await Tone.getContext().resume();
}

export function preventNonDigitInput(e) {
    const allowedKeys = new Set([8, 46, 37, 39]); // Backspace, Delete, Left Arrow, Right Arrow

    if (!/[0-9]/.test(e.key) && !allowedKeys.has(e.keyCode)) {
        e.preventDefault();
    }
}