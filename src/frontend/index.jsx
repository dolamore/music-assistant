import React from "react";
import {Provider} from "mobx-react";
import ReactDOM from "react-dom/client";
import Metronome from "./components/Metronome";
import LoopCounter from "./components/LoopCounter";
import BpmControls from "./components/BpmControls";
import {MetronomeManager} from "./managers/MetronomeManager";
import VisualCheckBoxControls from "./components/VisualsCheckBoxControls";
import MainPanelControls from "./components/MainPanelControls";
import TrainingSettings from "./components/TrainingSettings";
import TimeSignatureControls from "./components/TimeSignatureControls";
import BeatBars from "./components/BeatBars";
import FlashingBar from "./components/FlashingBar";
import Pendulum from "./components/Pendulum";
import SettingsPanel from "./components/SettingsPanel";
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