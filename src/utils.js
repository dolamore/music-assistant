export function toggleButtonsLimit(minLimit, maxLimit, increasingButton, decreasingButton) {
    increasingButton.disabled = maxLimit;
    decreasingButton.disabled = minLimit;
    increasingButton.classList.toggle('button-limit', maxLimit);
    decreasingButton.classList.toggle('button-limit', minLimit);
}

export function handleInputBlur(element, defaultElementValue) {
    if (element.value === '') {
        element.value = defaultElementValue;

        element.dispatchEvent(new Event('input', {bubbles: true}));
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