import * as Tone from 'https://cdn.skypack.dev/tone';
import {
    sounds,
    initialNumberOfBeats,
    defaultSoundSettings,
    beatHTML,
    buttons,
    elements,
    defaultInitialBPM
} from './vars.js';
import {toggleButtonsLimit, handleInputBlur} from './utils.js';
import {MetronomeManager} from "./metronomeManager.js";
import {HotBindManager} from "./hotBindManager.js";
import {ElementsManager} from "./elementsManager.js";
import {ButtonsManager} from "./buttonsManager.js";


let bpm = defaultInitialBPM;
let isPlaying = false;
let loop;
let sequence;
const hotBindManager = new HotBindManager();
const elementsManager = new ElementsManager();
const metronomeManager = new MetronomeManager();
const buttonsManager = new ButtonsManager(metronomeManager);

document.addEventListener('DOMContentLoaded', function () {
    metronomeManager.renderMetronomeElements();

    renderSoundSettings();
    initialBeatRender();

    hotBindManager.renderHotBinds();

    elementsManager.renderElements();

    buttonsManager.renderButtons();

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
        metronomeManager.soundManager.clearSelectedSounds();
        metronomeManager.soundManager.clearSelectedSounds();
        // Извлекаем и обновляем настройки для каждого бита
        elements.beatsRows.forEach((row) => {
            metronomeManager.soundManager.addSelectedSound(parseInt(row.querySelector('select').value, 10));
            metronomeManager.soundManager.addSoundSettings(getSoundSettings(row));
        });

        // Обновляем данные в DOM
        document.querySelectorAll('.beat').forEach((beat, index) => {
            beat.dataset.sound = metronomeManager.soundManager.getSelectedSounds()[index];  // Обновляем звук для каждого бита
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

function changeBeatSound(beatElement) {
    const beatIndex = parseInt(beatElement.dataset.beat, 10);
    const currentSound = parseInt(beatElement.dataset.sound, 10);

    // Cycle through sounds (1 - Sound 1, ..., 4 - Sound 4, 0 - No Sound)
    const nextSound = (currentSound % sounds.length) + 1;
    beatElement.dataset.sound = nextSound;

    // Update selectedSounds array
    metronomeManager.soundManager.getSelectedSounds()[beatIndex] = nextSound;

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
    metronomeManager.soundManager.addSoundSetting(defaultSoundSettings);
}

function initialBeatRender() {
    for (let i = 0; i < initialNumberOfBeats; i++) {
        createBeatElement(i);
    }
}

function getSoundSettings(row) {
    return Object.fromEntries(Object.keys(defaultSoundSettings).map(key => {
        const input = row.querySelector(`input[placeholder="${key.charAt(0).toUpperCase() + key.slice(1)}"]`);
        return [key, input ? parseFloat(input.value) : defaultSoundSettings[key]];
    }));
}

function renderSoundSettings() {

    Object.keys(defaultSoundSettings).forEach((key) => {
        const label = document.createElement('span');
        label.textContent = key.charAt(0).toUpperCase() + key.slice(1); // Преобразуем ключ в читаемое имя (например, 'frequency' -> 'Frequency')

        // Добавляем label в контейнер labels
        elements.labelsContainer.appendChild(label);
        const numColumns = Object.keys(defaultSoundSettings).length;
        elements.soundSettingsContainer.style.gridTemplateColumns = `150px repeat(${numColumns + 1}, 1fr)`;
    });
}

function checkBPMLimit() {
    const minLimit = bpm <= 1;
    const maxLimit = bpm >= 500;

    toggleButtonsLimit(minLimit, maxLimit, buttons.increaseBPMButton, buttons.decreaseBPMButton);
    toggleButtonsLimit(minLimit, maxLimit, buttons.increaseFiveBPMButton, buttons.decreaseFiveBPMButton);
}

function isBeatToggleChecked() {
    return buttons.toggleBeatBars.checked;
}
