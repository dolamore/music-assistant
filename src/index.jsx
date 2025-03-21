import React from "react";
import {Provider} from "mobx-react";
import ReactDOM from "react-dom/client";
import Metronome from "./Metronome.jsx";
import LoopCounter from "./components/loopCounter.jsx";
import BpmControls from "./components/bpmControls.jsx";
import {MetronomeManager} from "./managers/metronomeManager.js";
import VisualCheckBoxControls from "./components/visualsCheckBoxControls.jsx";
import MainPanelControls from "./components/mainPanelControls.jsx";
import TrainingSettings from "./components/trainingSettings.jsx";
import TimeSignatureControls from "./components/timeSignatureControls.jsx";
import BeatBars from "./components/beatBars.jsx";
import FlashingBar from "./components/flashingBar.jsx";
import Pendulum from "./components/pendulum.jsx";
import SettingsPanel from "./components/settingsPanel.jsx";
import './styles.css';

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