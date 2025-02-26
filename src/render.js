import * as Tone from 'https://cdn.skypack.dev/tone';
import {
    noteMultipliers,
    sounds,
    initialNumberOfBeats,
    defaultSoundSettings,
    beatHTML,
    buttons,
    elements,
    maxBeatsAmount,
    defaultLoopSkipProbability,
    defaultNoteSkipProbability,
    defaultInitialBPM
} from './vars.js';

let selectedSounds = []; // Default to the first sound for all notes
let soundSettings = [];
let bpm = defaultInitialBPM;
let isPlaying = false;
let loop;
let count = 0;
let loopCount = 0;
let isPendulumMode = false;
let pendulumAnimationFrame;
let currentNoteSizeIndex = 2;
let isTrainingMode = false;
let loopSkipProbability = defaultLoopSkipProbability;
let noteSkipProbability = defaultNoteSkipProbability;
let sequence;
let skipper = 0;
let currentStep = 0;
let isStartOfLoop = false;
let isFirstLoop = true;

document.addEventListener('DOMContentLoaded', function () {
    generateSelectedSounds();
    renderSoundSettings();
    initialBeatRender();

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault(); // Предотвращаем скролл страницы
            buttons.startStopButton.click();
        }
    });

    elements.settingsPanel.classList.add('hidden');

    elements.trainingSettings.classList.add('hidden');

    elements.bpmInput.value = bpm;

    buttons.decreaseBeatsButton.addEventListener('click', () => {
        decreaseBeat();
    });

    buttons.increaseBeatsButton.addEventListener('click', () => {
        increaseBeat();
    });

    buttons.increaseNotesButton.addEventListener('click', () => {
        document.querySelectorAll('.note-size-dropdown').forEach((dropdown) => {
            changeDropdownSize(dropdown, true);
        });
        updateTimeSignature();
        if (isPlaying) {
            restartMetronomeAndPendulum();
        }

    });

    buttons.decreaseNotesButton.addEventListener('click', () => {
        document.querySelectorAll('.note-size-dropdown').forEach((dropdown) => {
            changeDropdownSize(dropdown, false);
        });
        updateTimeSignature();
        if (isPlaying) {
            restartMetronomeAndPendulum();
        }
    });

    buttons.togglePendulumBar.addEventListener('change', function (e) {
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

    buttons.toggleFlashingBar.addEventListener('change', function (e) {
        document.querySelector('.flashing-bar').classList.toggle('hidden', !e.target.checked);
    });

    buttons.toggleBeatBars.addEventListener('change', function (e) {
        document.querySelectorAll('.beat').forEach(beat => {
            beat.classList.toggle('hidden', !e.target.checked);
        });
    });

    window.addEventListener('resize', () => {
        if (isPlaying) {
            restartMetronomeAndPendulum();
        }
    });

    buttons.settingsButton.addEventListener('click', function () {
        elements.settingsPanel.classList.toggle('hidden');
    });

    buttons.saveSettingsButton.addEventListener('click', function () {
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
        elements.settingsPanel.classList.add('hidden');
    });

    elements.bpmInput.addEventListener('input', (e) => {
        handleBpmChange(parseInt(e.target.value, 10));
    });

    elements.bpmInput.addEventListener('blur', () => {
        const oldBpm = bpm;
        handleInputBlur(elements.bpmInput, defaultInitialBPM, bpm);
        if (isPlaying && oldBpm !== defaultInitialBPM) {
            restartMetronomeAndPendulum();
        }
    });

    elements.bpmInput.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    elements.loopSkipProbabilityInput.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    elements.noteSkipProbabilityInput.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    buttons.increaseBPMButton.addEventListener('click', () => {
        const newBpm = bpm + 1;
        handleBpmChange(newBpm);
    });

    buttons.increaseFiveBPMButton.addEventListener('click', () => {
        const newBpm = bpm + 5;
        handleBpmChange(newBpm);
    });

    buttons.decreaseBPMButton.addEventListener('click', () => {
        const newBpm = bpm - 1;
        handleBpmChange(newBpm);
    });

    buttons.decreaseFiveBPMButton.addEventListener('click', () => {
        const newBpm = bpm - 5;
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

    buttons.toggleTrainingMode.addEventListener('change', function (e) {
        setTrainingMode(e.target.checked);
    });

    elements.loopSkipProbabilityInput.addEventListener('input', function (e) {
        const newProbability = isNaN(e.target.value) ? 25 : e.target.value;

        handleLoopSkipProbabilityChange(newProbability / 100);
    });

    elements.noteSkipProbabilityInput.addEventListener('input', function (e) {
        noteSkipProbability = parseInt(e.target.value, 10) / 100;
    });
    elements.noteSkipProbabilityInput.addEventListener('blur', () => handleInputBlur(elements.noteSkipProbabilityInput, defaultNoteSkipProbability * 100));
    elements.loopSkipProbabilityInput.addEventListener('blur', () => handleInputBlur(elements.loopSkipProbabilityInput, defaultLoopSkipProbability * 100));


    buttons.increaseLoopSkipProbabilityButton.addEventListener('click', () => handleLoopSkipProbabilityChange(0.01));
    buttons.increaseLoopSkipProbabilityFiveButton.addEventListener('click', () => handleLoopSkipProbabilityChange(0.05));
    buttons.decreaseLoopSkipProbabilityButton.addEventListener('click', () => handleLoopSkipProbabilityChange(0.01));
    buttons.decreaseLoopSkipProbabilityFiveButton.addEventListener('click', () => handleLoopSkipProbabilityChange(0.05));


    document.addEventListener('change', function (event) {
        if (event.target.matches('.note-size-dropdown') || event.target.matches('.note-amount-dropdown')) {
            updateTimeSignature();

            if (isPlaying) {
                updateMetronomeSequence();
            }
        }
    });

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('beat')) {
            changeBeatSound(event.target);
        }
    });
});

function startMetronome() {
    isPlaying = true;
    isPendulumMode = true;

    Tone.Transport.bpm.value = bpm * 3;

    sequence = generateFixedMetronomeSequence();
    skipper = 0;

    // Создаем новый луп с нужными параметрами
    loop = new Tone.Loop(getMetronomeLoopCallback, '64n');

    loop.start(0); // Стартуем луп

    Tone.Transport.start();
    buttons.startStopButton.textContent = 'Stop';
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

    // Update metronome sequence without restarting
    if (isPlaying) {
        updateMetronomeSequence();
    }
}

function updateMetronomeSequence() {
    sequence = generateFixedMetronomeSequence();
    loop.callback = (time) => getMetronomeLoopCallback(time);
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
    if (isNaN(newBpm) || bpm === newBpm) {
        return;
    }
    if (newBpm > 500) {
        bpm = 500;
        elements.bpmInput.value = 500;
    } else if (newBpm < 1) {
        bpm = 1;
        elements.bpmInput.value = 1;
    } else {
        bpm = newBpm;
        elements.bpmInput.value = newBpm;
    }
    checkBPMLimit();
    if (loop) loop.stop();  // Останавливаем текущий цикл метронома
    if (isPlaying) {
        restartMetronomeAndPendulum();
    }
}

function handleLoopSkipProbabilityChange(newProbability) {
    if (newProbability > 1) {
        loopSkipProbability = 0;
        elements.loopSkipProbabilityInput.value = 100;
    } else if (newProbability < 0) {
        loopSkipProbability = 0;
        elements.loopSkipProbabilityInput.value = 0;
    } else {
        loopSkipProbability = newProbability;
    }
    checkLoopSkipProbabilityLimit();
}

function restartMetronomeAndPendulum() {
    stopMetronome();
    resetPendulumAnimation();
    startMetronome();
}

function updateTimeSignature() {
    const timeSignature = countSize();
    document.getElementById('time-signature').textContent = `${timeSignature.beatAmount}/${timeSignature.tactSize}`;
    checkNotesLimit();
    checkBeatsLimit();
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
}

function increaseBeat() {
    const beatRows = document.querySelectorAll('.sound-row');

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
    beatWrapper.querySelector('.beat').classList.toggle('hidden', !isBeatToggleChecked())
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

function playMetronomeStep(sequence, currentStep, time) {
    const currentNote = sequence[currentStep];
    if (!currentNote || !currentNote.sound) return;
    if (!(isTrainingMode && Math.random() < noteSkipProbability)) {
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

    toggleButtonsLimit(minLimit, maxLimit, buttons.increaseNotesButton, buttons.decreaseNotesButton);
}

function checkBeatsLimit() {
    const beatRows = document.querySelectorAll('.sound-row');
    const minLimit = beatRows.length <= 1;
    const maxLimit = beatRows.length >= maxBeatsAmount;

    toggleButtonsLimit(minLimit, maxLimit, buttons.increaseBeatsButton, buttons.decreaseBeatsButton);
}

function checkLoopSkipProbabilityLimit() {
    const minLimit = loopSkipProbability <= 0;
    const maxLimit = loopSkipProbability >= 1;

    toggleButtonsLimit(minLimit, maxLimit, buttons.increaseLoopSkipProbabilityButton, buttons.decreaseLoopSkipProbabilityButton);
    toggleButtonsLimit(minLimit, maxLimit, buttons.increaseLoopSkipProbabilityFiveButton, buttons.decreaseLoopSkipProbabilityFiveButton);
}

function checkBPMLimit() {
    const minLimit = bpm <= 1;
    const maxLimit = bpm >= 500;

    toggleButtonsLimit(minLimit, maxLimit, buttons.increaseBPMButton, buttons.decreaseBPMButton);
    toggleButtonsLimit(minLimit, maxLimit, buttons.increaseFiveBPMButton, buttons.decreaseFiveBPMButton);
}

function toggleButtonsLimit(minLimit, maxLimit, increasingButton, decreasingButton) {
    increasingButton.disabled = maxLimit;
    decreasingButton.disabled = minLimit;
    increasingButton.classList.toggle('button-limit', maxLimit);
    decreasingButton.classList.toggle('button-limit', minLimit);
}

function setTrainingMode(enabled) {
    isTrainingMode = enabled;
    isFirstLoop = enabled;
    elements.trainingSettings.classList.toggle('hidden', !enabled);
}

function getMetronomeLoopCallback(time) {
    currentStep = count % sequence.length;
    isStartOfLoop = currentStep === 0;

    // Применяем вероятность пропуска такта
    if (isTrainingMode && isStartOfLoop) {
        if (isFirstLoop) {
            isFirstLoop = false;
        } else if (Math.random() < loopSkipProbability) {
            skipper = sequence.length;
        }
    }

    if (skipper > 0) {
        skipper--;
    } else {
        playMetronomeStep(sequence, currentStep, time);
    }

    if (isStartOfLoop) {
        document.getElementById('loop-counter').textContent = loopCount++;
    }

    count++;
}

function isBeatToggleChecked() {
    return buttons.toggleBeatBars.checked;
}

function generateSelectedSounds() {
    for (let i = 0; i < initialNumberOfBeats; i++) {
        selectedSounds.push(1);
    }
}

function handleInputBlur(element, defaultElementValue) {
    if (element.value === '') {
        element.value = defaultElementValue;

        element.dispatchEvent(new Event('input', {bubbles: true}));
    }
}
