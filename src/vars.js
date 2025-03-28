import * as Tone from "tone";
// Default to '4n' (quarter note)
export const NOTE_MULTIPLIERS = [4, 2, 1, 0.5, 0.25, 0.125, 0.0625];

export const INITIAL_NUMBER_OF_BEATS = 4;

export const MAX_BEATS_AMOUNT = 16;
export const MIN_BEATS_AMOUNT = 1;

export const DEFAULT_SOUND_SETTINGS = {
    frequency: 440,
    detune: 0,
    phase: 0,
    volume: 0,
    attack: 0.001,   // Быстрая атака
    decay: 0.1,
    sustain: 0,
    release: 0.1,
};
export const SOUNDS = [
    {sound: null, label: 'No sound'},
    {sound: new Tone.Synth({oscillator: {type: 'sine'}}).toDestination(), label: 'Sine'},
    {sound: new Tone.Synth({oscillator: {type: 'triangle'}}).toDestination(), label: 'Triangle'},
    {sound: new Tone.Synth({oscillator: {type: 'square'}}).toDestination(), label: 'Square'},
    {sound: new Tone.Synth({oscillator: {type: 'sawtooth'}}).toDestination(), label: 'Sawtooth'}
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

export const buttons = {
    startStopButton: document.getElementById('start-stop-button'),
    settingsButton: document.getElementById('settings-button'),

    increaseBPMButton: document.getElementById('increase-bpm-1-button'),
    decreaseBPMButton: document.getElementById('decrease-bpm-1-button'),
    increaseFiveBPMButton: document.getElementById('increase-bpm-5-button'),
    decreaseFiveBPMButton: document.getElementById('decrease-bpm-5-button'),

    saveSettingsButton: document.getElementById('save-settings-button'),

    increaseBeatsButton: document.getElementById('increase-beats-button'),
    decreaseBeatsButton: document.getElementById('decrease-beats-button'),

    increaseNotesButton: document.getElementById('increase-notes-button'),
    decreaseNotesButton: document.getElementById('decrease-notes-button'),

    togglePendulumBar: document.getElementById('toggle-pendulum'),
    toggleFlashingBar: document.getElementById('toggle-flashing-bar'),
    toggleBeatBars: document.getElementById('toggle-beat-bars'),

    toggleTrainingMode: document.getElementById('toggle-training-mode'),

    decreaseNoteSkipProbabilityButton: document.getElementById('decrease-note-skip-probability-button'),
    decreaseNoteSkipProbabilityFiveButton: document.getElementById('decrease-note-skip-probability-5-button'),
    increaseNoteSkipProbabilityButton: document.getElementById('increase-note-skip-probability-button'),
    increaseNoteSkipProbabilityFiveButton: document.getElementById('increase-note-skip-probability-5-button'),
    decreaseLoopSkipProbabilityButton: document.getElementById('decrease-loop-skip-probability-button'),
    decreaseLoopSkipProbabilityFiveButton: document.getElementById('decrease-loop-skip-probability-5-button'),
    increaseLoopSkipProbabilityButton: document.getElementById('increase-loop-skip-probability-button'),
    increaseLoopSkipProbabilityFiveButton: document.getElementById('increase-loop-skip-probability-5-button'),
}

export const effectsButtons = {
    togglePendulumBar: buttons.togglePendulumBar,
    toggleFlashingBar: buttons.toggleFlashingBar,
    toggleBeatBars: buttons.toggleBeatBars,
}

export const beatsButtons = {
    increaseButton: buttons.increaseBeatsButton,
    decreaseButton: buttons.decreaseBeatsButton,
}

export const notesButtons = {
    increaseButton: buttons.increaseNotesButton,
    decreaseButton: buttons.decreaseNotesButton,
}

export const BPMButtons = {
    increaseButton: buttons.increaseBPMButton,
    decreaseButton: buttons.decreaseBPMButton,
    increaseFiveButton: buttons.increaseFiveBPMButton,
    decreaseFiveButton: buttons.decreaseFiveBPMButton,
}

export const probButtons = {
    toggleTrainingMode: buttons.toggleTrainingMode,
    noteSkipProbabilityButtons: {
        increaseButton: buttons.increaseNoteSkipProbabilityButton,
        decreaseButton: buttons.decreaseNoteSkipProbabilityButton,
        increaseFiveButton: buttons.increaseNoteSkipProbabilityFiveButton,
        decreaseFiveButton: buttons.decreaseNoteSkipProbabilityFiveButton,
    },
    loopSkipProbabilityButtons: {
        increaseButton: buttons.increaseLoopSkipProbabilityButton,
        decreaseButton: buttons.decreaseLoopSkipProbabilityButton,
        increaseFiveButton: buttons.increaseLoopSkipProbabilityFiveButton,
        decreaseFiveButton: buttons.decreaseLoopSkipProbabilityFiveButton,
    }
}

export class Elements {
    static get beatRows() {
        return document.querySelectorAll('.beat-row');
    }

    static get beats() {
        return document.querySelectorAll('.beat');
    }

    static get noteSizeDropdowns() {
        return document.querySelectorAll('.note-size-dropdown');
    }

    static get noteAmountDropdowns() {
        return document.querySelectorAll('.note-amount-dropdown');
    }

    static get soundSettingsRows() {
        return document.querySelectorAll('.sound-row');
    }
}

export const elements = {
    //   bpmInput: document.getElementById('bpm-input'),
    settingsPanel: document.getElementById('settings-panel'),
    //trainingSettings: document.getElementById('training-settings'),
    //   noteSkipProbabilityInput: document.getElementById('note-skip-probability-input'),
    //  loopSkipProbabilityInput: document.getElementById('loop-skip-probability-input'),
    beatsCounter: document.getElementById('beats-counter'),
    timeSignature: document.getElementById('time-signature'),

    flashingBar: document.querySelector('.flashing-bar'),

    beatContainer: document.querySelector('.beat-container'),

    pendulumElement: document.querySelector('.pendulum'),
    pendulumBarElement: document.querySelector('.horizontal-bar'),

    // loopCounter: document.getElementById('loop-counter'),

    labelsContainer: document.querySelector('.labels'),

    soundSettingsContainer: document.querySelector('.sound-settings'),
}

//export const defaultNoteSkipProbability = elements.noteSkipProbabilityInput.value / 100
//export const defaultLoopSkipProbability = elements.loopSkipProbabilityInput.value / 100;
export const DEFAULT_INITIAL_BPM = 120;
export const BPM_MAX_LIMIT = 500;
export const BPM_MIN_LIMIT = 1;
export const DEFAULT_NOTE_SIZE = 4;
export const DEFAULT_IS_TRIPLET = false;
export const DEFAULT_NOTE_AMOUNT = 1;
export const DEFAULT_SOUND_INDEX = 1;