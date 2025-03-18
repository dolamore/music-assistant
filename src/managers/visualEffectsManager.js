import {makeAutoObservable} from "mobx";

export class VisualEffectsManager {
    _isPendulumVisible = true;
    _isFlashingBarVisible = true;
    _areBeatBarsVisible = true;

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

    set isPendulumVisible(value) {
        this._isPendulumVisible = value;
    }

    set isFlashingBarVisible(value) {
        this._isFlashingBarVisible = value;
    }

    set areBeatBarsVisible(value) {
        this._areBeatBarsVisible = value;
    }

    togglePendulumVisibility() {
        this._isPendulumVisible = !this._isPendulumVisible;
    }

    toggleFlashingBarVisibility() {
        this._isFlashingBarVisible = !this._isFlashingBarVisible;
    }

    toggleBeatBarsVisibility() {
        this._areBeatBarsVisible = !this._areBeatBarsVisible;
    }
}