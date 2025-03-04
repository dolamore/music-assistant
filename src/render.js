import {
    buttons,
    elements,
    defaultInitialBPM
} from './vars.js';
import {handleInputBlur} from './utils.js';
import {MetronomeManager} from "./metronomeManager.js";
import {HotBindManager} from "./hotBindManager.js";
import {ButtonsManager} from "./buttonsManager.js";


let bpm = defaultInitialBPM;
let isPlaying = false;
const hotBindManager = new HotBindManager();
const metronomeManager = new MetronomeManager();
const buttonsManager = new ButtonsManager(metronomeManager);

document.addEventListener('DOMContentLoaded', function () {
    metronomeManager.renderMetronomeElements();

    hotBindManager.renderHotBinds();

    buttonsManager.renderButtons();

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
        metronomeManager.soundManager.clearSoundSettings();
        // Извлекаем и обновляем настройки для каждого бита
        elements.beatsRows.forEach((row) => {
            metronomeManager.soundManager.addSelectedSound(parseInt(row.querySelector('select').value, 10));
            metronomeManager.soundManager.addSoundSetting(metronomeManager.soundManager.getSoundSettingsData(row));
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
        metronomeManager.handleBpmChange(parseInt(e.target.value, 10));
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

