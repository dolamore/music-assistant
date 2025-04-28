import {makeAutoObservable} from "mobx";
import {NOTE_MULTIPLIERS} from "../vars/vars.js";

export class ElementsManager {
    _isSettingsPanelVisible = false;
    pendulumAnimationFrame;
    metronomeManager;
    _beatBarsManager;
    _currentNoteSizeIndex = 2;

    constructor(metronomeManager) {
        this.metronomeManager = metronomeManager;
        this._beatBarsManager = metronomeManager.beatBarsManager;
        makeAutoObservable(this)
    }

    get isSettingsPanelVisible() {
        return this._isSettingsPanelVisible;
    }

    set isSettingsPanelVisible(value) {
        this._isSettingsPanelVisible = value;
    }

    toggleSettingsPanel() {
        this._isSettingsPanelVisible = !this._isSettingsPanelVisible;
    }
}


//     renderElements() {
//
//         elements.loopSkipProbabilityInput.addEventListener('keypress', (e) => this.preventNonDigitInput(e));
//
//         elements.noteSkipProbabilityInput.addEventListener('keypress', (e) => this.preventNonDigitInput(e));
//     }
// }