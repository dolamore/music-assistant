import React, {ReactElement} from "react";
import {observer} from "mobx-react-lite";
import {useHotkeys} from "../hooks/useHotKeys";
import {ToggleCheckbox} from "./UtilityComponents";
import {MetronomeManagerInputType} from "../models/ComponentsTypes";

export default (observer(function MainPanelControls({metronomeManager}: MetronomeManagerInputType): ReactElement {
    return (
        <div className="main-panel-controls container">
            <StartStopButton metronomeManager={metronomeManager}/>
            <SettingsButton metronomeManager={metronomeManager}/>
            <ToggleCheckbox
                id="toggle-training-mode"
                checked={metronomeManager.trainingModeManager.isTrainingMode}
                onChange={() => metronomeManager.trainingModeManager.toggleTrainingMode()}
                label="Training Mode"
            />
        </div>
    );
}));

const StartStopButton = observer(({metronomeManager}: MetronomeManagerInputType): ReactElement => {
    const onClick = () => {
        if (metronomeManager.isPlaying) {
            metronomeManager.stopMetronome();
        } else {
            metronomeManager.startMetronome();
        }
    };

    useHotkeys({
        " ": onClick
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

const SettingsButton = observer(({metronomeManager}: MetronomeManagerInputType): ReactElement => {
    return (
        <button
            id="settings-button"
            onClick={() => metronomeManager.elementsManager.toggleSettingsPanel()}
        >
            Settings
        </button>
    );
});
