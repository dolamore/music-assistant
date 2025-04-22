import {makeAutoObservable, action} from "mobx";

class UIState {
    flashingBarVisible: boolean = false;
    currentPlayingBeatIndex: number | null = null;

    pendulumPosition = 0;

    constructor() {
        makeAutoObservable(this, {
            flashBar: action.bound,
            playBeat: action.bound,

            updatePendulum: action.bound,
        });
    }

    updatePendulum(progress: number) {
        if (progress < 0.5) {
            this.pendulumPosition = progress * 200;
        } else {
            this.pendulumPosition = (1 - progress) * 200;
        }
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
