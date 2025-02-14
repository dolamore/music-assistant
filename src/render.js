import * as Tone from 'https://cdn.skypack.dev/tone';
import {noteMultipliers, noteSizes, sounds, initialNumberOfBeats, defaultSoundSettings} from './vars.js';

let selectedSounds = [1, 1, 1, 1]; // Default to the first sound for all notes
let soundSettings = [];
let bpm = 120;
let isPlaying = false;
let loop;
let count = 0;
let loopCount = 0;
let isPendulumMode = false;
let pendulumAnimationFrame;
let currentNoteSizeIndex = 2;

document.addEventListener('DOMContentLoaded', function () {
    renderSoundSettings();

    initialBeatRender();

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault(); // Предотвращаем скролл страницы
            toggleMetronome();
        }
    });

    document.getElementById('settings-panel').classList.add('hidden');

    document.getElementById('training-settings').classList.add('hidden');

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
        document.getElementById('settings-panel').classList.toggle('hidden');
    });

    document.getElementById('save-settings').addEventListener('click', function () {
        const beatRows = document.querySelectorAll('.sound-row');
        selectedSounds = [];
        soundSettings = [];

        // Извлекаем и обновляем настройки для каждого бита
        beatRows.forEach((row) => {
            selectedSounds.push(parseInt(row.querySelector('select').value, 10));
            soundSettings.push(getSoundSettings(row));
        });

        // Обновляем данные в DOM
        document.querySelectorAll('.beat').forEach((beat, index) => {
            beat.dataset.sound = selectedSounds[index];  // Обновляем звук для каждого бита
        });

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

    document.getElementById('training-mode').addEventListener('change', function (e) {
        const trainingSettings = document.getElementById('training-settings');
        if (e.target.checked) {
            trainingSettings.classList.remove('hidden');
        } else {
            trainingSettings.classList.add('hidden');
        }
    });
});

function createMetronomeLoop() {
    const sequence = generateFixedMetronomeSequence();
    let skipper = 0;

    return new Tone.Loop((time) => {
        const currentStep = count % sequence.length;
        const isStartOfLoop = currentStep === 0;

        const isTrainingMode = document.getElementById('training-mode').checked;
        const noteSkipProbability = parseInt(document.getElementById('note-skip-probability').value, 10) / 100;
        const loopSkipProbability = parseInt(document.getElementById('loop-skip-probability').value, 10) / 100;

        if (isTrainingMode && isStartOfLoop && Math.random() < loopSkipProbability) {
            skipper = sequence.length;
        }

        if (skipper > 0) {
            skipper--;
        } else {
            playMetronomeStep(sequence, currentStep, time, isTrainingMode, noteSkipProbability);
        }

        if (isStartOfLoop) {
            document.getElementById('loop-counter').textContent = loopCount++;
        }

        count++;
    }, '64n');
}

function startMetronome() {
    isPlaying = true;
    isPendulumMode = true;

    const noteSize = noteSizes[currentNoteSizeIndex]; // Получаем текущий размер ноты
    Tone.Transport.bpm.value = bpm * 3;

    // Создаем новый луп с нужными параметрами
    loop = createMetronomeLoop(noteSize);

    loop.start(0); // Стартуем луп

    Tone.Transport.start();
    document.getElementById('start-stop').textContent = 'Stop';
    movePendulum(); // Запускаем анимацию маятника
}

function changeBeatSound(beatElement) {
    const beatIndex = parseInt(beatElement.dataset.beat, 10);
    console.log("beat index: " + beatIndex);
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

    // Update metronome sequence without restarting
    if (isPlaying) {
        updateMetronomeSequence();
    }
}

function updateMetronomeSequence() {
    const sequence = generateFixedMetronomeSequence();
    loop.callback = (time) => {
        const currentStep = count % sequence.length;
        playMetronomeStep(sequence, currentStep, time, false, 0);
        count++;
    };
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
    count = 0;
    loopCount = 0;
    document.getElementById('loop-counter').textContent = loopCount;
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

        // Создаём новый элемент и добавляем его на страницу
        createBeatElement(newBeatIndex);

        // Обновляем массивы
        selectedSounds.push(1); // Звук по умолчанию
        soundSettings.push(defaultSoundSettings);

        // Обновляем количество битов
        document.getElementById('beats-count').textContent = newBeatIndex + 1;

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
        const noteSize = parseNoteSize(beatWrapper.querySelector('.note-size-dropdown').value).number;
        const noteAmount = parseInt(beatWrapper.querySelector('.note-amount-dropdown').value, 10);

        totalSteps += 64 / noteSize * 3 * noteAmount;
    });

    const sequence = new Array(totalSteps).fill(null);
    let position = 0; // Current position pointer

    beats.forEach((beatWrapper, index) => {
        const parsedNote = parseNoteSize(beatWrapper.querySelector('.note-size-dropdown').value);
        const noteAmount = parseInt(beatWrapper.querySelector('.note-amount-dropdown').value, 10);
        const noteSize = parsedNote.number;
        const isTriplet = parsedNote.isTriplet;
        const stepSize = isTriplet ? (64 / noteSize) : (64 / noteSize * 3);
        const sound = sounds[selectedSounds[index]];
        const settings = soundSettings[index]; // Получаем актуальные настройки звука

        for (let i = 0; i < (isTriplet ? 3 * noteAmount : noteAmount); i++) {
            sequence[position] = { sound, settings, beatIndex: index };
            position += stepSize;
        }
    });

    return sequence;
}

function parseNoteSize(value) {
    const isTriplet = value.endsWith('T'); // Проверяем, есть ли 'T' в конце
    const number = parseInt(value, 10); // Извлекаем числовое значение

    return {number, isTriplet};
}

function toggleMetronome() {
    const button = document.getElementById('start-stop');
    button.click(); // Имитация клика по кнопке
}

function createInputField(key, index) {
    const input = document.createElement('input');
    input.id = `${key}-${index}`;
    input.type = 'number';
    input.placeholder = key.charAt(0).toUpperCase() + key.slice(1);
    input.value = defaultSoundSettings[key];
    return input;
}

function createSoundRow(index) {
    const soundRow = document.createElement('div');
    soundRow.classList.add('sound-row');

    // Создаём метку и выпадающий список звуков
    const label = document.createElement('label');
    label.setAttribute('for', `sound-${index}`);
    label.textContent = `Beat ${index + 1}:`;
    soundRow.appendChild(label);

    const select = document.createElement('select');
    select.id = `sound-${index}`;
    select.innerHTML = `
        <option value="0">No Sound</option>
        <option value="1" selected>Sound 1</option>
        <option value="2">Sound 2</option>
        <option value="3">Sound 3</option>
        <option value="4">Sound 4</option>
    `;
    soundRow.appendChild(select);

    // Добавляем поля ввода на основе defaultSoundSettings
    Object.keys(defaultSoundSettings).forEach(key => {
        soundRow.appendChild(createInputField(key, index));
    });

    return soundRow;
}

function createBeatWrapper(index) {
    const beatWrapper = document.createElement('div');
    beatWrapper.classList.add('beat-wrapper');
    beatWrapper.innerHTML = `
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

    // Добавляем обработчик клика на бит
    const beatElement = beatWrapper.querySelector('.beat');
    beatElement.addEventListener('click', () => {
        changeBeatSound(beatElement);
    });

    return beatWrapper;
}

function createBeatElement(index) {
    const soundSettingsContainer = document.querySelector('.sound-settings');
    soundSettingsContainer.appendChild(createSoundRow(index));

    const beatContainer = document.querySelector('.beat-container');
    beatContainer.appendChild(createBeatWrapper(index));

    // Добавляем настройки звука в массив
    soundSettings.push(defaultSoundSettings);
}

function initialBeatRender() {
    for (let i = 0; i < initialNumberOfBeats; i++) {
        createBeatElement(i);
    }
}

function playMetronomeStep(sequence, currentStep, time, isTrainingMode, noteSkipProbability) {
    const currentNote = sequence[currentStep];
    if (currentNote && !(isTrainingMode && Math.random() < noteSkipProbability)) {
        const { sound, settings } = currentNote;
        sound.oscillator.frequency.value = settings.frequency;
        sound.oscillator.detune.value = settings.detune;
        sound.oscillator.phase = settings.phase;
        sound.volume.value = settings.volume;
        sound.triggerAttackRelease('C4', '64n', time);

        const flashingBar = document.querySelector('.flashing-bar');
        flashingBar.style.opacity = 1;
        setTimeout(() => flashingBar.style.opacity = 0, 100);

        const beatElement = document.querySelector(`.beat[data-beat="${currentNote.beatIndex}"]`);
        beatElement.classList.add('playing');
        setTimeout(() => beatElement.classList.remove('playing'), 100);
    }
}

function getSoundSettings(row) {
    return Object.fromEntries(
        Object.keys(defaultSoundSettings).map(key => {
            const input = row.querySelector(`input[placeholder="${key.charAt(0).toUpperCase() + key.slice(1)}"]`);
            return [
                key,
                input ? parseFloat(input.value) : defaultSoundSettings[key]
            ];
        })
    );
}

function renderSoundSettings() {
    const labelsContainer = document.querySelector('.labels');

    Object.keys(defaultSoundSettings).forEach((key) => {
        const label = document.createElement('span');
        label.textContent = key.charAt(0).toUpperCase() + key.slice(1); // Преобразуем ключ в читаемое имя (например, 'frequency' -> 'Frequency')

        // Добавляем label в контейнер labels
        labelsContainer.appendChild(label);
    });
}
