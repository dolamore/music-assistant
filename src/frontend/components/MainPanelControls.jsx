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

let noiseSource = null;

const StartStopButton = observer(({metronomeManager}) => {
    const onClick = async () => {

        if (Tone.getContext().state !== "running") {
            await Tone.start();
         //   await Tone.getContext().resume()
            console.log("Audio context" + Tone.getContext().state);
            if (!noiseSource) {
                // Создаем источник белого шума
                noiseSource = new Tone.Noise("white").start();
                // Устанавливаем минимальную громкость
                const gain = new Tone.Gain(0.0001).toDestination();
                noiseSource.connect(gain);
                console.log("Silent noise started");
            }

            metronomeManager._loop = new Tone.Loop(() => {
                console.log("Loop started");
            }, "64n");

            Tone.getTransport().start(0);
            metronomeManager._loop.start(0);
        }

        if (metronomeManager.isPlaying) {
            // metronomeManager.stopMetronome();
        } else {
         //   metronomeManager.startMetronome();
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

const ToggleTrainingMode = observer(({metronomeManager}) => {
    return (
        <label>
            <input type="checkbox"
                   id="toggle-training-mode"
                   onChange={() => metronomeManager.toggleTrainingMode()}
                   checked={metronomeManager.elementsManager.isTrainingMode}
            />
            Training Mode
        </label>
    );
});