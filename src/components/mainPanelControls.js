import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function MainPanelControls({metronomeManager}) {
    return (
        <div className="main-panel-controls container">
            <StartStopButton metronomeManager={metronomeManager}/>
            <SettingsButton metronomeManager={metronomeManager}/>
            <ToggleTrainingMode metronomeManager={metronomeManager}/>
        </div>
    );
}));

const StartStopButton = observer(({metronomeManager}) => {
    return (
        <button
            id="start-stop-button"
            onClick={() => metronomeManager.startMetronome()}
        >
            Start
        </button>
    );
});

const SettingsButton = observer(({metronomeManager}) => {
    return (
        <button
            id="settings-button"
            onClick={() => metronomeManager.elementsManager.toggleSettingsPanel()}
        >
            Settings
        </button>
    );
});

const ToggleTrainingMode = observer(({metronomeManager}) => {
    return (
        <label>
            <input type="checkbox" id="toggle-training-mode"/> Training Mode
        </label>
    );
});