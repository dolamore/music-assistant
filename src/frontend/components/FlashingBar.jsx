import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {uiState} from "../states/UIState";

export default inject("metronomeManager")(observer(function FlashingBar({metronomeManager}) {
    const isBeatPlaying = uiState.flashingBarBlinking;

    return (
        <div
            id="flashing-bar"
            className={`flashing-bar
                       container
                       ${!metronomeManager.visualEffectsManager.isFlashingBarVisible ? 'hidden' : ''}`}
            style={{ opacity: isBeatPlaying ? 1 : 0 }}
        >
        </div>
    )
}));