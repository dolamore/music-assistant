import {defaultInitialBPM, elements, initialNumberOfBeats} from "./vars.js";

export class ElementsManager {
    constructor() {
    }

    renderElements() {
        elements.beatsCounter.textContent = initialNumberOfBeats;
        elements.bpmInput.value = defaultInitialBPM;
    }
}