import React from "react";
import {Provider} from "mobx-react";
import ReactDOM from "react-dom/client";
import Metronome from "./Metronome.js";
import LoopCounter from "./components/loopCounter.js";
import BpmControls from "./components/bpmControls.js";
import {MetronomeManager} from "./managers/metronomeManager.js";
import VisualCheckBoxControls from "./components/visualsCheckBoxControls.js";
import MainPanelControls from "./components/mainPanelControls.js";
import TrainingSettings from "./components/trainingSettings.js";
import TimeSignatureControls from "./components/timeSignatureControls.js";
import BeatBars from "./components/beatBars.js";
import FlashingBar from "./components/flashingBar.js";
import Pendulum from "./components/pendulum.js";
import SettingsPanel from "./components/settingsPanel.js";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
const metronomeManager = new MetronomeManager();

function App() {
    return (
        <Provider metronomeManager={metronomeManager}>
            <Metronome>
                <BpmControls/>
                <LoopCounter/>
                <VisualCheckBoxControls/>
                <MainPanelControls/>
                <TrainingSettings/>
                <TimeSignatureControls/>
                <BeatBars/>
                <FlashingBar/>
                <Pendulum/>
                <SettingsPanel/>
            </Metronome>
        </Provider>
    );
}

root.render(<App/>);