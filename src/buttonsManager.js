import {buttons, elements} from "./vars.js";
import * as Tone from 'https://cdn.skypack.dev/tone';

export class ButtonsManager {
    constructor(metronomeManager) {
        this.metronomeManager = metronomeManager;
        this.beatsBarsManager = metronomeManager.getBeatBarsManager();
        this.elementsManager = metronomeManager.getElementsManager();
    }

    changeNoteSize(increase) {
        elements.noteSizeDropdowns.forEach((dropdown) => {
            this.elementsManager.changeDropdownSize(dropdown, increase);
        });
        this.elementsManager.updateTimeSignature();
        if (this.metronomeManager.isPlaying) {
            this.metronomeManager.restartMetronomeAndPendulum();
        }

    }

    async toggleStartStopButton() {
        await Tone.start();
        if (this.metronomeManager.isPlaying) {
            this.metronomeManager.stopMetronome();
        } else {
            this.metronomeManager.startMetronome();
        }
    }

    renderButtons() {
        buttons.decreaseBeatsButton.addEventListener('click', this.beatsBarsManager.decreaseBeat);

        buttons.increaseBeatsButton.addEventListener('click', this.beatsBarsManager.increaseBeat);

        buttons.increaseNotesButton.addEventListener('click', this.changeNoteSize.bind(this, true));

        buttons.decreaseNotesButton.addEventListener('click', this.changeNoteSize.bind(this, false));

        buttons.startStopButton.addEventListener('click', this.toggleStartStopButton.bind(this));
    }
}