import * as Tone from 'https://cdn.skypack.dev/tone';

export const noteSizes = ['1n', '2n', '4n', '8n', '16n', '32n', '64n']; // Default to '4n' (quarter note)
export const noteMultipliers = [4, 2, 1, 0.5, 0.25, 0.125, 0.0625];

export const initialNumberOfBeats = 4;

export const defaultSoundSettings = {
    frequency: 440,
    detune: 0,
    phase: 0,
    volume: 0,
    attack: 0.001,   // Быстрая атака
    decay: 0.1,
    sustain: 0,
    release: 0.1,
};
export const sounds = [
    null, // No sound
    new Tone.Synth({oscillator: {type: 'sine'}}).toDestination(),
    new Tone.Synth({oscillator: {type: 'triangle'}}).toDestination(),
    new Tone.Synth({oscillator: {type: 'square'}}).toDestination(),
    new Tone.Synth({oscillator: {type: 'sawtooth'}}).toDestination()
];