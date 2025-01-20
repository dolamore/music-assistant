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
let isPendulumMode = false;

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('settings-panel').classList.add('hidden');

    document.getElementById('toggle-pendulum').addEventListener('change', function (e) {
        document.querySelector('.horizontal-bar').classList.toggle('hidden', !e.target.checked);
    });

    document.getElementById('toggle-flashing-bar').addEventListener('change', function (e) {
        document.querySelector('.flashing-bar').classList.toggle('hidden', !e.target.checked);
    });

    document.getElementById('toggle-note-bar').addEventListener('change', function (e) {
        document.querySelectorAll('.note').forEach(note => {
            note.classList.toggle('hidden', !e.target.checked);
        });
    });

    function movePendulum() {
        if (isPendulumMode) {
            const barElement = document.querySelector('.horizontal-bar');
            const pendulumElement = document.querySelector('.pendulum');
            let barWidth = barElement.clientWidth - pendulumElement.clientWidth; // Adjust bar width
            let pixelsPerBeat = barWidth; // Distance the pendulum should move per beat
            let position = 0;
            let direction = 1; // 1 for forward, -1 for backward

            function updatePendulumPosition() {
                if (!isPendulumMode) return;

                position += direction * pixelsPerBeat;

                if (position >= barWidth || position <= 0) {
                    direction *= -1; // Reverse direction
                    position = Math.max(0, Math.min(barWidth, position)); // Ensure position stays within bounds
                }

                pendulumElement.style.left = `${position}px`;
            }

            function syncPendulum() {
                updatePendulumPosition();
            }

            Tone.Transport.scheduleRepeat(syncPendulum, "4n"); // Schedule the sync for each quarter note
            Tone.Transport.start(); // Ensure the transport is started
        }
    }

    function startMetronome() {
        isPlaying = true;
        isPendulumMode = true;
        Tone.Transport.bpm.value = bpm;

        const flashingBar = document.querySelector('.flashing-bar');

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

            // Flash the bar
            flashingBar.style.opacity = 1;
            setTimeout(() => {
                flashingBar.style.opacity = 0;
                currentNote.classList.remove('playing');
            }, 100); // Flash duration
            count++;
        }, "4n").start(0);  // Every quarter note

        Tone.Transport.start();
        document.getElementById('start-stop').textContent = 'Stop';
        movePendulum();
    }

    function stopMetronome() {
        isPlaying = false;
        isPendulumMode = false;
        if (loop) loop.stop();
        Tone.Transport.stop();
        document.getElementById('start-stop').textContent = 'Start';

        // Reset pendulum position
        const pendulumElement = document.querySelector('.pendulum');
        pendulumElement.style.left = '0px';
    }

    const settingsButton = document.getElementById('settings');
    if (settingsButton) {
        settingsButton.addEventListener('click', function () {
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

    document.getElementById('bpm').addEventListener('input', (e) => {
        bpm = parseInt(e.target.value, 10) || 120;
        if (loop) loop.stop();
        if (isPlaying) startMetronome();
    });

    document.getElementById('bpm').addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    document.getElementById('increase-bpm-1').addEventListener('click', () => {
        bpm += 1;
        document.getElementById('bpm').value = bpm;
        if (loop) loop.stop();
        if (isPlaying) startMetronome();
    });

    document.getElementById('increase-bpm-5').addEventListener('click', () => {
        bpm += 5;
        document.getElementById('bpm').value = bpm;
        if (loop) loop.stop();
        if (isPlaying) startMetronome();
    });

    document.getElementById('decrease-bpm-1').addEventListener('click', () => {
        bpm -= 1;
        document.getElementById('bpm').value = bpm;
        if (loop) loop.stop();
        if (isPlaying) startMetronome();
    });

    document.getElementById('decrease-bpm-5').addEventListener('click', () => {
        bpm -= 5;
        document.getElementById('bpm').value = bpm;
        if (loop) loop.stop();
        if (isPlaying) startMetronome();
    });

    document.getElementById('start-stop').addEventListener('click', async () => {
        await Tone.start();
        if (isPlaying) {
            stopMetronome();
        } else {
            startMetronome();
        }
    });

    document.querySelectorAll('.note').forEach(button => {
        button.addEventListener('click', (e) => {
            const noteIndex = parseInt(e.target.dataset.note, 10);
            selectedSounds[noteIndex] = (selectedSounds[noteIndex] + 1) % sounds.length;
            e.target.dataset.sound = selectedSounds[noteIndex];
        });
    });

    render();
});

function render() {
    document.getElementById('bpm').value = bpm;

    document.querySelectorAll('.note').forEach((note, index) => {
        note.dataset.sound = selectedSounds[index];
        note.classList.toggle('playing', isPlaying && (index === (Tone.Transport.position.split(':')[1] % 4)));
    });
}