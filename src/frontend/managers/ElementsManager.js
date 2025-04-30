import {makeAutoObservable} from "mobx";

export class ElementsManager {
    _isSettingsPanelVisible = false;
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