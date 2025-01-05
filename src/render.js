import * as Tone from 'https://cdn.skypack.dev/tone';

const click = new Tone.NoiseSynth({
    noise: {
        type: 'white',
        playbackRate: 1
    },
    envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1
    }
}).toDestination();

let bpm = 120;
let isPlaying = false;
let loop;

// Update BPM from input
document.getElementById('bpm').addEventListener('input', (e) => {
    bpm = parseInt(e.target.value, 10) || 120;
    if (loop) loop.stop();
    if (isPlaying) startMetronome();
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

// Start metronome
function startMetronome() {
    isPlaying = true;
    Tone.Transport.bpm.value = bpm;

    loop = new Tone.Loop((time) => {
        click.triggerAttackRelease('8n', time);
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