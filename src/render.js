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
let metronomeBuffer = [];
let pendulumBuffer = [];

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

    window.addEventListener('resize', () => {
        if (isPlaying && isPendulumMode) {
            const barElement = document.querySelector('.horizontal-bar');
            const pendulumElement = document.querySelector('.pendulum');
            if (barElement && pendulumElement) {
                const barWidth = barElement.clientWidth;
                const pendulumWidth = pendulumElement.clientWidth;
                const maxPosition = barWidth - pendulumWidth;

                // Пересчитайте позиции или обновите параметры
                pendulumElement.style.left = `${Math.min(maxPosition, lastPosition)}px`;
            }
        }
    });


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
        const newBpm = parseInt(e.target.value, 10) || 120;
        handleBpmChange(newBpm);
    });

    document.getElementById('bpm').addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    document.getElementById('increase-bpm-1').addEventListener('click', () => {
        const newBpm = bpm + 1;
        document.getElementById('bpm').value = newBpm;
        handleBpmChange(newBpm);
    });

    document.getElementById('increase-bpm-5').addEventListener('click', () => {
        const newBpm = bpm + 5;
        document.getElementById('bpm').value = newBpm;
        handleBpmChange(newBpm);
    });

    document.getElementById('decrease-bpm-1').addEventListener('click', () => {
        const newBpm = bpm - 1;
        document.getElementById('bpm').value = newBpm;
        handleBpmChange(newBpm);
    });

    document.getElementById('decrease-bpm-5').addEventListener('click', () => {
        const newBpm = bpm - 5;
        document.getElementById('bpm').value = newBpm;
        handleBpmChange(newBpm);
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

function generateMetronomeSequence() {
    const sequence = [];
    for (let i = 0; i < 4; i++) {
        const sound = sounds[selectedSounds[i]];
        const settings = soundSettings[i];
        sequence.push({sound, settings});
    }
    return sequence;
}

function getMetronomeSequence() {
    if (metronomeBuffer.length === 0) {
        metronomeBuffer = generateMetronomeSequence();
    }
    return metronomeBuffer;
}

let pendulumAnimationFrame; // Чтобы остановить текущую анимацию

function movePendulum() {
    const pendulumElement = document.querySelector('.pendulum');
    const barElement = document.querySelector('.horizontal-bar');

    if (!pendulumElement || !barElement) {
        console.error('Pendulum or bar element not found.');
        return;
    }

    const barWidth = barElement.clientWidth;
    const pendulumWidth = pendulumElement.clientWidth;
    const maxPosition = barWidth - pendulumWidth; // Амплитуда движения
    const beatDuration = (60 / bpm) * 1000; // Длительность одного бита в миллисекундах
    const pendulumPeriod = beatDuration * 2; // Полный цикл (туда и обратно)

    let startTime = performance.now();

    function updatePendulumPosition(currentTime) {
        if (!isPlaying) return; // Прерываем анимацию, если метроном остановлен

        const elapsed = (currentTime - startTime) % pendulumPeriod;
        const normalizedTime = elapsed / pendulumPeriod; // От 0 до 1

        const position = normalizedTime <= 0.5
            ? normalizedTime * 2 * maxPosition // Движение вправо
            : maxPosition - (normalizedTime - 0.5) * 2 * maxPosition; // Движение влево

        pendulumElement.style.left = `${position}px`;

        pendulumAnimationFrame = requestAnimationFrame(updatePendulumPosition);
    }

    startTime = performance.now();
    pendulumAnimationFrame = requestAnimationFrame(updatePendulumPosition);

    // Синхронизация с метрономом
    Tone.Transport.scheduleRepeat(() => {
        startTime = performance.now(); // Сброс времени анимации при каждом бите
    }, "2n");
}

function resetPendulumAnimation() {
    cancelAnimationFrame(pendulumAnimationFrame); // Останавливаем текущую анимацию
    movePendulum(); // Перезапускаем анимацию с новыми настройками
}


function startMetronome() {
    isPlaying = true;
    isPendulumMode = true;
    Tone.Transport.bpm.value = bpm;

    const flashingBar = document.querySelector('.flashing-bar');
    const sequence = getMetronomeSequence();

    let count = 0;
    loop = new Tone.Loop((time) => {
        const currentNote = document.querySelector(`.note[data-note="${count % 4}"]`);
        currentNote.classList.add('playing');
        const {sound, settings} = sequence[count % 4];
        if (sound) {
            sound.oscillator.frequency.value = settings.frequency;
            sound.oscillator.detune.value = settings.detune;
            sound.oscillator.phase = settings.phase;
            sound.volume.value = settings.volume;
            sound.triggerAttackRelease('C4', '8n', time);
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
    movePendulum(); // Запускаем маятник
}


function stopMetronome() {
    isPlaying = false;
    isPendulumMode = false;
    if (loop) loop.stop();
    Tone.Transport.stop();
    document.getElementById('start-stop').textContent = 'Start';

    // Сбросить маятник в начальное положение
    const pendulumElement = document.querySelector('.pendulum');
    pendulumElement.style.left = '0px';
}

function handleBpmChange(newBpm) {
    bpm = newBpm;
    if (loop) loop.stop();  // Останавливаем текущий цикл метронома
    if (isPlaying) {
        stopMetronome();  // Останавливаем метроном
        resetPendulumAnimation();  // Сбрасываем и перезапускаем анимацию маятника
        startMetronome();  // Перезапускаем метроном с новым BPM
    }
}
