import * as Tone from "tone";
// Default to '4n' (quarter note)
export const NOTE_MULTIPLIERS = [4, 2, 1, 0.5, 0.25, 0.125, 0.0625];

export const INITIAL_NUMBER_OF_BEATS = 4;

export const MAX_BEATS_AMOUNT = 16;
export const MIN_BEATS_AMOUNT = 1;

export const DEFAULT_SOUND_SETTINGS = [
    {key: 'frequency', value: 440, label: "Frequency"},
    {key: 'detune', value: 0, label: "Detune"},
    {key: 'phase', value: 0, label: "Phase"},
    {key: 'volume', value: 0, label: "Volume"},
    {key: 'attack', value: 0.001, label: "Attack"},
    {key: 'decay', value: 0.1, label: "Decay"},
    {key: 'sustain', value: 0, label: "Sustain"},
    {key: 'release', value: 0.1, label: "Release"},
];
export const SOUNDS = [
    {key: 'no-sound', sound: null, label: 'No sound'},
    {key: 'sine', sound: new Tone.Synth({oscillator: {type: 'sine'}}).toDestination(), label: 'Sine'},
    {key: 'triangle', sound: new Tone.Synth({oscillator: {type: 'triangle'}}).toDestination(), label: 'Triangle'},
    {key: 'square', sound: new Tone.Synth({oscillator: {type: 'square'}}).toDestination(), label: 'Square'},
    {key: 'sawtooth', sound: new Tone.Synth({oscillator: {type: 'sawtooth'}}).toDestination(), label: 'Sawtooth'}
];

export const NOTES = [
    {noteSize: 1, label: "1", isTriplet: false},
    {noteSize: 1, label: "1T", isTriplet: true},
    {noteSize: 2, label: "1/2", isTriplet: false},
    {noteSize: 2, label: "1/2T", isTriplet: true},
    {noteSize: 4, label: "1/4", isTriplet: false},
    {noteSize: 4, label: "1/4T", isTriplet: true},
    {noteSize: 8, label: "1/8", isTriplet: false},
    {noteSize: 8, label: "1/8T", isTriplet: true},
    {noteSize: 16, label: "1/16", isTriplet: false},
    {noteSize: 16, label: "1/16T", isTriplet: true},
    {noteSize: 32, label: "1/32", isTriplet: false},
    {noteSize: 32, label: "1/32T", isTriplet: true},
    {noteSize: 64, label: "1/64", isTriplet: false},
    {noteSize: 64, label: "1/64T", isTriplet: true}
];

export const NOTE_AMOUNTS = [1, 2, 3, 4];

export const DEFAULT_INITIAL_BPM = 120;
export const BPM_MAX_LIMIT = 500;
export const BPM_MIN_LIMIT = 1;
export const DEFAULT_NOTE_SIZE = 4;
export const DEFAULT_IS_TRIPLET = false;
export const DEFAULT_NOTE_AMOUNT = 1;
export const DEFAULT_SOUND_INDEX = 1;
//export const defaultNoteSkipProbability = elements.noteSkipProbabilityInput.value / 100
//export const defaultLoopSkipProbability = elements.loopSkipProbabilityInput.value / 100;