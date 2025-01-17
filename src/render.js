import * as Tone from 'https://cdn.skypack.dev/tone';

const sounds = [
    null, // No sound
    new Tone.Synth({oscillator: {type: 'sine'}}).toDestination(),
    new Tone.Synth({oscillator: {type: 'triangle'}}).toDestination(),
    new Tone.Synth({oscillator: {type: 'square'}}).toDestination(),
    new Tone.Synth({oscillator: {type: 'sawtooth'}}).toDestination()
];

let selectedSounds = [1, 1, 1, 1]; // Default to the first sound for all notes
let soundSettings = [
    {frequency: 440, detune: 0, phase: 0, volume: 0},
    {frequency: 440, detune: 0, phase: 0, volume: 0},
    {frequency: 440, detune: 0, phase: 0, volume: 0},
    {frequency: 440, detune: 0, phase: 0, volume: 0}
];
let bpm = 120;
let isPlaying = false;
let loop;

document.addEventListener('DOMContentLoaded', function () {
    // Ensure the settings panel is hidden initially
    document.getElementById('settings-panel').classList.add('hidden');

    // Event listener for the settings button
    const settingsButton = document.getElementById('settings');
    if (settingsButton) {
        settingsButton.addEventListener('click', function() {
            for (let i = 0; i < 4; i++) {
                const soundElement = document.getElementById(`sound-${i}`);
                const frequencyElement = document.getElementById(`frequency-${i}`);
                const detuneElement = document.getElementById(`detune-${i}`);
                const phaseElement = document.getElementById(`phase-${i}`);
                const volumeElement = document.getElementById(`volume-${i}`);

                if (soundElement && frequencyElement && detuneElement && phaseElement && volumeElement) {
                    soundElement.value = selectedSounds[i];
                    frequencyElement.value = soundSettings[i].frequency;
                    detuneElement.value = soundSettings[i].detune;
                    phaseElement.value = soundSettings[i].phase;
                    volumeElement.value = soundSettings[i].volume;
                } else {
                    console.error(`Element with ID sound-${i}, frequency-${i}, detune-${i}, phase-${i}, or volume-${i} not found.`);
                }
            }
            document.getElementById('settings-panel').classList.toggle('hidden');
        });
    } else {
        console.error('Settings button not found.');
    }

    document.getElementById('save-settings').addEventListener('click', function () {
        for (let i = 0; i < 4; i++) {
            selectedSounds[i] = parseInt(document.getElementById(`sound-${i}`).value, 10);
            soundSettings[i] = {
                frequency: parseFloat(document.getElementById(`frequency-${i}`).value),
                detune: parseFloat(document.getElementById(`detune-${i}`).value),
                phase: parseFloat(document.getElementById(`phase-${i}`).value),
                volume: parseFloat(document.getElementById(`volume-${i}`).value)
            };
            document.querySelector(`.note[data-note="${i}"]`).dataset.sound = selectedSounds[i];
        }
        document.getElementById('settings-panel').classList.add('hidden');
    });

    // Other event listeners and code...
    // Update BPM from input
    document.getElementById('bpm').addEventListener('input', (e) => {
        bpm = parseInt(e.target.value, 10) || 120;
        if (loop) loop.stop();
        if (isPlaying) startMetronome();
    });

    // Prevent non-numeric input
    document.getElementById('bpm').addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    // Increase BPM by 1
    document.getElementById('increase-bpm-1').addEventListener('click', () => {
        bpm += 1;
        document.getElementById('bpm').value = bpm;
        if (loop) loop.stop();
        if (isPlaying) startMetronome();
    });

    // Increase BPM by 5
    document.getElementById('increase-bpm-5').addEventListener('click', () => {
        bpm += 5;
        document.getElementById('bpm').value = bpm;
        if (loop) loop.stop();
        if (isPlaying) startMetronome();
    });

    // Decrease BPM by 1
    document.getElementById('decrease-bpm-1').addEventListener('click', () => {
        bpm -= 1;
        document.getElementById('bpm').value = bpm;
        if (loop) loop.stop();
        if (isPlaying) startMetronome();
    });

    // Decrease BPM by 5
    document.getElementById('decrease-bpm-5').addEventListener('click', () => {
        bpm -= 5;
        document.getElementById('bpm').value = bpm;
        if (loop) loop.stop();
        if (isPlaying) startMetronome();
    });

    // Start/stop metronome
    document.getElementById('start-stop').addEventListener('click', async () => {
        await Tone.start();
        if (isPlaying) {
            stopMetronome();
        } else {
            startMetronome();
        }
    });

    // Select sound for each quarter note
    document.querySelectorAll('.note').forEach(button => {
        button.addEventListener('click', (e) => {
            const noteIndex = parseInt(e.target.dataset.note, 10);
            selectedSounds[noteIndex] = (selectedSounds[noteIndex] + 1) % sounds.length;
            e.target.dataset.sound = selectedSounds[noteIndex];
        });
    });

    // Initial render
    render();
});

function render() {
    // Update BPM display
    document.getElementById('bpm').value = bpm;

    // Update note display
    document.querySelectorAll('.note').forEach((note, index) => {
        note.dataset.sound = selectedSounds[index];
        note.classList.toggle('playing', isPlaying && (index === (Tone.Transport.position.split(':')[1] % 4)));
    });
}

// Start metronome
function startMetronome() {
    isPlaying = true;
    Tone.Transport.bpm.value = bpm;

    let count = 0;
    loop = new Tone.Loop((time) => {
        const currentNote = document.querySelector(`.note[data-note="${count % 4}"]`);
        currentNote.classList.add('playing');
        if (sounds[selectedSounds[count % 4]]) {
            const synth = sounds[selectedSounds[count % 4]];
            const settings = soundSettings[count % 4];
            synth.oscillator.frequency.value = settings.frequency;
            synth.oscillator.detune.value = settings.detune;
            synth.oscillator.phase = settings.phase;
            synth.volume.value = settings.volume;
            synth.triggerAttackRelease('C4', '8n', time);
        }
        setTimeout(() => {
            currentNote.classList.remove('playing');
        }, (60000 / bpm) / 2); // Remove class after half a beat
        count++;
    }, "4n").start(0);  // Every quarter note

    Tone.Transport.start();
    document.getElementById('start-stop').textContent = 'Stop';
}

// Stop metronome
function stopMetronome() {
    isPlaying = false;
    if (loop) loop.stop();
    Tone.Transport.stop();
    document.getElementById('start-stop').textContent = 'Start';
}