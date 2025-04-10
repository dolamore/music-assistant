import React from "react";
import {Provider} from "mobx-react";
import ReactDOM from "react-dom/client";
import Metronome from "./components/Metronome.jsx";
import LoopCounter from "./components/LoopCounter.jsx";
import BpmControls from "./components/BpmControls.jsx";
import {MetronomeManager} from "./managers/MetronomeManager.js";
import VisualCheckBoxControls from "./components/VisualsCheckBoxControls.jsx";
import MainPanelControls from "./components/MainPanelControls.jsx";
import TrainingSettings from "./components/TrainingSettings.jsx";
import TimeSignatureControls from "./components/TimeSignatureControls.jsx";
import BeatBars from "./components/BeatBars.jsx";
import FlashingBar from "./components/FlashingBar.jsx";
import Pendulum from "./components/Pendulum.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import './styles/styles.css';

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