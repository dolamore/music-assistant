import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {useHotkeys} from "../hooks/useHotKeys.js";
import * as Tone from "tone";

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
    const onClick = () => {
        if (metronomeManager.isPlaying) {
            metronomeManager.stopMetronome();
        } else {
            metronomeManager.startMetronome();
        }
    }

    useHotkeys({
        " ": onClick,
    });

    return (
        <button
            id="start-stop-button"
            onClick={onClick}
        >
            {metronomeManager.isPlaying ? "Stop" : "Start"}
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