import * as Tone from 'https://cdn.skypack.dev/tone';
 // Default to '4n' (quarter note)
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

export const beatHTML = (index) => `
        <div class="beat" data-beat="${index}" data-sound="1"></div>
        <select class="note-size-dropdown" data-beat="${index}">
            <option value="1">1</option>
            <option value="1T">1T</option>
            <option value="2">1/2</option>
            <option value="2T">1/2T</option>
            <option value="4" selected>1/4</option>
            <option value="4T">1/4T</option>
            <option value="8">1/8</option>
            <option value="8T">1/8T</option>
            <option value="16">1/16</option>
            <option value="16T">1/16T</option>
            <option value="32">1/32</option>
            <option value="32T">1/32T</option>
            <option value="64">1/64</option>
            <option value="64T">1/64T</option>
        </select>
        <label>
            <select class="note-amount-dropdown" data-beat="${index}">
                <option value="1" selected>1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
        </label>
    `;