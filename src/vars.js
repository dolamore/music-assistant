import * as Tone from 'https://cdn.skypack.dev/tone';
// Default to '4n' (quarter note)
export const noteMultipliers = [4, 2, 1, 0.5, 0.25, 0.125, 0.0625];

export const initialNumberOfBeats = 6;

export const maxBeatsAmount = 16;

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

export const probButtons = {
    noteSkipProbability: {
        increaseButton: buttons.increaseNoteSkipProbabilityButton,
        decreaseButton: buttons.decreaseNoteSkipProbabilityButton,
        increaseFiveButton: buttons.increaseNoteSkipProbabilityFiveButton,
        decreaseFiveButton: buttons.decreaseNoteSkipProbabilityFiveButton,
    },
    loopSkipProbability: {
        increaseButton: buttons.increaseLoopSkipProbabilityButton,
        decreaseButton: buttons.decreaseLoopSkipProbabilityButton,
        increaseFiveButton: buttons.increaseLoopSkipProbabilityFiveButton,
        decreaseFiveButton: buttons.decreaseLoopSkipProbabilityFiveButton,
    }
}

export const elements = {
    bpmInput: document.getElementById('bpm-input'),
    settingsPanel: document.getElementById('settings-panel'),
    trainingSettings: document.getElementById('training-settings'),
    noteSkipProbabilityInput: document.getElementById('note-skip-probability-input'),
    loopSkipProbabilityInput: document.getElementById('loop-skip-probability-input'),
    beatsCounter: document.getElementById('beats-counter'),
}

export const defaultNoteSkipProbability = elements.noteSkipProbabilityInput.value / 100
export const defaultLoopSkipProbability = elements.loopSkipProbabilityInput.value / 100;
export const defaultInitialBPM = 120;