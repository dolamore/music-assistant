import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {useHotkeys} from "../hooks/useHotKeys";
import {setupAudioContextUnlocker} from "../utils/utils.js";
import {ToggleCheckbox} from "./UtilityComponents.tsx";

export default inject("metronomeManager")(observer(function MainPanelControls({metronomeManager}) {
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
const StartStopButton = observer(({metronomeManager}) => {
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
