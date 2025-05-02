import React, {ReactElement} from "react";
import {observer} from "mobx-react-lite";
import {uiState} from "../states/UIState";
import {MetronomeManagerInputType} from "../models/ComponentsTypes";

export default (observer(function FlashingBar({metronomeManager}: MetronomeManagerInputType): ReactElement {
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