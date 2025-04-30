import {makeAutoObservable} from "mobx";
import {MetronomeManager} from "./MetronomeManager";
import {BeatBarsManager} from "./BeatBarsManager";

export class ElementsManager {
    private _isSettingsPanelVisible: boolean = false;
    private readonly _metronomeManager: MetronomeManager;
    private readonly _beatBarsManager: BeatBarsManager;

    constructor(metronomeManager: MetronomeManager) {
        this._metronomeManager = metronomeManager;
        this._beatBarsManager = metronomeManager.beatBarsManager;
        makeAutoObservable(this)
    }

    get metronomeManager(): MetronomeManager {
        return this._metronomeManager;
    }

    get beatBarsManager(): BeatBarsManager {
        return this._beatBarsManager;
    }

    get isSettingsPanelVisible() {
        return this._isSettingsPanelVisible;
    }

    set isSettingsPanelVisible(value: boolean) {
        this._isSettingsPanelVisible = value;
    }

    toggleSettingsPanel(): void {
        this._isSettingsPanelVisible = !this._isSettingsPanelVisible;
    }
}