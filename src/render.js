import * as Tone from 'https://cdn.skypack.dev/tone';
import {noteMultipliers, noteSizes, sounds} from './vars.js';

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
let count = 0;
let isPendulumMode = false;
let metronomeBuffer = [];
let pendulumAnimationFrame;
let currentNoteSizeIndex = 2;

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('settings-panel').classList.add('hidden');

    document.getElementById('bpm').value = bpm;

    document.getElementById('decrease-beats').addEventListener('click', () => {
        decreaseBeat();
    });

    document.getElementById('increase-beats').addEventListener('click', () => {
        increaseBeat();
    });

    document.getElementById('increase-notes').addEventListener('click', () => {
        if (currentNoteSizeIndex < noteSizes.length - 1) {
            currentNoteSizeIndex++;
            updateNoteSize();
        }
    });

    document.getElementById('decrease-notes').addEventListener('click', () => {
        if (currentNoteSizeIndex > 0) {
            currentNoteSizeIndex--;
            updateNoteSize();
        }
    });

    document.getElementById('toggle-pendulum').addEventListener('change', function (e) {
        const pendulumElement = document.querySelector('.pendulum');
        const barElement = document.querySelector('.horizontal-bar');
        if (e.target.checked) {
            pendulumElement.style.opacity = '1';
            barElement.style.opacity = '1';
        } else {
            pendulumElement.style.opacity = '0';
            barElement.style.opacity = '0';
        }
    });

    document.getElementById('toggle-flashing-bar').addEventListener('change', function (e) {
        document.querySelector('.flashing-bar').classList.toggle('hidden', !e.target.checked);
    });

    document.getElementById('toggle-note-bar').addEventListener('change', function (e) {
        document.querySelectorAll('.beat').forEach(note => {
            note.classList.toggle('hidden', !e.target.checked);
        });
    });

    window.addEventListener('resize', () => {
        if (isPlaying) {
            restartMetronomeAndPendulum();
        }
    });

    document.getElementById('settings').addEventListener('click', function () {
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

    document.getElementById('save-settings').addEventListener('click', function () {
        const beatRows = document.querySelectorAll('.sound-row');
        selectedSounds = [];
        soundSettings = [];

        // Извлекаем и обновляем настройки для каждого бита
        beatRows.forEach((row, index) => {
            selectedSounds.push(parseInt(row.querySelector('select').value, 10));
            soundSettings.push({
                frequency: parseFloat(row.querySelector('input[placeholder="Frequency"]').value),
                detune: parseFloat(row.querySelector('input[placeholder="Detune"]').value),
                phase: parseFloat(row.querySelector('input[placeholder="Phase"]').value),
                volume: parseFloat(row.querySelector('input[placeholder="Volume"]').value)
            });
        });

        // Обновляем данные в DOM
        document.querySelectorAll('.beat').forEach((beat, index) => {
            beat.dataset.sound = selectedSounds[index];  // Обновляем звук для каждого бита
        });

        // Перегенерируем последовательность для метронома с новыми настройками
        metronomeBuffer = generateMetronomeSequence();

        // Обновляем метроном, не останавливая его
        if (isPlaying) {
            updateMetronomeSequence();
        }

        // Скрываем панель настроек
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

    document.querySelector('.beat-container').addEventListener('click', (event) => {
        const beatElement = event.target.closest('.beat');
        changeBeatSound(beatElement);
    });
});

function createMetronomeLoop() {
    const sequence = generateFixedMetronomeSequence(); // Получаем последовательность

    return new Tone.Loop((time) => {
        const currentStep = count % sequence.length; // Двигаемся по всей длине последовательности

        const currentNote = sequence[currentStep];
        if (currentNote) { // Просто проверяем, есть ли тут нота
            const { sound, settings } = currentNote;
            sound.oscillator.frequency.value = settings.frequency;
            sound.oscillator.detune.value = settings.detune;
            sound.oscillator.phase = settings.phase;
            sound.volume.value = settings.volume;
            sound.triggerAttackRelease('C4', '64n', time); // Проигрываем 1/64 ноту

            // Визуальный эффект мигания
            const flashingBar = document.querySelector('.flashing-bar');
            flashingBar.style.opacity = 1;
            setTimeout(() => flashingBar.style.opacity = 0, 100);

            // Подсветка текущего бита
            const beatElement = document.querySelector(`.beat[data-beat="${currentNote.beatIndex}"]`);
            beatElement.classList.add('playing');
            setTimeout(() => beatElement.classList.remove('playing'), 100);
        }

        count++;
    }, '64n'); // Всегда двигаемся с разрешением 1/64
}

function startMetronome() {
    isPlaying = true;
    isPendulumMode = true;

    const noteSize = noteSizes[currentNoteSizeIndex]; // Получаем текущий размер ноты
    Tone.Transport.bpm.value = bpm;

    // Создаем новый луп с нужными параметрами
    loop = createMetronomeLoop(noteSize);

    loop.start(0); // Стартуем луп

    Tone.Transport.start();
    document.getElementById('start-stop').textContent = 'Stop';
    movePendulum(); // Запускаем анимацию маятника
}

function changeBeatSound(beatElement) {
    const beatIndex = parseInt(beatElement.dataset.beat, 10);
    const currentSound = parseInt(beatElement.dataset.sound, 10);

    // Cycle through sounds (1 - Sound 1, ..., 4 - Sound 4, 0 - No Sound)
    const nextSound = (currentSound % sounds.length) + 1;
    beatElement.dataset.sound = nextSound;

    // Update selectedSounds array
    selectedSounds[beatIndex] = nextSound;

    // Update select in sound settings
    const soundSelect = document.getElementById(`sound-${beatIndex}`);
    if (soundSelect) {
        soundSelect.value = nextSound;
    }

    // Regenerate metronome sequence
    metronomeBuffer = generateMetronomeSequence();

    // Update metronome sequence without restarting
    if (isPlaying) {
        updateMetronomeSequence();
    }
}

function updateMetronomeSequence() {
    const sequence = generateFixedMetronomeSequence();  // Get the updated sequence

    // Update the loop callback with the new sequence
    loop.callback = (time) => {
        const currentStep = count % sequence.length;
        const currentNote = sequence[currentStep];
        if (currentNote) {
            const { sound, settings } = currentNote;
            sound.oscillator.frequency.value = settings.frequency;
            sound.oscillator.detune.value = settings.detune;
            sound.oscillator.phase = settings.phase;
            sound.volume.value = settings.volume;
            sound.triggerAttackRelease('C4', '64n', time);

            // Visual flashing
            const flashingBar = document.querySelector('.flashing-bar');
            flashingBar.style.opacity = 1;
            setTimeout(() => flashingBar.style.opacity = 0, 100);

            // Highlight the current beat
            const beatElement = document.querySelector(`.beat[data-beat="${currentNote.beatIndex}"]`);
            beatElement.classList.add('playing');
            setTimeout(() => beatElement.classList.remove('playing'), 100);
        }
        count++;
    };
}

function generateMetronomeSequence() {
    const sequence = [];
    const beatRows = document.querySelectorAll('.sound-row');
    for (let i = 0; i < beatRows.length; i++) {
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
}// Чтобы остановить текущую анимацию

function stopMetronome() {
    isPlaying = false;
    isPendulumMode = false;
    if (loop) loop.stop();
    Tone.Transport.stop();
    document.getElementById('start-stop').textContent = 'Start';

    // Сбросить маятник в начальное положение
    const pendulumElement = document.querySelector('.pendulum');
    pendulumElement.style.left = '0px';
    count = 0;
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

function restartMetronomeAndPendulum() {
    stopMetronome();
    resetPendulumAnimation();
    startMetronome();
}

function updateNoteSize() {
    updateTimeSignature()

    if (isPlaying) {
        stopMetronome();  // Stop the metronome
        startMetronome(); // Restart the metronome with the new note size
    }
}

function updateTimeSignature() {
    const beatsCount = document.querySelectorAll('.beat-wrapper').length;
    const noteSize = noteSizes[currentNoteSizeIndex];
    document.getElementById('time-signature').textContent = `${beatsCount}/${noteSize.replace('n', '')}`;
}

function movePendulum() {
    const pendulumElement = document.querySelector('.pendulum');
    const barElement = document.querySelector('.horizontal-bar');

    const barWidth = barElement.clientWidth;
    const pendulumWidth = pendulumElement.clientWidth;
    const maxPosition = barWidth - pendulumWidth; // Amplitude of movement
    const beatDuration = (60 / bpm) * 1000 * noteMultipliers[currentNoteSizeIndex]; // Duration of one beat in milliseconds
    const pendulumPeriod = beatDuration * 2; // Full cycle (back and forth)

    let startTime = performance.now();

    function updatePendulumPosition(currentTime) {
        if (!isPlaying) return; // Stop animation if metronome is stopped

        const elapsed = (currentTime - startTime) % pendulumPeriod;
        const normalizedTime = elapsed / pendulumPeriod; // From 0 to 1

        const position = normalizedTime <= 0.5
            ? normalizedTime * 2 * maxPosition // Move right
            : maxPosition - (normalizedTime - 0.5) * 2 * maxPosition; // Move left

        pendulumElement.style.left = `${position}px`;

        pendulumAnimationFrame = requestAnimationFrame(updatePendulumPosition);
    }

    startTime = performance.now();
    requestAnimationFrame(updatePendulumPosition);
}

function resetPendulumAnimation() {
    cancelAnimationFrame(pendulumAnimationFrame); // Stop the current animation
    const pendulumElement = document.querySelector('.pendulum');
    pendulumElement.style.left = '0px'; // Reset pendulum to initial position
}

function decreaseBeat() {
    const beatRows = document.querySelectorAll('.sound-row');
    if (beatRows.length > 1) {
        // Удаляем последнюю строку из DOM
        beatRows[beatRows.length - 1].remove();

        // Удаляем последний элемент из beat-container
        const beatContainer = document.querySelector('.beat-container');
        const lastBeatWrapper = beatContainer.lastElementChild;
        if (lastBeatWrapper) {
            lastBeatWrapper.remove();
        }

        // Обновляем массивы
        selectedSounds.pop();
        soundSettings.pop();
        metronomeBuffer.pop();

        // Пересчитываем количество битов
        document.getElementById('beats-count').textContent = document.querySelectorAll('.beat-wrapper').length;

        // Используем setTimeout, чтобы подождать завершения обновления DOM
        setTimeout(() => {
            updateTimeSignature();
        }, 0);

        // Если метроном запущен, обновляем его
        if (isPlaying) {
            updateMetronomeSequence();
        }
    }
}


function increaseBeat() {
    const beatRows = document.querySelectorAll('.sound-row');
    if (beatRows.length < 16) { // Ограничение на максимальное количество битов
        const newBeatIndex = beatRows.length;

        // Добавляем новую строку в настройки звуков
        const settingsPanel = document.querySelector('.sound-settings');
        const newSoundRow = document.createElement('div');
        newSoundRow.classList.add('sound-row');
        newSoundRow.innerHTML = `
            <label for="sound-${newBeatIndex}">Beat ${newBeatIndex + 1}:</label>
            <select id="sound-${newBeatIndex}">
                <option value="0">No Sound</option>
                <option value="1" selected>Sound 1</option>
                <option value="2">Sound 2</option>
                <option value="3">Sound 3</option>
                <option value="4">Sound 4</option>
            </select>
            <input id="frequency-${newBeatIndex}" type="number" placeholder="Frequency" value="440">
            <input id="detune-${newBeatIndex}" type="number" placeholder="Detune" value="0">
            <input id="phase-${newBeatIndex}" type="number" placeholder="Phase" value="0">
            <input id="volume-${newBeatIndex}" type="number" placeholder="Volume" value="0">
        `;
        settingsPanel.appendChild(newSoundRow);

        // Добавляем новый элемент в beat-container
        const beatContainer = document.querySelector('.beat-container');
        const newBeatWrapper = document.createElement('div');
        newBeatWrapper.classList.add('beat-wrapper');
        newBeatWrapper.innerHTML = `
            <div class="beat" data-beat="${newBeatIndex}" data-sound="1"></div>
            <select class="note-size-dropdown" data-beat="${newBeatIndex}">
                <option value="1">1</option>
                <option value="2">1/2</option>
                <option value="4" selected>1/4</option>
                <option value="8">1/8</option>
                <option value="16">1/16</option>
                <option value="32">1/32</option>
                <option value="64">1/64</option>
            </select>
        `;
        beatContainer.appendChild(newBeatWrapper);

        // Обновляем массивы
        selectedSounds.push(1); // Звук по умолчанию
        soundSettings.push({
            frequency: 440,
            detune: 0,
            phase: 0,
            volume: 0
        });

        // Обновляем количество битов
        document.getElementById('beats-count').textContent = beatRows.length + 1;

        // Перегенерируем последовательность для метронома
        metronomeBuffer = generateMetronomeSequence();

        // Обновляем последовательность метронома без перезапуска
        if (isPlaying) {
            updateMetronomeSequence();
        }

        // Обновляем тактовую сетку (если нужно)
        updateTimeSignature();
    }
}

function generateFixedMetronomeSequence() {
    const beats = document.querySelectorAll('.beat-wrapper');
    let totalSteps = 0;

    beats.forEach((beatWrapper) => {
        const noteSize = parseInt(beatWrapper.querySelector('.note-size-dropdown').value, 10);
        totalSteps += 64 / noteSize;
    });

    const sequence = new Array(totalSteps).fill(null);
    let position = 0; // Current position pointer

    beats.forEach((beatWrapper, index) => {
        const noteSize = parseInt(beatWrapper.querySelector('.note-size-dropdown').value, 10);
        const stepSize = 64 / noteSize; // Number of steps this beat occupies

        sequence[position] = {
            sound: sounds[selectedSounds[index]],
            settings: soundSettings[index],
            beatIndex: index
        };
        position += stepSize; // Move to the next beat
    });

    return sequence;
}







