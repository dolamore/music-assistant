import {makeAutoObservable} from "mobx";

export class VisualEffectsManager {
    private _isPendulumVisible: boolean = true;
    private _isFlashingBarVisible: boolean = true;
    private _areBeatBarsVisible: boolean = true;

    constructor() {
        makeAutoObservable(this);
    }

    get isPendulumVisible() {
        return this._isPendulumVisible;
    }

    get isFlashingBarVisible() {
        return this._isFlashingBarVisible;
    }

    get areBeatBarsVisible() {
        return this._areBeatBarsVisible;
    }

    togglePendulumVisibility(): void {
        this._isPendulumVisible = !this._isPendulumVisible;
    }

    toggleFlashingBarVisibility(): void {
        this._isFlashingBarVisible = !this._isFlashingBarVisible;
    }

    toggleBeatBarsVisibility(): void {
        this._areBeatBarsVisible = !this._areBeatBarsVisible;
    }
}