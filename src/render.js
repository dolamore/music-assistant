import * as Tone from 'https://cdn.skypack.dev/tone';
import {noteMultipliers, sounds, initialNumberOfBeats, defaultSoundSettings, beatHTML, buttons} from './vars.js';

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
            buttons.startStopButton.click();
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
        document.querySelectorAll('.note-size-dropdown').forEach((dropdown) => {
            changeDropdownSize(dropdown, true);
        });
        updateTimeSignature();
        checkNotesLimit();
        if (isPlaying) {
            restartMetronomeAndPendulum();
        }

    });

    document.getElementById('decrease-notes').addEventListener('click', () => {
        document.querySelectorAll('.note-size-dropdown').forEach((dropdown) => {
            changeDropdownSize(dropdown, false);
        });
        updateTimeSignature();
        checkNotesLimit();
        if (isPlaying) {
            restartMetronomeAndPendulum();
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

    buttons.settingsButton.addEventListener('click', function () {
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

    buttons.startStopButton.addEventListener('click', async () => {
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

    document.addEventListener('change', function (event) {
        if (event.target.matches('.note-size-dropdown') || event.target.matches('.note-amount-dropdown')) {
            updateTimeSignature();
            checkNotesLimit();
        }
    });

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('beat')) {
            changeBeatSound(event.target);
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

    Tone.Transport.bpm.value = bpm * 3;

    // Создаем новый луп с нужными параметрами
    loop = createMetronomeLoop();

    loop.start(0); // Стартуем луп

    Tone.Transport.start();
    buttons.startStopButton.textContent = 'Stop';
    movePendulum(); // Запускаем анимацию маятника

    console.log(countSize());
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
    buttons.startStopButton.textContent = 'Start';

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

function updateTimeSignature() {
    const timeSignature = countSize();
    document.getElementById('time-signature').textContent = `${timeSignature.beatAmount}/${timeSignature.tactSize}`;
}

function countSize() {
    let beatAmount = 0;
    const beats = document.querySelectorAll('.beat-wrapper');
    let beatPattern = [];

    beats.forEach((beat) => {
        const noteData = parseNoteSize(beat.querySelector('.note-size-dropdown').value);
        const noteAmount = parseInt(beat.querySelector('.note-amount-dropdown').value, 10);
        const isTriplet = noteData.isTriplet;
        const noteSize = noteData.number;

        for (let i = 0; i < (isTriplet ? 3 * noteAmount : noteAmount); i++) {
            beatPattern.push(isTriplet ? noteSize * 3 / 2 : noteSize);
        }
    });

    const denominator = lcmArray(beatPattern);

    beats.forEach((beat) => {
        const noteData = parseNoteSize(beat.querySelector('.note-size-dropdown').value);
        const noteAmount = parseInt(beat.querySelector('.note-amount-dropdown').value, 10);
        const isTriplet = noteData.isTriplet;
        const noteSize = isTriplet ? noteData.number * 3 / 2 : noteData.number;

        if (isTriplet) {
            beatAmount += noteAmount * 3 * (denominator / noteSize);
        } else {
            beatAmount += noteAmount * (denominator / noteSize);
        }
    });

    return {beatAmount: beatAmount, tactSize: denominator};
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

function lcmArray(arr) {
    return arr.reduce((a, b) => lcm(a, b));
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

        updateTimeSignature();
        checkNotesLimit();
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
        checkNotesLimit();
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
            sequence[position] = {sound, settings, beatIndex: index};
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
        <option value="1" selected>Sine</option>
        <option value="2">Triangle</option>
        <option value="3">Square</option>
        <option value="4">Sawtooth</option>
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
    beatWrapper.innerHTML = beatHTML(index);

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
        const {sound, settings} = currentNote;

        // Динамически применяем все параметры из settings к sound
        for (const key in settings) {
            if (settings.hasOwnProperty(key)) {
                if (key in sound) {
                    // Если параметр есть в объекте sound (например, volume)
                    sound[key].value = settings[key];
                } else if (key in sound.oscillator) {
                    // Если параметр относится к осциллятору (например, frequency, detune, phase)
                    sound.oscillator[key] = settings[key];
                } else if (key in sound.envelope) {
                    // Если параметр относится к огибающей (например, attack, decay, sustain, release)
                    sound.envelope[key] = settings[key];
                } else if (key in sound.filter) {
                    // Если параметр относится к фильтру (например, filterFrequency, filterQ, filterType)
                    sound.filter[key] = settings[key];
                }
            }
        }

        // Запускаем звук
        sound.triggerAttackRelease('C4', '64n', time);

        // Визуальные эффекты
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
    const soundSettingsContainer = document.querySelector('.sound-settings');

    Object.keys(defaultSoundSettings).forEach((key) => {
        const label = document.createElement('span');
        label.textContent = key.charAt(0).toUpperCase() + key.slice(1); // Преобразуем ключ в читаемое имя (например, 'frequency' -> 'Frequency')

        // Добавляем label в контейнер labels
        labelsContainer.appendChild(label);
        const numColumns = Object.keys(defaultSoundSettings).length;
        soundSettingsContainer.style.gridTemplateColumns = `150px repeat(${numColumns + 1}, 1fr)`;
    });
}

function changeDropdownSize(dropdown, direction) {
    const options = Array.from(dropdown.options);
    const currentIndex = options.findIndex(option => option.value === dropdown.value);
    // Изменяем индекс с учетом пропуска триолей
    let newIndex = currentIndex + (direction ? 2 : -2);

    // Проверяем валидность нового значения
    const newValue = parseInt(options[newIndex]?.value);
    if (newValue >= 1 && newValue <= 64) {
        dropdown.value = options[newIndex].value;
    }
}

function checkNotesLimit() {
    const noteSizeDropdowns = document.querySelectorAll('.note-size-dropdown');
    let minLimit = false;
    let maxLimit = false;

    noteSizeDropdowns.forEach((dropdown) => {
        const currentValue = parseInt(dropdown.value);

        if (currentValue === 1) {
            minLimit = true;
        }

        if (currentValue === 64) {
            maxLimit = true;
        }
    });

    document.getElementById('decrease-notes').disabled = minLimit;
    document.getElementById('increase-notes').disabled = maxLimit;
    document.getElementById('increase-notes').classList.toggle('button-limit', maxLimit);
    document.getElementById('decrease-notes').classList.toggle('button-limit', minLimit);
}
