import {makeAutoObservable} from "mobx";

export class ElementsManager {
    private _isSettingsPanelVisible: boolean = false;

    constructor() {
        makeAutoObservable(this)
    }

    get isSettingsPanelVisible() {
        return this._isSettingsPanelVisible;
    }

    toggleSettingsPanel(): void {
        this._isSettingsPanelVisible = !this._isSettingsPanelVisible;
    }
}