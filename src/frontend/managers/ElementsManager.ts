import {makeAutoObservable} from "mobx";
import {MetronomeManager} from "./MetronomeManager";
import {BeatBarsManager} from "./BeatBarsManager";

export class ElementsManager {
    _isSettingsPanelVisible: boolean = false;
    metronomeManager: MetronomeManager;
    _beatBarsManager: BeatBarsManager;

    constructor(metronomeManager: MetronomeManager) {
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

    toggleSettingsPanel(): void {
        this._isSettingsPanelVisible = !this._isSettingsPanelVisible;
    }
}