import {makeAutoObservable, action} from "mobx";

class UIState {
    flashingBarVisible = false;
    currentPlayingBeatIndex: number | null = null;

    constructor() {
        makeAutoObservable(this, {
            flashBar: action.bound,
            playBeat: action.bound,
        });
    }

    flashBar() {
        this.flashingBarVisible = true;
        setTimeout(() => {
            this.setFlashingBarVisible(false);
        }, 100);
    }

    playBeat(index: number) {
        this.currentPlayingBeatIndex = index;
        setTimeout(() => {
            if (this.currentPlayingBeatIndex === index) {
                this.setCurrentPlayingBeatIndex(null);
            }
        }, 100);
    }

    setFlashingBarVisible(value: boolean) {
        this.flashingBarVisible = value;
    }

    setCurrentPlayingBeatIndex(index: number | null) {
        this.currentPlayingBeatIndex = index;
    }
}

export const uiState = new UIState();
