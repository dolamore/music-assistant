import React, {ReactElement} from "react";
import {observer} from "mobx-react-lite";
import {ToggleCheckbox} from "./UtilityComponents";
import {MetronomeManagerInputType} from "../models/ComponentsTypes";

export default (observer(function VisualCheckBoxControls({metronomeManager}: MetronomeManagerInputType): ReactElement {
    return (
        <div className="checkbox-controls-container container">
            <ToggleCheckbox
                id="toggle-pendulum-bar"
                checked={metronomeManager.visualEffectsManager.isPendulumVisible}
                onChange={() => metronomeManager.visualEffectsManager.togglePendulumVisibility()}
                label="Show Pendulum Bar"
            />
            <ToggleCheckbox
                id="toggle-flashing-bar"
                checked={metronomeManager.visualEffectsManager.isFlashingBarVisible}
                onChange={() => metronomeManager.visualEffectsManager.toggleFlashingBarVisibility()}
                label="Show Flashing Bar"
            />
            <ToggleCheckbox
                id="toggle-beat-bars"
                checked={metronomeManager.visualEffectsManager.areBeatBarsVisible}
                onChange={() => metronomeManager.visualEffectsManager.toggleBeatBarsVisibility()}
                label="Show Beat Bars"
            />
        </div>
    );
}));