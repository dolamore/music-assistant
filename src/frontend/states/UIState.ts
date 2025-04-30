import {makeAutoObservable, action} from "mobx";

class UIState {
    private _flashingBarBlinking: boolean = false;
    private _currentPlayingBeatIndex: number | null = null;

    constructor() {
        makeAutoObservable(this, {
            playBeat: action.bound,
        });
    }

    get currentPlayingBeatIndex(): number | null {
        return this._currentPlayingBeatIndex;
    }

    get flashingBarBlinking(): boolean {
        return this._flashingBarBlinking;
    }

    playBeat(index: number) {
        this._currentPlayingBeatIndex = index;
        this._flashingBarBlinking = true;
        setTimeout(() => {
            if (this._currentPlayingBeatIndex === index) {
                this.setCurrentPlayingBeatIndex(null);
                this.setFlashingBarVisible(false);
            }
        }, 100);
    }

    setFlashingBarVisible(value: boolean) {
        this._flashingBarBlinking = value;
    }

    setCurrentPlayingBeatIndex(index: number | null) {
        this._currentPlayingBeatIndex = index;
    }
}

export const uiState = new UIState();
