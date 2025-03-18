import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function VisualCheckBoxControls({metronomeManager}) {
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

const ToggleCheckbox = observer(({id, checked, onChange, label}) => {
    return (
        <label>
            <input type="checkbox" id={id} checked={checked} onChange={onChange}/>
            {label}
        </label>
    );
});