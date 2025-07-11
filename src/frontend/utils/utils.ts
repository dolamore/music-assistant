import * as Tone from "tone";
import React from "react";

export function handleVariableChange(
  newValue: number,
  variable: number,
  minLimit: number,
  maxLimit: number,
  varSetter: (value: number) => void,
) {
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

export function preventNonDigitInput(
  e: React.KeyboardEvent<HTMLInputElement>,
): void {
  const allowedKeys = new Set([
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
  ]);

  if (
    (!/^[0-9]$/.test(e.key) && !allowedKeys.has(e.key)) ||
    e.key === "." ||
    e.key === " "
  ) {
    e.preventDefault();
  }
}
