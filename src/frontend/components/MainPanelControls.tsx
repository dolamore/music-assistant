import React, {ReactElement} from "react";
import {observer} from "mobx-react-lite";
import {useHotkeys} from "../hooks/useHotKeys";
import {setupAudioContextUnlocker} from "../utils/utils.js";
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

//TODO: перенести это в App и сделать разово появляющимся
const StartStopButton = observer(({metronomeManager}: MetronomeManagerInputType): ReactElement => {
    const onClick = async () => {
        if (metronomeManager.isPlaying) {
            metronomeManager.stopMetronome();
        } else {
            await setupAudioContextUnlocker();
            metronomeManager.startMetronome();
        }
    };

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
