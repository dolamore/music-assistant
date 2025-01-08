import * as Tone from 'https://cdn.skypack.dev/tone';

const sounds = [
    new Tone.Synth().toDestination(),
    new Tone.Synth({ oscillator: { type: 'square' } }).toDestination(),
    new Tone.Synth({ oscillator: { type: 'triangle' } }).toDestination(),
    new Tone.Synth({ oscillator: { type: 'sawtooth' } }).toDestination()
];

let selectedSounds = [0, 0, 0, 0]; // Default to the first sound for all notes
let bpm = 120;
let isPlaying = false;
let loop;

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
        e.target.textContent = `Note ${noteIndex + 1} (Sound ${selectedSounds[noteIndex] + 1})`;
    });
});

// Start metronome
function startMetronome() {
    isPlaying = true;
    Tone.Transport.bpm.value = bpm;

    let count = 0;
    loop = new Tone.Loop((time) => {
        sounds[selectedSounds[count % 4]].triggerAttackRelease('C4', '8n', time);
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