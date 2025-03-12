import {
    beatHTML,
    buttons,
    defaultInitialBPM,
    defaultSoundSettings,
    Elements,
    elements,
    initialNumberOfBeats,
    maxBeatsAmount,
    noteMultipliers
} from "../vars.js";
import {handleInputBlur, lcmArray, parseNoteSize, toggleButtonsLimit} from "../utils.js";

export class ElementsManager {
    constructor(metronomeManager) {
        this.pendulumAnimationFrame = null;
        this.metronomeManager = metronomeManager;
    }

    updateTimeSignature() {
        const timeSignature = this.countSize();
        elements.timeSignature.textContent = `${timeSignature.beatAmount}/${timeSignature.tactSize}`;
        this.checkNotesLimit();
        this.checkBeatsLimit();
    }

    checkNotesLimit() {
        let minLimit = false;
        let maxLimit = false;

        Elements.noteSizeDropdowns.forEach((dropdown) => {
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

    checkBeatsLimit() {
        const minLimit = Elements.beatRows.length <= 1;
        const maxLimit = Elements.beatRows.length >= maxBeatsAmount;

        toggleButtonsLimit(minLimit, maxLimit, buttons.increaseBeatsButton, buttons.decreaseBeatsButton);
    }

    countSize() {
        let beatAmount = 0;
        let beatPattern = [];

        Elements.beatRows.forEach((beatRow) => {
            const noteData = parseNoteSize(beatRow.querySelector('.note-size-dropdown').value);
            const noteAmount = parseInt(beatRow.querySelector('.note-amount-dropdown').value, 10);
            const isTriplet = noteData.isTriplet;
            const noteSize = noteData.number;

            for (let i = 0; i < (isTriplet ? 3 * noteAmount : noteAmount); i++) {
                beatPattern.push(isTriplet ? noteSize * 3 / 2 : noteSize);
            }
        });

        const denominator = lcmArray(beatPattern);

        Elements.beatRows.forEach((beat) => {
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

        elements.beatContainer.appendChild(this.createBeatWrapper(index));

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

    createBeatWrapper(index) {
        const beatWrapper = document.createElement('div');
        beatWrapper.classList.add('beat-row');
        beatWrapper.innerHTML = beatHTML(index);
        beatWrapper.querySelector('.beat').classList.toggle('hidden', !this.isBeatToggleChecked())
        return beatWrapper;
    }

    createInputField(key, index) {
        const input = document.createElement('input');
        input.id = `${key}-${index}`;
        input.type = 'number';
        input.placeholder = key.charAt(0).toUpperCase() + key.slice(1);
        input.value = defaultSoundSettings[key];
        return input;
    }

    isBeatToggleChecked() {
        return buttons.toggleBeatBars.checked;
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

    toggleSettingsPanel() {
        elements.settingsPanel.classList.toggle('hidden');
    }

    handleBpmInputChanges(bpm, setBpm) {
        const oldBpm = this.metronomeManager.bpm;
       handleInputBlur(bpm, setBpm, defaultInitialBPM);
        if (this.metronomeManager.isPlaying && oldBpm !== defaultInitialBPM) {
            this.metronomeManager.restartMetronomeAndPendulum();
        }
    }

    preventNonDigitInput(e) {
        if (!/[0-9]/.test(e.key)) {
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

    deleteLastSoundSettingsRow() {
        const lastSoundRow = Elements.soundSettingsRows[Elements.soundSettingsRows.length - 1];
        if (lastSoundRow) {
            lastSoundRow.remove();
        }
    }

    renderElements() {
        elements.beatsCounter.textContent = initialNumberOfBeats;
        elements.bpmInput.value = defaultInitialBPM;
        this.renderSoundSettings();
        this.initialBeatRender();

        window.addEventListener('resize', () => this.metronomeManager.restartIfPlaying());


        elements.bpmInput.addEventListener('input', (e) => {
            this.metronomeManager.handleNewBPM(parseInt(e.target.value, 10));
        });

        elements.bpmInput.addEventListener('blur', () => this.handleBpmInputChanges());


        elements.bpmInput.addEventListener('keypress', (e) => this.preventNonDigitInput(e));

        elements.loopSkipProbabilityInput.addEventListener('keypress', (e) => this.preventNonDigitInput(e));

        elements.noteSkipProbabilityInput.addEventListener('keypress', (e) => this.preventNonDigitInput(e));

        document.addEventListener('change', (e) => this.updateBeatDropdowns(e));

        document.addEventListener('click', (e) => this.handleBeatClick(e));
    }
}