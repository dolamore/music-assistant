import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {uiState} from "../states/UIState.js";

export default inject("metronomeManager")(observer(function FlashingBar({metronomeManager}) {
    const isPlaying = uiState.flashingBarVisible;

    return (
        <div
            id="flashing-bar"
            className={`flashing-bar
                       container
                       ${!metronomeManager.visualEffectsManager.isFlashingBarVisible ? 'hidden' : ''}`}
            style={{ opacity: isPlaying ? 1 : 0 }}
        >
        </div>
    )
}));