import {
    defaultInitialBPM,
    defaultSoundSettings,
    Elements,
    elements,
    initialNumberOfBeats,
    maxBeatsAmount, minBeatsAmount, noteAmounts,
    noteMultipliers, noteSizes
} from "../vars.js";
import {handleInputBlur, lcmArray} from "../utils.js";
import {makeAutoObservable} from "mobx";
import document from "react";
import * as performance from "tone";

export class ElementsManager {
    _isSettingsPanelVisible = false;
    pendulumAnimationFrame;
    metronomeManager;
    _timeSignature;
    _increaseNoteButtonLimit = false;
    _decreaseNoteButtonLimit = false;
    _increaseBeatsButtonLimit = false;
    _decreaseBeatsButtonLimit = false;

    constructor(metronomeManager) {
        this.metronomeManager = metronomeManager;
        this._timeSignature = this.countSize();
        makeAutoObservable(this)
    }

    get increaseBeatsButtonLimit() {
        return this._increaseBeatsButtonLimit;
    }

    set increaseBeatsButtonLimit(value) {
        this._increaseBeatsButtonLimit = value;
    }

    get decreaseBeatsButtonLimit() {
        return this._decreaseBeatsButtonLimit;
    }

    set decreaseBeatsButtonLimit(value) {
        this._decreaseBeatsButtonLimit = value;
    }

    get increaseNoteButtonLimit() {
        return this._increaseNoteButtonLimit;
    }

    set increaseNoteButtonLimit(value) {
        this._increaseNoteButtonLimit = value;
    }

    get decreaseNoteButtonLimit() {
        return this._decreaseNoteButtonLimit;
    }

    set decreaseNoteButtonLimit(value) {
        this._decreaseNoteButtonLimit = value;
    }

    get timeSignature() {
        return this._timeSignature;
    }

    updateTimeSignature() {
        this._timeSignature = this.countSize();
        this.checkNotesLimit();
        this.checkBeatsLimit();
    }

    get isSettingsPanelVisible() {
        return this._isSettingsPanelVisible;
    }

    set isSettingsPanelVisible(value) {
        this._isSettingsPanelVisible = value;
    }

    toggleSettingsPanel() {
        this.isSettingsPanelVisible = !this.isSettingsPanelVisible;
    }

    checkNotesLimit() {
        let minLimit = false;
        let maxLimit = false;

        this.metronomeManager.beatBarsManager.noteAttributes.noteAmounts.forEach((index) => {
            const currentValue = noteAmounts[index];

            if (currentValue === 1) {
                minLimit = true;
            }

            if (currentValue === 64) {
                maxLimit = true;
            }
        });
        this._decreaseNoteButtonLimit = minLimit;
        this._increaseNoteButtonLimit = maxLimit;
    }

    checkBeatsLimit() {
        const minLimit = this.metronomeManager.beatBarsManager.numberOfBeats <= minBeatsAmount;
        const maxLimit = this.metronomeManager.beatBarsManager.numberOfBeats >= maxBeatsAmount;

        this._decreaseBeatsButtonLimit = minLimit;
        this._decreaseBeatsButtonLimit = maxLimit;
    }

    countSize() {
        let beatAmount = this.metronomeManager.beatBarsManager.numberOfBeats;

        let beatPattern = [];

        for (let index = 0; index < beatAmount; index++) {
            const noteAmount = noteAmounts[this.metronomeManager.beatBarsManager.noteAttributes.noteAmounts[index]];
            const isTriplet = this.metronomeManager.beatBarsManager.noteAttributes.isTriplets[index];
            const noteSize = noteSizes[this.metronomeManager.beatBarsManager.noteAttributes.noteSizes[index]];

            for (let i = 0; i < (isTriplet ? 3 * noteAmount : noteAmount); i++) {
                beatPattern.push(isTriplet ? noteSize * 3 / 2 : noteSize);
            }
        }

        const denominator = lcmArray(beatPattern);
        let numerator = 0;

        for (let index = 0; index < beatAmount; index++) {
            const noteAmount = noteAmounts[this.metronomeManager.beatBarsManager.noteAttributes.noteAmounts[index]];
            const isTriplet = this.metronomeManager.beatBarsManager.noteAttributes.isTriplets[index];
            const noteSize = noteSizes[this.metronomeManager.beatBarsManager.noteAttributes.noteSizes[index]];

            if (isTriplet) {
                numerator += noteAmount * 3 * (denominator / noteSize);
            } else {
                numerator += noteAmount * (denominator / noteSize);
            }
        }

        return {numerator: numerator, tactSize: denominator};
    }

    changeDropdownSize(dropdown, direction) {
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

    movePendulum() {

        const barWidth = elements.pendulumBarElement.clientWidth;
        const pendulumWidth = elements.pendulumElement.clientWidth;
        const maxPosition = barWidth - pendulumWidth; // Amplitude of movement
        const beatDuration = (60 / this.metronomeManager.bpm) * 1000 * noteMultipliers[this.metronomeManager.currentNoteSizeIndex]; // Duration of one beat in milliseconds
        const pendulumPeriod = beatDuration * 2; // Full cycle (back and forth)

        let startTime = performance.now();

        const updatePendulumPosition = (currentTime) => {
            if (!this.metronomeManager.isPlaying) return; // Stop animation if metronome is stopped

            const elapsed = (currentTime - startTime) % pendulumPeriod;
            const normalizedTime = elapsed / pendulumPeriod; // From 0 to 1

            const position = normalizedTime <= 0.5 ? normalizedTime * 2 * maxPosition // Move right
                : maxPosition - (normalizedTime - 0.5) * 2 * maxPosition; // Move left

            elements.pendulumElement.style.left = `${position}px`;

            this.pendulumAnimationFrame = requestAnimationFrame(updatePendulumPosition);
        }

        startTime = performance.now();
        requestAnimationFrame(updatePendulumPosition);
    }

    resetPendulumAnimation() {
        cancelAnimationFrame(this.pendulumAnimationFrame); // Stop the current animation
        elements.pendulumElement.style.left = '0px'; // Reset pendulum to initial position
    }

    renderSoundSettings() {

        Object.keys(defaultSoundSettings).forEach((key) => {
            const label = document.createElement('span');
            label.textContent = key.charAt(0).toUpperCase() + key.slice(1); // Преобразуем ключ в читаемое имя (например, 'frequency' -> 'Frequency')

            // Добавляем label в контейнер labels
            elements.labelsContainer.appendChild(label);
            const numColumns = Object.keys(defaultSoundSettings).length;
            elements.soundSettingsContainer.style.gridTemplateColumns = `150px repeat(${numColumns + 1}, 1fr)`;
        });
    }

    initialBeatRender() {
        for (let i = 0; i < initialNumberOfBeats; i++) {
            this.createBeatElement(i);
        }
    }

    createBeatElement(index) {
        elements.soundSettingsContainer.appendChild(this.createSoundRow(index));

     //   elements.beatContainer.appendChild(this.createBeatWrapper(index));

        this.metronomeManager.soundManager.addSoundSetting(defaultSoundSettings);
    }

    createSoundRow(index) {
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
            soundRow.appendChild(this.createInputField(key, index));
        });

        return soundRow;
    }

    createInputField(key, index) {
        const input = document.createElement('input');
        input.id = `${key}-${index}`;
        input.type = 'number';
        input.placeholder = key.charAt(0).toUpperCase() + key.slice(1);
        input.value = defaultSoundSettings[key];
        return input;
    }

    toggleFlashingBar(e) {
        elements.flashingBar.classList.toggle('hidden', !e.target.checked);
    }

    toggleBeatBars(e) {
        Elements.beats.forEach(beat => {
            beat.classList.toggle('hidden', !e.target.checked);
        });
    }

    togglePendulumBar(e) {
        if (e.target.checked) {
            elements.pendulumElement.style.opacity = '1';
            elements.pendulumBarElement.style.opacity = '1';
        } else {
            elements.pendulumElement.style.opacity = '0';
            elements.pendulumBarElement.style.opacity = '0';
        }
    }


    //TODO: проверить что метроном будет перезапускаться в нужный момент
    handleBpmInputChanges(bpm, setBpm) {
        const oldBpm = this.metronomeManager.bpm;
        handleInputBlur(bpm, setBpm, defaultInitialBPM);
        if (this.metronomeManager.isPlaying && oldBpm !== defaultInitialBPM) {
            this.metronomeManager.restartMetronomeAndPendulum();
        }
    }

    preventNonDigitInput(e) {
        const allowedKeys = new Set([8, 46, 37, 39]); // Backspace, Delete, Left Arrow, Right Arrow

        if (!/[0-9]/.test(e.key) && !allowedKeys.has(e.keyCode)) {
            e.preventDefault();
        }
    }

    updateBeatDropdowns(e) {
        if (e.target.matches('.note-size-dropdown') || e.target.matches('.note-amount-dropdown')) {
            this.updateTimeSignature();

            if (this.metronomeManager.isPlaying) {
                this.metronomeManager.updateMetronomeSequence();
            }
        }
    }

    handleBeatClick(e) {
        if (e.target.classList.contains('beat')) {
            this.metronomeManager.soundManager.changeBeatSound(e.target);
        }
    }

    renderElements() {
        elements.beatsCounter.textContent = initialNumberOfBeats;

        this.renderSoundSettings();
        this.initialBeatRender();

        window.addEventListener('resize', () => this.metronomeManager.restartIfPlaying());

        elements.loopSkipProbabilityInput.addEventListener('keypress', (e) => this.preventNonDigitInput(e));

        elements.noteSkipProbabilityInput.addEventListener('keypress', (e) => this.preventNonDigitInput(e));

        document.addEventListener('change', (e) => this.updateBeatDropdowns(e));

        document.addEventListener('click', (e) => this.handleBeatClick(e));
    }
}