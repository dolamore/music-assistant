import * as Tone from "tone";
// Default to '4n' (quarter note)
export const noteMultipliers = [4, 2, 1, 0.5, 0.25, 0.125, 0.0625];

export const initialNumberOfBeats = 4;

export const maxBeatsAmount = 16;
export const minBeatsAmount = 1;

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

export const notes = [
    {value: 1, label: "1", isTriplet: false},
    {value: 1, label: "1T", isTriplet: true},
    {value: 2, label: "1/2", isTriplet: false},
    {value: 2, label: "1/2T", isTriplet: true},
    {value: 4, label: "1/4", isTriplet: false},
    {value: 4, label: "1/4T", isTriplet: true},
    {value: 8, label: "1/8", isTriplet: false},
    {value: 8, label: "1/8T", isTriplet: true},
    {value: 16, label: "1/16", isTriplet: false},
    {value: 16, label: "1/16T", isTriplet: true},
    {value: 32, label: "1/32", isTriplet: false},
    {value: 32, label: "1/32T", isTriplet: true},
    {value: 64, label: "1/64", isTriplet: false},
    {value: 64, label: "1/64T", isTriplet: true}
];

export const noteAmounts = [1, 2, 3, 4];

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
export const defaultInitialBPM = 120;
export const bpmMaxLimit = 500;
export const bpmMinLimit = 1;