import * as Tone from "tone";

export function handleVariableChange(newValue: any, variable: number, minLimit: number, maxLimit: number, varSetter: (value: number) => void) {
    if (/^0\d+$/.test(newValue)) {
        newValue = newValue.replace(/^0+/, '');
    }

    if (isNaN(newValue) || newValue === '') {
        return;
    }
    if (variable === newValue) {
        return;
    }
    if (newValue > maxLimit) {
        varSetter(maxLimit);
    } else if (newValue < minLimit) {
        varSetter(minLimit);
    } else {
        varSetter(newValue);
    }
}

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}

export function lcmArray(arr: number[]): number {
    return arr.reduce((a, b) => lcm(a, b));
}

export async function setupAudioContextUnlocker(): Promise<void> {
    await Tone.start();
    await Tone.getContext().resume();
}

//TODO: проверить чтобы двойной пробел не создавал точку и тип e
export function preventNonDigitInput(e: any) {
    const allowedKeys = new Set([8, 46, 37, 39]); // Backspace, Delete, Left Arrow, Right Arrow

    if (!/[0-9]/.test(e.key) && !allowedKeys.has(Number(e.keyCode))) {
        e.preventDefault();
    }
}